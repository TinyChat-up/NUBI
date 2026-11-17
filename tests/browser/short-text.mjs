// Ajustes → «Textos cortos» en el reproductor real (fase 15).
// Falla si:
//  - una página del cuento no muestra su versión corta (si existe) o su texto completo (si no existe),
//  - la región aria-live (lector de pantalla y narración) no dice exactamente el texto que se ve,
//  - una consecuencia sin versión corta escrita no muestra su texto completo,
//  - cambiar el ajuste a mitad de la historia borra respuestas o posición.
// Uso: NUBI_BROWSER_TOOLS=… CHROMIUM_PATH=… node tests/browser/short-text.mjs  (Vite en 127.0.0.1:5173)
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { unaMananaDiferente as story } from '../../src/content/stories/una-manana-diferente/story.ts';
const require = createRequire(process.env.NUBI_BROWSER_TOOLS + '/package.json');
const { chromium } = require('playwright');
const base = process.env.NUBI_URL || 'http://127.0.0.1:5173';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
const STAGE = '[aria-label="Contenido de la escena"]';
const norm = t => t.replace(/\s+/g, ' ').trim();
const beats = story.scenes.flatMap(s => s.steps).filter(s => s.type === 'beat');
const choice = story.scenes.flatMap(s => s.steps).find(s => s.type === 'choice');
const option = choice.options[0];
try {
  for (const [width, height] of [[390, 844], [1180, 820]]) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
    await context.addInitScript(() => { if (!localStorage.getItem('nubi.v1.settings')) localStorage.setItem('nubi.v1.settings', JSON.stringify({ shortText: true })); });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (['error', 'warning'].includes(m.type())) errors.push(m.text()); });
    const label = `${width}×${height}`;

    // 1. Cuento completo con «Textos cortos».
    await page.goto(`${base}/historias/${story.id}/cuento`);
    await page.locator('h1').waitFor();
    const seen = new Set();
    for (let n = 0; n < 60; n++) {
      await page.waitForTimeout(120);
      const stage = norm(await page.locator(STAGE).innerText());
      const live = norm(await page.locator('p[aria-live="polite"]').textContent());
      const beat = beats.find(b => live === norm(b.short ?? b.text) || live === norm(b.text));
      if (beat && !seen.has(beat.id)) {
        seen.add(beat.id);
        const expected = norm(beat.short ?? beat.text);
        assert.equal(live, expected, `${label} ${beat.id}: aria-live`);
        assert(stage.includes(expected.replace(/[«»]/g, '').slice(0, 30)) || stage.includes(expected.slice(0, 30)), `${label} ${beat.id}: se ve «${expected}»`);
        if (beat.short) assert(!stage.includes(norm(beat.text)), `${label} ${beat.id}: con el ajuste no debe verse el texto completo`);
      }
      if (await page.getByRole('button', { name: 'Salir', exact: true }).count()) break;
      if (await page.locator('#choice-hint').count()) {
        await page.getByRole('button', { name: option.label, exact: false }).click();
        await page.getByRole('heading', { name: option.label, exact: true }).waitFor();
        // 2. Consecuencia: sin versiones cortas escritas, texto completo; aria-live = lo que se ve.
        const c = norm(await page.locator(STAGE).innerText());
        for (const t of [option.consequence.youMayFeel, option.consequence.keepInMind, ...option.consequence.story.map(f => f.text)]) assert(c.includes(norm(t)), `${label}: consecuencia sin «${t.slice(0, 30)}…»`);
        assert.equal(norm(await page.locator('p[aria-live="polite"]').textContent()), norm(`${option.label}. ${option.consequence.story.map(f => f.text).join(' ')}`), `${label}: aria-live de la consecuencia`);
      }
      await page.getByRole('button', { name: 'Siguiente', exact: true }).click();
    }
    assert.equal(seen.size, beats.length, `${label}: páginas comprobadas ${seen.size}/${beats.length}`);

    // 3. Cambiar el ajuste a mitad de la historia no borra respuestas ni posición.
    await page.goto(`${base}/historias/${story.id}/cuento?escena=cambio`);
    await page.locator('h1').waitFor();
    for (let i = 0; i < 20 && !await page.getByRole('button', { name: 'No lo sé', exact: true }).count(); i++) await page.getByRole('button', { name: 'Siguiente', exact: true }).click();
    await page.getByRole('button', { name: 'Sorpresa', exact: true }).click();
    await page.getByRole('button', { name: 'Un poco', exact: true }).click();
    await page.goto(`${base}/ajustes`);
    await page.locator('h1').waitFor();
    const group = page.getByRole('group', { name: /Textos cortos/ });
    await group.getByRole('button', { name: 'No', exact: true }).click();
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('nubi.v1.settings')).shortText), false);
    await page.goto(`${base}/historias/${story.id}/cuento?continuar=1`);
    await page.getByRole('button', { name: 'Sorpresa', exact: true }).waitFor();
    assert.equal(await page.getByRole('button', { name: 'Sorpresa', exact: true }).getAttribute('aria-pressed'), 'true', `${label}: respuesta conservada`);
    assert.equal(await page.getByRole('button', { name: 'Un poco', exact: true }).getAttribute('aria-pressed'), 'true', `${label}: intensidad conservada`);
    assert.deepEqual(errors, [], `${label}: consola`);
    console.log(`PASS ${label}: ${seen.size} páginas con su versión (corta si existe), aria-live = texto visible, consecuencia completa sin versión corta, respuestas conservadas al cambiar el ajuste`);
    await context.close();
  }
} finally { await browser.close(); }
