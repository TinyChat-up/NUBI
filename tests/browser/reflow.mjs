// Reajuste con zoom alto (WCAG 1.4.10), prueba de regresión de C-01 (fase 15). A partir de reflow-probe.mjs.
// Emula el zoom con el viewport equivalente en px CSS (400 % de 1280×1024 → 320×256). No sustituye el zoom real.
// Falla si:
//  - en los tamaños habituales (390×844, 820×1180, 1180×820), al 200 % (640×512) o al 400 % vertical (320×568)
//    cambia el diseño: las barras dejan de ser fijas o los controles del reproductor no se ven sin desplazar;
//  - a 320×256 no se puede completar el cuento (con su decisión) y el cómic, o en algún paso el principio
//    del contenido no queda a la vista, o un texto o control no puede verse sin quedar tapado;
//  - a 320×256 algún control enfocado con Tab en las pantallas generales queda tapado o fuera de la vista;
//  - hay desbordamiento horizontal o errores de consola.
// Uso: NUBI_BROWSER_TOOLS=… CHROMIUM_PATH=… node tests/browser/reflow.mjs  (Vite en 127.0.0.1:5173)
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { unaMananaDiferente as story } from '../../src/content/stories/una-manana-diferente/story.ts';
const require = createRequire(process.env.NUBI_BROWSER_TOOLS + '/package.json');
const { chromium } = require('playwright');
const base = process.env.NUBI_URL || 'http://127.0.0.1:5173';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
const STAGE = '[aria-label="Contenido de la escena"]';
const option = story.scenes.flatMap(s => s.steps).find(s => s.type === 'choice').options[0];
// Fase 19: las dos funciones, Ajustes y dos páginas de compatibilidad (rutas antiguas).
const generalRoutes = ['/historias', '/historias/una-manana-diferente', '/acompanar', '/acompanar/una-manana-diferente', '/ajustes', '/mundo', '/herramientas', '/familias'];

const newPage = async (width, height) => {
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (['error', 'warning'].includes(m.type())) errors.push(`${m.type()}: ${m.text()}`); });
  return { context, page, errors };
};
const isTight = page => page.evaluate(() => document.documentElement.hasAttribute('data-tight'));
const noOverflow = async (page, label) => assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${label}: desbordamiento horizontal`);

/** Cada texto y control visible del paso puede llevarse a la vista y no queda tapado por otro elemento. */
async function everythingReachable(page, label) {
  const problems = await page.evaluate(sel => {
    const stage = document.querySelector(sel);
    const items = [...stage.querySelectorAll('p,h2,h3,li,figcaption,button,a'), ...document.querySelectorAll('footer button, header button')]
      .filter(e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && !e.closest('[aria-hidden="true"],.sr-only,[inert]')
        // Fase 19: el contenido de un <details> cerrado (apoyos desplegables) no se muestra hasta abrirlo.
        && !(e.closest('details:not([open])') && !e.closest('summary')); });
    const out = [];
    for (const e of items) {
      e.scrollIntoView({ block: 'center', inline: 'nearest' });
      const r = e.getBoundingClientRect();
      const x = Math.min(Math.max(r.left + Math.min(r.width / 2, 40), 1), innerWidth - 2);
      const y = Math.min(Math.max(r.top + Math.min(r.height / 2, 20), 1), innerHeight - 2);
      const hit = document.elementFromPoint(x, y);
      if (!hit || !(e.contains(hit) || hit.contains(e))) out.push(`${e.tagName.toLowerCase()} «${(e.getAttribute('aria-label') || e.textContent).trim().slice(0, 40)}» tapado por ${hit?.tagName.toLowerCase()}`);
      if (e.matches('button,a') && (r.height < 48 || r.width < 48)) out.push(`${e.tagName.toLowerCase()} «${e.textContent.trim().slice(0, 30)}» ${Math.round(r.width)}×${Math.round(r.height)} px`);
    }
    return out;
  }, STAGE);
  assert.deepEqual(problems, [], label);
}

/** Tras cambiar de paso, el principio del contenido nuevo está a la vista. */
async function startVisible(page, label) {
  await page.waitForTimeout(150);
  const top = await page.locator(STAGE).evaluate(el => el.getBoundingClientRect().top);
  const height = await page.evaluate(() => innerHeight);
  assert(top >= -1 && top < height / 2, `${label}: el principio del paso está fuera de la vista (top ${Math.round(top)} px)`);
}

try {
  // 1. Tamaños habituales, 200 % y 400 % vertical: el diseño no cambia.
  for (const [width, height] of [[390, 844], [820, 1180], [1180, 820], [640, 512], [320, 568]]) {
    const { context, page, errors } = await newPage(width, height);
    const label = `${width}×${height}`;
    await page.goto(`${base}/historias`); await page.locator('h1').waitFor();
    assert.equal(await isTight(page), false, `${label}: no debería activarse la ventana baja`);
    assert.equal(await page.getByRole('banner').evaluate(e => getComputedStyle(e).position), 'sticky', `${label}: la cabecera sigue fija`);
    for (const format of ['cuento', 'comic']) {
      await page.goto(`${base}/historias/${story.id}/${format}`); await page.locator('h1').waitFor();
      assert.equal(await isTight(page), false, `${label}/${format}: no debería activarse la ventana baja`);
      const m = await page.evaluate(sel => ({ overflow: getComputedStyle(document.querySelector(sel)).overflowY, footerBottom: document.querySelector('footer').getBoundingClientRect().bottom, stage: document.querySelector(sel).clientHeight }), STAGE);
      assert.equal(m.overflow, 'auto', `${label}/${format}: el escenario sigue con desplazamiento propio`);
      assert(m.footerBottom <= height + 1, `${label}/${format}: los controles se ven sin desplazar`);
      assert(m.stage >= 200, `${label}/${format}: escenario de ${m.stage} px`);
      await noOverflow(page, `${label}/${format}`);
    }
    assert.deepEqual(errors, [], `${label}: consola`);
    console.log(`PASS ${label}: diseño habitual (barras fijas, controles visibles, escenario ≥ 200 px)`);
    await context.close();
  }

  // 2. 320×256 (400 %): cuento y cómic completos, con todo el contenido accesible.
  {
    const { context, page, errors } = await newPage(320, 256);
    for (const format of ['cuento', 'comic']) {
      await page.goto(`${base}/historias/${story.id}/${format}`); await page.locator('h1').waitFor();
      assert.equal(await isTight(page), true, `${format}: debería activarse la ventana baja`);
      assert(await page.locator('h1').evaluate(h => { const r = h.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; }), `${format}: título visible al abrir`);
      let steps = 0;
      for (; steps < 80; steps++) {
        const label = `320×256/${format}/paso ${steps}`;
        await everythingReachable(page, label);
        await noOverflow(page, label);
        if (await page.getByRole('button', { name: 'Salir', exact: true }).count()) break;
        if (await page.locator('#choice-hint').count()) {
          await page.getByRole('button', { name: option.label, exact: false }).click();
          await page.getByRole('heading', { name: option.label, exact: true }).waitFor();
          await startVisible(page, `${label} (consecuencia)`);
          await everythingReachable(page, `${label} (consecuencia)`);
        }
        // Teclado: el control se enfoca, se ve sin quedar tapado y se activa.
        const next = page.getByRole('button', { name: 'Siguiente', exact: true });
        await next.focus();
        assert(await next.evaluate(b => { const r = b.getBoundingClientRect(); const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return r.top >= 0 && r.bottom <= innerHeight && (b === hit || b.contains(hit)); }), `${label}: «Siguiente» enfocado no visible`);
        await page.keyboard.press('Enter');
        if (format === 'cuento') await startVisible(page, label);
      }
      assert(await page.getByRole('button', { name: 'Salir', exact: true }).count(), `${format}: no se llegó al resumen`);
      console.log(`PASS 320×256 ${format}: completado en ${steps} pasos; principio de cada paso visible; textos y controles alcanzables sin quedar tapados`);
    }

    // 3. Pantallas generales: barras no fijas y foco nunca tapado.
    for (const route of generalRoutes) {
      await page.goto(base + route); await page.locator('h1').first().waitFor(); await page.waitForTimeout(150);
      assert.equal(await isTight(page), true, `${route}: debería activarse la ventana baja`);
      assert.equal(await page.getByRole('banner').evaluate(e => getComputedStyle(e).position), 'static', `${route}: cabecera no fija`);
      // Fase 19: no hay navegación inferior; solo la cabecera (con umbral de una barra, SINGLE_BAR).
      assert.equal(await page.getByRole('navigation', { name: 'Principal' }).count(), 0, `${route}: no debe haber pestañas`);
      await noOverflow(page, route);
      const seen = new Set();
      for (let i = 0; i < 60; i++) {
        await page.keyboard.press('Tab');
        await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
        const f = await page.evaluate(() => {
          const a = document.activeElement; if (!a || a === document.body) return null;
          const r = a.getBoundingClientRect();
          const hit = document.elementFromPoint(Math.min(Math.max(r.left + r.width / 2, 1), innerWidth - 2), Math.min(Math.max(r.top + Math.min(r.height / 2, 20), 1), innerHeight - 2));
          return { key: a.outerHTML.slice(0, 80) + Math.round(r.top + scrollY), label: (a.getAttribute('aria-label') || a.textContent).trim().slice(0, 40), ok: r.bottom > 0 && r.top < innerHeight && !!hit && (a.contains(hit) || hit.contains(a)) };
        });
        if (!f) continue;
        if (seen.has(f.key)) break;
        seen.add(f.key);
        assert(f.ok, `320×256 ${route}: foco en «${f.label}» tapado o fuera de la vista`);
      }
    }
    console.log(`PASS 320×256: ${generalRoutes.length} pantallas generales con barras no fijas y foco siempre visible`);
    assert.deepEqual(errors, [], '320×256: consola');
    await context.close();
  }
} finally { await browser.close(); }
