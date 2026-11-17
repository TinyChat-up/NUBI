// Capturas reproducibles de 14 estados reales; solo escribe en NUBI_EVIDENCE.
import {createRequire} from 'node:module';
import {mkdirSync,writeFileSync} from 'node:fs';
const require=createRequire(process.env.NUBI_BROWSER_TOOLS+'/package.json');const {chromium}=require('playwright');
const base=process.env.NUBI_URL||'http://127.0.0.1:5173',out=process.env.NUBI_EVIDENCE||'/tmp/nubi-ux-captures';mkdirSync(out,{recursive:true});
const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});const report=[];
for(const [width,height] of [[390,844],[820,1180],[1180,820]]){
 const c=await b.newContext({viewport:{width,height},reducedMotion:'reduce'}),p=await c.newPage();
 const go=async(path)=>{await p.goto(base+path);await p.locator('h1').waitFor();};
 const next=()=>p.getByRole('button',{name:'Siguiente',exact:true}).click();
 const snap=async(name)=>{await p.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>{});} ));});await p.waitForTimeout(120);await p.screenshot({path:`${out}/${width}-${name}-viewport.png`});await p.screenshot({path:`${out}/${width}-${name}.png`,fullPage:true});report.push({width,height,name,overflow:await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),text:await p.locator('body').innerText()});};
 const story='/historias/una-manana-diferente';
 for(const [name,path] of [['01-portada','/'],['02-mundo','/mundo'],['03-biblioteca','/historias'],['04-ficha',story],['05-cuento',story+'/cuento'],['06-comic',story+'/comic'],['11-emociones','/emociones'],['12-herramientas','/herramientas'],['13-ajustes','/ajustes'],['14-ficha-herramienta','/herramientas/pedir-ayuda']]){await go(path);await snap(name);}
 await go(story+'/cuento?escena=cambio');for(let i=0;i<15&&!await p.getByRole('button',{name:'No lo sé',exact:true}).count();i++)await next();await snap('07-selector-emociones');
 await go(story+'/cuento?escena=posibilidades');await next();await snap('08-decisiones');await p.getByRole('button',{name:/Buscar a un adulto de confianza/}).click();await snap('09-consecuencias');
 for(let i=0;i<30&&!await p.getByRole('button',{name:/^Pedir ayuda/}).count();i++)await next();await snap('10-selector-herramientas');
 await c.close();
}
writeFileSync(`${out}/capture.json`,JSON.stringify(report,null,2));await b.close();
