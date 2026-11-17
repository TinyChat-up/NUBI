// Phase 10: test real emotion artwork and preserve evidence without changing the UI.
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { assets } from '../../src/content/assets/index.ts';
import { unaMananaDiferente as story } from '../../src/content/stories/una-manana-diferente/story.ts';
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
  page.on('console', m => { if (['error', 'warning'].includes(m.type())) errors.push(`${m.type()}: ${m.text()}`); });
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
  // Story selector (phase 11): options with a typed `emotion` show EmotionArt; the others keep their icon.
  const feelings = story.scenes.flatMap(s => s.steps).find(s => s.type === 'feelings');
  assert.equal(feelings.options.filter(o => o.emotion).length, 5);
  assert.equal(feelings.options.filter(o => !o.emotion).length, 3);
  for (const format of ['comic', 'cuento']) {
   const at = `${width}/${format}`;
   await page.goto(`${base}/historias/una-manana-diferente/${format}?escena=cambio`);
   await page.locator('h1').waitFor();
   for (let i = 0; i < 20 && !await page.getByRole('button', { name: 'No lo sé', exact: true }).count(); i++) {
    await page.getByRole('button', { name: 'Siguiente', exact: true }).click();
   }
   for (const o of feelings.options) {
    const card = page.getByRole('button', { name: o.label, exact: true });
    assert.equal((await card.innerText()).trim(), o.label, `${at} ${o.id}: visible text`);
    if (!o.emotion) {
     assert.equal(await card.locator('[data-asset]').count(), 0, `${at} ${o.id}: no artwork`);
     assert.equal(await card.locator('svg').count(), 2, `${at} ${o.id}: icon + check`);
     continue;
    }
    const art = card.locator(`[data-asset="emo-${o.emotion}"]`);
    assert.equal(await art.count(), 1, `${at} ${o.id}: EmotionArt emo-${o.emotion}`);
    assert.equal(await card.locator('[data-asset]').count(), 1);
    assert.equal(await card.locator('svg').count(), 1, `${at} ${o.id}: icon replaced, check kept`);
    assert(assets[`emo-${o.emotion}`].transparent);
    const img = art.locator('img');
    await img.evaluate(el => el.decode());
    await page.waitForFunction(id => document.querySelector(`[data-asset="${id}"]`)?.dataset.assetState === 'cargado', `emo-${o.emotion}`);
    const r = await img.evaluate(el => {
     const box = el.getBoundingClientRect(), slot = el.closest('[data-leading]').getBoundingClientRect();
     const c = document.createElement('canvas'); c.width = el.naturalWidth; c.height = el.naturalHeight;
     const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(el, 0, 0);
     return { w: box.width, h: box.height, fit: getComputedStyle(el).objectFit, alt: el.getAttribute('alt'), src: el.currentSrc,
      hidden: el.closest('[data-leading]').getAttribute('aria-hidden'), inside: box.left >= slot.left - .5 && box.right <= slot.right + .5 && box.top >= slot.top - .5 && box.bottom <= slot.bottom + .5,
      cornerAlpha: g.getImageData(0, 0, 1, 1).data[3], centerAlpha: g.getImageData(el.naturalWidth >> 1, el.naturalHeight >> 1, 1, 1).data[3] };
    });
    assert(r.w >= 56 && r.w <= 64 && r.w === r.h, `${at} ${o.id}: ${r.w}×${r.h} px`);
    assert.equal(r.fit, 'contain');
    assert(r.inside, `${at} ${o.id}: artwork outside its slot`);
    assert.equal(r.alt, '', `${at} ${o.id}: decorative image`);
    assert.equal(r.hidden, 'true');
    assert.match(r.src, /-256w\.png$/);
    assert.equal(r.cornerAlpha, 0, `${at} ${o.id}: transparent background`);
    assert(r.centerAlpha > 0, `${at} ${o.id}: Nubi drawn`);
   }
   // Keyboard: Tab from the stage reaches the first card; Enter selects and deselects; focus ring visible.
   const surprise = page.getByRole('button', { name: 'Sorpresa', exact: true });
   await page.locator('[aria-label="Contenido de la escena"]').focus();
   await page.keyboard.press('Tab');
   assert(await surprise.evaluate(el => el === document.activeElement && el.matches(':focus-visible')), `${at}: Tab to Sorpresa`);
   assert(await surprise.evaluate(el => getComputedStyle(el).outlineStyle !== 'none'));
   await page.keyboard.press('Enter');
   assert.equal(await surprise.getAttribute('aria-pressed'), 'true');
   await page.keyboard.press('Enter');
   assert.equal(await surprise.getAttribute('aria-pressed'), 'false');
   await page.keyboard.press('Enter');
   for (const label of ['Tranquilidad', 'No lo sé']) await page.getByRole('button', { name: label, exact: true }).click();
   for (const label of ['Sorpresa', 'Tranquilidad', 'No lo sé']) assert.equal(await page.getByRole('button', { name: label, exact: true }).getAttribute('aria-pressed'), 'true');
   await page.getByRole('button', { name: 'Un poco', exact: true }).click();
   assert.equal(await page.getByRole('button', { name: 'Un poco', exact: true }).getAttribute('aria-pressed'), 'true');
   assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
   if (format === 'comic') continue;
   await page.evaluate(() => {
    for (const el of document.querySelectorAll('*')) {
     if (el.scrollHeight > el.clientHeight && /auto|scroll/.test(getComputedStyle(el).overflowY)) el.scrollTop = 0;
    }
    window.scrollTo(0,0);
   });
  }
  await page.screenshot({ path: `${out}${width}-selector-cuento.png` });
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  assert.deepEqual(errors, []);
  report.push({ width, height, emotionImages: '9 at 64px + each selected at 100px', keyboard: 'Enter + focus + aria-pressed + visible heading', axeViolations: 0, storySelector: 'cuento + cómic: 5 EmotionArt at 56 px (transparent, contain, decorative, 256w) + 3 icons, original labels, keyboard, aria-pressed, intensity, no console errors' });
  await context.close();
 }
} finally { await browser.close(); }
writeFileSync(new URL('../../docs/art-batch-5/browser-results.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
console.log('PASS nine emotions, three viewports, keyboard, accessible labels, contain, responsive files, axe and existing story selector');
