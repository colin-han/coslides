---
name: coslides
description: 用 coslides 框架快速生成演示文稿（单文件 HTML slides）。当用户想做 PPT / 演示 / slides / deck / 技术分享页，或说"用 coslides 做一份关于 X 的演示"时使用。AI 只负责写每页内容并按章节组织，框架负责导航、快捷键、背景与统一风格。
---

# coslides · 生成演示文稿

用 coslides 框架把一个选题做成单文件 HTML 演示。**你只写内容、组织章节；视觉、导航、快捷键、背景全部由模板提供。**

## 框架在哪

路径相对本 skill 根目录：
- `assets/coslides-core.html` —— 核心模板（CSS/JS/导航/粒子/批注，不含组件样式）。**复制它作为基础。**
- `src/css/components/*.css` —— 组件样式文件，**按需读取并插入到 `<style>` 块中**（见下方「组件按需加载」）。
- `references/COMPONENTS.md` —— 组件手册：每个组件的可复制 HTML 片段 + 何时用。**填内容前先读它。**
- `references/demo-deck.html` —— 完整范例，照着学结构与组件用法。

### 组件按需加载

核心模板不包含组件 CSS（card、term、pipeline 等）。生成演示文稿时，根据大纲中用到的组件，读取对应的 `src/css/components/{name}.css` 文件，将内容**插入到 `<style>` 块末尾**（`</style>` 之前）。

可用组件文件：
| 文件 | 组件 | 典型场景 |
|------|------|---------|
| `card.css` | `.cards` `.card` | 并列要点、对比 |
| `feat.css` | `ul.feat` | 逐条陈述 |
| `note-card.css` | `.note-card` | 一句关键结论 |
| `term.css` | `.term` | 命令行/输出展示 |
| `tree.css` | `.tree` | 目录/文件结构 |
| `code.css` | `pre.code` | 代码块 |
| `chips.css` | `.chips` `.chip` | 标签集合 |
| `pipeline.css` | `.pipe` `.pnode` | 线性步骤 |
| `flow.css` | `.flow-*` | 决策流程图 |
| `chat.css` | `.chat` `.bubble` | 问答/点击揭示 |
| `two-col.css` | `.two-col` | 左右对照 |
| `term-frame.css` | `.term-frame` `.term-pane` | 终端分栏布局 |
| `bubble.css` | `.term-bubble` | 画外音/气泡提示 |
| `keyhint.css` | `.term-keyhint` `kbd` | 按键提示 |

终端交互演示还需要 JS 工具代码。根据页面需求，读取对应文件并将内容插入 section 的 `<script>` 块顶部（在 step 逻辑之前）：

| 文件 | 工具 | 何时加载 |
|------|------|---------|
| `src/js/snippets/term-builder.js` | `TermBuilder` | 使用终端交互时 |
| `src/js/snippets/bubble.js` | `createBubble` | 使用气泡提示时 |
| `src/js/snippets/keyhint.js` | `createKeyHint` | 使用按键提示时 |

## 硬约束（必须遵守）

1. **不要改动模板顶部原有的 `<style>` 和底部原有的 `<script>`**（导航 / 粒子 / 分步等核心逻辑）。配色只改顶部 `:root` 的 `--accent` / `--accent-2` / `--bg`。组件样式（card、term 等）从 `src/css/components/` 读取后追加到 `<style>` 块末尾。**做交互时，可以在你自己的 `<section>` 内新增 `<style>` 和 `<script>`**（见「交互与分步」）。
2. **只在 `#deck` 区域内写 `<section class="slide">`**。
3. 不要引入任何外部依赖（CDN、字体、图片外链）——产物必须是自包含单文件。
4. 搭页面优先用 `references/COMPONENTS.md` 里的现成组件；做交互或自定义视觉时，可在 section 内自由写样式与脚本。布局微调用内联 `style`（如 `style="justify-content:center"`）。

## 工作流：需求→大纲→逐页确认→输出

### 第 1 步 · 需求明确
理解用户选题的核心意图。信息不足时追问关键问题：受众是谁？演示场景？重点章节？风格偏好？**如果用户指定了输出文件路径**，先查看目标目录中的相关文件（README、文档等），从中提取上下文辅助理解。不要过度访谈，1-3 轮追问即可。

### 第 2 步 · 读框架 + 产出大纲
读 `references/COMPONENTS.md` 掌握可用组件；必要时翻 `references/demo-deck.html` 看真实用法。

先**不写 HTML**。给用户一个 章→页 大纲，每页标注页标题 + 拟用组件，每章标注主题色。主题色从以下色板中选择（避免相邻章节颜色过于接近）：

- `#38e0d0` 青色 · `#a78bfa` 紫色 · `#4ade80` 绿色 · `#fbbf24` 琥珀 · `#fb7185` 玫瑰 · `#60a5fa` 蓝色

```
封面
议程
第 1 章「背景」🟢 #4ade80
  · 1.1 现状痛点 — 三列卡片，分步揭示
  · 1.2 数据佐证 — 左右两栏：终端 + 特性列表
第 2 章「方案」🟣 #a78bfa
  · 2.1 整体流程 — 流程条
  · 2.2 关键决策 — 决策图
收尾
```

**停下来等用户确认 / 调整大纲。** 这是质量关键。

### 第 3 步 · 确认方式选择
大纲确认后，问用户一个问题：

> **需要逐页确认每页的内容设计吗？** 逐页确认可以让你对每一页的布局、组件选择和交互细节有更精细的控制。选择「否」则直接基于大纲输出完整文件。

### 第 4 步 · 逐页确认（仅在用户选择「是」时执行）
从首页开始，对每一页用自然语言描述：内容要点、拟用的布局、交互设计（如有）。**等用户确认 / 调整后再进入下一页。**

遇到新章节时：
1. 先确认是否需要章节分隔页，以及章节页的标题和副标题
2. 再逐页确认章节内的内容页

描述示例：
> **第 3 页 · 议程页**
> - 标题：「五个章节，完整体验 Colyn」
> - 布局：两列网格，共 5 个议程项，每项有编号、标题和一句话描述
> - 交互：错峰入场动画，逐个浮现
>
> 这样可以吗？

### 第 5 步 · 输出文件
全部页面确认完成（或用户选择跳过逐页确认）后：

1. 复制 `assets/coslides-core.html` 到目标文件（如 `<主题>-deck.html`）。
2. **按需加载组件样式**：根据大纲中用到的组件，读取 `src/css/components/{name}.css`，将内容插入到 `<style>` 块的 `</style>` 之前。
3. 改 `<title>` 和 `#brandname` 为本演示的标题 / 品牌。
4. 需要换主色时改顶部 `:root` 的 `--accent`。
5. 清空 `#deck` 内的占位示例 section，按大纲逐章写：
   - 封面 / 议程 / 收尾**不写** `data-chapter`。
   - 每章第一页用 `chapter` 页，带 `data-chapter="N"` + `data-chapter-title="章名"`；可选 `data-chapter-color="#rrggbb"` 给该章一个主题色（章内高亮、进度条、圆点随之变色）。
   - 该章其余页带 `data-chapter="N"`（颜色/标题只写在第一页）。
   - 首页（封面）保留 `active` 类，其余页不要 `active`。
   - 需要逐项浮现的元素加 `class="reveal-item"`。

### 第 6 步 · 自检（产出前逐项核对）
- [ ] 模板顶部原有的 `<style>` 与底部原有的 `<script>` 未被改动（`:root` 三个变量除外）；自定义样式/交互写在 section 内
- [ ] 用到的组件样式已从 `src/css/components/` 加载并插入 `<style>` 块
- [ ] 若用终端交互：JS snippet（term-builder / bubble / keyhint）已从 `src/js/snippets/` 读取并插入 section `<script>`
- [ ] 只有第一页有 `active`
- [ ] `data-chapter` 编号连续（1,2,3…），每章首页有 `data-chapter-title`
- [ ] 无占位符残留（"写在这里""TAG""说明文字"等）、无空 `<section>`
- [ ] 无外部依赖（CDN / 外链字体图片）
- [ ] 组件片段结构正确（对照 `references/COMPONENTS.md`）
- [ ] 若用分步：`.step` 或 `data-steps` 已就位，空格推进、推完翻页符合预期

### 第 7 步 · 交付
告诉用户产物路径，并提示放映快捷键：`空格`/点击 推进（页内有步骤时逐步展开，否则翻页）、`←` `→` 翻页、`1-9` 跳章、`Esc` 概览、`F` 全屏、`#p7` 深链。

## 内容与风格建议

- **一页一个观点**。文字精炼，多用组件可视化，少用大段段落。
- **组件选择速查**：
  | 内容性质 | 用 |
  |----------|----|
  | 并列要点 / 对比 | `card.c2` / `card.c3`（多色调区分） |
  | 逐条陈述 | `feat` |
  | 线性步骤 | `pipeline` |
  | 含分支的决策 | `flow` |
  | 命令行 / 输出 | `term` |
  | 目录 / 文件结构 | `tree` |
  | 代码 | `pre.code` |
  | 现场问答 / 互动 | `chat`（点击揭示） |
  | 一句关键结论 | `note-card` |
  | 左右对照 | `two-col` |
  | 终端交互演示 | `term-frame` + `TermBuilder` |
  | 画外音/提示 | Balloon（`bubble`） |
  | 按键提示 | KeyHint（`keyhint`） |
- **章节节奏**：每章用 `chapter` 分隔页开场；章内 3-6 页为宜。
- 强调用 `.accent`（主色）/ `.hl`（黄）/ `.ref`（引用路径）。

## 交互与分步演示（steps）

coslides 支持两类能力，按需取用——**用户要交互/分步就放手做，用户只要静态页就保持简单**。是否使用、用到多丰富，以用户在提示里的要求为准；框架只保证这些能力可用、不设限。

### 1. 分步推进（steps）
让空格在页内逐步展开内容（Keynote builds 心智）：
- `空格` / 点击空白处 = **推进一步**；步骤推完后再按才翻下一页。
- `→` = 直接下一页（跳过剩余步骤）；`←` = 上一页。
- 没有步骤的页，空格即翻页（向后兼容，静态页无需任何改动）。

### 2. 即时交互
任意元素可挂 `onclick` / `onmouseover` 等做点击/悬停反应（如点击气泡揭示答案），与分步正交，框架不干预。

### 你可以在自己的 section 内写 `<script>` / `<style>`
唯一禁区是模板顶部原有的 `<style>` 和底部原有的 `<script>`。你 section 内部的脚本、样式、`onclick`、`<canvas>` 都可自由使用。

### steps 三种写法（可混用）

**① 零代码逐个揭示**：给元素加 `class="step"`，默认隐藏，每按一次空格按文档顺序浮现一个。
```html
<ul class="feat">
  <li class="step"><span class="mk">▸</span> 第一步才出现</li>
  <li class="step"><span class="mk">▸</span> 第二步才出现</li>
</ul>
```

**② 纯 CSS 按步响应**：框架在 section 上写 `data-step="N"`（当前推进到第几步）。在 section 内放 `<style>`，用属性选择器做跨步变化（揭示/高亮/移动/连线…）。
```html
<section class="slide" data-chapter="2" data-steps="3">
  <style>
    #flow .node{opacity:.25;transition:.4s}
    [data-step="1"] #flow .node:nth-child(1),
    [data-step="2"] #flow .node:nth-child(-n+2),
    [data-step="3"] #flow .node{opacity:1}
  </style>
  <div id="flow"><span class="node">A</span><span class="node">B</span><span class="node">C</span></div>
</section>
```

**③ 事件驱动**：框架每推进一步在当前 section 派发 `coslides:step` 事件，`detail = {step, total, dir}`。在 section 内加 `<script>` 监听，可做 canvas 作画、数字滚动、按步高亮代码等任意逻辑。
```html
<section class="slide" data-chapter="3" data-steps="4">
  <canvas id="demo" width="800" height="360"></canvas>
  <script>
    const sec = document.currentScript.parentElement;
    sec.addEventListener('coslides:step', (e) => {
      const { step, total, dir } = e.detail;   // step: 1..total
      drawFrame(step);
    });
  </script>
</section>
```
`data-steps="N"` 声明步数（步骤非离散元素、而是 JS 逻辑时用）；不写则自动数 `.step` 个数。

> 进入有步骤的页：正向（`→`/空格/跳转）从第 0 步开始；反向（`←`）直接显示全部推完的完成态。事件在进入与每次推进时都会派发，`dir` 标明方向。
