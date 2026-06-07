#!/usr/bin/env node
// coslides 构建脚本：将 src/ 下的核心模块拼接为 assets/coslides-core.html
// 纯拼接，不做转译、压缩或依赖解析。产物是零依赖单文件 HTML。
//
// 组件 CSS（src/css/components/*.css）不包含在构建产物中，
// 由 skill 在生成演示文稿时按需读取并拼接。

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname);
const SRC = path.join(ROOT, 'src');
const OUT_CORE = path.join(ROOT, 'assets', 'coslides-core.html');
const COMP_DIR = path.join(SRC, 'css', 'components');

// ── 核心 CSS 模块（始终包含）──
const CSS_FILES = [
  'css/base.css',
  'css/slide.css',
  // css/components/ 下的文件由 skill 按需选择
  'css/chrome.css',
  'css/overview.css',
  'css/comments.css',
  // 'css/tmux.css',  // 新增模块时取消注释
];

// ── JS 模块（始终包含）──
const JS_FILES = [
  'js/core.js',
  'js/overview.js',
  'js/comments.js',
  'js/reveal.js',
  'js/theme.js',
  'js/steps.js',
  'js/particles.js',
  // 'js/tmux.js',    // 新增模块时取消注释
];

// ── HTML 片段 ──
const HEAD = 'head.html';
const BODY_PREFIX = 'body-prefix.html';
const BODY_SUFFIX = 'body-suffix.html';
const TAIL = 'tail.html';

function read(fragment) {
  const p = path.join(SRC, fragment);
  if (!fs.existsSync(p)) {
    console.warn(`⚠ 跳过缺失文件: ${fragment}`);
    return '';
  }
  return fs.readFileSync(p, 'utf8');
}

function concatFiles(list) {
  return list.map(f => {
    const content = read(f);
    if (!content) return '';
    return content.endsWith('\n') ? content : content + '\n';
  }).join('\n');
}

// ── 构建 core 模板 ──
console.log('🔨 coslides build starting...');

const headHtml = read(HEAD);
const cssContent = concatFiles(CSS_FILES);
const bodyPrefixHtml = read(BODY_PREFIX);
const bodySuffixHtml = read(BODY_SUFFIX);
const jsContent = concatFiles(JS_FILES);
const tailHtml = read(TAIL);

const output = [
  headHtml,
  cssContent,
  bodyPrefixHtml,
  bodySuffixHtml,
  jsContent,
  tailHtml,
].join('');

fs.writeFileSync(OUT_CORE, output, 'utf8');

const size = (Buffer.byteLength(output, 'utf8') / 1024).toFixed(1);
console.log(`✅ Core: ${OUT_CORE} (${size} KB)`);
console.log(`   CSS modules: ${CSS_FILES.length}  JS modules: ${JS_FILES.length}`);

// ── 列出可用组件 ──
if (fs.existsSync(COMP_DIR)) {
  const components = fs.readdirSync(COMP_DIR)
    .filter(f => f.endsWith('.css'))
    .map(f => f.replace('.css', ''));
  console.log(`   可用组件 (${components.length}): ${components.join(', ')}`);
}
