// ── comments 批注（评审工具）：C 进入批注、J 看/编 JSON ──
let comments = [], cmId = 0, commenting = false, cmInput = null;
const cmLayer = document.getElementById('comments-layer');
const cmJson = document.getElementById('cm-json');
const cmJsonTa = document.getElementById('cm-json-ta');
const cmJsonErr = document.getElementById('cm-json-err');

function renderMarkers() {
  cmLayer.querySelectorAll('.cm-marker, .cm-pop').forEach(e => e.remove());
  const page = idx + 1;
  comments.filter(c => c.page === page).forEach(c => {
    const m = document.createElement('div');
    m.className = 'cm-marker';
    m.style.left = (c.x * 100) + '%'; m.style.top = (c.y * 100) + '%';
    m.textContent = c.id; m.title = '点击查看批注';
    m.addEventListener('click', (e) => { e.stopPropagation(); showCommentPop(c); });
    cmLayer.appendChild(m);
  });
}
function showCommentPop(c) {
  cmLayer.querySelectorAll('.cm-pop').forEach(e => e.remove());
  const p = document.createElement('div');
  p.className = 'cm-pop';
  p.style.left = (c.x * 100) + '%'; p.style.top = (c.y * 100) + '%';
  p.textContent = c.text;
  p.addEventListener('click', e => e.stopPropagation());
  cmLayer.appendChild(p);
  setTimeout(() => {
    const close = (ev) => { if (!p.contains(ev.target)) { p.remove(); document.removeEventListener('click', close, true); } };
    document.addEventListener('click', close, true);
  }, 0);
}
function confirmInput() {
  if (!cmInput) return;
  const text = cmInput.querySelector('textarea').value.trim();
  const x = parseFloat(cmInput.dataset.x), y = parseFloat(cmInput.dataset.y);
  cmInput.remove(); cmInput = null;
  if (text) { comments.push({ id: ++cmId, page: idx + 1, x, y, text }); renderMarkers(); }
}
function closeInput(commit) {
  if (!cmInput) return;
  if (commit) { confirmInput(); return; }
  cmInput.remove(); cmInput = null;
}
function openInput(x, y) {
  closeInput(true);
  const box = document.createElement('div');
  box.className = 'cm-input';
  box.style.left = (x * 100) + '%'; box.style.top = (y * 100) + '%';
  box.dataset.x = x; box.dataset.y = y;
  box.innerHTML = '<textarea></textarea><div class="cm-hint">Enter 确认 · Shift+Enter 换行 · Esc 取消</div>';
  cmLayer.appendChild(box);
  cmInput = box;
  const ta = box.querySelector('textarea');
  ta.addEventListener('keydown', (e) => {
    e.stopPropagation();
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); confirmInput(); }
    else if (e.key === 'Escape') { e.preventDefault(); closeInput(false); }
  });
  ta.focus();
}
function enterCommenting() { commenting = true; document.body.classList.add('commenting'); cmLayer.style.pointerEvents = 'auto'; }
function exitCommenting() { closeInput(false); commenting = false; document.body.classList.remove('commenting'); cmLayer.style.pointerEvents = 'none'; }
cmLayer.addEventListener('click', (e) => {
  if (!commenting) return;
  if (e.target.closest('.cm-marker') || e.target.closest('.cm-input') || e.target.closest('.cm-pop')) return;
  openInput(e.clientX / window.innerWidth, e.clientY / window.innerHeight);
});

function openJson() { cmJsonTa.value = JSON.stringify(comments, null, 2); cmJsonErr.textContent = ''; cmJson.classList.add('show'); cmJsonTa.focus(); cmJsonTa.select(); }
function closeJson() { cmJson.classList.remove('show'); }
function applyJson() {
  try {
    const data = JSON.parse(cmJsonTa.value || '[]');
    if (!Array.isArray(data)) throw new Error('顶层应为数组');
    comments = data.map((c, i) => ({ id: c.id != null ? c.id : (i + 1), page: parseInt(c.page, 10) || 1, x: +c.x || 0, y: +c.y || 0, text: String(c.text == null ? '' : c.text) }));
    cmId = comments.reduce((m, c) => Math.max(m, +c.id || 0), 0);
    closeJson();
    if (comments.length) go(comments[0].page - 1); else renderMarkers();
  } catch (err) { cmJsonErr.textContent = '解析失败：' + err.message; }
}
document.getElementById('cm-json-apply').addEventListener('click', applyJson);
document.getElementById('cm-json-clear').addEventListener('click', () => { comments = []; cmId = 0; renderMarkers(); closeJson(); });
cmJson.addEventListener('click', (e) => { if (e.target === cmJson) closeJson(); });
