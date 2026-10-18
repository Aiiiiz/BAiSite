# 用 Codex 创建个人主页：技术路线与执行提示词

> 定位更新：网站已根据用户最新要求改为个人博客，栏目为「随笔、学习笔记、项目记录」。布局执行 `blog-layout.md`，内容维护以根目录 README 为准。下文保留最初作品集方案及技术研究记录；Astro 与 GitHub Pages 路线继续适用。

2026-10-18 · 配合 `art-direction.md`、`style-guide.html`、`tokens.css` 使用。

## 推荐路线

采用 **Astro + TypeScript + Markdown 内容集合 + 原生 CSS + GitHub Actions + GitHub Pages**。

技术参考 DeeJ6126 的公开源码；视觉执行本项目已有的美术风格规范。个人介绍、作品、笔记与联系信息由自己的真实材料组织。

参考站网页直连未成功；以下技术结论已通过其公开仓库中的 README、依赖配置、Astro 配置、内容定义、页面与发布流程核对。源码可能与线上当前部署存在时间差，本说明不声称已完成线上交互验收。

## 参考站已确认的实现

| 部分 | 已核实内容 | 对本项目的建议 |
| --- | --- | --- |
| 页面生成 | Astro，`output: 'static'` | 使用 Astro 生成可部署的静态 HTML |
| 类型与内容 | TypeScript；Astro Content Collections；Markdown 与字段校验 | 作品和笔记放在内容文件中，页面模板统一渲染 |
| 内容组织 | 课程、笔记、项目三类集合；首页为课程目录，另有项目和关于页 | 个人主页改为首页、作品、笔记、关于四类入口 |
| 阅读能力 | Markdown、数学公式插件、KaTeX 与代码高亮；课程资料含 PDF | 普通作品集先实现 Markdown；有学术内容时再加公式与 PDF |
| 样式与交互 | `.astro` 组件、分文件 CSS、浏览器脚本；依赖列表未包含 React / Vue | 原生 CSS 与少量脚本即可起步，不必先引入额外 UI 框架 |
| 额外装饰 | 源码包含音乐播放器、Live2D、鼠标轨迹、页面动效与客户端切换 | 这些是独立可选项；依照现有美术规范，首版只保留轻微反馈 |
| 发布 | main 分支触发 GitHub Actions，检查和构建后发布 `dist/` | 配置同类自动发布流程 |

参考仓库当前声明 Astro `^7.2.4`，README 要求 Node.js `>=22.12.0`，发布流程使用 Node.js 24。这些是该仓库的配置快照，不是本项目必须固定的版本。创建项目时选用彼此兼容且受支持的版本，记录版本并提交锁文件。

## 开始前准备

本地工作目录为 `D:\A_MINE\Mysite`，美术文件已经位于 `design/`。在 Codex 中打开这个目录，后续任务就可以直接引用这些文件。软件开发任务应使用能够访问该本地文件夹的 Codex 工作环境。

准备姓名或署名、一句话介绍、3–5 个作品、各项目的角色和过程图、个人照片、公开联系方式。如果暂时没有完整材料，先使用明确标记的占位内容，避免把虚构经历写进网站。

Node.js、包管理器、Git 的检查与项目初始化可以交给 Codex 执行；你主要负责内容与视觉反馈。GitHub 发布阶段需要你的 GitHub 账户和目标仓库。

## 建议的项目结构

以下是本项目建议，不是参考站目录的逐项复制。

```text
Mysite/
  design/                    现有美术规范与开发指南
  src/
    components/              导航、作品入口、按钮、页脚
    layouts/                 全站布局、作品与文章布局
    pages/
      index.astro            个人首页
      about.astro            关于我
      projects/
        index.astro          作品列表
        [slug].astro         构建时生成每个作品的独立页面
      notes/
        index.astro          笔记列表（需要时实现）
        [slug].astro         构建时生成文章详情
    content/
      projects/              每个项目一份 Markdown
      notes/                 每篇文章一份 Markdown
    content.config.ts        必填字段与内容集合定义
    styles/                  变量、全局样式、页面样式
  public/
    images/                  项目图片与头像
    files/                   允许公开的 PDF 等资料
  astro.config.mjs
  package.json
  package-lock.json
  .github/workflows/deploy.yml
  README.md
```

首页、作品列表、详情页应共享同一份内容数据。更换一份 Markdown，就能更新相应页面，避免在多个模板中重复修改项目标题。

## 在 Codex 中分阶段推进

### 1. 创建本地第一版

告诉 Codex 读取现有美术规范，检查文件夹，再初始化 Astro 工程。先完成首页、作品列表、作品详情与关于页，并启动本地预览。保留 `design/` 中的现有文件。

完成标志：你能打开本地地址，导航正常，进入作品后可以返回，页面适配手机，缺少真实材料的位置清楚可见。

### 2. 替换真实资料并完善内容管理

把作品原图与介绍放进项目目录，让 Codex 根据约定字段填入内容文件。确认标题、年份、个人角色与协作署名。需要笔记栏目时再加入 Markdown 列表、目录、代码块和详情页；有公式或 PDF 时再增加相应能力。

完成标志：至少有一个完整真实项目，包含成果图、背景、关键选择与过程证据；你知道下次应编辑哪个文件。

### 3. 看预览，给具体反馈

用“首页标题再小一档”“第一张作品保留全貌”“手机上先看文字再看图”“说明文字太淡”这样的反馈迭代。每轮聚焦一组问题，让 Codex 修改后重新打开预览。

要求在 320 / 390 / 768 / 1440px 下检查排版、菜单、图片、键盘焦点与减少动态效果设置。检查实际页面，不仅检查构建成功。

### 4. 配置 GitHub Pages

使用 `你的 GitHub 用户名.github.io` 作为用户站点仓库名，可以得到根路径网址；若放在普通项目仓库，则网址带仓库子路径。让 Codex 据此配置 Astro 的 `site`，必要时配置 `base`，并检查图片、导航和 PDF 链接在目标路径下是否正确。

发布流程建议为：提交源码 → GitHub Actions 安装依赖、检查与构建 → 发布 `dist/` → GitHub Pages 提供访问。仓库的 Settings → Pages → Source 选择 GitHub Actions。具体流程文件遵循当前 Astro 与 GitHub 官方说明。

Astro 的静态输出适合个人主页、作品、文章与资料展示。需要真实提交的联系表单、账户登录或数据库时，应单独接入相应服务，不能仅靠静态页面完成。首版联系区使用公开邮箱与社交链接即可。

### 5. 以后维护

新增作品：添加项目 Markdown 与图片，让 Codex 检查字段和链接，再提交更新。调整外观：优先修改全局样式变量，避免各页面分别写一套颜色与间距。发布后打开实际网址，确认新内容和资源可访问。

## 可直接发送给 Codex 的启动提示词

请在当前目录 D:\A_MINE\Mysite 中创建我的个人主页与作品集网站。

技术参考：https://deej6126.github.io/，其公开源码为 https://github.com/DeeJ6126/DeeJ6126.github.io 。参考其 Astro 静态生成、Markdown 内容管理、内容集合和 GitHub Pages 自动发布方法。

请先读取 design/art-direction.md、design/style-guide.html 和 design/tokens.css，按照其中的配色、中文排版、构图、影像、组件与动效规范实施。

具体要求：

1. 先检查现有文件与本地环境，保留 design/ 文件夹，在根目录建立 Astro + TypeScript 工程。使用兼容的受支持版本，记录环境要求并提交依赖锁文件。
2. 首页包含个人身份与介绍、精选作品、关于和联系入口；另外实现作品列表、作品详情和关于页。
3. 使用 Astro Content Collections 管理作品，字段至少包含 title、slug 或稳定 id、year、category、summary、role、cover、featured。正文用 Markdown，图片与正文分离管理。
4. 将现有 tokens.css 映射到正式样式。首页遵循“身份 → 作品 → 人 → 联系”的顺序；界面以原生 CSS 与少量浏览器脚本实现。
5. 参考站中的课程导入、数学公式、PDF 阅读器、音乐、Live2D 等功能按实际需要单独评估；首版优先把作品浏览和内容维护做好。
6. 资料缺失处使用明确的占位内容，集中记录待补资料，不能虚构我的姓名、项目经历、成果与联系方式。
7. 完成本地可运行版本，启动预览，检查手机与桌面布局、导航、作品详情、图片加载、键盘焦点和减少动态效果。运行适合此项目的类型检查、内容检查与构建，修复发现的问题。
8. 准备 GitHub Pages 发布配置与简明 README，说明本地启动、构建、添加作品、替换图片和发布步骤。GitHub 用户名与目标仓库尚未明确时，集中标记需要替换的配置，不填入参考作者的信息。
9. 先交付本地预览和配置文件；本轮任务不要求推送或公开发布。完成后说明需要我补充的真实资料，以及发布前还需填写的配置。

## 资料来源

- [参考仓库 README](https://github.com/DeeJ6126/DeeJ6126.github.io/blob/main/README.md)
- [参考仓库依赖与脚本](https://github.com/DeeJ6126/DeeJ6126.github.io/blob/main/package.json)
- [参考仓库 Astro 配置](https://github.com/DeeJ6126/DeeJ6126.github.io/blob/main/astro.config.mjs)
- [参考仓库内容集合](https://github.com/DeeJ6126/DeeJ6126.github.io/blob/main/src/content.config.ts)
- [参考仓库首页](https://github.com/DeeJ6126/DeeJ6126.github.io/blob/main/src/pages/index.astro)
- [参考仓库自动部署](https://github.com/DeeJ6126/DeeJ6126.github.io/blob/main/.github/workflows/deploy.yml)
- [OpenAI 官方入门文档](https://learn.chatgpt.com/docs/quickstart)
- [Astro 官方 GitHub Pages 部署说明](https://docs.astro.build/en/guides/deploy/github/)
- [GitHub Pages 官方入门](https://docs.github.com/en/pages/quickstart)
