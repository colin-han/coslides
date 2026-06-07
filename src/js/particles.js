// ── 粒子背景（翻页方向性 whoosh）──
(function () {
  if (reduceMotion) { window.__kickBg = null; return; }
  const canvas = document.getElementById('bg'), ctx = canvas.getContext('2d');
  let w, h, pts, raf, running = true; const COUNT = 52, LINK = 150;
  let boost = 0, dir = 0;
  let curRGB = accentRGB.slice();
  window.__kickBg = (d) => {
    dir = d; boost = 1;
    for (const p of pts) { p.vx += dir * (0.7 + Math.random() * 0.9) * devicePixelRatio; p.vy += (Math.random() - .5) * 1.0 * devicePixelRatio; }
  };
  window.__pauseBg = () => { running = false; cancelAnimationFrame(raf); };
  window.__resumeBg = () => { if (!running && !document.hidden) { running = true; frame(); } };
  function resize() { w = canvas.width = innerWidth * devicePixelRatio; h = canvas.height = innerHeight * devicePixelRatio; canvas.style.width = innerWidth + 'px'; canvas.style.height = innerHeight + 'px'; }
  function init() { pts = Array.from({ length: COUNT }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .22 * devicePixelRatio, vy: (Math.random() - .5) * .22 * devicePixelRatio, r: (Math.random() * 1.5 + .5) * devicePixelRatio })); }
  const FPS_INTERVAL = 1000 / 30;
  let lastFrame = 0;
  function frame(ts) {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    if (!ts || ts - lastFrame < FPS_INTERVAL) return;
    lastFrame = ts;
    ctx.clearRect(0, 0, w, h); const link = LINK * devicePixelRatio;
    const sweep = dir * boost * 3.2 * devicePixelRatio;
    for (let k = 0; k < 3; k++) curRGB[k] += (accentRGB[k] - curRGB[k]) * 0.08;
    const cr = curRGB[0] | 0, cg = curRGB[1] | 0, cb = curRGB[2] | 0;
    const BUCKETS = 5;
    const bucketLines = Array.from({ length: BUCKETS }, () => []);
    const bucketAlpha = [];
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      p.x += p.vx + sweep; p.y += p.vy;
      if (p.x < 0) p.x += w; else if (p.x > w) p.x -= w;
      if (p.y < 0) p.y += h; else if (p.y > h) p.y -= h;
      p.vx += ((Math.sign(p.vx) || 1) * 0.22 * devicePixelRatio - p.vx) * 0.04;
      p.vy += ((Math.sign(p.vy) || 1) * 0.22 * devicePixelRatio - p.vy) * 0.04;
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = Math.hypot(dx, dy);
        if (d < link) {
          const alpha = (1 - d / link) * (.15 + boost * .35);
          const bi = Math.min(BUCKETS - 1, (alpha * BUCKETS) | 0);
          bucketLines[bi].push(p.x, p.y, q.x, q.y);
        }
      }
    }
    ctx.lineWidth = devicePixelRatio * (.6 + boost * .5);
    for (let bi = 0; bi < BUCKETS; bi++) {
      const lines = bucketLines[bi];
      if (!lines.length) continue;
      const a = ((bi + 0.5) / BUCKETS).toFixed(3);
      ctx.strokeStyle = 'rgba(' + cr + ',' + cg + ',' + cb + ',' + a + ')';
      ctx.beginPath();
      for (let k = 0; k < lines.length; k += 4) {
        ctx.moveTo(lines[k], lines[k + 1]);
        ctx.lineTo(lines[k + 2], lines[k + 3]);
      }
      ctx.stroke();
    }
    for (const p of pts) { ctx.fillStyle = 'rgba(' + cr + ',' + cg + ',' + cb + ',' + (.5 + boost * .4) + ')'; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (1 + boost * .6), 0, Math.PI * 2); ctx.fill(); }
    boost *= 0.90; if (boost < 0.01) boost = 0;
  }
  resize(); init(); frame();
  addEventListener('resize', () => { resize(); init(); });
  document.addEventListener('visibilitychange', () => { running = !document.hidden; if (running) frame(); else cancelAnimationFrame(raf); });
})();
