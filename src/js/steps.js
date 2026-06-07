// ── 分步（steps）：空格 / 点击在页内逐步推进 ──
let curStep = 0, curTotal = 0;
function slideTotal(s) {
  if (s.dataset.steps != null) return parseInt(s.dataset.steps, 10) || 0;
  return s.querySelectorAll('.step').length;
}
function applyStepState(s, fire, dir) {
  s.dataset.step = curStep;
  s.querySelectorAll('.step').forEach((el, i) => el.classList.toggle('shown', i < curStep));
  if (fire && curTotal > 0) s.dispatchEvent(new CustomEvent('coslides:step', { detail: { step: curStep, total: curTotal, dir: dir || 0 } }));
}
function initSteps(dir) {
  const s = slides[idx];
  curTotal = slideTotal(s);
  curStep = dir < 0 ? curTotal : 0;
  applyStepState(s, curTotal > 0, 0);
}
function advance() {
  if (curStep < curTotal) { curStep++; applyStepState(slides[idx], true, 1); }
  else next();
}
