// ── 当前章名 ──
function updateChapName() {
  const ch = slides[idx].dataset.chapter;
  const meta = ch && chapterMap.get(ch);
  chapEl.textContent = meta ? ('· ' + meta.title) : '';
}

// ── 章节主题色 ──
const rootStyle = document.documentElement.style;
const defaultAccent = (getComputedStyle(document.documentElement).getPropertyValue('--accent') || '#38e0d0').trim();
function hexToRgb(hex) {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec((hex || '').trim());
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [56, 224, 208];
}
let accentRGB = hexToRgb(defaultAccent);
function applyTheme() {
  const ch = slides[idx].dataset.chapter;
  const meta = ch && chapterMap.get(ch);
  const color = (meta && meta.color) || defaultAccent;
  rootStyle.setProperty('--accent', color);
  accentRGB = hexToRgb(color);
}
