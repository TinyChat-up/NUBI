import {createRequire} from 'node:module';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {assets} from '../../src/content/assets/index.ts';
import {tools} from '../../src/content/tools.ts';
import {unaMananaDiferente as story} from '../../src/content/stories/una-manana-diferente/story.ts';
const require=createRequire(process.env.NUBI_BROWSER_TOOLS+'/package.json');
const {chromium}=require('playwright');
const base=process.env.NUBI_URL||'http://127.0.0.1:5173';
const out=process.env.NUBI_ART_EVIDENCE||'/tmp/nubi-art-batch-6';mkdirSync(out,{recursive:true});
const selected=Object.values(assets).filter(a=>['herramienta','lugar'].includes(a.kind));assert.equal(selected.length,13);
const exports=JSON.parse(readFileSync(new URL('../../docs/art-batch-6/exports.json',import.meta.url)));
const files=[];
for(const a of selected){
 assert.equal(a.status,'listo');assert.deepEqual(a.variants,a.transparent?[256,512]:[800,1200]);
 const record=exports.find(e=>e.id===a.id);assert(record);
 for(const f of [record,...record.variants]){
  const data=readFileSync(new URL('../../public'+f.file,import.meta.url));assert.equal(createHash('sha256').update(data).digest('hex'),f.sha256);
  if(a.transparent)assert.deepEqual([...data.subarray(0,8)],[137,80,78,71,13,10,26,10]);else assert.equal(data.toString('ascii',8,12),'WEBP');
  files.push({file:f.file,size:f.exportSize,transparent:a.transparent});
 }
}
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});const report=[];
try{
 for(const [width,height] of [[390,844],[820,1180],[1180,820]]){
  const ctx=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});const page=await ctx.newPage();const errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(['error','warning'].includes(m.type()))errors.push(m.type()+': '+m.text());});page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
  await page.goto(base);
  const decoded=await page.evaluate(async files=>{
   const result=[];
   for(const f of files){const im=new Image();im.src=f.file;await im.decode();const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(im,0,0);const d=g.getImageData(0,0,c.width,c.height).data;let lo=255,hi=0;for(let i=3;i<d.length;i+=4){lo=Math.min(lo,d[i]);hi=Math.max(hi,d[i]);}result.push({file:f.file,size:[im.naturalWidth,im.naturalHeight],alpha:[lo,hi]});}return result;
  },files);
  decoded.forEach((r,i)=>{assert.deepEqual(r.size,files[i].size);if(files[i].transparent)assert(r.alpha[0]===0&&r.alpha[1]>=250);else assert.deepEqual(r.alpha,[255,255]);});
  // Fase 19: «Mi mundo» y «Mis herramientas» salieron de la navegación. Los 6 lugares se siguen comprobando
  // arriba (hash, decodificación, alfa) aunque ninguna pantalla los muestre; las 7 herramientas se ven en la
  // guía para familias y docentes (y en el selector y las consecuencias del cuento, más abajo).
  for(const path of ['/acompanar/una-manana-diferente']){
   await page.goto(base+path);await page.locator('h1').waitFor();
   const ids=selected.filter(a=>a.transparent);
   const measured=[];
   for(const a of ids){const img=page.locator(`[data-asset="${a.id}"] img`);await img.scrollIntoViewIfNeeded();await img.evaluate(el=>el.decode());
    const m=await img.evaluate(el=>{const r=el.getBoundingClientRect();return {width:r.width,height:r.height,source:el.currentSrc,fit:getComputedStyle(el).objectFit,sizes:el.sizes};});
    assert(Math.abs(m.width/m.height-(a.transparent?1:4/3))<.02);if(a.transparent)assert.equal(m.fit,'contain');assert.match(m.source,a.transparent?(m.width>256?/-512w\.png$/:/-256w\.png$/):/-800w\.webp$/);measured.push({id:a.id,...m});
   }
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.equal(await page.locator('[data-asset-state="error"]').count(),0);
   await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`${out}/${width}-${path.replaceAll('/','-').slice(1)}-viewport.png`});await page.screenshot({path:`${out}/${width}-${path.replaceAll('/','-').slice(1)}.png`,fullPage:true});
   report.push({width,height,path,measured});
  }
  // Phase 13: the story's strategies selector shows each tool's final artwork (ToggleCard `leading`).
  const strategies=story.scenes.flatMap(s=>s.steps).find(s=>s.type==='strategies');
  const sceneId=story.scenes.find(s=>s.steps.includes(strategies)).id;
  for(const format of ['cuento','comic']){
   const at=`${width}/${format}`;
   await page.goto(`${base}/historias/${story.id}/${format}?escena=${sceneId}`);await page.locator('h1').waitFor();
   for(let i=0;i<20&&!await page.getByRole('heading',{name:strategies.prompt,exact:true}).count();i++)await page.getByRole('button',{name:'Siguiente',exact:true}).click();
   const card=t=>page.getByRole('button',{name:new RegExp('^'+t.name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'))});
   for(const id of strategies.tools){
    const t=tools[id];const c=card(t);
    assert.equal(await c.count(),1,`${at} ${id}: one card`);
    const text=(await c.innerText()).replace(/\s+/g,' ').trim();
    assert(text.includes(t.name)&&text.includes(t.childText),`${at} ${id}: name and description kept`);
    assert.equal(await c.locator('[data-asset]').count(),1);
    const img=c.locator(`[data-leading] [data-asset="${t.illustration}"] img`);
    assert.equal(await img.count(),1,`${at} ${id}: artwork ${t.illustration}`);
    await img.evaluate(el=>el.decode());
    await page.waitForFunction(i=>document.querySelector(`[data-asset="${i}"]`)?.dataset.assetState==='cargado',t.illustration);
    const m=await img.evaluate(el=>{const r=el.getBoundingClientRect(),slot=el.closest('[data-leading]').getBoundingClientRect();return {w:r.width,h:r.height,fit:getComputedStyle(el).objectFit,alt:el.getAttribute('alt'),src:el.currentSrc,hidden:el.closest('[data-leading]').getAttribute('aria-hidden'),inside:r.left>=slot.left-.5&&r.right<=slot.right+.5&&r.top>=slot.top-.5&&r.bottom<=slot.bottom+.5};});
    assert(m.w>=95&&m.w<=97&&Math.abs(m.w-m.h)<.5,`${at} ${id}: ${m.w}x${m.h}`);assert.equal(m.fit,'contain');assert(m.inside,`${at} ${id}: inside its slot`);
    assert.equal(m.alt,'');assert.equal(m.hidden,'true');assert.match(m.src,/-256w\.png$/);
    assert.equal(await c.locator('svg').count(),1,`${at} ${id}: icon replaced, check kept`);
    assert.equal(await c.getAttribute('aria-pressed'),'false');
   }
   const [first,second]=strategies.tools.map(id=>card(tools[id]));
   await page.locator('[aria-label="Contenido de la escena"]').focus();await page.keyboard.press('Tab');
   assert(await first.evaluate(el=>el===document.activeElement&&el.matches(':focus-visible')&&getComputedStyle(el).outlineStyle!=='none'),`${at}: Tab to the first tool`);
   await page.keyboard.press('Enter');assert.equal(await first.getAttribute('aria-pressed'),'true');
   await page.keyboard.press('Enter');assert.equal(await first.getAttribute('aria-pressed'),'false');
   await page.keyboard.press('Enter');await second.click();
   for(const c of [first,second])assert.equal(await c.getAttribute('aria-pressed'),'true');
   await page.goto(`${base}/historias/${story.id}/${format}?continuar=1`);await page.getByRole('heading',{name:strategies.prompt,exact:true}).waitFor();
   for(const c of [first,second])assert.equal(await c.getAttribute('aria-pressed'),'true',`${at}: selection restored`);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await page.locator('[aria-label="Contenido de la escena"]').evaluate(el=>el.scrollTop=0);
   await page.screenshot({path:`${out}/${width}-${format}-estrategias.png`});
   report.push({width,height,path:`${format}: estrategias`,tools:strategies.tools.map(id=>tools[id].illustration)});
  }
  assert.deepEqual(errors,[]);await ctx.close();
 }
}finally{await browser.close();}
writeFileSync(out+'/results.json',JSON.stringify(report,null,2)+'\n');console.log('PASS 13 assets / 39 files, hashes, decode, formats, dimensions, alpha, variants; 7 tools in the adult guide and the strategies selector (cuento + cómic) at three viewports');
