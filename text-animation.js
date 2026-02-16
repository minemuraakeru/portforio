// テキストアニメーション機能（効率化版）
class TextScrambler {
  constructor(element) {
    this.element = element;
    this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    this.totalDuration = 500; // 総アニメーション時間（ミリ秒）
    this.animationFrameId = null;
    this.charStates = [];
    this.startTime = 0;
  }

  // ランダムな文字を生成（キャッシュ済み）
  getRandomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }

  // 文字をABC順で次の文字に進める（遠い場合は飛ばす）
  getNextCharInSequence(currentChar, targetChar) {
    if (!currentChar || !targetChar) return targetChar;
    
    const currentIndex = this.chars.indexOf(currentChar);
    const targetIndex = this.chars.indexOf(targetChar);
    
    // 現在の文字がcharsにない場合（日本語など）は、ランダム文字を使用
    if (currentIndex === -1) {
      return this.getRandomChar();
    }
    
    // ターゲットがcharsにない場合（日本語など）は、ランダム文字を使用
    if (targetIndex === -1) {
      return this.getRandomChar();
    }
    
    // ターゲットと同じ場合はターゲットを返す
    if (currentIndex === targetIndex) {
      return targetChar;
    }
    
    const distance = Math.abs(targetIndex - currentIndex);
    const skipThreshold = 10; // 10文字以上離れている場合は飛ばす
    
    // 遠い場合は違和感のない程度に飛ばす（最大5文字ずつ）
    if (distance > skipThreshold) {
      const skipAmount = Math.min(5, Math.floor(distance / 3));
      if (currentIndex < targetIndex) {
        return this.chars[Math.min(currentIndex + skipAmount, targetIndex)];
      } else {
        return this.chars[Math.max(currentIndex - skipAmount, targetIndex)];
      }
    }
    
    // 近い場合は1文字ずつ進める
    if (currentIndex < targetIndex) {
      return this.chars[Math.min(currentIndex + 1, targetIndex)];
    } else {
      return this.chars[Math.max(currentIndex - 1, targetIndex)];
    }
  }

  // アニメーションループ（requestAnimationFrame使用、最適化版）
  animate() {
    const elapsed = performance.now() - this.startTime;
    const isComplete = elapsed >= this.totalDuration;
    const textParts = [];
    let allComplete = true;
    let hasChanges = false;
    const statesLength = this.charStates.length;

    // 事前に最終テキストを構築（完了時のため）
    let finalText = '';

    for (let i = 0; i < statesLength; i++) {
      const state = this.charStates[i];
      
      if (state.target === null) {
        // この文字は削除される（表示しない）
        continue;
      }

      finalText += state.target;

      // 同じ文字の場合は変更しない
      if (!state.needsChange) {
        textParts.push(state.target);
        continue;
      }

      // 0.5秒経過したら強制的に完了
      if (isComplete) {
        textParts.push(state.target);
        state.needsChange = false;
      } else if (state.iterations < state.maxIterations) {
        // まだアニメーション中 - ABC順で変更
        const nextChar = this.getNextCharInSequence(state.current, state.target);
        if (nextChar !== state.current) {
          state.current = nextChar;
          state.iterations++;
          hasChanges = true;
        }
        textParts.push(state.current);
        allComplete = false;
      } else {
        // アニメーション完了、最終文字を表示
        textParts.push(state.target);
        state.needsChange = false;
      }
    }

    // 変更があった場合のみDOMを更新（効率化）
    if (hasChanges || !allComplete) {
      this.element.textContent = textParts.join('');
    }

    if (allComplete || isComplete) {
      // 最終的なテキストを確実に設定
      this.element.textContent = finalText;
      this.animationFrameId = null;
    } else {
      // 次のフレームをスケジュール
      this.animationFrameId = requestAnimationFrame(() => this.animate());
    }
  }

  // テキストをスクランブルアニメーションで変更（最適化版）
  animateTo(targetText) {
    // 既存のアニメーションをキャンセル
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // 同じテキストの場合はアニメーションしない
    const currentText = this.element.textContent;
    if (currentText === targetText) {
      return;
    }

    const currentLength = currentText.length;
    const targetLength = targetText.length;
    const maxLength = Math.max(currentLength, targetLength);
    
    // 各文字位置の状態を管理（事前に配列サイズを確保）
    this.charStates = new Array(maxLength);
    const frameRate = 60; // 60fps想定
    const maxIterations = Math.floor((this.totalDuration / 1000) * frameRate); // 約30フレーム
    
    for (let i = 0; i < maxLength; i++) {
      const currentChar = i < currentLength ? currentText[i] : '';
      const targetChar = i < targetLength ? targetText[i] : null;
      
      // 同じ文字の場合は変更しない
      if (currentChar === targetChar) {
        this.charStates[i] = {
          current: currentChar,
          target: targetChar,
          iterations: 0,
          maxIterations: 0, // 即座に完了
          needsChange: false // 変更不要
        };
      } else {
        // 各文字が異なるタイミングで終わるように設定（ランダムな順序）
        this.charStates[i] = {
          current: currentChar,
          target: targetChar,
          iterations: 0,
          maxIterations: Math.floor(15 + Math.random() * (maxIterations - 15)), // 15〜30フレームの範囲
          needsChange: true // 変更が必要
        };
      }
    }

    this.startTime = performance.now(); // Date.now()より高精度
    // requestAnimationFrameでアニメーション開始
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }
}

// 西暦の数字を1ずつカウントアップ/ダウンするアニメーション
class YearCounter {
  constructor(element) {
    this.element = element;
    this.animationFrameId = null;
    this.currentYear = null;
    this.targetYear = null;
    this.animationSpeed = 150; // ミリ秒（1ずつ変わる間隔）- 遅くするために150に変更
    this.lastUpdateTime = 0;
  }

  // アニメーションループ
  animate() {
    const now = performance.now();
    
    if (now - this.lastUpdateTime >= this.animationSpeed) {
      if (this.currentYear !== null && this.targetYear !== null) {
        if (this.currentYear < this.targetYear) {
          this.currentYear++;
          this.updateDisplay();
          this.lastUpdateTime = now;
        } else if (this.currentYear > this.targetYear) {
          this.currentYear--;
          this.updateDisplay();
          this.lastUpdateTime = now;
        } else {
          // アニメーション完了
          this.updateDisplay();
          this.animationFrameId = null;
          return;
        }
      }
    }

    if (this.currentYear !== this.targetYear) {
      this.animationFrameId = requestAnimationFrame(() => this.animate());
    } else {
      this.animationFrameId = null;
    }
  }

  // 表示を更新（年のみ表示）
  updateDisplay() {
    if (this.currentYear === null) return;
    this.element.textContent = this.currentYear.toString();
  }

  // 西暦を1ずつカウントアップ/ダウンで変更
  animateTo(targetYear) {
    // 既存のアニメーションをキャンセル
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // ターゲットを数値に変換（「2019-」のような場合は「2019」を抽出）
    let target = parseInt(targetYear, 10);
    if (isNaN(target)) {
      // 「2019-」のような形式の場合、「2019」を抽出
      const match = targetYear.match(/(\d+)/);
      if (match) {
        target = parseInt(match[1], 10);
      } else {
        // 数値が含まれていない場合はそのまま表示
        this.element.textContent = targetYear;
        this.currentYear = null;
        this.targetYear = null;
        return;
      }
    }

    // 現在の値を取得
    const currentText = this.element.textContent.trim().replace(/→\d+$/, '');
    const current = parseInt(currentText, 10);
    
    // 同じ値の場合はアニメーションしない
    if (!isNaN(current) && current === target) {
      this.updateDisplay();
      this.currentYear = target;
      this.targetYear = target;
      return;
    }

    // 初期値が空または数値でない場合は、即座にターゲット値を表示してからアニメーションしない
    if (isNaN(current) || currentText === '') {
      // 初期値が空の場合は即座に表示（アニメーションなし）
      this.currentYear = target;
      this.targetYear = target;
      this.updateDisplay();
      return;
    }

    // 初期値を設定
    this.currentYear = current;
    this.targetYear = target;
    this.lastUpdateTime = performance.now();

    // アニメーション開始
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }
}

// DOMContentLoaded時に初期化
document.addEventListener("DOMContentLoaded", () => {
  const hoverText = document.querySelector(".image-hover-text");
  const hoverTitle = document.querySelector(".hover-title");
  const hoverYear = document.querySelector(".hover-year");
  const hoverDescription = document.querySelector(".hover-description");
  const imageLinks = document.querySelectorAll(".image-link");

  if (hoverText && hoverTitle && hoverYear && hoverDescription && imageLinks.length > 0) {
    const titleScrambler = new TextScrambler(hoverTitle);
    const yearCounter = new YearCounter(hoverYear); // TextScramblerからYearCounterに変更
    const descriptionScrambler = new TextScrambler(hoverDescription);

    // ホバー中の画像があればそれを優先して使用
    let hoveredImageLink = null;

    function updateDisplayFromLink(link) {
      if (!link) return;
      const title = link.getAttribute("data-title");
      const year = link.getAttribute("data-year");
      const description = link.getAttribute("data-description") || "";
      if (title && year) {
        if (hoverTitle.textContent !== title) {
          titleScrambler.animateTo(title);
        }
        const currentYearText = hoverYear.textContent.trim();
        const yearMatch = year.match(/(\d+)/);
        const yearNumber = yearMatch ? yearMatch[1] : year;
        if (currentYearText !== yearNumber) {
          yearCounter.animateTo(year);
        }
        if (hoverDescription.textContent !== description) {
          if (description) {
            descriptionScrambler.animateTo(description);
          } else {
            hoverDescription.textContent = "";
          }
        }
      }
    }

    // 画面上の基準位置に一番近い画像、またはホバー中ならその画像のタイトル・西暦を表示
    // 640px以下: 画面縦中央に一番近い画像 / それ以上: 上から34vhに一番近い画像
    function checkCenterImage() {
      let targetLink = hoveredImageLink;

      if (!targetLink) {
        const isNarrow = window.innerWidth <= 640;
        const viewportReference = window.scrollY + window.innerHeight * (isNarrow ? 0.5 : 0.34);
        let minDistance = Infinity;

        imageLinks.forEach((link) => {
          const rect = link.getBoundingClientRect();
          const imageCenter = rect.top + rect.height / 2 + window.scrollY;
          const distance = Math.abs(viewportReference - imageCenter);

          if (distance < minDistance) {
            minDistance = distance;
            targetLink = link;
          }
        });
      }

      if (targetLink) {
        updateDisplayFromLink(targetLink);
      }
    }

    // ホバー中はその画像を優先
    imageLinks.forEach((link) => {
      link.addEventListener("mouseenter", () => {
        hoveredImageLink = link;
        updateDisplayFromLink(link);
      });
      link.addEventListener("mouseleave", () => {
        hoveredImageLink = null;
        checkCenterImage(); // 34vhに近い画像に戻す
      });
    });

    // スクロールイベント
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(checkCenterImage, 50);
    });

    // リサイズ時（640px境界をまたぐときも反映）
    window.addEventListener('resize', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(checkCenterImage, 50);
    });

    // 初期チェック
    checkCenterImage();
  }

  // 640px以下：タイトルが上から10pxに来たら固定。スクロールを戻すと元の位置に戻る（タイトルは content-text 内）
  const contentText = document.querySelector(".content-text");
  const contentGrid = document.querySelector(".content-grid");
  if (contentText && contentGrid) {
    const STICKY_TOP = 10;
    let stuckNaturalTop = 0; // 固定した瞬間の、タイトル上端のドキュメント座標
    function updateTitleSticky() {
      if (window.innerWidth > 640) {
        contentText.classList.remove("is-stuck");
        contentGrid.style.paddingTop = "";
        return;
      }
      if (contentText.classList.contains("is-stuck")) {
        // 固定中は rect が常に 10 付近なので、スクロール位置で「戻す」判定
        if (window.scrollY < stuckNaturalTop - STICKY_TOP) {
          contentText.classList.remove("is-stuck");
          contentGrid.style.paddingTop = "";
        }
        return;
      }
      const rect = contentText.getBoundingClientRect();
      if (rect.top <= STICKY_TOP) {
        stuckNaturalTop = window.scrollY + rect.top;
        const h = contentText.offsetHeight;
        contentText.classList.add("is-stuck");
        contentGrid.style.paddingTop = h + 12 + "px";
      }
    }
    window.addEventListener("scroll", updateTitleSticky, { passive: true });
    window.addEventListener("resize", updateTitleSticky);
    updateTitleSticky();
  }
});
