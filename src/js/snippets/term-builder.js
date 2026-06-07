class TermBuilder {
  constructor(el) {
    this.el = el;
    this.groups = [];
  }

  cmd(text) {
    this.groups.push({ cmd: text, output: [] });
    this._render();
    return this;
  }

  output(lines) {
    if (!this.groups.length) return this;
    this.groups[this.groups.length - 1].output.push(...lines);
    this._render();
    return this;
  }

  replaceOutput(lines) {
    if (!this.groups.length) return this;
    this.groups[this.groups.length - 1].output = lines.slice();
    this._render();
    return this;
  }

  replaceLastCmd(text) {
    if (!this.groups.length) return this;
    this.groups[this.groups.length - 1].cmd = text;
    this._render();
    return this;
  }

  removeLastCmd() {
    this.groups.pop();
    this._render();
    return this;
  }

  removeLastOutput() {
    if (!this.groups.length) return this;
    this.groups[this.groups.length - 1].output = [];
    this._render();
    return this;
  }

  clearAll() {
    this.groups = [];
    this._render();
    return this;
  }

  _colorize(text) {
    const map = {
      '0': '', '1': 'font-weight:bold', '2': 'color:var(--txt-dim)',
      '31': 'color:#f87171', '32': 'color:var(--emerald)',
      '33': 'color:var(--amber)', '34': 'color:var(--blue)',
      '35': 'color:#c084fc', '36': 'color:var(--accent)',
      'ok': 'color:var(--emerald)', 'warn': 'color:var(--amber)',
      'err': 'color:#f87171', 'accent': 'color:var(--accent)',
      'dim': 'color:var(--txt-dim)', 'bright': 'color:#fff',
    };
    return text.replace(/\\m([a-z]+|\d+);/g, (_, code) => {
      if (code === '0') return '</span><span>';
      const style = map[code];
      return style ? '</span><span style="' + style + '">' : '';
    });
  }

  _render() {
    let html = '';
    for (const g of this.groups) {
      html += '<div class="term-cmd"><span class="term-prompt">$ </span>'
        + this._colorize(g.cmd) + '</div>';
      for (const line of g.output) {
        html += '<div class="term-out">' + this._colorize(line) + '</div>';
      }
    }
    this.el.innerHTML = html;
  }
}
