// Comprueba los archivos realmente entregados y sus variantes, sin depender del componente React.
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { assets } from '../../src/content/assets/index.ts';
const require = createRequire(process.env.NUBI_BROWSER_TOOLS + '/package.json');
const { chromium } = require('playwright');
const base = process.env.NUBI_URL || 'http://127.0.0.1:5173';
const manifest = JSON.parse(readFileSync(new URL('../../docs/art-direction/delivery.json', import.meta.url)));
const ready = Object.values(assets).filter(a => a.status === 'listo');
assert.deepEqual(ready.map(a => a.id).sort(), manifest.assets.map(a => a.id).sort());
const files = [];
for (const a of ready) {
 const m = manifest.assets.find(x => x.id === a.id);
 assert.equal(createHash('sha256').update(readFileSync(new URL('../../public' + a.file, import.meta.url))).digest('hex'), m.sha256);
 files.push({ id: a.id, path: a.file, width: a.size.width, height: a.size.height, transparent: a.transparent });
 for (const w of a.variants || []) {
   assert(w < a.size.width);
   const v=m.variants.find(x=>x.width===w);assert(v);
   files.push({ id: a.id, path: v.file, width: w, height: Math.round(a.size.height*w/a.size.width), transparent: a.transparent });
 }
}
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',args:['--no-sandbox']});
try {
 const page=await browser.newPage();await page.goto(base);
 const results=await page.evaluate(async files=>{
  const results=[];
  for(const f of files) {
    const image=new Image();image.src=f.path;await image.decode();
    const r={...f,actual:[image.naturalWidth,image.naturalHeight]};
    if(f.transparent){
      const c=document.createElement('canvas');c.width=image.naturalWidth;c.height=image.naturalHeight;const ctx=c.getContext('2d');ctx.drawImage(image,0,0);
      const pixels=ctx.getImageData(0,0,c.width,c.height).data;let min=255,max=0;
      for(let i=3;i<pixels.length;i+=4){min=Math.min(min,pixels[i]);max=Math.max(max,pixels[i]);}
      r.alpha=[min,max];
    }
    results.push(r);
  }
  return results;
 },files);
 for(const r of results){assert.deepEqual(r.actual,[r.width,r.height],r.path);if(r.transparent)assert(r.alpha[0]===0 && r.alpha[1]>=250,r.path);}
 if(process.env.NUBI_FILE_RESULTS)writeFileSync(process.env.NUBI_FILE_RESULTS,JSON.stringify(results,null,2)+'\n');
 console.log(`PASS ${ready.length} recursos listos / ${results.length} archivos: SHA256, decodificación, dimensiones y alfa`);
} finally{await browser.close();}
