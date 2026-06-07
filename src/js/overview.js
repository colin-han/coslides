// ── overview 缩略概览 ──
const slideTitles = slides.map(s => {
  const el = s.querySelector('h1, h2, .chap-tag, .kicker');
  return el ? el.textContent.trim().replace(/\s+/g, ' ').slice(0, 48) : '(无标题)';
});
let overviewBuilt = false;
function buildOverview() {
  if (overviewBuilt) {
    ovBody.querySelectorAll('.ov-cell').forEach((el, i) => el.classList.toggle('cur', i === idx));
    return;
  }
  ovBody.innerHTML = '';
  let group = null, groupChapter = '__none__';
  slides.forEach((s, i) => {
    const ch = s.dataset.chapter || '';
    if (ch !== groupChapter) {
      groupChapter = ch;
      group = document.createElement('div');
      group.className = 'ov-chapter';
      const name = document.createElement('div');
      name.className = 'ov-ch-name';
      const meta = chapterMap.get(ch);
      name.textContent = ch ? (meta ? meta.title : ('第 ' + ch + ' 章')) : '— 前言 / 尾声 —';
      group.appendChild(name);
      const grid = document.createElement('div');
      grid.className = 'ov-grid';
      group.appendChild(grid);
      ovBody.appendChild(group);
    }
    const grid = group.querySelector('.ov-grid');
    const cell = document.createElement('div');
    cell.className = 'ov-cell' + (i === idx ? ' cur' : '');
    cell.dataset.idx = i;
    cell.innerHTML = '<div class="ov-n">' + (i + 1) + '</div><div class="ov-t">' + slideTitles[i] + '</div>';
    grid.appendChild(cell);
  });
  overviewBuilt = true;
}
ovBody.addEventListener('click', (e) => {
  const cell = e.target.closest('.ov-cell');
  if (!cell) return;
  closeOverview(); go(+cell.dataset.idx);
});
let ovSel = 0;
function ovCells() { return Array.from(ovBody.querySelectorAll('.ov-cell')); }
function updateOvSel() {
  const cells = ovCells();
  cells.forEach((el, i) => el.classList.toggle('sel', i === ovSel));
  if (cells[ovSel]) cells[ovSel].scrollIntoView({ block: 'nearest' });
}
function moveOvSel(dx, dy) {
  const cells = ovCells();
  if (!cells.length) return;
  const rects = cells.map(el => el.getBoundingClientRect());
  const ci = Math.min(ovSel, rects.length - 1);
  const cr = rects[ci] || rects[0];
  const ccx = cr.left + cr.width / 2, ccy = cr.top + cr.height / 2;
  let best = -1, bestScore = Infinity;
  for (let i = 0; i < cells.length; i++) {
    if (i === ci) continue;
    const r = rects[i];
    const ex = (r.left + r.width / 2) - ccx, ey = (r.top + r.height / 2) - ccy;
    if (dx === 1 && ex <= 4) continue;
    if (dx === -1 && ex >= -4) continue;
    if (dy === 1 && ey <= 4) continue;
    if (dy === -1 && ey >= -4) continue;
    const score = dx !== 0 ? Math.abs(ex) + Math.abs(ey) * 3 : Math.abs(ey) + Math.abs(ex) * 3;
    if (score < bestScore) { bestScore = score; best = i; }
  }
  if (best >= 0) { ovSel = best; updateOvSel(); }
}
function openOverview() { ovSel = idx; buildOverview(); overview.classList.add('show'); updateOvSel(); if (window.__pauseBg) __pauseBg(); }
function closeOverview() { overview.classList.remove('show'); if (window.__resumeBg) __resumeBg(); }
function toggleOverview() { overview.classList.contains('show') ? closeOverview() : openOverview(); }
