function createBubble(container) {
  let el = null;
  const icons = { tip: '\u{1F4A1}', warning: '⚠️', error: '\u{1F6AB}', thinking: '\u{1F4AC}' };
  container.style.position = 'relative';
  function show(type, text) {
    hide();
    el = document.createElement('div');
    el.className = 'term-bubble';
    el.innerHTML = '<span style="font-size:1rem;margin-right:6px;">' + (icons[type] || icons.tip) + '</span>' + text;
    container.prepend(el);
  }
  function hide() {
    if (el && el.parentNode) el.remove();
    el = null;
  }
  return { show, hide };
}
