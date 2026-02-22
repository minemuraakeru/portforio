document.addEventListener("DOMContentLoaded", () => {
  // マウスアピアランス：追従する円（PC・マウス操作時のみ表示・軽量版）※コメントアウト
  /*
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
  */

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
      // project(index) → サブページ（1.html, 2.html など）のときはフェードせずそのまま遷移（白＞黒の背景変更なし）
      // project → aboutme（a.html）のときもフェードせずそのまま遷移（黒＞黒のままでよい）
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

  // 640px以下：20pxスクロールで akeru.min を縦10%縮小・opacity 0
  const navBrand = document.querySelector('.nav-brand');
  if (navBrand) {
    const SCROLL_END = 20;
    const BREAKPOINT = 640;
    function updateNavBrandScroll() {
      if (window.innerWidth > BREAKPOINT) {
        navBrand.style.opacity = '';
        navBrand.style.transform = '';
        navBrand.style.pointerEvents = '';
        return;
      }
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const t = Math.min(1, scrollTop / SCROLL_END);
      navBrand.style.opacity = (1 - t).toString();
      navBrand.style.transform = `scaleY(${1 - t * 0.1})`;
      navBrand.style.pointerEvents = scrollTop >= SCROLL_END ? 'none' : '';
    }
    window.addEventListener('scroll', updateNavBrandScroll, { passive: true });
    window.addEventListener('resize', updateNavBrandScroll);
    updateNavBrandScroll();
  }

  // index: スクロール速度に応じて画像を14%縮小（最大速度時）。止まっている時は100%。滑らかに比例。
  const contentSection = document.getElementById("content-section");
  const imageGrid = contentSection?.querySelector(".image-grid");
  if (contentSection && imageGrid) {
    const MAX_SPEED = 2500;   // px/s 以上を「最大速度」とする
    const SMOOTH = 0.15;      // 速度の平滑化（小さいほどなめらか）
    const EASE = 0.12;        // スケールの追従（小さいほどなめらか）
    let lastScrollY = window.scrollY;
    let lastTime = performance.now();
    let smoothSpeed = 0;
    let currentScale = 1;

    function updateScrollScale() {
      const now = performance.now();
      const dt = (now - lastTime) / 1000;
      const rawSpeed = Math.abs((window.scrollY - lastScrollY) / (dt || 0.001));
      lastScrollY = window.scrollY;
      lastTime = now;
      smoothSpeed += (rawSpeed - smoothSpeed) * SMOOTH;
      const t = Math.min(1, smoothSpeed / MAX_SPEED);
      const targetScale = 1 - 0.14 * t;
      currentScale += (targetScale - currentScale) * EASE;
      contentSection.style.setProperty("--scroll-scale", currentScale.toString());
      requestAnimationFrame(updateScrollScale);
    }
    requestAnimationFrame(updateScrollScale);
  }
});










