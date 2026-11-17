// Precarga del cuento: se descarga solo lo que se muestra, con la composición y la variante que se usan.
// Recorre el cuento entero (explorando las seis consecuencias) en 390×844, 820×1180 y 1180×820, DPR 1 y 2,
// con caché vacía, y falla si:
//  - se descarga una escena u opción que nunca se muestra (p. ej. la 16:9 cuando <picture> usa la 3:4),
//  - un archivo se pide dos veces,
//  - en vertical una escena no usa su composición 3:4, o en horizontal la usa,
//  - con DPR 1, una imagen mostrada no es la variante más pequeña que cubre su ancho (la precarga anunció otro `sizes`).
// Uso: NUBI_BROWSER_TOOLS=… CHROMIUM_PATH=… node tests/browser/story-preload.mjs  (Vite en 127.0.0.1:5173)
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { unaMananaDiferente as story } from '../../src/content/stories/una-manana-diferente/story.ts';
import { assets } from '../../src/content/assets/index.ts';
const require = createRequire(process.env.NUBI_BROWSER_TOOLS + '/package.json');
const { chromium } = require('playwright');
const base = process.env.NUBI_URL || 'http://127.0.0.1:5173';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
const pathOf = url => decodeURIComponent(new URL(url).pathname);
const MEDIA = /\/media\/stories\/[^/]+\/(scenes|options)\//;
const options = story.scenes.flatMap(s => s.steps).find(s => s.type === 'choice').options;

// Candidatos de cada archivo servido: [ancho, ruta] de su srcset (horizontal o vertical).
const candidatesOf = {};
const variant = (file, w) => file.replace(/\.(\w+)$/, `-${w}w.$1`);
for (const a of Object.values(assets)) for (const source of [a, a.portrait].filter(Boolean)) {
  const list = [...(source.variants ?? []).map(w => [w, variant(source.file, w)]), [source.size.width, source.file]].sort((x, y) => x[0] - y[0]);
  for (const [, file] of list) candidatesOf[file] = list;
}

try {
  for (const [width, height] of [[390, 844], [820, 1180], [1180, 820]]) {
    for (const dpr of [1, 2]) {
      const label = `${width}×${height}@${dpr}`;
      const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: dpr, reducedMotion: 'reduce' });
      const page = await context.newPage();
      const requested = [];
      const errors = [];
      page.on('request', r => { const p = pathOf(r.url()); if (MEDIA.test(p)) requested.push(p); });
      page.on('pageerror', e => errors.push(e.message));
      const shown = new Map(); // ruta → anchos mostrados
      const collect = async () => {
        await page.waitForTimeout(150);
        // Fase 20: las imágenes de un <details> cerrado (apoyos desplegables, fase 19) no se muestran ni se cargan
        // (lazy): decode() no se resolvería nunca. Se excluyen; siguen contando si se descargaran sin mostrarse.
        const imgs = await page.locator('[aria-label="Contenido de la escena"] img').evaluateAll(list => Promise.all(list.filter(i => !i.closest('details:not([open])')).map(async i => {
          try { await i.decode(); } catch { /* imagen aún no visible */ }
          return { src: decodeURIComponent(new URL(i.currentSrc || i.src).pathname), width: i.getBoundingClientRect().width, scene: !!i.closest('[data-asset^="ume-s"]'), thumb: i.getBoundingClientRect().width < 200 };
        })));
        for (const i of imgs) if (MEDIA.test(i.src)) {
          shown.set(i.src, [...(shown.get(i.src) ?? []), i]);
          if (i.scene && !i.thumb) assert.equal(i.src.includes('-vertical'), height > width, `${label}: ${i.src} no es la composición de esta orientación`);
        }
      };
      await page.goto(`${base}/historias/${story.id}/cuento`);
      await page.locator('h1').waitFor();
      for (let n = 0; n < 60; n++) {
        await collect();
        if (await page.getByRole('button', { name: 'Salir', exact: true }).count()) break;
        if (await page.locator('#choice-hint').count()) {
          for (const [k, o] of options.entries()) {
            await page.getByRole('button', { name: o.label, exact: false }).click();
            await page.getByRole('heading', { name: o.label, exact: true }).waitFor();
            await collect();
            if (k < options.length - 1) { await page.getByRole('button', { name: /Probar otra decisión/  /* fase 19: antes «Probar otra posibilidad» */ }).click(); await collect(); }
          }
        }
        await page.getByRole('button', { name: 'Siguiente', exact: true }).click();
      }
      await page.waitForTimeout(500);
      const unused = [...new Set(requested)].filter(p => !shown.has(p));
      assert.deepEqual(unused, [], `${label}: descargadas y nunca mostradas`);
      const twice = Object.entries(requested.reduce((m, p) => (m[p] = (m[p] ?? 0) + 1, m), {})).filter(([, c]) => c > 1).map(([p]) => p);
      assert.deepEqual(twice, [], `${label}: pedidas dos veces`);
      if (dpr === 1) {
        for (const [src, views] of shown) {
          const list = candidatesOf[src];
          assert(list, `${label}: ${src} sin registro`);
          const widest = Math.max(...views.map(v => v.width));
          const best = (list.find(([w]) => w >= widest) ?? list.at(-1))[1];
          assert.equal(src, best, `${label}: se muestra ${src.split('/').pop()} a ${Math.round(widest)} px; bastaba ${best.split('/').pop()}`);
        }
      }
      assert.deepEqual(errors, []);
      console.log(`PASS ${label}: ${shown.size} archivos mostrados, ninguno descargado de más ni dos veces${dpr === 1 ? ', variante óptima' : ''}`);
      await context.close();
    }
  }
} finally { await browser.close(); }
