// Artifact rendering and structural QA; does not operate the user's browser.
const { chromium } = require('C:/Users/14749/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const root = path.resolve(__dirname, '..');
const out = path.join(root, '_qa');
fs.mkdirSync(out, { recursive: true });
function lum(hex) {
  const rgb = hex.match(/\w\w/g).map(h => parseInt(h,16)/255).map(x => x <= .04045 ? x/12.92 : ((x+.055)/1.055)**2.4);
  return rgb[0]*.2126 + rgb[1]*.7152 + rgb[2]*.0722;
}
function contrast(a,b) { const x=lum(a),y=lum(b); return (Math.max(x,y)+.05)/(Math.min(x,y)+.05); }
(async()=>{
  const browser = await chromium.launch({headless:true, executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  const report = { viewports: [], contrast: [] };
  const page = await browser.newPage({viewport:{width:1440,height:1100},deviceScaleFactor:1});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(pathToFileURL(path.join(root,'style-guide.html')).href);
  await page.screenshot({path:path.join(out,'desktop-cover.png')});
  await page.locator('#visual-board').screenshot({path:path.join(out,'visual-board.png')});
  for(const width of [1440,768,390,360,320]) {
    await page.setViewportSize({width,height:1100});
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
    const info=await page.evaluate(()=>({
      width:innerWidth, documentWidth:document.documentElement.scrollWidth,
      sections:document.querySelectorAll('article h2').length,
      brokenAnchors:[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href')).filter(h=>!document.getElementById(h.slice(1))),
      duplicateIds:[...document.querySelectorAll('[id]')].map(n=>n.id).filter((id,i,all)=>all.indexOf(id)!==i),
      svgCount:document.querySelectorAll('svg').length
    }));
    report.viewports.push(info);
    if(width===390||width===320) {
      await page.screenshot({path:path.join(out,`mobile-${width}-cover.png`)});
      await page.locator('.composition').screenshot({path:path.join(out,`mobile-${width}-composition.png`)});
    }
    if(info.width!==info.documentWidth || info.brokenAnchors.length || info.duplicateIds.length || info.sections!==14) throw new Error(JSON.stringify(info));
  }
  await page.setViewportSize({width:1440,height:1100});
  const heading=page.locator('article h2').nth(3);
  await heading.scrollIntoViewIfNeeded();
  await page.screenshot({path:path.join(out,'specification-table.png')});
  await page.emulateMedia({reducedMotion:'reduce'});
  report.reducedMotion=await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior);
  report.errors=errors;
  for(const [name,a,b] of [
    ['正文 / 纸白','20231F','F5F5F2'],['说明 / 纸白','62675E','F5F5F2'],
    ['白字 / 森绿','FFFFFF','365B45'],['墨黑 / 芽绿','20231F','DDE6AD'],
    ['墨黑 / 雾蓝','20231F','BDCFDF'],['控件边框 / 素白','7C8276','FFFFFF'],
    ['错误文字 / 纸白','A33131','F5F5F2']
  ]) report.contrast.push({name,ratio:Number(contrast(a,b).toFixed(2))});
  fs.writeFileSync(path.join(out,'verification.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));
  await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1;});
