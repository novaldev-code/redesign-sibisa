(function(){
  const btn = document.getElementById('scroll-top');
  if (!btn) return;
  function update(){ btn.classList.toggle('hidden', window.scrollY <= 600); }
  update();
  window.addEventListener('scroll', update, { passive: true });
  btn.addEventListener('click', ()=> window.scrollTo({ top: 0, behavior: 'smooth' }));
})();
