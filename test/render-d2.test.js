const { test } = require('node:test');
const assert = require('node:assert');
const { execFileSync } = require('child_process');
const { callD2 } = require('../render-d2.js');

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
