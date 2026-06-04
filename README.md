# coslides

> 一个让 **AI 帮你做演示文稿**的 skill。装上它，对 Claude 说一句「用 coslides 做一份关于 X 的演示」，就能得到一个**自包含的单文件 HTML deck**——暗色科技风、全套键盘导航、分步演示、章节主题色全部内置，双击即放映、发给谁都能直接打开。

coslides 是一个标准的 [Claude Code skill](https://docs.claude.com/claude-code)：`SKILL.md` 教 AI 怎么用，`assets/` 放它复制的模板，`references/` 放它查阅的组件手册与范例。AI 只负责写每页内容、按章节组织，视觉与交互这套「引擎」由框架包办——既保证出片质量，又不必每次重造轮子。

---

## 这个 skill 解决什么

让 AI 生成演示页面时，常见两个问题：每次重写几百行 CSS/JS（费 token、风格漂移），以及产物花哨却不好用（没有导航、没法分步讲）。coslides 把**视觉系统 + 导航系统 + 组件库**沉淀成一个固定的单文件模板，AI 只往 `#deck` 里填内容、用 `data-chapter` 分章。于是：

- **省心** — AI 不碰样式与脚本，只关注「讲什么、怎么分章」。
- **一致** — 每份 deck 都是同一套打磨过的暗色风与交互。
- **能用** — 产物是真正可放映的演示：键盘翻页、跳章、概览、分步、全屏、深链。

---

## 安装

把本仓库（`SKILL.md` 所在的 `coslides/` 目录）放到 Claude Code 的 skills 目录即可：

```bash
git clone https://github.com/colin-han/coslides.git ~/.claude/skills/coslides
# 或：cp -r coslides ~/.claude/skills/
```

Claude 会自动发现该 skill（`name: coslides`）。无需任何运行时或依赖。

---

## 用法

### 让 AI 生成（主要方式）

对 Claude 说：

> 用 coslides 做一份关于 X 的演示

AI 会按 `SKILL.md` 的工作流：**接选题 → 给出「章→节」大纲让你确认 → 复制模板逐章填内容 → 自检 → 产出单文件 HTML**。整个过程它只写内容与章节，视觉/导航/分步由框架负责。

### 手动写（可选）

不想用 AI 也行，自己复制模板填内容：

```bash
cp assets/coslides-template.html my-talk.html
```

只在 `#deck` 内填 `<section class="slide">`，**不要改动模板顶部的 `<style>` 和底部的 `<script>`**（换主色只改顶部 `:root` 的 `--accent`）。双击即放映。

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

## skill 如何组织

按标准 skill 结构：`SKILL.md` 在根，配 `assets/`（产物用到的模板）与 `references/`（按需查阅的手册与范例）。

```
coslides/                        # skill 根目录（放进 ~/.claude/skills/）
├── SKILL.md                     # 教 AI 怎么用：工作流 + 硬约束 + 组件速查
├── README.md
├── assets/
│   └── coslides-template.html   # 单文件模板（AI 复制它 / 产物即由它生成）
└── references/
    ├── COMPONENTS.md            # 组件参考手册：每个组件的 HTML 片段 + 何时用
    └── demo-deck.html           # 能力全展示范例（18 页 4 章，含分步 / canvas / 主题色）
```

- AI 读 `SKILL.md` 学流程 → 读 `references/COMPONENTS.md` 查组件 → 复制 `assets/coslides-template.html` → 只填 `#deck` → 自检 → 交付单文件。
- `references/harness-overview.html` 是本地预览文件，已 gitignore。

---

## 产物特性

- **单文件 · 零依赖** — 一个 HTML 搞定，离线可放映、可分享。
- **暗色科技风** — 网格背景、径向光晕、Canvas 粒子（翻页有方向性「whoosh」）。
- **12 类组件** — 卡片、特性列表、终端、目录树、代码块、流程条、决策图、问答气泡、强调框、标签、两栏，以及封面/议程/章节/收尾页型。
- **章节模型** — `data-chapter` 把页面分章，支持数字键跳章、概览分区、底部圆点分组。
- **章节主题色** — `data-chapter-color` 给每章一个主色，进入该章时**高亮元素、进度条、圆点、背景粒子整体跟随**。
- **分步演示（steps）** — 空格在页内逐步展开（Keynote builds），三种写法从零代码到事件驱动。
- **即时交互** — 任意元素可挂 `onclick` / `onmouseover`，与分步正交。
- **批注 / 评审** — `C` 进入批注模式，在页面任意位置留言，气泡定位显示；`J` 弹窗查看/编辑/导入导出 comments JSON（仅内存）。适合把评审意见整段交给 AI 改稿。
- **完整导航** — 键盘 / 点击 / 触摸 / URL 深链，全部内置无需配置。

---

## 导航与快捷键

| 操作 | 键 / 手势 |
|------|-----------|
| 推进一步 / 翻页 | `空格` · 点击空白处（页内有步骤先推进，推完翻页） |
| 下一页 / 上一页 | `→` `PageDown` / `←` `PageUp` · 触摸滑动（始终整页） |
| 首 / 尾页 | `Home` / `End` |
| 跳到第 N 章 | 数字键 `1`–`9` |
| 缩略概览 | `O` / `Esc` 开关；概览内 `↑↓←→` 选择、`Enter` 跳转、点击直达 |
| 批注 / 查看标注 | `C` 进入批注模式 · `J` 查看/编辑 comments JSON |
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

### 批注（评审工具）
`C` 进入批注模式（光标变十字、其它快捷键禁用），点击页面任意处弹出输入框——`Enter` 确认、`Esc` 取消、`Shift+Enter` 换行、点击别处提交并新建；无输入框时 `Enter`/`Esc` 退出。批注以「内容 + 视口比例坐标 + 页码」存内存，对应页显示气泡、点击查看。`J` 弹出 comments JSON（默认全选）可复制/编辑/粘贴导入（应用后跳到首条所在页），或「清除全部」。

**批注仅存在内存中（刷新即丢），靠 JSON 自行保存与恢复**，典型流程：

1. **放映演示** —— 正常翻页讲解。
2. **添加标注** —— 按 `C` 进入批注，在页面相关位置点击留言（边讲边记 / 收集评审意见）。
3. **导出保存** —— 演示结束按 `J`，弹窗内容默认已全选，直接复制 JSON，自行保存到笔记 / 文件 / 发给他人。
4. **恢复查看** —— 下次打开同一演示，按 `J`，粘贴之前保存的 JSON 并「应用」；自动跳到第一条标注所在页，逐页点气泡查看内容。

> 这份 JSON 也可整段交给 AI——「按这些标注改稿」即可据此修订 deck。

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
