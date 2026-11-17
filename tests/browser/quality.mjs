// Herramientas externas opcionales: ver docs/TEST_RESULTS.md. Sin dependencias de producción nuevas.
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const require = createRequire(process.env.NUBI_BROWSER_TOOLS + '/package.json');
const { chromium } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
const base = process.env.NUBI_URL || 'http://127.0.0.1:5173';
const out = process.env.NUBI_EVIDENCE || '/tmp/nubi-evidence';
mkdirSync(out, { recursive: true });
const report = [];
try {
for (const width of [390, 820, 1180]) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'no-preference' });
  const page = await context.newPage();
  const errors = [], external = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('request', r => { if (!r.url().startsWith(base) && !r.url().startsWith('data:')) external.push(r.url()); });
  const go = async path => { await page.goto(base + path); await page.locator('h1').waitFor(); assert.equal(await page.locator('vite-error-overlay').count(), 0); };
  const capture = async name => {
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${out}/${width}-${name}.png`, fullPage: true });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `desbordamiento ${width}/${name}`);
    const result = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
    report.push({ width, name, violations: result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })) });
    assert.equal(result.violations.length, 0, JSON.stringify(result.violations.map(v => v.id)));
  };
  const next = () => page.getByRole('button', { name: 'Siguiente', exact: true }).click();
  await go('/'); await capture('01-inicio');
  await go('/historias/una-manana-diferente'); await capture('02-ficha');
  for (const format of ['cuento', 'comic']) {
    await go(`/historias/una-manana-diferente/${format}`);
    await capture(`03-${format}`);
    await page.getByRole('button', { name: 'Detener animaciones', exact: true }).click();
    await next();
    assert.equal(await page.locator('[aria-label="Contenido de la escena"]').evaluate(el => el === document.activeElement), true);
    assert.equal(await page.locator('[aria-label="Contenido de la escena"] [class*="animate-"]').first().evaluate(el => getComputedStyle(el).animationName), 'none');
    await page.getByRole('button', { name: 'Repetir la escena', exact: true }).click();
    assert.equal(JSON.parse(await page.evaluate(f => localStorage.getItem(`nubi.v1.run.una-manana-diferente.${f}`), format)).position.stepIndex, 0);
    await page.getByRole('button', { name: 'Escenas', exact: true }).click();
    await page.keyboard.press('Escape');
    assert.equal(await page.getByRole('dialog').count(), 0);
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowLeft');
    await go(`/historias/una-manana-diferente/${format}?escena=cambio`);
    for(let i=0;i<20 && !(await page.getByRole('button', { name: 'No lo sé', exact: true }).count());i++) await next();
    await page.getByRole('button', { name: 'No lo sé', exact: true }).click();
    assert.equal(await page.getByRole('button', { name: 'No lo sé', exact: true }).getAttribute('aria-pressed'), 'true');
    const feeling = page.getByRole('button', { name: 'Sorpresa', exact: true });
    await feeling.click();
    await page.getByRole('button', { name: 'Un poco', exact: true }).click();
    await capture(`04-${format}-emociones`);
    const saved = await page.evaluate(f => localStorage.getItem(`nubi.v1.run.una-manana-diferente.${f}`), format);
    await go(`/historias/una-manana-diferente/${format}?continuar=1`);
    assert.equal(await feeling.getAttribute('aria-pressed'), 'true');
    assert.equal(await page.getByRole('button', { name: 'Un poco', exact: true }).getAttribute('aria-pressed'), 'true');
    assert.equal(await page.evaluate(f => localStorage.getItem(`nubi.v1.run.una-manana-diferente.${f}`), format), saved);
    // Continuar la misma partida conserva emociones e intensidad hasta el resumen.
    const options = await page.evaluate(async () => {
      const { unaMananaDiferente: s } = await import('/src/content/stories/una-manana-diferente/story.ts');
      return s.scenes.flatMap(x => x.steps).find(x => x.type === 'choice').options.map(x => x.label);
    });
    assert.equal(options.length, 6);
    for(let i=0;i<20 && !(await page.getByRole('button', { name: options[0], exact: true }).count());i++) await next();
    for(const label of options) {
      await page.getByRole('button', { name: label, exact: false }).click();
      await page.getByRole('heading', { name: label, exact: true }).waitFor();
      assert.equal(await page.locator('[aria-label="Contenido de la escena"]').evaluate(el => el === document.activeElement), true);
      await page.getByRole('button', { name: /Probar otra decisión/  /* fase 19: antes «Probar otra posibilidad» */ }).click();
    }
    await page.getByRole('button', { name: options[0], exact: false }).click();
    await capture(`05-${format}-consecuencia`);
    for(let i=0;i<40 && !(await page.getByRole('heading', { name: '¿Cuáles podrían ayudarte a ti cuando cambia un plan?', exact: true }).count());i++) await next();
    const tool = page.getByRole('button', { name: /^Pedir ayuda/ });
    await tool.click();
    assert.equal(await tool.getAttribute('aria-pressed'), 'true');
    for(let i=0;i<40 && !(await page.getByRole('button', { name: 'Salir', exact: true }).count());i++) await next();
    await page.getByRole('button', { name: 'Salir', exact: true }).waitFor();
    assert.match(await page.locator('[aria-label="Contenido de la escena"]').innerText(), /Sorpresa/);
    assert.match(await page.locator('[aria-label="Contenido de la escena"]').innerText(), /Intensidad: un poco/);
    await capture(`06-${format}-resumen`);
  }
  // Corrupción persistida y rutas malformadas: recuperación sin pantalla en blanco.
  await page.evaluate(() => localStorage.setItem('nubi.v1.run.una-manana-diferente.cuento', JSON.stringify({ storyId: 'una-manana-diferente', position: { sceneId: 'llegada', stepIndex: 0 } })));
  await go('/historias/una-manana-diferente/cuento?continuar=1');
  await page.getByRole('button', { name: 'Siguiente', exact: true }).waitFor();
  // Vite rechaza una URL malformada antes de llegar a la SPA; probar el router cliente.
  await page.evaluate(() => { history.pushState(null, '', '/historias/%E0%A4%A'); dispatchEvent(new PopStateEvent('popstate')); });
  await page.getByRole('heading', { name: 'Este camino no existe' }).waitFor();
  assert.equal(await page.getByRole('heading', { name: 'Este camino no existe' }).count(), 1);
  await go('/historias/una-manana-diferente/video');
  await page.getByRole('heading', { name: 'Vídeo en producción' }).waitFor();
  await capture('07-video');
  const link = page.getByRole('link', { name: 'Ver como cuento', exact: true });
  assert(await link.isVisible()); await link.click(); await page.locator('[aria-label="Contenido de la escena"]').waitFor();
  // Fase 19: la guía adulta no tiene puerta numérica ni datos del menor; el borrado está en Ajustes.
  await go('/acompanar/una-manana-diferente');
  await page.getByRole('heading', { name: 'Antes del cuento' }).waitFor();
  assert.equal(await page.getByRole('button', { name: /^(14|41|27|72)$/ }).count(), 0, 'sin puerta numérica');
  await capture('08-familias');
  await go('/ajustes');
  await page.evaluate(() => localStorage.setItem('other-app', 'conservar'));
  await page.getByRole('button', { name: 'Borrar el progreso', exact: true }).click();
  await page.getByRole('button', { name: 'Sí, borrar', exact: true }).click();
  assert.deepEqual(await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('nubi.v1.run.'))), []);
  assert.equal(await page.evaluate(() => localStorage.getItem('other-app')), 'conservar');
  assert.equal(errors.length, 0, JSON.stringify(errors));
  assert.equal(external.length, 0, JSON.stringify(external));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await go('/historias/una-manana-diferente/cuento');
  assert.equal(await page.locator('[aria-label="Contenido de la escena"] [class*="animate-"]').first().evaluate(el => getComputedStyle(el).animationName), 'none');
  report.push({ width, functional: 'passed', errors, external });
  console.log(`PASS ${width}: cuento, cómic, seis opciones, emociones, intensidad, resumen, persistencia, borrado, teclado, vídeo`);
  await context.close();
}
} finally { writeFileSync(`${out}/results.json`, JSON.stringify(report,null,2)); await browser.close(); }
