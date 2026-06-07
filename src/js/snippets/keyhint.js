function createKeyHint(container) {
  let el = null;
  container.style.position = 'relative';
  const modMap = { cmd: '⌘', ctrl: '⌃', shift: '⇧', alt: '⌥', enter: '⏎', tab: '⇥', esc: '⎋' };
  function show(keyStr) {
    hide();
    const keys = keyStr.split('+').map(function(k) {
      var mapped = modMap[k.toLowerCase()];
      return mapped || k;
    });
    el = document.createElement('div');
    el.className = 'term-keyhint';
    el.innerHTML = keys.map(function(k) { return '<kbd>' + k + '</kbd>'; }).join('<span class="key-sep">+</span>');
    container.appendChild(el);
  }
  function hide() {
    if (el && el.parentNode) el.remove();
    el = null;
  }
  return { show, hide };
}
