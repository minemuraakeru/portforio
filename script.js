document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".hamburger-menu");
  const menuContent = document.querySelector(".menu-content");

  menuButton.addEventListener("click", () => {
    menuContent.classList.toggle("active");
  });

  // メニュー外をクリックしたときに閉じる
  menuContent.addEventListener("click", (e) => {
    if (e.target === menuContent) {
      menuContent.classList.remove("active");
    }
  });

  // 画像ホバー時のテキスト変更は text-animation.js で処理
});









window.addEventListener('load', () => {
  // オープニングアニメーションが終了した後に、コンテンツを表示する
  const openingAnimation = document.querySelector('.opening-animation');
  setTimeout(() => {
    openingAnimation.style.display = 'none'; // アニメーション終了後にオープニングを非表示
  }, 2000); // アニメーション時間（ミリ秒）
});

