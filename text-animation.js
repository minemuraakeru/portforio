// テキストアニメーション機能
class TextScrambler {
  constructor(element) {
    this.element = element;
    this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    this.animationSpeed = 50; // ミリ秒
    this.totalDuration = 500; // 総アニメーション時間（ミリ秒）
    this.animationId = null;
  }

  // ランダムな文字を生成
  getRandomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }

  // テキストをスクランブルアニメーションで変更
  animateTo(targetText) {
    // 既存のアニメーションをキャンセル
    if (this.animationId) {
      clearInterval(this.animationId);
    }

    const currentText = this.element.textContent;
    const maxLength = Math.max(currentText.length, targetText.length);
    
    // 各文字位置の状態を管理
    const charStates = [];
    const maxIterations = Math.floor(this.totalDuration / this.animationSpeed); // 約10回
    
    for (let i = 0; i < maxLength; i++) {
      // 各文字が8〜10回の範囲でランダムに終わるように設定
      charStates.push({
        current: i < currentText.length ? currentText[i] : '',
        target: i < targetText.length ? targetText[i] : null,
        iterations: 0,
        maxIterations: Math.floor(8 + Math.random() * (maxIterations - 8)) // 8〜10回の範囲
      });
    }

    const startTime = Date.now();

    // アニメーションループ
    this.animationId = setInterval(() => {
      const elapsed = Date.now() - startTime;
      let scrambledText = '';
      let allComplete = true;

      for (let i = 0; i < charStates.length; i++) {
        const state = charStates[i];
        
        if (state.target === null) {
          // この文字は削除される（表示しない）
          continue;
        }

        // 0.5秒経過したら強制的に完了
        if (elapsed >= this.totalDuration) {
          scrambledText += state.target;
        } else if (state.iterations < state.maxIterations) {
          // まだアニメーション中
          scrambledText += this.getRandomChar();
          state.iterations++;
          allComplete = false;
        } else {
          // アニメーション完了、最終文字を表示
          scrambledText += state.target;
        }
      }

      this.element.textContent = scrambledText;

      if (allComplete || elapsed >= this.totalDuration) {
        clearInterval(this.animationId);
        this.animationId = null;
        // 最終的なテキストを確実に設定
        this.element.textContent = targetText;
      }
    }, this.animationSpeed);
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
    const yearScrambler = new TextScrambler(hoverYear);
    const descriptionScrambler = new TextScrambler(hoverDescription);

    // スクロール時に中央に来た画像を検知
    function checkCenterImage() {
      const viewportCenter = window.innerHeight / 2 + window.scrollY;
      let centerImage = null;
      let minDistance = Infinity;

      imageLinks.forEach((link) => {
        const rect = link.getBoundingClientRect();
        const imageCenter = rect.top + rect.height / 2 + window.scrollY;
        const distance = Math.abs(viewportCenter - imageCenter);

        if (distance < minDistance) {
          minDistance = distance;
          centerImage = link;
        }
      });

      if (centerImage) {
        const title = centerImage.getAttribute("data-title");
        const year = centerImage.getAttribute("data-year");
        const description = centerImage.getAttribute("data-description") || ""; // 説明はオプション
        if (title && year) {
          if (hoverTitle.textContent !== title) {
            titleScrambler.animateTo(title);
          }
          if (hoverYear.textContent !== year) {
            yearScrambler.animateTo(year);
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
    }

    // スクロールイベント
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(checkCenterImage, 50);
    });

    // 初期チェック
    checkCenterImage();

    // ホバーイベントは削除（スクロールベースのみ）
  }
});
