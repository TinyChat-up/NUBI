// Fase 17: adaptación de las pantallas rediseñadas, imágenes y controles reales.
// Sin dependencias nuevas: Playwright + axe se instalan fuera del proyecto.
import {createRequire} from 'node:module';
import {mkdirSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const require=createRequire(process.env.NUBI_BROWSER_TOOLS+'/package.json');
const {chromium}=require('playwright');const AxeBuilder=require('@axe-core/playwright').default;
const base=process.env.NUBI_URL||'http://127.0.0.1:5173';
const out=process.env.NUBI_EVIDENCE||'/tmp/nubi-ux-redesign';mkdirSync(out,{recursive:true});
const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
const results=[],failures=[];
const paths=['/','/mundo','/historias','/historias/una-manana-diferente','/emociones','/herramientas','/herramientas/pedir-ayuda','/ajustes'];
try{
 for(const [width,height] of [[390,844],[820,1180],[1180,820],[320,256],[640,512]]){
  for(const textSize of ['m','xl']){
   const ctx=await b.newContext({viewport:{width,height},reducedMotion:'reduce'});
   await ctx.addInitScript(s=>localStorage.setItem('nubi.v1.settings',JSON.stringify({textSize:s,contrast:'high',motion:'reduced',shortText:true,spacing:'normal',font:'nunito',letterCase:'normal',subtitles:true,deviceVoice:false,voiceRate:.9})),textSize);
   const p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
   for(const path of paths){
    await p.goto(base+path);await p.locator('h1').waitFor();await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(150);
    const key=`${width}-${textSize}-${path==='/'?'portada':path.replaceAll('/','-').slice(1)}`;
    const metrics=await p.evaluate(()=>{
     const visible=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
     const controls=[...document.querySelectorAll('button,a,summary')].filter(visible).filter(e=>!e.classList.contains('skip-link'));
     return {overflow:document.documentElement.scrollWidth>innerWidth,small:controls.filter(e=>{const r=e.getBoundingClientRect();return r.width<47.5||r.height<47.5;}).map(e=>({text:e.textContent.trim(),w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height})),h1:document.querySelectorAll('h1').length};
    });
    const axe=await new AxeBuilder({page:p}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
    const violations=axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}));
    results.push({key,...metrics,violations});
    if(metrics.overflow||metrics.small.length||metrics.h1!==1||violations.length)failures.push({key,...metrics,violations});
    if(width<=640)await p.screenshot({path:`${out}/${key}.png`});
   }
   assert.deepEqual(errors,[]);await ctx.close();
  }
 }
 // DPR 1/2: arte íntegro, sin duplicar nombres, y recursos de suficiente resolución.
 for(const dpr of [1,2]){
  const ctx=await b.newContext({viewport:{width:820,height:1180},deviceScaleFactor:dpr,reducedMotion:'reduce'}),p=await ctx.newPage();
  for(const path of ['/','/mundo','/emociones','/herramientas','/historias/una-manana-diferente']){
   await p.goto(base+path);await p.locator('h1').waitFor();
   for(const img of await p.locator('[data-asset] img').all()){
    await img.scrollIntoViewIfNeeded();await img.evaluate(i=>i.decode());
    const r=await img.evaluate(i=>({id:i.closest('[data-asset]').dataset.asset,width:i.getBoundingClientRect().width,height:i.getBoundingClientRect().height,fit:getComputedStyle(i).objectFit,src:i.currentSrc,alt:i.alt}));
    assert.equal(r.fit,'contain',r.id);
    const originalWidth=await p.evaluate(async id=>(await import('/src/content/assets/index.ts')).assets[id].size.width,r.id);
    const sourceWidth=Number(/-(\d+)w\./.exec(r.src)?.[1]||originalWidth);
    assert(sourceWidth>=Math.min(originalWidth,r.width*dpr)-1,`${r.id}: ${sourceWidth}px for ${r.width}px @${dpr}`);
    results.push({path,dpr,image:r});
   }
  }
  await ctx.close();
 }
}finally{writeFileSync(out+'/results.json',JSON.stringify({results,failures},null,2));await b.close();}
assert.deepEqual(failures,[]);console.log('PASS 80 pantallas: 5 viewports × 2 tamaños de letra × 8 rutas; contraste alto, movimiento reducido, textos cortos, axe, objetivos ≥48px; 10 recorridos de imágenes DPR 1/2');
