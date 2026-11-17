import {createRequire} from 'node:module';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {assets} from '../../src/content/assets/index.ts';
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
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
  await page.goto(base);
  const decoded=await page.evaluate(async files=>{
   const result=[];
   for(const f of files){const im=new Image();im.src=f.file;await im.decode();const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(im,0,0);const d=g.getImageData(0,0,c.width,c.height).data;let lo=255,hi=0;for(let i=3;i<d.length;i+=4){lo=Math.min(lo,d[i]);hi=Math.max(hi,d[i]);}result.push({file:f.file,size:[im.naturalWidth,im.naturalHeight],alpha:[lo,hi]});}return result;
  },files);
  decoded.forEach((r,i)=>{assert.deepEqual(r.size,files[i].size);if(files[i].transparent)assert(r.alpha[0]===0&&r.alpha[1]>=250);else assert.deepEqual(r.alpha,[255,255]);});
  for(const path of ['/mundo','/herramientas',...selected.filter(a=>a.transparent).map(a=>'/herramientas/'+a.id.slice(5))]){
   await page.goto(base+path);await page.locator('h1').waitFor();
   const ids=path==='/mundo'?selected.filter(a=>!a.transparent):path==='/herramientas'?selected.filter(a=>a.transparent):selected.filter(a=>path.endsWith(a.id.slice(5)));
   const measured=[];
   for(const a of ids){const img=page.locator(`[data-asset="${a.id}"] img`);await img.scrollIntoViewIfNeeded();await img.evaluate(el=>el.decode());
    const m=await img.evaluate(el=>{const r=el.getBoundingClientRect();return {width:r.width,height:r.height,source:el.currentSrc,fit:getComputedStyle(el).objectFit,sizes:el.sizes};});
    assert(Math.abs(m.width/m.height-(a.transparent?1:4/3))<.02);if(a.transparent)assert.equal(m.fit,'contain');assert.match(m.source,a.transparent?/-256w\.png$/:/-800w\.webp$/);measured.push({id:a.id,...m});
   }
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.equal(await page.locator('[data-asset-state="error"]').count(),0);
   await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`${out}/${width}-${path.replaceAll('/','-').slice(1)}-viewport.png`});await page.screenshot({path:`${out}/${width}-${path.replaceAll('/','-').slice(1)}.png`,fullPage:true});
   report.push({width,height,path,measured});
  }
  assert.deepEqual(errors,[]);await ctx.close();
 }
}finally{await browser.close();}
writeFileSync(out+'/results.json',JSON.stringify(report,null,2)+'\n');console.log('PASS 13 assets / 39 files, hashes, decode, formats, dimensions, alpha, variants and 27 screen checks at three viewports');
