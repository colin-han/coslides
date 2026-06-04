---
name: coslides
description: 用 coslides 框架快速生成演示文稿（单文件 HTML slides）。当用户想做 PPT / 演示 / slides / deck / 技术分享页，或说"用 coslides 做一份关于 X 的演示"时使用。AI 只负责写每页内容并按章节组织，框架负责导航、快捷键、背景与统一风格。
---

# coslides · 生成演示文稿

用 coslides 框架把一个选题做成单文件 HTML 演示。**你只写内容、组织章节；视觉、导航、快捷键、背景全部由模板提供。**

## 框架在哪

skill 同级仓库根目录下：
- `coslides-template.html` —— 单文件模板（含全部 CSS/JS）。**复制它，只在 `#deck` 内填 `<section>`。**
- `COMPONENTS.md` —— 组件手册：每个组件的可复制 HTML 片段 + 何时用。**填内容前先读它。**
- `examples/demo-deck.html` —— 完整范例，照着学结构与组件用法。

## 硬约束（必须遵守）

1. **不要改动模板顶部原有的 `<style>` 和底部原有的 `<script>`**（导航 / 粒子 / 分步等核心逻辑）。配色只改顶部 `:root` 的 `--accent` / `--accent-2` / `--bg`。**做交互时，可以在你自己的 `<section>` 内新增 `<style>` 和 `<script>`**（见「交互与分步」）。
2. **只在 `#deck` 区域内写 `<section class="slide">`**。
3. 不要引入任何外部依赖（CDN、字体、图片外链）——产物必须是自包含单文件。
4. 搭页面优先用 `COMPONENTS.md` 里的现成组件；做交互或自定义视觉时，可在 section 内自由写样式与脚本。布局微调用内联 `style`（如 `style="justify-content:center"`）。

## 工作流：大纲先行，逐章填充

### 第 1 步 · 接选题
确认主题、核心要点、受众、大致篇幅。信息不足就简短追问（1-2 个问题），不要冗长访谈。

### 第 2 步 · 读框架
读 `COMPONENTS.md` 掌握可用组件；必要时翻 `examples/demo-deck.html` 看真实用法。

### 第 3 步 · 产出大纲，停下来确认
先**不写 HTML**。给用户一个 章→节 大纲，每页标注：页标题 + 拟用组件。例如：

```
封面（title-slide）
议程（agenda）
第 1 章「背景」
  · 1.1 现状痛点（card.c3）
  · 1.2 数据佐证（two-col: term + feat）
第 2 章「方案」
  · 2.1 整体流程（pipeline）
  · 2.2 关键决策（flow）
收尾（closing）
```

**等用户确认 / 调整后再继续。** 这是质量关键。

### 第 4 步 · 逐章填充
1. 复制 `coslides-template.html` 到目标文件（如 `<主题>-deck.html`）。
2. 改 `<title>` 和 `#brandname` 为本演示的标题 / 品牌。
3. 需要换主色时改顶部 `:root` 的 `--accent`。
4. 清空 `#deck` 内的占位示例 section，按大纲逐章写：
   - 封面 / 议程 / 收尾**不写** `data-chapter`。
   - 每章第一页用 `chapter` 页，带 `data-chapter="N"` + `data-chapter-title="章名"`；可选 `data-chapter-color="#rrggbb"` 给该章一个主题色（章内高亮、进度条、圆点随之变色）。
   - 该章其余页带 `data-chapter="N"`（颜色/标题只写在第一页）。
   - 首页（封面）保留 `active` 类，其余页不要 `active`。
   - 需要逐项浮现的元素加 `class="reveal-item"`。

### 第 5 步 · 自检（产出前逐项核对）
- [ ] 模板顶部原有的 `<style>` 与底部原有的 `<script>` 未被改动（`:root` 三个变量除外）；自定义样式/交互写在 section 内
- [ ] 只有第一页有 `active`
- [ ] `data-chapter` 编号连续（1,2,3…），每章首页有 `data-chapter-title`
- [ ] 无占位符残留（"写在这里""TAG""说明文字"等）、无空 `<section>`
- [ ] 无外部依赖（CDN / 外链字体图片）
- [ ] 组件片段结构正确（对照 `COMPONENTS.md`）
- [ ] 若用分步：`.step` 或 `data-steps` 已就位，空格推进、推完翻页符合预期

### 第 6 步 · 交付
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
