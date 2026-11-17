import { createRequire } from 'node:module';
const require = createRequire(process.env.NUBI_BROWSER_TOOLS + '/package.json');
const { chromium } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;
import assert from 'node:assert/strict';
const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});try {
 const c=await b.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});const p=await c.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
 // Fase 19: dos funciones + Ajustes + páginas de compatibilidad de rutas antiguas + 404.
 for(const path of ['/historias','/historias/una-manana-diferente','/acompanar','/acompanar/una-manana-diferente','/mundo','/recreaciones','/herramientas/pedir-ayuda','/emociones','/familias','/ajustes','/inexistente']){
  await p.goto('http://127.0.0.1:5173'+path);await p.locator('h1').waitFor();
  const results=await new AxeBuilder({page:p}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
  console.log(path,await p.locator('h1').innerText(),JSON.stringify(results.violations.map(x=>({id:x.id,nodes:x.nodes.map(n=>n.target)}))));
  assert.equal(results.violations.length, 0, JSON.stringify(results.violations.map(v=>v.id)));
  assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 }
 assert.equal(errors.length,0);await c.close();
}finally{await b.close();}
