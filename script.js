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

  // ページ遷移をなめらかにする
  const links = document.querySelectorAll('a[href]');
  links.forEach(link => {
    const href = link.getAttribute('href');
    
    // ページ内リンクのみを対象（外部リンク、SNSリンク、アンカーリンクは除外）
    if (href && 
        !href.startsWith('#') && 
        !href.startsWith('javascript:') && 
        !href.startsWith('http://') && 
        !href.startsWith('https://') &&
        (href.endsWith('.html') || href === 'index.html' || href === 'aboutme.html' || 
         href.includes('/') && !href.includes('://'))) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.style.transition = 'opacity 0.2s ease-in-out'; // フェードアウト時間
        document.body.style.opacity = '0';
        setTimeout(() => {
          window.location.href = href;
        }, 200); // フェードアウト時間と同じ
      });
    }
  });

  // 画像ホバー時のテキスト変更は text-animation.js で処理

  // スクロール時に「AKERU MINEMURA PORTFOLIO」をフェードアウト
  const portfolioButton = document.querySelector('.nav-right .nav-button');
  if (portfolioButton) {
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // 60pxスクロールした時にフェードアウト
      if (scrollTop > 60) {
        portfolioButton.style.opacity = '0';
      } else {
        // 60px未満の場合は表示
        portfolioButton.style.opacity = '1';
      }
      
      lastScrollTop = scrollTop;
    }, { passive: true });
  }
});









window.addEventListener('load', () => {
  // オープニングアニメーションが終了した後に、コンテンツを表示する
  const openingAnimation = document.querySelector('.opening-animation');
  setTimeout(() => {
    openingAnimation.style.display = 'none'; // アニメーション終了後にオープニングを非表示
  }, 2000); // アニメーション時間（ミリ秒）
});

