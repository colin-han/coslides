#!/usr/bin/env node
// coslides · D2 渲染/再生工具
// 用法: node render-d2.js <deck.html>
// 扫描 <figure class="…d2…"><script type="text/d2">…</script></figure>（class 含 d2 即可），
// 调用系统 d2 渲染成 SVG，后处理后用幂等标记注入回 figure，保留 figure 其他 class/属性。

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

// 深色主题编号（Task 1 探测确定；默认 200）
const D2_THEME = '200';

// 幂等标记常量（Task 4）
const MARK_START = '<!--coslides-d2-start-->';
const MARK_END = '<!--coslides-d2-end-->';
const MARK_RE = /<!--coslides-d2-start-->[\s\S]*?<!--coslides-d2-end-->/;

// 把渲染好的 svg 放进幂等标记块。已有标记→替换；否则末尾追加。
// 源 <script type="text/d2"> 始终保留，实现「改源文本→重渲染」回溯闭环。
function injectSvg(inner, svg) {
  const block = MARK_START + svg + MARK_END;
  if (MARK_RE.test(inner)) return inner.replace(MARK_RE, block);
  return inner.replace(/\s*$/, '') + '\n  ' + block + '\n';
}

// 后处理：
// · 剥离 <?xml?> prolog（d2 输出带头，内联进 HTML 多余）
// · 剥离含 @font-face 的内嵌 <style>（D2 内嵌 base64 字体，体积大）
// · 连接线与箭头主色 → currentColor，使图随 [data-chapter] 章节色变化
//   （d2.css 设 .d2{color:var(--accent)}）
function postProcessSvg(svg) {
  if (!svg) return '';
  let out = svg;
  // 剥离 <?xml ...?> prolog（探测确认 d2 输出以它开头）
  out = out.replace(/^<\?xml[^]*?\?>/i, '').trimStart();
  // 逐个匹配 <style> 块，仅删除含 @font-face 的（避免误删合法 CSS）
  out = out.replace(/<style[^>]*>([\s\S]*?)<\/style>/g, (block, body) =>
    body.includes('@font-face') ? '' : block
  );
  // 统计 stroke 颜色频次，取最高频（连接线主色）替换为 currentColor
  const strokes = {};
  for (const m of out.matchAll(/stroke="(#[0-9a-fA-F]{3,8})"/g)) {
    strokes[m[1]] = (strokes[m[1]] || 0) + 1;
  }
  let dominantColor = null, maxCount = 0;
  for (const c of Object.keys(strokes)) {
    if (strokes[c] > maxCount) { maxCount = strokes[c]; dominantColor = c; }
  }
  if (dominantColor) {
    out = out.split('stroke="' + dominantColor + '"').join('stroke="currentColor"');
    out = out.split('fill="' + dominantColor + '"').join('fill="currentColor"');
  }
  return out;
}

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

// 匹配任意 <figure>：捕获起始标签的属性 (attrs) 与内部内容 (inner)。
// 是否处理由 CLASS_D2_RE 判断（class 含 d2 即可，d2 不必是唯一类）。
const FIGURE_RE = /<figure\b([^>]*)>([\s\S]*?)<\/figure>/g;
const CLASS_D2_RE = /\bclass="[^"]*\bd2\b[^"]*"/;
const SCRIPT_RE = /<script\s+type="text\/d2">([\s\S]*?)<\/script>/;

// 对整段 HTML 渲染所有 class 含 d2 的 figure；返回处理后的 HTML。
// 保留 figure 原有的全部 class 与属性（id/style 等），只替换 inner。
function renderInHtml(html) {
  return html.replace(FIGURE_RE, (full, attrs, inner) => {
    if (!CLASS_D2_RE.test(attrs)) return full; // 非 d2 figure，原样
    const m = inner.match(SCRIPT_RE);
    if (!m) return full;                       // 无源文本，跳过
    const src = m[1].trim();
    const svg = postProcessSvg(callD2(src));   // 渲染 + 后处理
    return '<figure' + attrs + '>' + injectSvg(inner, svg) + '</figure>';
  });
}

function main(argv) {
  const file = argv[0];
  if (!file) { console.error('用法: node render-d2.js <deck.html>'); process.exit(1); }
  ensureD2();
  const html = fs.readFileSync(file, 'utf8');
  const before = (html.match(FIGURE_RE) || [])
    .filter((_, i, arr) => CLASS_D2_RE.test(arr[i])).length;
  const out = renderInHtml(html);
  fs.writeFileSync(file, out, 'utf8');
  console.log(`✅ 处理 ${before} 个 d2 figure → ${file}`);
}

module.exports = { ensureD2, callD2, postProcessSvg, injectSvg, renderInHtml, main, D2_THEME };

if (require.main === module) main(process.argv.slice(2));
