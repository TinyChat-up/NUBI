// Verificación de integración de ilustraciones definitivas (docs/ILLUSTRATION_INTEGRATION.md).
// Herramientas externas opcionales, igual que quality.mjs: NUBI_BROWSER_TOOLS, CHROMIUM_PATH, NUBI_URL.
//
// Recorre las pantallas con ilustraciones en 390 / 820 / 1180 px y falla si:
//  - un recurso marcado `listo` no carga (404 o error de decodificación),
//  - una ilustración narrativa (escena, viñeta, opción) queda recortada,
//  - hay desbordamiento horizontal o errores de página.
// Los recortes de fondos decorativos (portada) y cubiertas se informan, pero no fallan.
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const require = createRequire(process.env.NUBI_BROWSER_TOOLS + '/package.json');
const { chromium } = require('playwright');
const base = process.env.NUBI_URL || 'http://127.0.0.1:5173';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
const DECORATIVE = /^(portada-fondo|ume-cover|place-)/;
const failures = [];
const totals = { cargado: 0, provisional: 0, error: 0 };

try {
  for (const [width, height] of [[390, 844], [820, 1180], [1180, 820]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    const broken = [];
    page.on('pageerror', (e) => failures.push(`${width}: error de página ${e.message}`));
    page.on('response', (r) => { if (r.url().includes('/media/') && r.status() >= 400) broken.push(`${r.status()} ${r.url()}`); });
    const next = async () => { await page.getByRole('button', { name: 'Siguiente', exact: true }).click(); await page.waitForTimeout(250); };
    const inspect = async (name) => {
      await page.waitForTimeout(900);
      const r = await page.evaluate(() => {
        const states = {}; const cropped = [];
        for (const el of document.querySelectorAll('[data-asset-state]')) states[el.dataset.assetState] = (states[el.dataset.assetState] || 0) + 1;
        for (const img of document.querySelectorAll('[data-asset] img')) {
          const b = img.getBoundingClientRect(); if (!b.width || !img.naturalWidth) continue;
          const box = b.width / b.height, nat = img.naturalWidth / img.naturalHeight;
          if (getComputedStyle(img).objectFit === 'cover' && Math.abs(box / nat - 1) > 0.02) cropped.push(img.closest('[data-asset]').dataset.asset);
        }
        return { states, cropped, overflow: document.documentElement.scrollWidth > innerWidth };
      });
      for (const k of Object.keys(totals)) totals[k] += r.states[k] || 0;
      const narrative = r.cropped.filter((id) => !DECORATIVE.test(id));
      if (narrative.length) failures.push(`${width}/${name}: ilustración narrativa recortada: ${narrative.join(', ')}`);
      if (r.states.error) failures.push(`${width}/${name}: ${r.states.error} recurso(s) listos con error de carga`);
      if (r.overflow) failures.push(`${width}/${name}: desbordamiento horizontal`);
      console.log(`${width} ${name}`, JSON.stringify(r.states), r.cropped.length ? `recortes: ${r.cropped.join(', ')}` : '');
    };
    const story = '/historias/una-manana-diferente';
    await page.goto(base + '/'); await inspect('portada');
    await page.goto(base + '/mundo'); await inspect('mundo');
    await page.goto(base + story); await inspect('ficha');
    await page.goto(base + story + '/cuento'); await inspect('cuento');
    await page.goto(base + story + '/cuento?escena=cambio');
    for (let i = 0; i < 6; i++) { await next(); await inspect(`cuento-cambio-${i + 1}`); }
    await page.goto(base + story + '/cuento?escena=posibilidades'); await next(); await inspect('decision');
    await page.getByRole('button', { name: /Salir de clase sin avisar/ }).click(); await inspect('consecuencia');
    await page.goto(base + story + '/comic?escena=cambio');
    for (let i = 0; i < 4; i++) { await inspect(`comic-${i + 1}`); await next(); }
    for (const path of ['/recreaciones', '/herramientas', '/herramientas/descansar', '/emociones']) { await page.goto(base + path); await inspect(path); }
    if (broken.length) failures.push(`${width}: recursos con error HTTP: ${broken.join(', ')}`);
    await page.close();
  }
} finally {
  await browser.close();
}
console.log('Estados de recursos vistos:', JSON.stringify(totals));
assert.equal(failures.length, 0, failures.join('\n'));
console.log('PASS integración de ilustraciones (390/820/1180)');
