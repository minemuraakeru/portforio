document.addEventListener("DOMContentLoaded", () => {
  // マウスアピアランス：追従する円（PC・マウス操作時のみ表示・軽量版）
  (function initMouseAppearance() {
    const isTouch = window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in document.documentElement;
    if (isTouch) return;

    const el = document.createElement("div");
    el.className = "mouse-appearance";
    el.setAttribute("aria-hidden", "true");
    document.body.appendChild(el);

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let visible = false;
    let rafId = null;

    document.body.addEventListener("mousemove", (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!visible) {
        visible = true;
        document.body.classList.add("has-mouse-appearance");
        el.style.opacity = "1";
        currentX = targetX;
        currentY = targetY;
      }
      if (visible && rafId === null) rafId = requestAnimationFrame(update);
    }, { passive: true });

    document.body.addEventListener("mouseleave", () => {
      visible = false;
      document.body.classList.remove("has-mouse-appearance");
      el.style.opacity = "0";
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    });

    document.addEventListener("mousedown", () => el.classList.add("is-pressed"), { passive: true });
    document.addEventListener("mouseup", () => el.classList.remove("is-pressed"), { passive: true });

    function update() {
      rafId = null;
      if (!visible) return;
      const ease = 0.22;
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;
      el.style.transform = `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px))`;
      const dx = targetX - currentX, dy = targetY - currentY;
      if (dx * dx + dy * dy > 0.5) rafId = requestAnimationFrame(update);
    }
  })();

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










