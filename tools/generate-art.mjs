/** Original vector material studies. Rebuild with: node tools/generate-art.mjs.
 * One material, one top-left light, one quiet registration mark across the series.
 * No external fonts, raster assets, game artwork or CSS color filters. */
import { writeFileSync } from 'node:fs';
const defs = `<defs>
  <radialGradient id="ground" cx="20%" cy="8%" r="105%"><stop stop-color="#f5f5f1"/><stop offset="1" stop-color="#deded7"/></radialGradient>
  <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffffff"/><stop offset=".55" stop-color="#f7f7f2"/><stop offset="1" stop-color="#deded5"/></linearGradient>
  <linearGradient id="fold" x1="0" y1="0" x2="1" y2=".5"><stop stop-color="#b6b6ac"/><stop offset=".35" stop-color="#e5e5dc"/><stop offset="1" stop-color="#fafaf6"/></linearGradient>
  <linearGradient id="edge" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#c5c5ba"/><stop offset="1" stop-color="#91918a"/></linearGradient>
  <filter id="shadow" x="-60%" y="-50%" width="240%" height="250%" color-interpolation-filters="sRGB"><feDropShadow dx="15" dy="22" stdDeviation="13" flood-color="#41413b" flood-opacity=".19"/></filter>
  <filter id="close" x="-40%" y="-40%" width="200%" height="220%" color-interpolation-filters="sRGB"><feDropShadow dx="4" dy="7" stdDeviation="4" flood-color="#41413b" flood-opacity=".2"/></filter>
</defs>`;
const studies = {
  'blank-page': ['留白：一张折起的纸，统一侧光下的纸白与灰影', `<g transform="rotate(-8 320 240)" filter="url(#shadow)">
    <path d="M204 83H438V326L374 386H204Z" fill="url(#paper)"/>
    <path d="M374 326H438L374 386Z" fill="url(#edge)"/>
    <path d="M374 326Q403 329 438 326Q402 347 374 386Z" fill="url(#fold)"/>
    <path d="M225 84H437" stroke="#fff" stroke-opacity=".8"/>
  </g>`],
  'growth-study': ['观察：白纸裁成的叶片与细长叶脉，在相同光线下形成浅浮雕', `<g transform="rotate(-18 320 240)" filter="url(#shadow)">
    <path d="M319 371C317 280 329 194 337 107" fill="none" stroke="#c9c9be" stroke-width="5"/>
    <path d="M323 295C244 300 209 249 208 199C269 199 311 232 323 295Z" fill="url(#paper)"/>
    <path d="M329 244C398 239 434 192 430 143C372 150 339 186 329 244Z" fill="url(#paper)"/>
    <path d="M335 186C279 166 269 116 287 80C331 102 350 139 335 186Z" fill="url(#paper)"/>
    <path d="M323 295L222 213M329 244L415 159M335 186L290 91" stroke="#c9c9bf" stroke-width="1" fill="none"/>
    <path d="M325 294L224 212M331 243L417 158M337 185L292 90" stroke="#fff" stroke-opacity=".8" fill="none"/>
  </g>`],
  'note-pages': ['笔记：几层错落的白色书页，以纸张厚度和阴影表现信息层次', `<g transform="rotate(-8 320 240)" filter="url(#shadow)">
    <path d="M166 136H446V366H166Z" fill="#c7c7bc"/>
    <path d="M176 124H456V354H176Z" fill="#ddddd3"/>
    <path d="M187 112H467V342H187Z" fill="url(#paper)"/>
    <path d="M222 153H412M222 181H378M222 209H421M222 237H391" stroke="#c4c4bb" stroke-width="2" opacity=".7"/>
    <path d="M222 151H412M222 179H378M222 207H421M222 235H391" stroke="#fff" stroke-width="2"/>
    <path d="M187 280Q330 294 467 280V342H187Z" fill="url(#fold)" opacity=".55"/>
  </g>`],
  'type-study': ['字间：由白色几何纸条组成的间字结构，侧光呈现字形和负空间', `<g transform="translate(0 -4)" filter="url(#shadow)">
    <path d="M208 111H242V370H208Z M274 111H432V370H398V143H274Z" fill="url(#paper)"/>
    <path d="M271 198H369V325H271Z" fill="url(#edge)"/>
    <path d="M267 192H365V319H267Z M286 211V246H346V211Z M286 264V300H346V264Z" fill="url(#paper)" fill-rule="evenodd"/>
    <path d="M221 78L249 100" stroke="#fdfdf9" stroke-width="15"/>
    <path d="M209 112V369M399 145V369M268 193V317" stroke="#fff" stroke-opacity=".9"/>
  </g>`],
  'paper-study': ['折光：连续白色纸带的折面与负空间，明暗来自同一左上侧光', `<g transform="translate(0 -8)" filter="url(#shadow)">
    <path d="M172 279L321 102L471 251L321 386Z" fill="url(#edge)"/>
    <path d="M172 279L321 102L355 166L247 294Z" fill="url(#paper)"/>
    <path d="M321 102L471 251L402 272L355 166Z" fill="url(#fold)"/>
    <path d="M471 251L321 386L293 321L402 272Z" fill="url(#paper)"/>
    <path d="M321 386L172 279L247 294L293 321Z" fill="url(#fold)"/>
    <path d="M247 294L355 166L402 272L293 321Z" fill="#b9b9af"/>
    <path d="M247 294L355 166L389 264L293 321Z" fill="url(#ground)"/>
    <path d="M173 279L321 103L355 166M294 321L321 385" stroke="#fff" fill="none" stroke-opacity=".7"/>
  </g>`],
  'small-system': ['秩序：同一种白色材料构成高低不同的几何模块，统一阴影和间距', `<g filter="url(#shadow)" transform="translate(-3 6)">
    <path d="M182 235L272 185L356 234L268 286Z" fill="url(#paper)"/>
    <path d="M182 235L268 286V345L182 294Z" fill="url(#fold)"/>
    <path d="M268 286L356 234V292L268 345Z" fill="url(#edge)"/>
    <path d="M289 172L379 120L463 169L375 221Z" fill="url(#paper)"/>
    <path d="M289 172L375 221V282L289 233Z" fill="url(#fold)"/>
    <path d="M375 221L463 169V230L375 282Z" fill="url(#edge)"/>
    <path d="M300 313L390 261L474 310L386 362Z" fill="url(#paper)"/>
    <path d="M300 313L386 362V385L300 335Z" fill="url(#fold)"/>
    <path d="M386 362L474 310V333L386 385Z" fill="url(#edge)"/>
  </g>`],
};
for (const [name,[title,shape]] of Object.entries(studies)) {
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" role="img" aria-labelledby="title"><title id="title">${title}</title>${defs}<path fill="url(#ground)" d="M0 0H640V480H0Z"/>${shape}<path d="M40 424H64" stroke="#82745e" stroke-width="1.5"/></svg>\n`;
 writeFileSync(new URL(`../public/images/${name}.svg`,import.meta.url),svg);
}
writeFileSync(new URL('../public/images/portrait-placeholder.svg',import.meta.url),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800"><title>真实个人肖像待补充，暂以纸框标记位置</title>${defs}<path d="M0 0H600V800H0Z" fill="url(#ground)"/><g filter="url(#shadow)"><path d="M132 161H468V624H132Z M159 188V597H441V188Z" fill="url(#paper)" fill-rule="evenodd"/></g><path d="M276 392H324M300 368V416" stroke="#858580" stroke-width="1"/><path d="M40 744H64" stroke="#82745e" stroke-width="1.5"/></svg>\n`);
writeFileSync(new URL('../public/favicon.svg',import.meta.url),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#252525"/><path d="M25 18H18V46H25M39 18H46V46H39" fill="none" stroke="#f7f7f5" stroke-width="2.5"/><path d="M31 27V37" stroke="#f7f7f5" stroke-width="2"/></svg>\n`);
console.log('Generated 6 paper studies, the portrait placeholder and favicon.');
