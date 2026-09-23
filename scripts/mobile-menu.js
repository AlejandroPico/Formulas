const menuToggle = document.querySelector('#mobileMenuToggle');
const menuClose = document.querySelector('#mobileMenuClose');
const menuScrim = document.querySelector('#mobileMenuScrim');
const menu = document.querySelector('#mobileTools');
const mobileMedia = window.matchMedia('(max-width: 900px)');
let touchStart = null;

function setMenu(open, restoreFocus = false) {
  const visible = open && mobileMedia.matches;
  document.body.classList.toggle('mobile-tools-open', visible);
  menuToggle.setAttribute('aria-expanded', String(visible));
  menuToggle.setAttribute('aria-label', visible ? 'Cerrar menú' : 'Abrir menú');
  menuScrim.hidden = !visible;
  menu.inert = mobileMedia.matches && !visible;
  if (visible) menuClose.focus({ preventScroll: true });
  else if (restoreFocus && mobileMedia.matches) menuToggle.focus({ preventScroll: true });
}

menuToggle.addEventListener('click', () => setMenu(true));
menuClose.addEventListener('click', () => setMenu(false, true));
menuScrim.addEventListener('click', () => setMenu(false, true));
document.querySelector('#aboutToggle')?.addEventListener('click', () => setMenu(false));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && document.body.classList.contains('mobile-tools-open')) setMenu(false, true);
});
menu.addEventListener('touchstart', event => {
  const touch = event.changedTouches[0];
  touchStart = { x: touch.clientX, y: touch.clientY };
}, { passive: true });
menu.addEventListener('touchend', event => {
  if (!touchStart) return;
  const touch = event.changedTouches[0];
  const dx = touch.clientX - touchStart.x;
  const dy = touch.clientY - touchStart.y;
  if (dx > 65 && Math.abs(dx) > Math.abs(dy) * 1.25) setMenu(false, true);
  touchStart = null;
}, { passive: true });
mobileMedia.addEventListener('change', () => setMenu(false));
setMenu(false);
