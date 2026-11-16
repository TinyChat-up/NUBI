// Comic production review: every panel, reading order, real bubbles and protected art regions.
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, existsSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { unaMananaDiferente as story } from '../../src/content/stories/una-manana-diferente/story.ts';
import { assets } from '../../src/content/assets/index.ts';
const require = createRequire(process.env.NUBI_BROWSER_TOOLS + '/package.json');
const { chromium } = require('playwright');
const base = process.env.NUBI_URL || 'http://127.0.0.1:5173';
const out = process.env.NUBI_ART_EVIDENCE || '/tmp/nubi-art-batch-4';
mkdirSync(out, { recursive: true });
const roiFile = new URL('../../docs/art-batch-4/protected-regions.json', import.meta.url);
const regions = existsSync(roiFile) ? JSON.parse(readFileSync(roiFile)) : {};
const subset = process.env.NUBI_COMIC_SCENES?.split(',');
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
const results = [];
try {
  for (const [width, height, dpr] of [[390, 844, 2], [820, 1180, 1], [1180, 820, 1]]) {
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: dpr, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('response', r => { if (r.url().includes('/media/') && r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
    for (const scene of story.scenes.filter(s => s.comic && (!subset || subset.includes(s.id)))) {
      await page.goto(`${base}/historias/${story.id}/comic?escena=${scene.id}`);
      await page.locator('h1').waitFor();
      for (const [index, panel] of scene.comic.entries()) {
        assert(regions[panel.illustration]?.length, `${panel.id}: missing protected art regions`);
        if (index) await page.getByRole('button', { name: 'Siguiente', exact: true }).click();
        const current = page.locator('ol[aria-label="Viñetas del cómic"] > li[aria-current="step"]');
        const art = current.locator(`[data-asset="${panel.illustration}"]`);
        await art.locator('img').evaluate(i => i.decode());
        await page.waitForFunction(id => document.querySelector(`[data-asset="${id}"]`)?.dataset.assetState === 'cargado', panel.illustration);
        const r = await current.evaluate((li, data) => {
          const art = li.querySelector('[data-asset]');
          const img = art.querySelector('img');
          const image = img.getBoundingClientRect();
          const rect = el => { const r = el.getBoundingClientRect(); return { x: (r.left-image.left)/image.width, y: (r.top-image.top)/image.height, w:r.width/image.width, h:r.height/image.height }; };
          const overlays = [...li.querySelectorAll('figure > div.relative > p')].filter(e => getComputedStyle(e).display !== 'none').map(e => ({ ...rect(e), text: e.innerText }));
          const list = li.querySelector('figure > ol');
          const below = !!list && getComputedStyle(list).display !== 'none';
          const shown = [...li.querySelectorAll('.reading-text')].filter(e => e.getBoundingClientRect().width && e.getBoundingClientRect().height && getComputedStyle(e).visibility !== 'hidden').map(e => e.textContent);
          const intersections = [];
          for (const region of data.regions) for (const b of overlays) {
            if (Math.min(region.x+region.w,b.x+b.w)-Math.max(region.x,b.x) > .004 && Math.min(region.y+region.h,b.y+b.h)-Math.max(region.y,b.y) > .004) intersections.push(region.name);
          }
          return { id:art.dataset.asset, width:image.width, height:image.height, src:img.currentSrc, natural:[img.naturalWidth,img.naturalHeight], overlays, below, shown, intersections };
        }, { regions: regions[panel.illustration] || [] });
        assert.equal(r.id, panel.illustration);
        assert.equal(await page.locator('ol[aria-label="Viñetas del cómic"] > li[aria-current]').count(), 1);
        const visibleIds = await page.locator('ol[aria-label="Viñetas del cómic"] [data-asset]').evaluateAll(a => a.map(x => x.dataset.asset));
        assert.deepEqual(visibleIds, scene.comic.slice(0,index+1).map(p=>p.illustration));
        const spec = assets[panel.illustration];
        assert(Math.abs(r.width/r.height-spec.size.width/spec.size.height) < .015, `${width}/${panel.id}: cropped`);
        assert.equal(r.intersections.length, 0, `${width}/${panel.id}: bubbles cover ${r.intersections}`);
        if (panel.bubbles.length) assert.equal(r.below, r.width < 512, `${width}/${panel.id}: bubble mode`);
        if (panel.bubbles.length) assert.equal(r.overlays.length, r.below ? 0 : panel.bubbles.length);
        for (const b of panel.bubbles) {
          // The AAC renderer deliberately separates the ·-delimited words into cells.
          const parts = b.kind === 'device' ? b.text.split('·').map(t=>t.trim()) : [b.text];
          let previous = -1;
          for (const part of parts) {
            assert.equal(r.shown.filter(t=>t===part).length, 1, `${width}/${panel.id}: duplicate or missing bubble cell ${part}`);
            const position = r.shown.indexOf(part);
            assert(position > previous, `${panel.id}: AAC reading order`);
            previous = position;
          }
        }
        if (panel.caption) assert(r.shown.includes(panel.caption), panel.id);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
        assert.equal(await page.locator('[data-asset-state="error"]').count(), 0);
        await current.screenshot({ path:`${out}/${width}-${panel.illustration}.jpg`, type:'jpeg', quality:88 });
        results.push({ viewport:{width,height,dpr}, scene:scene.id, panel:panel.id, ...r });
      }
    }
    assert.deepEqual(errors, []);
    console.log(`PASS ${width}: comic order, loading, aspect ratios, bubbles once, reserved regions and navigation`);
    await context.close();
  }
} finally {
  writeFileSync(`${out}/results.json`, JSON.stringify(results,null,2)+'\n');
  await browser.close();
}
