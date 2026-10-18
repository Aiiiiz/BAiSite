# 此间 · 个人博客

个人博客，栏目为用户确认的「随笔、学习笔记、项目记录」。站名「此间」为暂定创作名称，可以在 `src/config/site.ts` 修改。

基于 Astro 7.4.0、TypeScript 与 Markdown Content Collections，使用原生 CSS 和浏览器脚本。依赖精确锁定，推荐 Node.js 24 LTS（本机验证为 24.15.0）；最低使用 Astro 支持的 Node.js 22.22+ 偶数版本。

## 当前页面与布局

首页参考 Dee’s Blog 的固定左侧栏目索引、右侧分组内容与图文交替布局，使用自己的纸白 / 石墨视觉系统、原创封面、栏目名称和交互。手机索引改为吸顶横排。

- 首页 `/`：按栏目分组的文章列表，随阅读位置高亮栏目。
- 归档 `/archive/`：按年份归档，栏目筛选与稍后读筛选。
- 文章 `/posts/<slug>/`：Markdown 正文、自动目录、阅读进度、标签、稍后读、复制链接及下一篇。
- 关于 `/about/`：个人介绍、博客说明与联系区。
- 搜索索引 `/search.json`：构建时生成，包括公开文章标题、正文、摘要、栏目与标签。
- 404 页。

六篇文章是此次为版式撰写的原创示例，均标有「示例文章」，日期为示例日期，不代表用户的真实经历。旧作品集文件、数据与 `/projects/` 路径保留供迁移，但不进入博客主导航。

## 本地运行

```powershell
npm ci --cache .cache/npm --no-audit --no-fund
npm run dev
```

默认地址 `http://127.0.0.1:4321/`，只监听本机。预览终端关闭后，再次运行 `npm run dev` 即可恢复。

```powershell
npm test
npm run check
npm run build
npm run check:dist
npm run test:browser
npm run preview
```

`check` 验证类型、内容字段、重复地址、正文、封面与示例标记；`check:dist` 验证静态产物中的本地资源、页面与锚点。`preview` 查看上一次构建，修改源码后需重新构建。

浏览器测试覆盖栏目跳转与高亮、文章目录、搜索及失败重试、归档筛选、稍后读持久化、复制链接、四种视口、键盘操作、减少动态效果与字体放大。截图和跟踪写入 `.qa/`。Windows 默认使用已安装的 Chrome，其他平台可先运行 `npx playwright install chromium`；亦可通过 `PLAYWRIGHT_CHROMIUM_EXECUTABLE` 指定浏览器路径。此验收使用 Chromium，尚未验证 Safari、Firefox 与实体手机。

## 内容与代码位置

```text
src/config/site.ts          暂定站名、个人资料、联系方式、栏目名称与介绍
src/content/posts/*.md      博客文章
src/content.config.ts       文章和保留的旧项目集合
src/pages/index.astro       分组首页
src/pages/archive.astro     归档
src/pages/posts/[slug].astro 文章模板
src/pages/about.astro       关于页
src/scripts/blog.ts         搜索、筛选、稍后读、目录与阅读进度
src/styles/blog.css         博客布局
public/images/              原创示例封面、个人照片与其他图片
```

## 发布一篇真实文章

在 `src/content/posts/` 新建 Markdown，例如：

```yaml
---
title: "填写真实文章标题"
slug: "your-post"
category: "essays"
summary: "填写文章摘要。"
date: 2026-10-18
order: 1
cover: "/images/your-cover.webp"
coverAlt: "清楚描述封面内容"
tags: ["标签"]
demo: false
draft: false
---
```

上面日期为格式示例，请替换为实际发布日期。栏目 id 分别为 `essays`（随笔）、`notes`（学习笔记）、`making`（项目记录）。仅改栏目名称不影响已有文章地址。新增栏目时在 `columns` 中新增配置与 id。

文章按日期倒序、同日按 `order` 排列。`draft: true` 不进入首页、归档、文章路由与搜索索引；草稿只在本地源码中保留。`demo: true` 显示示例标记与 noindex，摘要或正文也须注明示例身份。真实文章用 `demo: false`。

正文二三级标题自动构成阅读目录。推荐先交代问题，再组织段落，最后补充来源或下一步。图片放在 `public/images/`，正文使用：

```markdown
![图片内容描述](/images/process.webp)
```

Markdown 中根相对图片与链接自动适配 GitHub Pages 仓库子路径。不要手写 HTML 图片标签，原始 HTML 不经过这个 Markdown 路径插件。

## 个人信息与交互

在 `src/config/site.ts` 替换姓名、自述、方向和允许公开的邮箱、社交主页。关于页肖像与关注主题在 `src/pages/about.astro` 中更换。补齐资料后再关闭 `profilePending`，它控制占位页脚与全站 noindex；每篇示例文章仍独立保留 noindex。

搜索以静态索引实现，不发送查询给第三方，支持 `/` 打开和 Esc 关闭。稍后读只存储在当前浏览器 localStorage，不上传、不跨设备同步。存储不可用时，阅读功能仍可使用；收藏只保留在当前页面。归档筛选同步到 URL 的 `category` 与 `saved` 参数，刷新保留状态。

未填写邮箱时，联系区只显示待补充说明，不创建无效联系方式。没有表单提交、账号系统或服务器数据库。

## GitHub Pages

发布仓库为 `Aiiiiz/BAiSite`，目标网址为 `https://aiiiiz.github.io/BAiSite/`。`.github/workflows/deploy.yml` 负责检查、构建与自动发布。

上线后可以直接在 GitHub 网页中编辑 `src/content/posts/` 下的文章文件；图片和附件通过对应文件夹的 Add file → Upload files 上传。保存修改时提交到 `main`，Actions 检查通过后自动更新网站。图片放入 `public/images/`，在文章中引用 `/images/文件名`，不要把 `public` 写入链接。文件夹中已经有同名文件时请先确认要替换的内容。

1. 在自己的 GitHub 账户创建仓库；用户主页采用 `用户名.github.io`，普通项目仓库使用仓库子路径。
2. 提交源码、锁文件与工作流，不提交 `node_modules/`、`dist/`、`.qa/` 或私密资料。
3. 仓库 Settings → Pages 的 Source 选择 GitHub Actions。
4. 推送 `main` 后自动测试、检查、构建、检查静态链接并发布 `dist/`；拉取请求只检查和构建。

工作流根据实际仓库自动推导 SITE_URL 与 BASE_PATH，不需要在源码写他人的账户信息。自定义域名可在 Actions variables 中设置 `SITE_URL=https://你的域名` 和 `BASE_PATH=/`，并另行配置 GitHub Pages 域名、DNS 与需要的 CNAME。

本地验证子路径：

```powershell
$env:SITE_URL = 'https://example.github.io'
$env:BASE_PATH = '/personal-blog/'
npm run build
npm run check:dist
npm run preview -- --port 4322
```

测试入口为 `http://127.0.0.1:4322/personal-blog/`。完成后移除测试变量再构建根路径版本：

```powershell
Remove-Item Env:SITE_URL -ErrorAction SilentlyContinue
Remove-Item Env:BASE_PATH -ErrorAction SilentlyContinue
npm run build
```

## 美术与参考

原 `design/` 文件完整保留。`design/blog-layout.md` 是最新博客布局规范，优先于原作品集的首页叙事；配色、中文字体和基础组件仍直接复用 `design/tokens.css`。

现行美术依据为 `design/art-direction-v2.md`：纸白、石墨与统一侧光；`design/art-review.html` 可直接在浏览器打开查看整套封面和色彩。原 `art-direction.md`、`style-guide.html` 与 `design/assets/` 保留作 v1 历史材料。

六张示例封面、肖像占位与站点图标由 `tools/generate-art.mjs` 生成。调整共享材质或光影后运行 `node tools/generate-art.mjs`，再检查整组效果。真实作品和照片保留本身色彩，不使用全站灰度滤镜。设计过程的参考出处与转译边界见 v2 规范。

参考 [Dee’s Blog](https://deej6126.github.io/) 的布局结构与 [公开源码](https://github.com/DeeJ6126/DeeJ6126.github.io)。本站独立实现，没有复制其品牌标识、个人资料、课程内容或挂件。纸张、植物、笔记本与系统模块等封面均为本项目原创示意。
