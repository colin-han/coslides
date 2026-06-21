const { test } = require('node:test');
const assert = require('node:assert');
const { execFileSync } = require('child_process');
const { callD2, postProcessSvg, injectSvg, renderInHtml } = require('../render-d2.js');

function d2Available() {
  try { execFileSync('d2', ['--version'], { stdio: 'pipe' }); return true; }
  catch { return false; }
}

test('callD2 返回合法 SVG（仅当 d2 可用时）', { skip: !d2Available() && 'd2 未安装' }, () => {
  const src = 'Client -> Server: hi';
  const svg = callD2(src);
  // d2 输出以 <?xml?> prolog 开头（探测确认），故用 includes 而非 startsWith
  assert.ok(svg.includes('<svg'), '应含 <svg');
  assert.ok(svg.includes('</svg>'), '应含 </svg>');
});

test('postProcessSvg 把最高频 stroke 色替换为 currentColor', () => {
  const svg = '<svg><path stroke="#0a0a0a" d="M1"/>' +
    '<path stroke="#0a0a0a" d="M2"/>' +
    '<path stroke="#abcdef" d="M3"/></svg>';
  const out = postProcessSvg(svg);
  assert.equal((out.match(/stroke="currentColor"/g) || []).length, 2, '两处主色被替换');
  assert.ok(out.includes('stroke="#abcdef"'), '低频色保留');
});

test('postProcessSvg 剥离内嵌 base64 字体 style 块', () => {
  const svg = '<svg><style>@font-face{font-family:x;src:url(data:font/woff2;base64,AAA)}</style><text>x</text></svg>';
  const out = postProcessSvg(svg);
  assert.ok(!out.includes('@font-face'), '字体声明被剥离');
  assert.ok(out.includes('<text>'), '其余内容保留');
});

test('postProcessSvg 把主色 fill（箭头）也替换为 currentColor', () => {
  const svg = '<svg><path stroke="#CBA6f7"/><polygon fill="#CBA6f7"/><text fill="#CDD6F4">x</text></svg>';
  const out = postProcessSvg(svg);
  assert.ok(out.includes('stroke="currentColor"'), 'stroke 替换');
  assert.ok(out.includes('fill="currentColor"'), '箭头 fill 替换');
  assert.ok(out.includes('fill="#CDD6F4"'), '文字 fill 保留');
});

test('postProcessSvg 无 stroke 时不报错', () => {
  const svg = '<svg><text>hi</text></svg>';
  assert.doesNotThrow(() => postProcessSvg(svg));
});

test('postProcessSvg 剥离 <?xml?> prolog', () => {
  const svg = '<?xml version="1.0" encoding="utf-8"?><svg><text>hi</text></svg>';
  const out = postProcessSvg(svg);
  assert.ok(!out.includes('<?xml'), 'prolog 被剥离');
  assert.ok(out.startsWith('<svg'), '以 <svg 开头');
});

test('injectSvg 首次注入追加标记块', () => {
  const inner = '<script type="text/d2">A -> B</script>\n';
  const out = injectSvg(inner, '<svg/>');
  assert.ok(out.includes('<!--coslides-d2-start-->'), '含开始标记');
  assert.ok(out.includes('<!--coslides-d2-end-->'), '含结束标记');
  assert.ok(out.includes('<svg/>'), '含 svg');
  assert.ok(out.includes('A -> B'), '保留源文本');
});

test('injectSvg 再次注入替换旧 svg（幂等）', () => {
  const inner = '<script type="text/d2">A -> B</script>\n' +
    '<!--coslides-d2-start--><svg id="old"/><!--coslides-d2-end-->';
  const out = injectSvg(inner, '<svg id="new"/>');
  assert.ok(!out.includes('id="old"'), '旧 svg 被清除');
  assert.ok(out.includes('id="new"'), '新 svg 写入');
  assert.equal((out.match(/coslides-d2-start-->/g) || []).length, 1, '标记不重复');
});

test('renderInHtml 渲染所有 figure 并保留源文本（仅当 d2 可用时）',
  { skip: !d2Available() && 'd2 未安装' }, () => {
  const html = '<section><figure class="d2"><script type="text/d2">A -> B: hi</script></figure></section>';
  const out = renderInHtml(html);
  assert.ok(out.includes('<!--coslides-d2-start-->'), '注入了标记');
  assert.ok(out.includes('<svg'), '注入了 svg');
  assert.ok(out.includes('A -> B: hi'), '源文本保留');
  assert.equal((out.match(/coslides-d2-start-->/g) || []).length, 1, '不重复标记块');
});

test('renderInHtml 跳过无源文本的 figure', () => {
  const html = '<figure class="d2"><p>no script here</p></figure>';
  const out = renderInHtml(html);
  assert.ok(!out.includes('<!--coslides-d2-start-->'), '不注入');
});

test('renderInHtml 幂等：跑两次结果一致',
  { skip: !d2Available() && 'd2 未安装' }, () => {
  const html = '<figure class="d2"><script type="text/d2">A -> B</script></figure>';
  const once = renderInHtml(html);
  const twice = renderInHtml(once);
  assert.equal(once, twice, '两次渲染结果完全一致');
  assert.equal((twice.match(/coslides-d2-start-->/g) || []).length, 1, '标记不重复');
});
