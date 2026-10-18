from pathlib import Path
import re
import html
import markdown

ROOT = Path(__file__).resolve().parents[1]
text = (ROOT / 'art-direction.md').read_text(encoding='utf-8')
body = '\n'.join(text.splitlines()[5:])
md = markdown.Markdown(extensions=['tables', 'fenced_code', 'toc'], extension_configs={'toc': {'toc_depth': '2-2'}})
rendered = md.convert(body)
rendered = re.sub(r'(<table>.*?</table>)', r'<div class="table-scroll" tabindex="0">\1</div>', rendered, flags=re.S)

sculpture = '''<svg viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="原创形式示意：雾蓝背景上，一条浅色纸带构成有转折的环，侧光强调纸带的厚度">
<defs>
 <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fffefa"/><stop offset=".5" stop-color="#e7e9e2"/><stop offset="1" stop-color="#aeb7aa"/></linearGradient>
 <linearGradient id="fold" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#a4b5b5"/><stop offset=".48" stop-color="#f9faf1"/><stop offset="1" stop-color="#f4f6f0"/></linearGradient>
 <linearGradient id="edge" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fcfdf7"/><stop offset="1" stop-color="#c2ccc1"/></linearGradient>
 <filter id="soft"><feGaussianBlur stdDeviation="14"/></filter>
</defs>
<path fill="#bdcfdf" d="M0 0h640v480H0z"/>
<ellipse cx="333" cy="389" rx="164" ry="19" fill="#617f8c" opacity=".21" filter="url(#soft)"/>
<path d="M170 316 243 121Q251 102 274 107L467 145Q486 149 481 171L425 354Q420 370 397 369L195 347Q161 344 170 316Z" fill="url(#paper)"/>
<path d="m248 148 156 31-44 129-153-17Z" fill="#bdcfdf"/>
<path d="m171 315 77-167 44 43-48 130 153 48-202-22q-32-2-24-32Z" fill="url(#fold)"/>
<path d="m292 191 112-12 63-34-193-38q-21-5-31 14l-36 170 41-143Z" fill="url(#edge)"/>
<path d="m404 179 63-34q20 2 14 26l-56 183q-5 16-28 15l-37-61Z" fill="url(#paper)"/>
<path d="m244 321 153 48-37-61-68-117Z" fill="#d8dfd3"/>
<path d="m243 121 31-14 193 38" fill="none" stroke="#fff" stroke-width="2" opacity=".75"/>
<circle cx="508" cy="88" r="9" fill="#c66a4a"/>
</svg>'''

botanical = '''<svg viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="原创形式示意：纸白底上的植物线描、芽绿色纸片与陶土色圆点，表现克制的手作感">
<path fill="#eeeee6" d="M0 0h640v480H0z"/>
<path d="m358 73 180 28-35 278-173-18Z" fill="#dde6ad"/>
<path d="M215 383q59-68 80-132t54-110" fill="none" stroke="#365b45" stroke-width="4" stroke-linecap="round"/>
<path d="M285 284q-93 3-104-79 81-5 104 79Zm22-58q-17-85 61-103 17 76-61 103Zm-49 107q7-60-57-79-23 61 57 79Zm78-163q-39-30-21-77 52 26 21 77Zm-46 108q78 2 102-67-72-11-102 67Z" fill="#365b45"/>
<path d="m187 213 91 65m38-64 45-81m-150 132 42 59m46-52 81-52" fill="none" stroke="#9cb18c" stroke-width="1.5"/>
<circle cx="461" cy="309" r="31" fill="#c66a4a"/>
<path d="M126 371q-19 17-2 24t34-17m-40 31q43 9 85-8" fill="none" stroke="#365b45" stroke-width="2" stroke-linecap="round"/>
<path d="M125 113h88m-88 12h54" fill="none" stroke="#92998b" stroke-width="2"/>
</svg>'''

(ROOT / 'assets').mkdir(exist_ok=True)
(ROOT / 'assets' / 'paper-study.svg').write_text(sculpture, encoding='utf-8')
(ROOT / 'assets' / 'growth-study.svg').write_text(botanical, encoding='utf-8')

swatches = [
    ('纸白', '#F5F5F2', 'canvas'), ('素白', '#FFFFFF', 'surface'),
    ('墨黑', '#20231F', 'ink'), ('石灰', '#62675E', 'muted'),
    ('森绿', '#365B45', 'accent'), ('芽绿', '#DDE6AD', 'lime'),
    ('雾蓝', '#BDCFDF', 'sky'), ('陶土', '#C66A4A', 'clay')]
swatch_html = ''.join(f'<div class="swatch"><div class="chip" style="background:{color}"></div><strong>{name}</strong><code>{color}</code></div>' for name,color,_ in swatches)

template = '''<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>清晰而有生气 · 个人主页美术风格规范</title>
<meta name="description" content="参考 Apple 与喜茶的产品、广告和海报艺术语言，为个人主页与作品集制定的美术风格规范。">
<style>__TOKENS__
*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:88px}body{margin:0;background:var(--color-canvas);color:var(--color-ink);font:16px/1.8 var(--font-sans)}
a{color:var(--color-accent);text-underline-offset:4px}button{font:inherit}button,a{-webkit-tap-highlight-color:transparent}
button:focus-visible,a:focus-visible,summary:focus-visible,[tabindex]:focus-visible{outline:2px solid var(--color-accent);outline-offset:4px}
.skip{position:absolute;left:16px;top:-80px;background:white;padding:12px;z-index:20}.skip:focus{top:8px}
.topbar{background:rgba(245,245,242,.97);position:sticky;top:0;z-index:10;border-bottom:1px solid var(--color-line)}
.topbar-inner{max-width:1320px;margin:auto;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:12px 48px;min-height:64px}
.brand{font-size:14px;font-weight:650;letter-spacing:.08em}.edition{font-size:12px;color:var(--color-muted)}.toolbar{display:flex;align-items:center;gap:24px}
.toolbar a,.toolbar button{font-size:14px;min-height:44px;display:inline-flex;align-items:center}.toolbar button{background:none;border:0;color:var(--color-accent);text-decoration:underline;cursor:pointer;padding:0}
.wrap{width:min(100% - 96px,1224px);margin:auto}.cover{padding:76px 0 72px}.kicker{font-size:12px;letter-spacing:.13em;font-weight:600;color:var(--color-muted);margin:0 0 24px}
.cover-grid{display:grid;grid-template-columns:1.05fr 1fr;gap:68px;align-items:center}.cover h1{font-size:clamp(42px,5.2vw,72px);font-weight:650;line-height:1.17;letter-spacing:0;margin:0 0 28px}.cover h1 em{font-style:normal;color:var(--color-accent)}
.intro{max-width:31em;font-size:17px;color:var(--color-muted);margin:0 0 28px}.subline{font-size:13px;color:var(--color-muted);margin-top:24px}.cover-art{margin:0}.cover-art svg{display:block;width:100%;height:auto;border-radius:16px}.cover-art figcaption{font-size:12px;color:var(--color-muted);display:flex;justify-content:space-between;gap:12px;margin-top:12px}
.action{display:inline-flex;align-items:center;justify-content:center;min-height:48px;background:var(--color-accent);color:#fff;border-radius:12px;padding:10px 22px;font-size:15px;text-decoration:none;font-weight:600}.action:hover{background:var(--color-accent-hover)}
.direction-strip{padding:26px 0;display:grid;grid-template-columns:1fr 1fr 1fr;border-top:1px solid var(--color-line);border-bottom:1px solid var(--color-line);gap:24px}.direction-strip strong{font-size:28px;font-weight:550;display:block;line-height:1.25}.direction-strip span{font-size:13px;color:var(--color-muted)}
.visuals{padding:80px 0}.section-intro{display:flex;justify-content:space-between;align-items:end;gap:32px;margin-bottom:32px}.section-intro h2{font-size:32px;font-weight:600;line-height:1.35;margin:0 0 10px}.section-intro p{font-size:14px;color:var(--color-muted);margin:0;max-width:40em}.section-id{font:14px/1.4 ui-monospace,monospace;color:var(--color-muted);white-space:nowrap}
.studies{display:grid;grid-template-columns:1fr 1fr;gap:32px}.study{margin:0}.study svg{width:100%;display:block;border-radius:16px}.study h3{font-size:22px;font-weight:600;margin:20px 0 4px}.study figcaption p{font-size:14px;color:var(--color-muted);max-width:35em;margin:0}.sample-label{font-size:12px;letter-spacing:.08em;color:var(--color-muted)}
.palette{display:grid;grid-template-columns:repeat(8,1fr);gap:12px;margin:40px 0 0}.swatch{min-width:0}.chip{height:100px;border-radius:8px;margin-bottom:12px;box-shadow:inset 0 0 0 1px rgb(32 35 31 / 8%)}.swatch strong{display:block;font-size:14px}.swatch code{font-size:11px;color:var(--color-muted);letter-spacing:0}
.composition{margin-top:64px;border:1px solid var(--color-line);border-radius:16px;overflow:hidden;background:white}.composition-label{padding:14px 24px;border-bottom:1px solid var(--color-line);font-size:12px;letter-spacing:.05em;color:var(--color-muted)}
.mock-nav{display:flex;justify-content:space-between;align-items:center;padding:24px 36px;gap:16px;font-size:13px}.mock-nav strong{font-size:17px}.mock-links{display:flex;gap:24px;color:var(--color-muted)}
.mock-hero{display:grid;grid-template-columns:1fr 1fr;gap:36px;align-items:center;padding:40px 36px 56px}.mock-copy h3{font-size:clamp(34px,4vw,54px);line-height:1.18;margin:0 0 20px;font-weight:600}.mock-copy p{font-size:14px;color:var(--color-muted);max-width:26em;margin-bottom:24px}.mock-art svg{display:block;width:100%;border-radius:16px}.mock-copy .eyebrow{font-size:12px;letter-spacing:.06em;color:var(--color-accent);margin-bottom:20px}.mock-caption{padding:16px 36px 22px;color:var(--color-muted);font-size:12px;margin:0}
.type-sheet{display:grid;grid-template-columns:1.2fr 1fr;gap:48px;margin-top:64px;padding-top:32px;border-top:1px solid var(--color-line)}.type-sheet h3{font-size:14px;color:var(--color-muted);font-weight:500;margin:0 0 24px}.type-big{font-size:40px;font-weight:600;line-height:1.3;margin-bottom:20px}.type-serif{font-family:var(--font-editorial);font-size:30px;line-height:1.5;margin-bottom:24px}.type-small{font-size:14px;color:var(--color-muted)}
.states{display:flex;flex-wrap:wrap;gap:12px}.state{padding:12px 20px;min-height:48px;background:var(--color-accent);color:white;border-radius:12px;font-size:14px;display:inline-flex;align-items:center}.state.hover{background:var(--color-accent-hover)}.state.focus{outline:2px solid var(--color-accent);outline-offset:4px}.state.disabled{background:var(--color-line);color:var(--color-muted)}.states-note{font-size:12px;color:var(--color-muted);margin-top:24px}
.doc-area{border-top:1px solid var(--color-line);padding:64px 0 96px;display:grid;grid-template-columns:224px minmax(0,1fr);gap:72px}.doc-nav{position:sticky;top:94px;max-height:calc(100vh - 120px);overflow:auto;align-self:start}.doc-nav summary{font-weight:600;font-size:14px;padding:10px 0;cursor:pointer}.doc-nav ul{padding:0;list-style:none;margin:16px 0}.doc-nav li{margin:6px 0}.doc-nav a{font-size:12px;text-decoration:none;color:var(--color-muted);display:block;padding:5px 0;line-height:1.6}.doc-nav a:hover{color:var(--color-accent);text-decoration:underline}
.document{min-width:0}.document h2{font-size:28px;line-height:1.35;margin:64px 0 28px;font-weight:600}.document h2:first-child{margin-top:0}.document h3{font-size:19px;line-height:1.5;margin:32px 0 16px;font-weight:600}.document p{margin:16px 0}.document li{margin-bottom:8px}.document ul,.document ol{padding-left:22px}.document strong{font-weight:650}.document code{background:#e9ece4;font-size:.85em;border-radius:4px;padding:2px 4px;overflow-wrap:anywhere}.document a{overflow-wrap:anywhere}.document table{width:100%;border-collapse:collapse;font-size:13px;line-height:1.7}.document th{font-weight:600;text-align:left;background:#e9ece4}.document th,.document td{padding:12px 14px;border-bottom:1px solid var(--color-line);vertical-align:top;min-width:100px}.document th:first-child,.document td:first-child{padding-left:12px}.table-scroll{overflow:auto;margin:24px 0;max-width:100%}.document blockquote{border-left:3px solid var(--color-accent);padding-left:20px;margin-left:0}.closing{padding:28px 0 48px;border-top:1px solid var(--color-line);display:flex;justify-content:space-between;gap:16px;font-size:12px;color:var(--color-muted)}
@media(min-width:1600px){.wrap{width:1224px}}
@media(max-width:1000px){.wrap{width:calc(100% - 64px)}.topbar-inner{padding-inline:32px}.cover-grid{gap:32px}.cover h1{font-size:52px}.intro{font-size:16px}.doc-area{grid-template-columns:180px minmax(0,1fr);gap:36px}.palette{grid-template-columns:repeat(4,1fr)}.chip{height:88px}.cover{padding-top:56px}.mock-hero{gap:24px;padding-top:28px}.mock-copy h3{font-size:36px}.mock-nav{padding:24px}.mock-hero{padding-inline:24px}.type-sheet{gap:28px}}
@media(max-width:767px){html{scroll-padding-top:80px}.wrap{width:calc(100% - 40px)}.topbar-inner{padding:8px 20px;gap:10px}.brand{font-size:12px;letter-spacing:.03em}.edition{display:none}.toolbar{gap:16px}.toolbar a,.toolbar button{font-size:12px}.cover{padding:48px 0}.cover-grid{grid-template-columns:1fr;gap:36px}.cover h1{font-size:44px;margin-bottom:24px}.kicker{font-size:11px;margin-bottom:20px}.intro{font-size:16px}.cover-art figcaption{font-size:11px}.direction-strip{gap:12px}.direction-strip strong{font-size:20px}.direction-strip span{font-size:11px;line-height:1.6;display:block;margin-top:6px}.visuals{padding:56px 0}.section-intro{align-items:start;gap:16px}.section-intro h2{font-size:26px}.section-id{font-size:11px}.studies{grid-template-columns:1fr;gap:36px}.study h3{font-size:21px}.palette{gap:10px;margin-top:32px}.swatch code{font-size:10px}.chip{height:64px}.composition{margin-top:48px}.composition-label{padding:12px 20px;font-size:11px}.mock-nav{padding:20px;font-size:11px}.mock-nav strong{font-size:15px}.mock-links{gap:12px}.mock-hero{grid-template-columns:1fr;padding:20px;gap:28px}.mock-copy h3{font-size:38px}.mock-copy p{font-size:14px}.mock-caption{padding:8px 20px 20px}.type-sheet{grid-template-columns:1fr;margin-top:48px;gap:40px}.type-big{font-size:32px}.type-serif{font-size:27px}.doc-area{grid-template-columns:1fr;gap:40px;padding:32px 0 64px}.doc-nav{position:static;max-height:none;overflow:visible}.doc-nav .toc ul{display:grid;grid-template-columns:1fr 1fr;gap:4px 20px;margin-bottom:0}.doc-nav a{font-size:12px}.document{font-size:15px}.document h2{font-size:25px;margin-top:52px}.document h3{font-size:18px}.document th,.document td{padding:10px;font-size:12px;min-width:110px}.closing{flex-direction:column;gap:4px}.table-scroll{border:1px solid var(--color-line);border-radius:8px}.type-sheet h3{margin-bottom:20px}}
@media(max-width:359px){.cover h1{font-size:38px}.brand{font-size:11px}.toolbar{gap:10px}.mock-nav{flex-wrap:wrap}.mock-copy h3{font-size:32px}.palette{grid-template-columns:repeat(2,1fr)}.direction-strip strong{font-size:18px}.doc-nav .toc ul{grid-template-columns:1fr}.section-intro .section-id{display:none}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*::before,*::after{animation:none!important;transition:none!important}}
@media print{body{background:white;font-size:10pt}.topbar,.doc-nav,.toolbar,.skip,.cover .action{display:none}.wrap{width:100%;max-width:none}.cover{padding:0 0 24pt}.cover-grid{gap:20pt}.cover h1{font-size:34pt}.intro{font-size:11pt}.cover-art figcaption{font-size:8pt}.cover-grid,.studies,.palette,.composition,.type-sheet{break-inside:avoid}.visuals{padding:28pt 0}.section-intro h2{font-size:22pt}.direction-strip strong{font-size:20pt}.chip{height:38pt}.swatch code{font-size:8pt}.doc-area{display:block;padding-top:24pt}.document h2{font-size:20pt;break-after:avoid}.document h3{break-after:avoid}.document table{font-size:8pt}.document th,.document td{min-width:0;padding:7pt}.table-scroll{overflow:visible;break-inside:auto}.document tr{break-inside:avoid}p,li{orphans:3;widows:3}.closing{padding-bottom:0}.type-big{font-size:24pt}.type-serif{font-size:21pt}.mock-copy h3{font-size:28pt}.mock-caption{font-size:8pt}a{color:inherit}.document a{text-decoration:underline}@page{size:A4;margin:16mm}}
</style></head>
<body><a class="skip" href="#specification">跳转至完整规范</a>
<header class="topbar"><div class="topbar-inner"><div><span class="brand">ART DIRECTION / 视觉规范</span><span class="edition">　个人主页 · V1.0</span></div><nav class="toolbar" aria-label="文档工具"><a href="#visual-board">看样张</a><a href="#specification">读规范</a><button type="button" id="print-guide">打印</button></nav></div></header>
<main id="main" class="wrap">
<section class="cover" aria-labelledby="cover-title"><p class="kicker">PERSONAL PORTFOLIO　/　2026.10.18</p><div class="cover-grid"><div><h1 id="cover-title">清晰，<br>而<em>有生气。</em></h1><p class="intro">让作品被看清，让创作者被记住。<br>以精确的展示秩序承托作品，用自然的温度与少量趣味，留下属于你的印象。</p><a class="action" href="#specification">阅读美术风格规范　↓</a><p class="subline">产品影像 × 海报艺术 × 个人表达<br>灵感参考：Apple / 喜茶的产品、广告、海报与字体项目</p></div><figure class="cover-art">__SCULPTURE__<figcaption><span>FORM STUDY 01 / 折光</span><span>原创形式示意</span></figcaption></figure></div></section>
<div class="direction-strip" aria-label="方向组合"><div><strong>精确秩序</strong><span>约 65% · 主体、对齐与留白</span></div><div><strong>自然温度</strong><span>约 25% · 材料、色彩与中文气质</span></div><div><strong>个人趣味</strong><span>约 10% · 一个值得记住的细节</span></div></div>
<section id="visual-board" class="visuals" aria-labelledby="board-title"><div class="section-intro"><div><h2 id="board-title">先感受，再落地。</h2><p>以下为本方案原创视觉练习，用来表达合成后的方向。品牌原素材请看文末参考索引。</p></div><span class="section-id">VISUAL BOARD / 01</span></div>
<div class="studies"><figure class="study">__SCULPTURE__<figcaption><h3>01 / 精确的形态</h3><p>安静底板、明确主角、受控的光影。把这套方法用在作品全貌与关键细节上，保持作品的真实颜色。</p></figcaption></figure><figure class="study">__BOTANICAL__<figcaption><h3>02 / 有温度的痕迹</h3><p>自然色、纸张与一笔手作感。用在个人观察和过程记录中，既有性格，也给阅读留下空间。</p></figcaption></figure></div>
<div class="palette" aria-label="核心色板">__SWATCHES__</div>
<div class="composition"><div class="composition-label">APPLICATION STUDY / 首页首屏构图示意 · 内容待替换</div><div class="mock-nav"><strong>你的名字<span aria-hidden="true" style="color:var(--color-clay)"> ●</span></strong><div class="mock-links" aria-label="示意导航，非交互内容"><span>作品</span><span>关于</span><span>联系 ↗</span></div></div><div class="mock-hero"><div class="mock-copy"><p class="eyebrow">个人方向 / 一句具体的自我介绍</p><h3>把观察，<br>做成作品。</h3><p>在这里，用一句话说清你的创作方向。选一件最能代表自己的作品，让它成为画面的主角。</p><a class="action" href="#specification">查看页面应用规范　↗</a></div><div class="mock-art">__SCULPTURE__</div></div><p class="mock-caption">这是美术构图示意，不是已开发的网站；署名、自述、作品和项目经历需要用真实内容替换。</p></div>
<div class="type-sheet"><div><h3>TYPE / 中文为主，少量编辑气质</h3><div class="type-big">把作品讲清楚。</div><div class="type-serif">也留一点，自己的语气。</div><p class="type-small">无衬线用于标题与正文；宋体只用于短引言。<br>不靠装饰性字体制造距离感。</p></div><div><h3>STATES / 同一语言，明确反馈</h3><div class="states" aria-label="按钮状态的静态视觉样本"><span class="state">默认</span><span class="state hover">悬停</span><span class="state focus">键盘焦点</span><span class="state disabled">不可用</span></div><p class="states-note">以上是状态样本。正式按钮高 48px、圆角 12px；交互变化保持轻微，文字始终清楚。</p></div></div>
</section>
<div class="doc-area" id="specification"><aside class="doc-nav"><details open><summary>完整规范 / 14 个章节</summary>__TOC__</details></aside><article class="document" aria-label="个人主页与作品集美术风格规范">__DOCUMENT__</article></div>
<footer class="closing"><span>清晰而有生气 / Personal portfolio art direction</span><span>V1.0 · 2026.10.18 · 可离线查看</span></footer>
</main><script>document.getElementById('print-guide').addEventListener('click',()=>window.print());</script></body></html>'''

# Keep each SVG's internal ids unique when repeated in this one-file document.
index = 0
def unique_sculpture(match):
    global index
    index += 1
    return re.sub(r'(?<=id=")([^\"]+)', lambda m: m[1] + str(index), sculpture).replace('url(#paper)', f'url(#paper{index})').replace('url(#fold)', f'url(#fold{index})').replace('url(#edge)', f'url(#edge{index})').replace('url(#soft)', f'url(#soft{index})')

result = template.replace('__TOKENS__', (ROOT / 'tokens.css').read_text(encoding='utf-8')).replace('__BOTANICAL__', botanical).replace('__SWATCHES__', swatch_html).replace('__TOC__', md.toc).replace('__DOCUMENT__', rendered)
result = re.sub('__SCULPTURE__', unique_sculpture, result)
(ROOT / 'style-guide.html').write_text(result, encoding='utf-8')
print('Built style-guide.html; sections:', rendered.count('<h2'))
