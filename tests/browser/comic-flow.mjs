// Recorrido del cómic completo como lo vive un niño o una niña: descubrir, volver, teclado y progreso.
// Complementa art-batch-4.mjs (arte, bocadillos y regiones protegidas) con la interacción:
//  - las 15 viñetas aparecen una a una y en el orden de story.ts, alternando ratón, flecha → y Tab + Enter,
//  - el botón «Descubrir la siguiente viñeta» tiene nombre, mide ≥ 48 px y es alcanzable con Tab tras cada viñeta,
//  - la región aria-live lee la leyenda y cada bocadillo con su hablante (también el comunicador de Lía),
//  - Atrás y la flecha ← ocultan la última viñeta descubierta; ?continuar=1 recupera las descubiertas,
//  - con movimiento reducido no hay animaciones; sin errores ni avisos de consola ni desbordamiento.
// Uso: NUBI_BROWSER_TOOLS=… CHROMIUM_PATH=… node tests/browser/comic-flow.mjs  (Vite en 127.0.0.1:5173)
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { unaMananaDiferente as story } from '../../src/content/stories/una-manana-diferente/story.ts';
import { characters } from '../../src/content/characters.ts';
const require = createRequire(process.env.NUBI_BROWSER_TOOLS + '/package.json');
const { chromium } = require('playwright');
const base = process.env.NUBI_URL || 'http://127.0.0.1:5173';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
const expectedOrder = story.scenes.flatMap(s => (s.comic ?? []).map(p => p.illustration));
const panelOf = Object.fromEntries(story.scenes.flatMap(s => (s.comic ?? []).map(p => [p.illustration, p])));
const LIST = 'ol[aria-label="Viñetas del cómic"]';
try {
  assert.equal(expectedOrder.length, 15);
  for (const [width, height, dpr] of [[390, 844, 2], [820, 1180, 1], [1180, 820, 1]]) {
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: dpr, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const problems = [];
    page.on('pageerror', e => problems.push(`pageerror: ${e.message}`));
    page.on('console', m => { if (['error', 'warning'].includes(m.type())) problems.push(`${m.type()}: ${m.text()}`); });
    const label = `${width}×${height}`;
    const seen = [];
    const ways = ['click', 'arrow', 'tab-enter'];
    let turn = 0;

    const checkCurrentPanel = async () => {
      const id = await page.locator(`${LIST} > li[aria-current="step"] [data-asset]`).getAttribute('data-asset');
      await page.waitForFunction(i => document.querySelector(`[data-asset="${i}"]`)?.dataset.assetState === 'cargado', id);
      const panel = panelOf[id];
      const live = (await page.locator('p[aria-live="polite"]').textContent()).trim();
      if (panel.caption) assert(live.includes(panel.caption), `${label} ${id}: aria-live sin la leyenda`);
      for (const b of panel.bubbles) {
        const text = b.text.replace(/·/g, ' ');
        assert(live.includes(text), `${label} ${id}: aria-live sin «${text}»`);
        if (b.speaker && b.kind !== 'sound') assert(live.includes(`${characters[b.speaker].name}: ${text}`), `${label} ${id}: falta el hablante de «${text}»`);
      }
      const alt = await page.locator(`${LIST} > li[aria-current="step"] img`).getAttribute('alt');
      assert(alt && alt.length > 10, `${label} ${id}: sin texto alternativo`);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${label} ${id}: desbordamiento`);
      const animation = await page.locator(`${LIST} > li[aria-current="step"]`).evaluate(li => getComputedStyle(li).animationName);
      assert.equal(animation, 'none', `${label} ${id}: animación con movimiento reducido`);
      return id;
    };

    await page.goto(`${base}/historias/${story.id}/comic`);
    await page.locator('h1').waitFor();
    for (let guard = 0; guard < 80 && seen.length < expectedOrder.length; guard++) {
      const panelStep = await page.locator(`${LIST} > li[aria-current="step"]`).count();
      if (!panelStep) {
        // Pasos interactivos entre escenas: elegir lo mínimo y seguir (ninguno es obligatorio salvo la decisión).
        const choice = story.scenes.flatMap(s => s.steps).find(s => s.type === 'choice');
        const option = page.getByRole('button', { name: choice.options[0].label, exact: false });
        if (await page.locator('#choice-hint').count()) { await option.click(); await page.getByRole('heading', { name: choice.options[0].label }).waitFor(); }
        await page.getByRole('button', { name: 'Siguiente', exact: true }).click();
        continue;
      }
      const id = await checkCurrentPanel();
      if (seen.at(-1) !== id) seen.push(id);
      const count = await page.locator(`${LIST} > li[aria-current]`).count();
      assert.equal(count, 1, `${label}: una sola viñeta actual`);
      const discover = page.getByRole('button', { name: 'Descubrir la siguiente viñeta', exact: true });
      if (!(await discover.count())) { await page.getByRole('button', { name: 'Siguiente', exact: true }).click(); continue; }
      const box = await discover.boundingBox();
      assert(box.height >= 48 && box.width >= 48, `${label}: botón de descubrir de ${box.width}×${box.height}`);
      const before = await page.locator(`${LIST} [data-asset]`).count();
      const way = ways[turn++ % ways.length];
      if (way === 'click') await discover.click();
      if (way === 'arrow') await page.keyboard.press('ArrowRight');
      if (way === 'tab-enter') {
        // Tras descubrir, el foco vuelve al escenario: el primer Tab lleva al botón de descubrir.
        await page.locator('[aria-label="Contenido de la escena"]').focus();
        await page.keyboard.press('Tab');
        assert.equal(await discover.evaluate(b => b === document.activeElement), true, `${label} ${id}: Tab no llega al botón de descubrir`);
        await page.keyboard.press('Enter');
      }
      await page.waitForFunction(([sel, n]) => document.querySelectorAll(sel).length === n + 1, [`${LIST} [data-asset]`, before]);
      assert.equal(await page.locator('[aria-label="Contenido de la escena"]').evaluate(el => el === document.activeElement), true, `${label}: el foco no vuelve al escenario`);
    }
    assert.deepEqual(seen, expectedOrder, `${label}: orden de las viñetas`);

    // Atrás (botón y flecha ←) y recuperación del progreso en la escena de cuatro viñetas.
    await page.goto(`${base}/historias/${story.id}/comic?escena=cambio`);
    await page.locator('h1').waitFor();
    for (let i = 0; i < 3; i++) await page.getByRole('button', { name: 'Descubrir la siguiente viñeta', exact: true }).click();
    const shown = () => page.locator(`${LIST} [data-asset]`).count();
    assert.equal(await shown(), 4);
    await page.getByRole('button', { name: 'Atrás', exact: true }).click();
    assert.equal(await shown(), 3, `${label}: Atrás no oculta la última viñeta`);
    await page.keyboard.press('ArrowLeft');
    assert.equal(await shown(), 2, `${label}: ← no oculta la última viñeta`);
    await page.keyboard.press('ArrowRight');
    assert.equal(await shown(), 3);
    await page.goto(`${base}/historias/${story.id}/comic?continuar=1`);
    await page.locator(`${LIST} [data-asset]`).first().waitFor();
    assert.equal(await shown(), 3, `${label}: ?continuar=1 no recupera las viñetas descubiertas`);
    assert.equal(await page.locator(`${LIST} > li[aria-current="step"] [data-asset]`).getAttribute('data-asset'), 'ume-k2-3');

    assert.deepEqual(problems, [], `${label}: consola`);
    console.log(`PASS ${label}: 15 viñetas en orden (ratón, → y Tab+Enter), aria-live, Atrás/←, ?continuar=1, movimiento reducido, consola limpia`);
    await context.close();
  }
} finally { await browser.close(); }
