// ── core：slides 数组、章节索引、底部圆点、导航、键盘/触摸、hash ──
const slides = Array.from(document.querySelectorAll('.slide'));
const dotsWrap = document.getElementById('dots');
const progress = document.getElementById('progress');
const curEl = document.getElementById('cur');
const totalEl = document.getElementById('total');
const chapEl = document.getElementById('chapname');
const overview = document.getElementById('overview');
const ovBody = document.getElementById('ov-body');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let idx = 0;
totalEl.textContent = slides.length;

// ── 章节索引：按 data-chapter 分组 ──
const chapters = [];
const chapterSet = new Set();
slides.forEach((s, i) => {
  const c = s.dataset.chapter;
  if (!c || chapterSet.has(c)) return;
  chapterSet.add(c);
  chapters.push({ num: c, title: s.dataset.chapterTitle || ('第 ' + c + ' 章'), start: i, color: s.dataset.chapterColor || null });
});
const chapterMap = new Map(chapters.map(c => [c.num, c]));

// ── 底部圆点：按章分组（章与章之间插入间隙）──
const dots = [];
let prevChapter = slides[0] ? slides[0].dataset.chapter : undefined;
slides.forEach((s, i) => {
  if (i > 0 && s.dataset.chapter !== prevChapter) {
    const gap = document.createElement('span');
    gap.className = 'gap';
    dotsWrap.appendChild(gap);
  }
  prevChapter = s.dataset.chapter;
  const d = document.createElement('div');
  d.className = 'd' + (i === 0 ? ' on' : '');
  d.addEventListener('click', () => go(i));
  dotsWrap.appendChild(d);
  dots.push(d);
});

let suppressHash = false;
function go(n) {
  const from = idx;
  idx = Math.max(0, Math.min(slides.length - 1, n));
  const dir = idx === from ? 0 : (idx > from ? 1 : -1);
  clearT();
  if (from >= 0 && from < slides.length) slides[from].classList.remove('active');
  slides[idx].classList.add('active');
  dots.forEach((d, i) => d.classList.toggle('on', i === idx));
  curEl.textContent = idx + 1;
  progress.style.width = ((idx + 1) / slides.length * 100) + '%';
  updateChapName();
  applyTheme();
  initSteps(dir);
  renderMarkers();
  runReveal(slides[idx], dir);
  if (dir !== 0 && window.__kickBg) window.__kickBg(dir);
  const want = 'p' + (idx + 1);
  if (location.hash.slice(1) !== want) { suppressHash = true; location.hash = want; }
}
function next() { go(idx + 1); }
function prev() { go(idx - 1); }
function gotoChapter(n) { if (chapters[n]) go(chapters[n].start); }

function applyHash() {
  if (suppressHash) { suppressHash = false; return; }
  const m = /^#p(\d+)$/.exec(location.hash);
  go(m ? parseInt(m[1], 10) - 1 : 0);
}
window.addEventListener('hashchange', applyHash);

document.addEventListener('keydown', (e) => {
  if (document.getElementById('cm-json').classList.contains('show')) {
    if (e.key === 'Escape') { e.preventDefault(); closeJson(); }
    return;
  }
  if (commenting) {
    if (!cmInput && (e.key === 'Enter' || e.key === 'Escape')) { e.preventDefault(); exitCommenting(); }
    return;
  }
  if (overview.classList.contains('show')) {
    if (e.key === 'Escape' || e.key === 'o' || e.key === 'O') { e.preventDefault(); closeOverview(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); moveOvSel(1, 0); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); moveOvSel(-1, 0); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); moveOvSel(0, 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); moveOvSel(0, -1); }
    else if (e.key === 'Enter') { e.preventDefault(); const t = ovSel; closeOverview(); go(t); }
    return;
  }
  if (e.key === ' ') { e.preventDefault(); advance(); }
  else if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); next(); }
  else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); prev(); }
  else if (e.key === 'Home') go(0);
  else if (e.key === 'End') go(slides.length - 1);
  else if (e.key === 'Escape' || e.key === 'o' || e.key === 'O') { e.preventDefault(); toggleOverview(); }
  else if (e.key >= '1' && e.key <= '9') { e.preventDefault(); gotoChapter(parseInt(e.key, 10) - 1); }
  else if (e.key === 'f' || e.key === 'F') { if (!document.fullscreenElement) document.documentElement.requestFullscreen(); else document.exitFullscreen(); }
  else if (e.key === 'c' || e.key === 'C') { e.preventDefault(); enterCommenting(); }
  else if (e.key === 'j' || e.key === 'J') { e.preventDefault(); openJson(); }
});

document.getElementById('deck').addEventListener('click', (e) => {
  if (e.target.closest('.bubble.human')) return;
  if (e.target.closest('a')) return;
  if (e.clientY > window.innerHeight - 70) return;
  advance();
});
let tx = 0;
document.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
document.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - tx; if (dx < -50) next(); else if (dx > 50) prev(); }, { passive: true });
