// Sonda de reajuste con zoom (WCAG 1.4.10), SOLO DIAGNÓSTICO: mide y no falla.
// Emula el zoom del navegador con el viewport equivalente en px CSS:
//   200 % de 1280×1024 → 640×512 · 400 % de 1280×1024 → 320×256 · 400 % de 1280×2272 → 320×568.
// No sustituye la prueba con zoom real del sistema (ver docs/review/MANUAL_ACCESSIBILITY_PROTOCOL.md).
// Informa del desbordamiento horizontal y del alto útil que dejan cabecera y controles fijos.
// Uso: NUBI_BROWSER_TOOLS=… CHROMIUM_PATH=… node tests/browser/reflow-probe.mjs  (Vite en 127.0.0.1:5173)
import { createRequire } from 'node:module';
const require = createRequire(process.env.NUBI_BROWSER_TOOLS + '/package.json');
const { chromium } = require('playwright');
const base = process.env.NUBI_URL || 'http://127.0.0.1:5173';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
const routes = ['/', '/mundo', '/historias', '/historias/una-manana-diferente', '/herramientas', '/herramientas/pedir-ayuda', '/emociones', '/ajustes',
  '/historias/una-manana-diferente/cuento', '/historias/una-manana-diferente/comic'];
const rows = [];
try {
  for (const [width, height, zoom] of [[640, 512, '200 %'], [320, 256, '400 %'], [320, 568, '400 % (vertical)']]) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    for (const route of routes) {
      await page.goto(base + route);
      await page.locator('h1').first().waitFor();
      await page.waitForTimeout(250);
      const m = await page.evaluate(() => {
        const stage = document.querySelector('[aria-label="Contenido de la escena"]');
        const bars = [...document.querySelectorAll('header,nav,footer')].filter(e => ['fixed', 'sticky'].includes(getComputedStyle(e).position) || (stage && e.matches('header,footer')));
        const barHeight = Math.round(bars.reduce((s, e) => s + e.getBoundingClientRect().height, 0));
        return { overflowX: document.documentElement.scrollWidth - innerWidth, useful: stage ? Math.round(stage.clientHeight) : innerHeight - barHeight, barHeight };
      });
      rows.push({ zoom, viewport: `${width}×${height}`, route, ...m });
    }
    await context.close();
  }
} finally { await browser.close(); }
for (const r of rows) console.log(`${r.zoom.padEnd(16)} ${r.viewport.padEnd(8)} ${r.route.padEnd(44)} desbordamiento ${r.overflowX} px · alto útil ${r.useful} px (barras ${r.barHeight} px)`);
const blocked = rows.filter(r => r.useful < 120);
console.log(`\nPantallas con menos de 120 px útiles: ${blocked.length}${blocked.length ? ' → ' + blocked.map(r => `${r.zoom} ${r.route}`).join(' | ') : ''}`);
