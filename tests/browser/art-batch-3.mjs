// All six choices and both narrative moments in the real player, with retained text.
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { unaMananaDiferente as story } from '../../src/content/stories/una-manana-diferente/story.ts';
const require = createRequire(process.env.NUBI_BROWSER_TOOLS + '/package.json');
const { chromium } = require('playwright');
const base = process.env.NUBI_URL || 'http://127.0.0.1:5173';
const out = process.env.NUBI_ART_EVIDENCE || '/tmp/nubi-art-batch-3';
mkdirSync(out, { recursive: true });
const options = story.scenes.flatMap(s => s.steps).find(s => s.type === 'choice').options;
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
const results = [];
try {
  for (const [width, height, dpr] of [[390, 844, 2], [820, 1180, 1], [1180, 820, 1]]) {
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: dpr, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('response', r => { if (r.url().includes('/media/') && r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
    const inspect = async id => {
      const box = page.locator(`[data-asset="${id}"]`).first();
      await box.scrollIntoViewIfNeeded();
      await box.locator('img').evaluate(i => i.decode());
      await page.waitForFunction(id => document.querySelector(`[data-asset="${id}"]`)?.dataset.assetState === 'cargado', id);
      const image = await box.locator('img').evaluate(i => {
        const r = i.getBoundingClientRect();
        return { src: i.currentSrc, width: r.width, height: r.height, natural: [i.naturalWidth, i.naturalHeight], fit: getComputedStyle(i).objectFit, srcset: i.srcset };
      });
      assert(Math.abs(image.width / image.height - 4 / 3) < .015, `${width}/${id}: crop`);
      assert(image.srcset.includes('800w') && image.srcset.includes('1200w'), id);
      assert(!image.src.includes('-vertical'), id);
      assert.equal(await page.locator('[data-asset-state="error"]').count(), 0);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      results.push({ width, height, dpr, id, image });
      return box;
    };
    await page.goto(`${base}/historias/${story.id}/cuento?escena=posibilidades`);
    await page.getByRole('button', { name: 'Siguiente', exact: true }).click();
    for (const option of options) {
      await inspect(option.illustration);
      await page.getByRole('button', { name: option.label, exact: false }).screenshot({ path: `${out}/${width}-choice-${option.id}.jpg`, type: 'jpeg', quality: 86 });
    }
    await page.locator('[aria-label="Contenido de la escena"]').evaluate(e => e.scrollTo(0, 0));
    await page.screenshot({ path: `${out}/${width}-choices.jpg`, type: 'jpeg', quality: 86, fullPage: true });
    for (const option of options) {
      await page.getByRole('button', { name: option.label, exact: false }).click();
      await page.getByRole('heading', { name: option.label, exact: true }).waitFor();
      const stage = page.locator('[aria-label="Contenido de la escena"]');
      for (const moment of option.consequence.story) {
        const box = await inspect(moment.illustration);
        assert((await stage.innerText()).includes(moment.text), `${width}/${moment.illustration}: narrative`);
        await box.locator('..').screenshot({ path: `${out}/${width}-${moment.illustration}.jpg`, type: 'jpeg', quality: 86 });
      }
      await page.getByRole('button', { name: /Probar otra decisión/  /* fase 19: antes «Probar otra posibilidad» */ }).click();
      await page.getByRole('heading', { name: '¿Qué podría hacer Teo?', exact: true }).waitFor();
    }
    assert.deepEqual(errors, []);
    console.log(`PASS ${width}: six choices, twelve moments, 4:3 without crop, responsive sources, exact narrative text and return navigation`);
    await context.close();
  }
} finally {
  writeFileSync(`${out}/results.json`, JSON.stringify(results, null, 2) + '\n');
  await browser.close();
}
