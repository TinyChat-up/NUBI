// Páginas de cuento: el texto cabe sin desplazar, la ilustración no se recorta y no cambia de tamaño
// entre páginas seguidas que la comparten. Con letra al 125 % se permite desplazar (nunca tapar).
// Uso: NUBI_BROWSER_TOOLS=… CHROMIUM_PATH=… node tests/browser/story-fit.mjs  (Vite en 127.0.0.1:5173)
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const require = createRequire(process.env.NUBI_BROWSER_TOOLS + '/package.json');
const { chromium } = require('playwright');
const base = process.env.NUBI_URL || 'http://127.0.0.1:5173';
const scenes = ['llegada', 'cambio', 'saber', 'posibilidades', 'estrategias', 'cierre'];
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
try {
  for (const textSize of ['m', 'xl']) {
    for (const [width, height, dpr] of [[390, 844, 2], [820, 1180, 1], [1180, 820, 1]]) {
      const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: dpr, reducedMotion: 'reduce', hasTouch: width < 1000 });
      await context.addInitScript((t) => localStorage.setItem('nubi.v1.settings', JSON.stringify({ textSize: t })), textSize);
      const page = await context.newPage();
      const rows = [];
      for (const scene of scenes) {
        await page.goto(`${base}/historias/una-manana-diferente/cuento?escena=${scene}`);
        await page.locator('h1').waitFor();
        for (let i = 0; i < 8; i++) {
          await page.waitForTimeout(250);
          const m = await page.evaluate(() => {
            const stage = document.querySelector('[aria-label="Contenido de la escena"]');
            const fig = stage.querySelector('article [data-asset]');
            if (!fig) return null;
            const img = fig.querySelector('img');
            const r = fig.getBoundingClientRect();
            return { id: fig.dataset.asset, w: Math.round(r.width), h: Math.round(r.height), ratio: r.width / r.height, nat: img?.naturalWidth ? img.naturalWidth / img.naturalHeight : null, overflow: stage.scrollHeight - stage.clientHeight };
          });
          if (!m) break;
          rows.push({ scene, i, ...m });
          await page.getByRole('button', { name: 'Siguiente', exact: true }).click();
        }
      }
      const label = `${width}×${height} letra=${textSize}`;
      assert(rows.length >= 20, `${label}: solo ${rows.length} páginas`);
      for (const r of rows) {
        assert(r.w > 0 && r.h > 0, `${label} ${r.id}: ilustración sin tamaño`);
        if (r.nat) assert(Math.abs(r.ratio - r.nat) < 0.02, `${label} ${r.id}: proporción alterada (recorte)`);
        if (textSize === 'm') assert(r.overflow <= 1, `${label} ${r.scene}#${r.i}: el texto no cabe (+${r.overflow}px)`);
      }
      for (let k = 1; k < rows.length; k++) {
        const [a, b] = [rows[k - 1], rows[k]];
        if (a.scene === b.scene && a.id === b.id) assert(a.w === b.w && a.h === b.h, `${label} ${b.id}: la imagen cambia de tamaño entre páginas (${a.w}×${a.h} → ${b.w}×${b.h})`);
      }
      const ws = rows.map((r) => r.w);
      console.log(`PASS ${label}: ${rows.length} páginas · imagen ${Math.min(...ws)}–${Math.max(...ws)} px · desplazan ${rows.filter((r) => r.overflow > 1).length}`);
      await context.close();
    }
  }
} finally {
  await browser.close();
}
