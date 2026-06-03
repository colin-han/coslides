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

1. **不要修改 `<style>` 和 `<script>`**。唯一可改的样式是顶部 `:root` 配置区的 `--accent` / `--accent-2` / `--bg` 三个变量。
2. **只在 `#deck` 区域内写 `<section class="slide">`**。
3. 不要引入任何外部依赖（CDN、字体、图片外链）——产物必须是自包含单文件。
4. 不要自创新 class / 内联大段新样式去"造组件"；用 `COMPONENTS.md` 里已有的组件。少量布局微调可用内联 `style`（如 `style="justify-content:center"`）。

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
- [ ] `<style>` / `<script>` 未被改动（除 `:root` 三个变量外）
- [ ] 只有第一页有 `active`
- [ ] `data-chapter` 编号连续（1,2,3…），每章首页有 `data-chapter-title`
- [ ] 无占位符残留（"写在这里""TAG""说明文字"等）、无空 `<section>`
- [ ] 无外部依赖、无新增 class 的自造组件
- [ ] 组件片段结构正确（对照 `COMPONENTS.md`）

### 第 6 步 · 交付
告诉用户产物路径，并提示放映快捷键：`←→`/空格翻页、`1-9` 跳章、`O` 概览、`F` 全屏、`#p7` 深链。

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
