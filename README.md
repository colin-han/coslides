# coslides

> 一个用于**快速生成演示文稿**的单文件 JS/CSS 框架——你只写每页内容，导航、快捷键、背景、分步、章节主题色全部内置。专为「让 AI 生成 slides」设计，也可手写。

产物始终是**一个自包含的 HTML 文件**：无构建、无依赖、无外链，双击即放映，发给谁都能直接打开。

---

## 快速开始

```bash
cp assets/coslides-template.html my-talk.html
```

打开 `my-talk.html`，只在 `#deck` 区域内填 `<section class="slide">`，**不要改动模板顶部的 `<style>` 和底部的 `<script>`**（换主色只改顶部 `:root` 的 `--accent`）。双击文件即可放映。

```html
<div id="deck">
  <section class="slide title-slide active">
    <div class="kicker">副标题</div>
    <h1>我的演示标题</h1>
    <div class="sub">一句话说明。</div>
  </section>

  <section class="slide chapter" data-chapter="1" data-chapter-title="背景" data-chapter-color="#38e0d0">
    <div class="chap-tag">PART · 01</div>
    <h1>第一章</h1>
  </section>

  <section class="slide" data-chapter="1">
    <div class="kicker"><span class="ch">01 ·</span> 小节</div>
    <h2>用卡片<span class="accent">并列三点</span></h2>
    <div class="grow">
      <div class="cards c3">
        <div class="card"><div class="top"></div><h3>要点一</h3><p>说明。</p></div>
        <div class="card b-emerald"><div class="top"></div><h3>要点二</h3><p>说明。</p></div>
        <div class="card b-violet"><div class="top"></div><h3>要点三</h3><p>说明。</p></div>
      </div>
    </div>
  </section>
</div>
```

---

## 特性

- **单文件 · 零依赖** — 一个 HTML 搞定，离线可放映、可分享。
- **暗色科技风** — 网格背景、径向光晕、Canvas 粒子（翻页有方向性「whoosh」）。
- **12 类组件** — 卡片、特性列表、终端、目录树、代码块、流程条、决策图、问答气泡、强调框、标签、两栏，以及封面/议程/章节/收尾页型。
- **章节模型** — `data-chapter` 把页面分章，支持数字键跳章、概览分区、底部圆点分组。
- **章节主题色** — `data-chapter-color` 给每章一个主色，进入该章时**高亮元素、进度条、圆点、背景粒子整体跟随**。
- **分步演示（steps）** — 空格在页内逐步展开（Keynote builds），三种写法从零代码到事件驱动。
- **即时交互** — 任意元素可挂 `onclick` / `onmouseover`，与分步正交。
- **完整导航** — 键盘 / 点击 / 触摸 / URL 深链，全部内置无需配置。
- **AI 友好** — 配套 skill，让 AI 只写内容、按章组织即可产出风格统一的 deck。

---

## 导航与快捷键

| 操作 | 键 / 手势 |
|------|-----------|
| 推进一步 / 翻页 | `空格` · 点击空白处（页内有步骤先推进，推完翻页） |
| 下一页 / 上一页 | `→` `PageDown` / `←` `PageUp` · 触摸滑动（始终整页） |
| 首 / 尾页 | `Home` / `End` |
| 跳到第 N 章 | 数字键 `1`–`9` |
| 缩略概览 | `O` / `Esc` 开关；概览内 `↑↓←→` 选择、`Enter` 跳转、点击直达 |
| 全屏 | `F` |
| 深链 | URL `#p7` 直达第 7 页 |

---

## 核心概念

### 章节
每页用 `data-chapter="N"` 标记归属；每章第一页（通常是 `chapter` 分隔页）再加 `data-chapter-title="章名"`，可选 `data-chapter-color="#rrggbb"` 设主题色。封面 / 议程 / 收尾不写 `data-chapter`。

### 分步（steps）
让空格在页内逐步展开，推完再翻页。三种写法可混用：

1. **声明式** — 给元素加 `class="step"`，默认隐藏，每按一次空格揭示一个。
2. **纯 CSS** — 框架在 section 上写 `data-step="N"`，在 section 内用 `<style>` 的属性选择器做跨步变化。
3. **事件驱动** — 框架每步派发 `coslides:step` 事件（`detail:{step,total,dir}`），在 section 内用 `<script>` 监听做任意交互（如驱动 `<canvas>`）。

用 `data-steps="N"` 声明步数，不写则自动数 `.step` 元素个数。

### 配色
改模板顶部 `:root` 的 `--accent` / `--accent-2` / `--bg` 即可全局换色；章节主题色由 `data-chapter-color` 覆盖。

---

## 项目结构

本仓库按标准 skill 结构组织（`SKILL.md` 在根，配 `assets/` 与 `references/`）：

```
coslides/                        # skill 根目录
├── SKILL.md                     # coslides skill：引导 AI 大纲先行→逐章填充
├── README.md
├── assets/
│   └── coslides-template.html   # 单文件模板（复制它开始 / 产物即由它生成）
└── references/
    ├── COMPONENTS.md            # 组件参考手册：每个组件的 HTML 片段 + 何时用
    └── demo-deck.html           # 能力全展示范例（18 页 4 章，含分步 / canvas / 主题色）
```

> `references/harness-overview.html` 是本地预览文件，已 gitignore。

---

## 让 AI 生成 slides

把本目录作为一个 skill 安装（即 `SKILL.md` 所在的 `coslides/` 目录）后，对 AI 说一句：

> 用 coslides 做一份关于 X 的演示

AI 会：接选题 → 给出章→节大纲让你确认 → 复制模板逐章填内容 → 自检 → 产出单文件 HTML。它只关注内容与章节组织，视觉、导航、分步由框架包办。

---

## 组件速查

写页面时先查 [`references/COMPONENTS.md`](references/COMPONENTS.md)，常用对应关系：

| 内容性质 | 用 |
|----------|----|
| 并列要点 / 对比 | `card.c2` / `card.c3` |
| 逐条陈述 | `feat` |
| 线性步骤 | `pipeline` |
| 含分支的决策 | `flow` |
| 命令行 / 输出 | `term` |
| 目录 / 文件结构 | `tree` |
| 代码 | `pre.code` |
| 现场问答 / 互动 | `chat`（点击揭示） |
| 一句关键结论 | `note-card` |
| 左右对照 | `two-col` |
