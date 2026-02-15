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

  // ページ遷移をなめらかにする（index / aboutme への遷移のみフェード。workサブページへは白背景のまま即遷移）
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
      // home → サブページ（1.html, 2.html など）のときはフェードせずそのまま遷移（白＞黒の背景変更なし）
      // home → aboutme（a.html）のときもフェードせずそのまま遷移（黒＞黒のままでよい）
      const isWorkSubpage = /^\d+\.html$/.test(href) || href === '0_temple.html';
      const isAboutMe = href === 'aboutme.html' || href.endsWith('/aboutme.html');
      if (isWorkSubpage || isAboutMe) {
        return; // 通常のリンク遷移のまま
      }
      link.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.style.transition = 'opacity 0.2s ease-in-out';
        document.body.style.opacity = '0';
        setTimeout(() => {
          window.location.href = href;
        }, 200);
      });
    }
  });

  // 画像ホバー時のテキスト変更は text-animation.js で処理

  // スクロール時に「AKERU MINEMURA PORTFOLIO」をフェードアウト（クラスで制御してホバーアニメを維持）
  const portfolioButton = document.querySelector('.nav-right .nav-button');
  if (portfolioButton) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > 60) {
        portfolioButton.classList.add('nav-button-scrolled');
      } else {
        portfolioButton.classList.remove('nav-button-scrolled');
      }
    }, { passive: true });
  }
});










