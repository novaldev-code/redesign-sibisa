(function(){
  const mobileNav = document.getElementById('mobile-nav');
  const menuBtn = document.getElementById('menu-btn');
  const themeBtn = document.getElementById('theme-btn');

  const ICON_MENU = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
  const ICON_CLOSE = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

  function setMobileMenu(open){
    if (!mobileNav || !menuBtn) return;
    mobileNav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
    menuBtn.innerHTML = open ? ICON_CLOSE : ICON_MENU;
  }

  function closeAll(){
    document.querySelectorAll('.nav-item.open').forEach(el=>{
      el.classList.remove('open');
      const toggle = el.querySelector('[data-dropdown-toggle]');
      if (toggle) toggle.setAttribute('aria-expanded','false');
    });
    setMobileMenu(false);
  }

  // dropdown toggles (desktop)
  document.querySelectorAll('[data-dropdown-toggle]').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      e.stopPropagation();
      const parent = btn.closest('.nav-item');
      const isOpen = parent.classList.contains('open');
      closeAll();
      if (!isOpen) {
        parent.classList.add('open');
        btn.setAttribute('aria-expanded','true');
      }
    });
  });

  document.addEventListener('click', (e)=>{
    if (e.target.closest('#menu-btn') || e.target.closest('#mobile-nav')) return;
    if (!e.target.closest('.nav-item')) closeAll();
  });
  document.addEventListener('keydown', (e)=>{
    if (e.key === 'Escape') closeAll();
  });

  // mobile menu
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', (e)=>{
      e.stopPropagation();
      setMobileMenu(!mobileNav.classList.contains('open'));
    });
  }

  // mobile group toggles
  document.querySelectorAll('[data-mobile-group]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (panel) panel.classList.toggle('hidden');
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    });
  });

  // theme toggle
  if (themeBtn) {
    themeBtn.addEventListener('click', ()=>{
      const root = document.documentElement;
      const next = !root.classList.contains('dark');
      root.classList.toggle('dark', next);
      try { localStorage.setItem('sibisa-theme', next ? 'dark' : 'light'); } catch(e){}
    });
  }

  // active link highlighting
  let path = window.location.pathname.replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/';
  if (path === '/') path = '/index.html';

  function matchesPath(match){
    const target = match.trim().replace(/\/$/, '');
    if (!target) return false;
    if (path === target || path.endsWith(target)) return true;
    if (/\.html$/.test(target)) return path.startsWith(target.replace(/\.html$/, '/'));
    return path.indexOf(target + '/') !== -1;
  }

  document.querySelectorAll('a[data-nav-match]').forEach(a=>{
    const matches = (a.getAttribute('data-nav-match') || '').split(',');
    if (matches.some(matchesPath)) {
      a.classList.add('active');
      a.setAttribute('aria-current','page');
    }
  });

  // close mobile menu on link click
  if (mobileNav) {
    mobileNav.querySelectorAll('a').forEach(a=>{
      a.addEventListener('click', ()=> setMobileMenu(false));
    });
  }

  // keep mobile menu state in sync when switching to desktop layout
  window.addEventListener('resize', ()=>{
    if (window.innerWidth >= 1024 && mobileNav && mobileNav.classList.contains('open')) {
      setMobileMenu(false);
    }
  });
})();
