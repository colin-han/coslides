# coslides 组件参考手册

> 复制片段到 `coslides-template.html` 的 `#deck` 内即可。所有组件已在模板的 `<style>` 中定义，**不要新增/修改 CSS**（仅顶部 `:root` 配置区可改主色）。
>
> 通用约定：
> - 每页是一个 `<section class="slide">`，首页加 `active`。
> - 章节用 `data-chapter="N"`；章首页（`chapter` 页）再加 `data-chapter-title="…"`。
> - 想让元素逐项入场，给它加 `class="reveal-item"`（按先后顺序依次浮现）。
> - 主内容区常用 `<div class="grow">…</div>` 包裹以垂直居中。

---

## 一、页型（一页整体的版式）

### 封面 `title-slide`
```html
<section class="slide title-slide active">
  <div class="kicker">副标题 · KICKER</div>
  <h1>演示标题</h1>
  <div class="sub">一句话说明这份演示讲什么、为谁而讲。可用 <span class="accent">强调色</span>。</div>
  <div class="title-meta">
    <div>范围 · <b>…</b></div>
    <div>状态 · <b>…</b></div>
  </div>
</section>
```

### 议程 `agenda`
```html
<section class="slide">
  <div class="kicker">本场议程</div>
  <h2>三个部分，<span class="accent">从结构到细节</span></h2>
  <div class="grow">
    <div class="agenda">
      <div class="ag-item reveal-item"><div class="n">1</div><div><div class="t">章标题</div><div class="d">一句话描述</div></div></div>
      <div class="ag-item reveal-item"><div class="n">2</div><div><div class="t">章标题</div><div class="d">一句话描述</div></div></div>
    </div>
  </div>
</section>
```

### 章节分隔 `chapter`（每章第一页）
```html
<section class="slide chapter" data-chapter="1" data-chapter-title="目录结构" data-chapter-color="#38e0d0">
  <div class="chap-tag">PART · 01</div>
  <h1>第一章标题</h1>
  <div class="chap-sub">这一章讲什么的<strong>一句话引子</strong>。</div>
</section>
```
> - `data-chapter-title` 用于底部章名、数字键跳章、概览分区。
> - `data-chapter-color="#rrggbb"`（可选）给该章一个**主题色**：进入本章后，所有高亮元素（`.accent` / `kicker` / `code` / 卡片顶条 / `chips` / 品牌点）、顶部进度条、底部高亮圆点都变为该色；不写则用默认 `--accent`。**写在该章第一页即可**（整章生效）。
> - 章内每一页都要带相同的 `data-chapter="N"`；颜色和标题只需写在第一页。

### 收尾 `closing`
```html
<section class="slide closing">
  <div class="kicker" style="justify-content:center;">小结</div>
  <h1>一句话<span class="accent">收束全场</span></h1>
  <div class="sub">把核心结论再说一遍。</div>
</section>
```

### 普通内容页
```html
<section class="slide" data-chapter="1">
  <div class="kicker"><span class="ch">01 ·</span> 小节眉标</div>
  <h2>本页主标题，<span class="accent">关键词强调</span></h2>
  <div class="grow">
    <!-- 这里放下面任意内容组件 -->
  </div>
</section>
```

---

## 二、内容组件

### card 卡片网格
两列用 `c2`，三列用 `c3`。色调：默认（主色）/ `b-emerald` / `b-amber` / `b-violet` / `b-blue` / `b-rose`。
```html
<div class="cards c3">
  <div class="card reveal-item"><div class="top"></div><div class="tag">TAG</div><h3>要点一</h3><p>说明文字。</p></div>
  <div class="card b-emerald reveal-item"><div class="top"></div><div class="tag">TAG</div><h3>要点二</h3><p>说明文字。</p></div>
  <div class="card b-violet reveal-item"><div class="top"></div><div class="tag">TAG</div><h3>要点三</h3><p>说明文字。</p></div>
</div>
```
卡片可选首行图标：`<div class="icon">▣</div>`（放在 `top` 之后）。

### feat 特性列表
```html
<ul class="feat">
  <li class="reveal-item"><span class="mk">▸</span><span><b>第一条</b> <span class="dim">— 补充说明</span></span></li>
  <li class="reveal-item"><span class="mk">▸</span><span><b>第二条</b> <span class="dim">— 补充说明</span></span></li>
</ul>
```

### note-card 强调框
```html
<div class="note-card reveal-item">
  💡 一段需要重点强调的洞察。<strong>关键结论</strong>用绿色高亮。
</div>
```

### term 终端模拟
`.ok` 绿 / `.run` 主色 / `.dim` 灰 / `.warn` 黄。
```html
<div class="term reveal-item">
  <div class="bar"><i class="r"></i><i class="y"></i><i class="g"></i></div>
  <div class="ln"><span class="dim">$</span> npm run build</div>
  <div class="ln"><span class="ok">✓</span> compiled successfully</div>
  <div class="ln"><span class="run">▶</span> starting server <span class="dim">…</span></div>
</div>
```

### tree 目录树
`.d` 目录(主色) / `.hl` 高亮(绿) / `.cm` 注释(灰) / `.pl` 紫 / `<b>` 文件名。整块用 `white-space:pre`，直接换行排版。
```html
<div class="tree reveal-item"><span class="b">project/</span>
├── <span class="d">src/</span>            <span class="cm"># 源码</span>
├── <span class="hl">config.json</span>     <span class="cm"># 配置</span>
└── README.md</div>
```

### code 代码块
`.k` 关键字(紫) / `.s` 字符串(绿) / `.c` 注释(灰) / `.f` 函数(主色)。
```html
<pre class="code reveal-item"><span class="k">function</span> <span class="f">hello</span>() {
  <span class="k">return</span> <span class="s">'world'</span>;  <span class="c">// 注释</span>
}</pre>
```

### chips 标签组
```html
<div class="chips">
  <span class="chip">标签 A</span><span class="chip">标签 B</span><span class="chip">标签 C</span>
</div>
```

### pipeline 流程条（线性步骤）
```html
<div class="pipe">
  <div class="pnode reveal-item"><div class="pc">步骤①</div><div class="pd">说明</div></div>
  <div class="psep reveal-item">→</div>
  <div class="pnode reveal-item"><div class="pc">步骤②</div><div class="pd">说明</div></div>
  <div class="psep reveal-item">→</div>
  <div class="pnode reveal-item"><div class="pc">步骤③</div><div class="pd">说明</div></div>
</div>
```

### flow 决策流程图（含分支）
```html
<div style="display:flex;flex-direction:column;align-items:center;gap:.7rem;max-width:800px;margin:0 auto;width:100%;">
  <div class="flow-node reveal-item">① 入口 <code>command</code></div>
  <div class="flow-arr reveal-item">▼</div>
  <div class="flow-decide reveal-item" style="width:100%;">② 判断条件？<div class="sub2">补充说明</div></div>
  <div class="reveal-item" style="display:flex;gap:1.2rem;width:100%;">
    <div class="flow-branch warn"><div class="bl">✗ 否</div><div class="bt">分支 A</div><div class="bd">说明</div></div>
    <div class="flow-branch ok"><div class="bl">✓ 是</div><div class="bt">分支 B</div><div class="bd">说明</div></div>
  </div>
  <div class="flow-arr reveal-item">▼</div>
  <div class="reveal-item" style="display:flex;gap:1.2rem;width:100%;">
    <div class="flow-out a">→ 结果 A</div>
    <div class="flow-out b">→ 结果 B</div>
  </div>
</div>
```

### chat 点击揭示气泡（问答 / 互动）
人类气泡点击后揭示答案，适合现场互动。
```html
<div class="chat">
  <div class="bubble ai reveal-item">
    <div class="who">🤖 提问方</div>
    <div class="text">这里是问题或提示文字，可用 <span class="hl">高亮</span>。</div>
  </div>
  <div class="bubble human reveal-item" onclick="this.classList.toggle('revealed')">
    <div class="who">🧑 回答方</div>
    <div class="answer">点击后揭示的答案。</div>
    <div class="placeholder">点击揭示回答…</div>
  </div>
</div>
```

---

## 三、布局与文本

### two-col 两栏
```html
<div class="grow two-col">
  <div><!-- 左栏，常放 term / tree / 图 --></div>
  <div><!-- 右栏，常放 feat / 文字 --></div>
</div>
```

### 文本工具类
| 用法 | class | 说明 |
|------|-------|------|
| 眉标 | `kicker` | 页顶小标题，前有短横线；内可放 `<span class="ch">01 ·</span>` |
| 大标题 | `h1` | 封面 / 章节页 |
| 页标题 | `h2` | 普通内容页主标题 |
| 主色强调 | `.accent` / `<span class="accent">` | 跟随 `--accent` |
| 大段引文 | `.lead` | 较大正文，`<strong>` 转亮色 |
| 普通副文 | `.sub` | 副标题 / 说明 |
| 黄色高亮 | `.hl` | 行内强调关键词 |
| 引用标记 | `.ref` | 等宽紫色，标注引用来源/路径 |
| 脚注 | `.footnote` | 页底等宽小字 |
| 行内代码 | `<code>` | 等宽主色 |

---

## 四、配置（顶部 `:root`，唯一可改的样式）

```css
--accent:   #38e0d0;   /* 主强调色 */
--accent-2: #4ade80;   /* 次强调色 */
--bg:       #0b1020;   /* 背景底色 */
```
品牌名改 `#brandname` 文本，deck 标题改 `<title>`，均在 HTML 中，不进 CSS。

---

## 五、导航（自动生效，无需配置）

| 操作 | 键 / 手势 |
|------|-----------|
| 推进一步 / 翻页 | `空格` · 点击空白处（页内有步骤先推进，推完翻页） |
| 下一页 / 上一页 | `→` `PageDown` / `←` `PageUp` · 触摸滑动（始终整页） |
| 首 / 尾页 | `Home` / `End` |
| 跳到第 N 章 | 数字键 `1`–`9` |
| 缩略概览 | `O` 或 `Esc` 开关；概览内 `↑↓←→` 选择、`Enter` 跳转、点击直达 |
| 全屏 | `F` |
| 深链 | URL `#p7` 直达第 7 页 |

> **分步 / 交互**：给元素加 `class="step"` 即可空格逐个揭示；复杂交互用 `data-steps="N"` + 监听 section 上的 `coslides:step` 事件（`detail:{step,total,dir}`），可在 section 内自由写 `<script>`/`<style>`。详见 `skill/SKILL.md`「交互与分步演示」。
