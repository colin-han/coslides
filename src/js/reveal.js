// ── reveal 入场 ──
const REVEAL_SEL = '.reveal-item';
let timers = [];
function clearT() { timers.forEach(clearTimeout); timers = []; }
function runReveal(slide, dir) {
  if (dir > 0) { slide.style.setProperty('--enter-x', '-36px'); slide.style.setProperty('--enter-y', '0px'); }
  else if (dir < 0) { slide.style.setProperty('--enter-x', '36px'); slide.style.setProperty('--enter-y', '0px'); }
  else { slide.style.setProperty('--enter-x', '0px'); slide.style.setProperty('--enter-y', '20px'); }
  const items = Array.from(slide.querySelectorAll(REVEAL_SEL));
  items.forEach(el => el.classList.remove('in'));
  if (reduceMotion) { items.forEach(el => el.classList.add('in')); return; }
  const step = items.length > 12 ? 50 : 85;
  items.forEach((el, i) => timers.push(setTimeout(() => el.classList.add('in'), 90 + i * step)));
}
