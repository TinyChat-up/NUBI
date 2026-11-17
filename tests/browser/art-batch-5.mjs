// Phase 10: test real emotion artwork and preserve evidence without changing the UI.
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { assets } from '../../src/content/assets/index.ts';
const require = createRequire(process.env.NUBI_BROWSER_TOOLS + '/package.json');
const { chromium } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;
const base = process.env.NUBI_URL || 'http://127.0.0.1:5174';
const out = new URL('../../docs/art-batch-5/previews/', import.meta.url).pathname;
mkdirSync(out, { recursive: true });
const emotions = Object.values(assets).filter(a => a.kind === 'emocion');
assert.equal(emotions.length, 9);
assert(emotions.every(a => a.status === 'listo'));
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
const report = [];
try {
 for (const [width, height] of [[390,844],[820,1180],[1180,820]]) {
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('response', r => { if (r.url().includes('/media/') && r.status() >= 400) errors.push(r.url()); });
  await page.goto(base + '/emociones');
  const group = page.getByRole('group', { name: 'Emociones', exact: true });
  assert.equal(await group.getByRole('button').count(), 9);
  await group.getByRole('button').first().focus();
  for (const a of emotions) {
   const button = group.getByRole('button', { name: a.emotionOrAction, exact: true });
   assert(await button.evaluate(el => el === document.activeElement));
   assert(await button.evaluate(el => getComputedStyle(el).outlineStyle !== 'none'));
   await page.keyboard.press('Enter');
   assert.equal(await button.getAttribute('aria-pressed'), 'true');
   await page.getByRole('heading', { name: a.emotionOrAction, exact: true }).waitFor();
   const images = page.locator(`[data-asset="${a.id}"] img`);
   assert.equal(await images.count(), 2);
   for (const img of await images.all()) {
    await img.evaluate(el => el.decode());
    assert(await img.evaluate(el => el.complete && el.naturalWidth > 0));
    const dims = await img.evaluate(el => ({ width: el.clientWidth, height: el.clientHeight, fit: getComputedStyle(el).objectFit, source: el.currentSrc }));
    assert.equal(dims.width, dims.height);
    assert.equal(dims.fit, 'contain');
    assert.match(dims.source, /-256w\.png$/);
   }
   assert.equal(await page.locator('[data-asset-state="error"]').count(), 0);
   if (a !== emotions.at(-1)) await page.keyboard.press('Tab');
  }
  await group.getByRole('button', { name: 'Calma', exact: true }).click();
  await page.evaluate(() => window.scrollTo(0,0));
  await page.screenshot({ path: `${out}${width}-emociones.png` });
  await page.getByRole('heading', { name: 'Calma', exact: true }).scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${out}${width}-emocion-detalle.png` });
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
  assert.deepEqual(axe.violations.map(v => v.id), []);
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  // The existing story selector uses Icon, not EmotionArt: assert its actual behavior honestly.
  await page.goto(base + '/historias/una-manana-diferente/cuento?escena=cambio');
  for (let i = 0; i < 20 && !await page.getByRole('button', { name: 'No lo sé', exact: true }).count(); i++) {
   await page.getByRole('button', { name: 'Siguiente', exact: true }).click();
  }
  const surprise = page.getByRole('button', { name: 'Sorpresa', exact: true });
  await surprise.focus();
  await page.keyboard.press('Enter');
  assert.equal(await surprise.getAttribute('aria-pressed'), 'true');
  assert.match(await surprise.innerText(), /Sorpresa/);
  assert(await surprise.locator('svg').count() > 0);
  assert.equal(await page.locator('[data-asset^="emo-"]').count(), 0);
  await page.getByRole('button', { name: 'Un poco', exact: true }).click();
  assert.equal(await page.getByRole('button', { name: 'Un poco', exact: true }).getAttribute('aria-pressed'), 'true');
  await page.evaluate(() => {
   for (const el of document.querySelectorAll('*')) {
    if (el.scrollHeight > el.clientHeight && /auto|scroll/.test(getComputedStyle(el).overflowY)) el.scrollTop = 0;
   }
   window.scrollTo(0,0);
  });
  await page.screenshot({ path: `${out}${width}-selector-cuento.png` });
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  assert.deepEqual(errors, []);
  report.push({ width, height, emotionImages: '9 at 64px + each selected at 100px', keyboard: 'Enter + focus + aria-pressed + visible heading', axeViolations: 0, storySelector: 'existing icons, selection and intensity pass; artwork integration requires React change' });
  await context.close();
 }
} finally { await browser.close(); }
writeFileSync(new URL('../../docs/art-batch-5/browser-results.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
console.log('PASS nine emotions, three viewports, keyboard, accessible labels, contain, responsive files, axe and existing story selector');
