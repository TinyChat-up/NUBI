import { createRequire } from 'node:module';
const require = createRequire(process.env.NUBI_BROWSER_TOOLS + '/package.json');
const { chromium } = require('playwright');
import assert from 'node:assert/strict';
const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
try {
for (const local of [false,true]) {
 const c=await b.newContext();
 await c.addInitScript(local=>{
   window.__spoken=0;window.__canceled=0;
   Object.defineProperty(window,'speechSynthesis',{value:{addEventListener:()=>{},removeEventListener:()=>{},getVoices:()=>[{lang:'es-ES',localService:local}],speak:u=>{window.__spoken++;window.__last=u;},cancel:()=>{window.__canceled++;}}});
   window.SpeechSynthesisUtterance=class { constructor(t){this.text=t;} };
 },local);
 const p=await c.newPage();await p.goto('http://127.0.0.1:5173/');
 await p.evaluate(()=>localStorage.setItem('nubi.v1.settings',JSON.stringify({playerMode:'escuchar',subtitles:false})));
 await p.goto('http://127.0.0.1:5173/historias/una-manana-diferente/cuento');
 await p.getByRole('button',{name:'Modo leer activado. Cambiar a escuchar',exact:true}).waitFor();
 assert.equal(await p.evaluate(()=>window.__spoken),0);
 await p.getByRole('button',{name:'Modo leer activado. Cambiar a escuchar',exact:true}).click();
 if(local){
  assert.equal(await p.evaluate(()=>window.__spoken),1);
  await p.evaluate(()=>window.__last.onerror());
 }
 await p.getByRole('status').waitFor();
 assert.match(await p.locator('[aria-label="Contenido de la escena"]').innerText(),/Es martes/);
 await p.getByRole('button',{name:'Modo escuchar activado. Cambiar a leer',exact:true}).click();
 assert((await p.evaluate(()=>window.__canceled))>0);
 console.log('PASS narración:',local?'voz local, error asíncrono y detener':'rechazo de voz remota y alternativa textual');
 await c.close();
}
}finally{await b.close();}
