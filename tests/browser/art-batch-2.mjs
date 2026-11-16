// Revisión reproducible del lote: escenas, composiciones verticales, bocadillos y fuentes responsive.
import {createRequire} from 'node:module';
import {mkdirSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {assets} from '../../src/content/assets/index.ts';
import {unaMananaDiferente as story} from '../../src/content/stories/una-manana-diferente/story.ts';
const require=createRequire(process.env.NUBI_BROWSER_TOOLS+'/package.json');
const {chromium}=require('playwright');const base=process.env.NUBI_URL||'http://127.0.0.1:5173';
const out=process.env.NUBI_ART_EVIDENCE||'/tmp/nubi-art-batch-2';mkdirSync(out,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});const results=[];
try{for(const [width,height,dpr] of [[390,844,2],[820,1180,1],[1180,820,1]]){
 const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:dpr,reducedMotion:'reduce'});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const asset of Object.values(assets).filter(a=>a.kind==='escena'&&a.status==='listo')){
  const scene=story.scenes.find(s=>s.steps.some(st=>st.type==='beat'&&st.illustration===asset.id));
  const index=scene.steps.findIndex(st=>st.type==='beat'&&st.illustration===asset.id);
  await page.goto(`${base}/historias/${story.id}/cuento?escena=${scene.id}`);await page.locator('h1').waitFor();
  for(let i=0;i<index;i++)await page.getByRole('button',{name:'Siguiente',exact:true}).click();
  const image=page.locator(`[data-asset="${asset.id}"] img`).first();await image.waitFor();await image.evaluate(i=>i.decode());await page.waitForTimeout(180);
  const r=await image.evaluate(i=>{const b=i.getBoundingClientRect();return {src:i.currentSrc,width:b.width,height:b.height,fit:getComputedStyle(i).objectFit};});
  const portrait=height>width;assert.equal(r.src.includes('-vertical'),portrait,asset.id);
  assert(Math.abs(r.width/r.height-(portrait?.75:16/9))<.015,`${width}/${asset.id}: recorte`);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  const next=page.getByRole('button',{name:'Siguiente',exact:true});assert(await next.isVisible());
  const text=scene.steps[index].text;assert((await page.locator('[aria-label="Contenido de la escena"]').innerText()).includes(text),asset.id);
  assert.equal(await page.locator('[data-asset-state="error"]').count(),0);
  await page.screenshot({path:`${out}/${width}-${asset.id}.jpg`,type:'jpeg',quality:85,fullPage:true});results.push({viewport:{width,height,dpr},id:asset.id,image:r});
 }
 await page.goto(`${base}/historias/${story.id}/comic`);await page.locator('[data-asset="ume-k1-1"] img').evaluate(i=>i.decode());await page.waitForTimeout(1200);
 await page.screenshot({path:`${out}/${width}-comic.jpg`,type:'jpeg',quality:88,fullPage:true});
 for (const text of ['¡Que tengas un buen día, Teo!', 'Primero, mates con Carmen.']) {
  const matches = await page.getByText(text,{exact:true}).all();
  const visible = await Promise.all(matches.map(m => m.isVisible()));
  assert.equal(visible.filter(Boolean).length, 1, text);
 }
 assert.equal(await page.locator('[data-asset-state="error"]').count(),0);
 results.push({width,comic:'loaded; both bubbles visible'});
 await page.goto(base);await page.locator('[data-asset="nubi-saludo"] img').evaluate(i=>i.decode());
 const nubiSrc=await page.locator('[data-asset="nubi-saludo"] img').evaluate(i=>i.currentSrc);
 if(width===390)assert(nubiSrc.includes('-512w.png'),nubiSrc);
 results.push({width,nubiSrc});assert.deepEqual(errors,[]);
 console.log(`PASS ${width}: 10 escenas, orientación, proporción, texto, controles, cómic y Nubi`);await context.close();
}}finally{writeFileSync(`${out}/results.json`,JSON.stringify(results,null,2)+'\n');await browser.close();}
