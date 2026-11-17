// Selección de resolución del cómic: cada viñeta descarga la variante adecuada a su ancho real, una sola vez.
// Recorre las 15 viñetas en 390×844, 820×1180 y 1180×820, con DPR 1 y 2 y caché vacía, y falla si:
//  - el ancho medido no coincide con el modelo de comicLayout.ts (la rejilla cambió sin actualizar `sizes`),
//  - currentSrc no es la variante más pequeña que cubre ancho × DPR (sizes exagera o se queda corto),
//  - una viñeta descarga más de un archivo (la precarga eligió otra variante).
// Uso: NUBI_BROWSER_TOOLS=… CHROMIUM_PATH=… node tests/browser/comic-sizes.mjs  (Vite en 127.0.0.1:5173)
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { unaMananaDiferente as story } from '../../src/content/stories/una-manana-diferente/story.ts';
import { assets } from '../../src/content/assets/index.ts';
import { comicPanelWidth } from '../../src/components/player/comicLayout.ts';
const require = createRequire(process.env.NUBI_BROWSER_TOOLS + '/package.json');
const { chromium } = require('playwright');
const base = process.env.NUBI_URL || 'http://127.0.0.1:5173';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
const fileOf = url => decodeURIComponent(new URL(url).pathname).split('/').pop();
const stem = name => name.replace(/(-\d+w)?\.webp$/, '');
const widthOf = (name, asset) => Number(/-(\d+)w\.webp$/.exec(name)?.[1] ?? asset.size.width);
try {
  for (const [width, height] of [[390, 844], [820, 1180], [1180, 820]]) {
    for (const dpr of [1, 2]) {
      const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: dpr, reducedMotion: 'reduce' });
      const page = await context.newPage();
      const requested = [];
      page.on('request', r => { if (r.url().includes('/comic/')) requested.push(fileOf(r.url())); });
      const chosen = [];
      for (const scene of story.scenes.filter(s => s.comic)) {
        await page.goto(`${base}/historias/${story.id}/comic?escena=${scene.id}`);
        await page.locator('h1').waitFor();
        for (const [index, panel] of scene.comic.entries()) {
          if (index) await page.getByRole('button', { name: 'Siguiente', exact: true }).click();
          const img = page.locator(`li[aria-current="step"] [data-asset="${panel.illustration}"] img`);
          await img.evaluate(i => i.decode());
          const shown = await img.evaluate(i => ({ width: i.getBoundingClientRect().width, src: i.currentSrc }));
          const asset = assets[panel.illustration];
          const label = `${width}×${height}@${dpr} ${panel.illustration} (${panel.span ?? 'half'})`;
          const model = comicPanelWidth(panel.span, { width, height });
          assert(Math.abs(shown.width - model) <= 1, `${label}: mide ${shown.width} px, el modelo de sizes dice ${model} px`);
          const candidates = [...asset.variants, asset.size.width].sort((a, b) => a - b);
          const best = candidates.find(c => c >= shown.width * dpr) ?? candidates.at(-1);
          assert.equal(widthOf(fileOf(shown.src), asset), best, `${label}: currentSrc ${fileOf(shown.src)}, se esperaba la variante de ${best} px`);
          chosen.push(`${panel.illustration}→${best}`);
        }
      }
      await page.waitForTimeout(300);
      const perPanel = new Map();
      for (const name of requested) perPanel.set(stem(name), new Set([...(perPanel.get(stem(name)) ?? []), name]));
      for (const [name, files] of perPanel) assert.equal(files.size, 1, `${width}×${height}@${dpr} ${name}: descargas ${[...files].join(', ')}`);
      assert.equal(perPanel.size, 15, `${width}×${height}@${dpr}: se esperaban 15 viñetas descargadas`);
      console.log(`PASS ${width}×${height}@${dpr}: 15 viñetas, variante óptima y una descarga por viñeta (${[...new Set(chosen.map(c => c.split('→')[1]))].join('/')} px)`);
      await context.close();
    }
  }
} finally { await browser.close(); }
