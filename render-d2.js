#!/usr/bin/env node
// coslides · D2 渲染/再生工具
// 用法: node render-d2.js <deck.html>
// 扫描 <figure class="d2"><script type="text/d2">…</script></figure>，
// 调用系统 d2 渲染成 SVG，后处理后用幂等标记注入回 figure。

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

// 深色主题编号（Task 1 探测确定；默认 200）
const D2_THEME = '200';

// 占位导出（后续任务实现）
function postProcessSvg(svg) { return svg; }
function injectSvg(inner, svg) { return inner; }

function ensureD2() {
  try {
    execFileSync('d2', ['--version'], { stdio: 'pipe' });
  } catch (_) {
    console.error('未找到 d2。安装：\n  curl -fsSL https://d2lang.com/install.sh | sh -s --');
    process.exit(1);
  }
}

function callD2(srcText) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'coslides-d2-'));
  const inP = path.join(dir, 'in.d2');
  const outP = path.join(dir, 'out.svg');
  try {
    fs.writeFileSync(inP, srcText, 'utf8');
    execFileSync('d2', ['--theme=' + D2_THEME, inP, outP], { stdio: 'pipe' });
    return fs.readFileSync(outP, 'utf8');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

module.exports = { ensureD2, callD2, postProcessSvg, injectSvg, D2_THEME };

if (require.main === module) {
  // main 在 Task 5 实现
  console.log('render-d2.js 尚未实现 main（见 Task 5）');
}
