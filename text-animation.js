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
    const maxIterations = Math.floor(this.totalDuration / this.animationSpeed); // 約14回
    
    for (let i = 0; i < maxLength; i++) {
      // 各文字が10〜14回の範囲でランダムに終わるように設定
      charStates.push({
        current: i < currentText.length ? currentText[i] : '',
        target: i < targetText.length ? targetText[i] : null,
        iterations: 0,
        maxIterations: Math.floor(10 + Math.random() * (maxIterations - 10)) // 10〜14回の範囲
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

        // 0.7秒経過したら強制的に完了
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
  const imageLinks = document.querySelectorAll(".image-link");

  if (hoverText && imageLinks.length > 0) {
    const scrambler = new TextScrambler(hoverText);

    imageLinks.forEach((link) => {
      link.addEventListener("mouseenter", () => {
        const title = link.getAttribute("data-title");
        const year = link.getAttribute("data-year");
        if (title && year) {
          const newText = `${title} ${year}`;
          scrambler.animateTo(newText);
        }
      });

      link.addEventListener("mouseleave", () => {
        scrambler.animateTo("-------");
      });
    });
  }
});
