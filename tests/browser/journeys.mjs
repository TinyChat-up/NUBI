// Recorridos de la fase 19 (NUBI = cuentos sociales, dos funciones). Falla si se rompe alguno de estos caminos:
//  NIÑO:   inicio → Descubrir un cuento → abrir → Cuento → (pregunta opcional sin responder) → decisión →
//          consecuencia → Probar otra decisión → otra decisión (teclado) → Seguir el cuento → final (Mi resumen)
//          y el progreso se conserva («Seguir donde lo dejaste»).
//  ADULTO: inicio → Para familias y docentes → guía (antes / durante / después, sin puerta numérica ni datos
//          del menor) → Empezar el cuento → Cómic → salir → volver a la guía.
// Además: nada avanza solo, los tres momentos se nombran en la cabecera, sin desbordamiento horizontal,
// foco visible con teclado, consola limpia. Tamaños: 390×844, 820×1180, 1180×820, 640×512 y 320×256;
// y letra «muy grande» + movimiento reducido en 390×844 y 1180×820.
// Uso: NUBI_BROWSER_TOOLS=… CHROMIUM_PATH=… node tests/browser/journeys.mjs  (Vite en 127.0.0.1:5173)
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const require = createRequire(process.env.NUBI_BROWSER_TOOLS + '/package.json');
const { chromium } = require('playwright');
const base = process.env.NUBI_URL || 'http://127.0.0.1:5173';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
const STAGE = '[aria-label="Contenido de la escena"]';

const noOverflow = async (page, at) => assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${at}: desbordamiento horizontal`);
const h1 = (page) => page.locator('h1').first().innerText();
const next = (page) => page.getByRole('button', { name: 'Siguiente', exact: true }).click();

async function child(page, label) {
  await page.goto(base + '/');
  await page.getByRole('link', { name: 'Descubrir un cuento' }).click();
  await page.waitForURL(/\/historias$/);
  await noOverflow(page, `${label} biblioteca`);
  assert.equal(await page.getByRole('button', { name: /^Todas$/ }).count(), 0, `${label}: sin filtros con un solo cuento`);
  // Fase 20: carrusel de portadas. Flechas visibles, teclado y tarjeta final sin historias ni enlaces inventados.
  const carousel = page.getByRole('region', { name: 'Cuentos' });
  assert.equal(await carousel.locator('.story-carousel-track > li').count(), 2, `${label}: un cuento + «Próximamente»`);
  assert.equal(await page.getByText('Próximamente: nuevas historias').count(), 1);
  assert.equal(await carousel.locator('a[href*="instagram"]').count(), 0, `${label}: sin enlace inventado`);
  await page.getByRole('button', { name: 'Cuento siguiente' }).click();
  await page.getByText('2 de 2', { exact: true }).waitFor();
  assert(await page.getByRole('button', { name: 'Cuento siguiente' }).isDisabled(), `${label}: última tarjeta`);
  await page.getByRole('button', { name: 'Cuento anterior' }).click();
  await page.getByText('1 de 2', { exact: true }).waitFor();
  await page.getByRole('link', { name: 'Abrir el cuento' }).focus();
  await page.keyboard.press('ArrowRight');
  await page.getByText('2 de 2', { exact: true }).waitFor();
  await page.keyboard.press('ArrowLeft');
  await page.getByText('1 de 2', { exact: true }).waitFor();
  await noOverflow(page, `${label} carrusel`);
  await page.getByRole('link', { name: 'Abrir el cuento' }).click();
  await page.waitForURL(/\/historias\/una-manana-diferente$/);
  await noOverflow(page, `${label} ficha`);
  // Dos formatos grandes; el vídeo en preparación no compite como opción.
  assert.equal(await page.locator('.format-choice').count(), 2, `${label}: Cuento y Cómic`);
  await page.locator('.format-cuento').click();
  await page.waitForURL(/\/cuento/);
  assert.match(await h1(page), /Qué está pasando/, `${label}: momento 1`);

  // Nada avanza solo.
  const before = await page.locator(STAGE).innerText();
  await page.waitForTimeout(1500);
  assert.equal(await page.locator(STAGE).innerText(), before, `${label}: la página cambió sola`);

  // Hasta la pregunta opcional: se puede seguir sin responder.
  for (let i = 0; i < 15 && !(await page.getByText('Pregunta opcional').count()); i++) await next(page);
  assert(await page.getByText('Pregunta opcional').isVisible(), `${label}: marca de pregunta opcional`);
  assert.equal(await page.locator(`${STAGE} [aria-pressed="true"]`).count(), 0);
  assert(await page.getByRole('button', { name: 'Siguiente', exact: true }).isEnabled(), `${label}: se puede seguir sin responder`);

  // Momento 2: la decisión (seis posibilidades, ninguna destacada).
  for (let i = 0; i < 10 && !(await page.locator('#choice-hint').count()); i++) await next(page);
  assert.match(await h1(page), /¿Qué podría hacer Teo\?/, `${label}: momento 2`);
  const options = page.locator(`${STAGE} .choice-path`);
  assert.equal(await options.count(), 6, `${label}: seis posibilidades`);
  const heights = await options.evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().width)));
  assert(Math.max(...heights) - Math.min(...heights) <= 1, `${label}: todas las posibilidades del mismo ancho`);
  assert(!(await page.getByRole('button', { name: 'Siguiente', exact: true }).isEnabled()), `${label}: elegir es la acción`);
  await noOverflow(page, `${label} decisión`);
  await options.first().click();

  // Momento 3: la consecuencia como posibilidad.
  await page.getByText('Esto es lo que podría pasar').waitFor();
  assert.match(await h1(page), /Qué podría pasar/, `${label}: momento 3`);
  assert.equal(await page.getByText(/correcto|incorrecto|puntos|estrellas/i).count(), 0, `${label}: sin valoraciones`);
  await page.getByRole('button', { name: 'Probar otra decisión' }).click();
  await page.locator('#choice-hint').waitFor();
  assert.equal(await page.getByText('Ya la exploraste').count(), 1, `${label}: lo explorado se marca`);

  // Otra decisión con teclado.
  const second = options.nth(1);
  await options.first().focus();
  await page.keyboard.press('Tab');
  assert(await second.evaluate((e) => e === document.activeElement && e.matches(':focus-visible')), `${label}: Tab lleva a la segunda decisión con foco visible`);
  await page.keyboard.press('Enter');
  await page.getByText('Esto es lo que podría pasar').waitFor();
  assert.match(await page.locator(STAGE).innerText(), /Has explorado 2 de 6/);
  await page.getByRole('button', { name: 'Seguir el cuento' }).click();

  // Hasta el final.
  for (let i = 0; i < 20 && !(await page.getByRole('heading', { name: 'Mi resumen' }).count()); i++) await next(page);
  await page.getByRole('heading', { name: 'Mi resumen' }).waitFor();
  const summary = await page.locator(STAGE).innerText();
  for (const t of ['Preguntar qué va a pasar', 'Pedir que le expliquen el horario']) assert(summary.includes(t), `${label}: el resumen recoge «${t}»`);
  assert(await page.getByRole('button', { name: 'Salir', exact: true }).isVisible(), `${label}: terminar`);
  assert.equal(await page.getByRole('link', { name: /Mi mundo|Mis herramientas/ }).count(), 0, `${label}: sin enlaces a secciones retiradas`);
  await page.getByRole('link', { name: 'Elegir otro cuento' }).click();
  await page.waitForURL(/\/historias$/);

  // El progreso se conserva.
  await page.goto(base + '/historias/una-manana-diferente');
  assert(await page.locator('.format-cuento').getByText('Seguir donde lo dejaste').isVisible(), `${label}: partida guardada`);
}

async function adult(page, label) {
  await page.goto(base + '/');
  await page.getByRole('link', { name: /^Para familias y docentes/ }).click();
  await page.waitForURL(/\/acompanar$/);
  await noOverflow(page, `${label} acompañar`);
  await page.getByRole('link', { name: /Una mañana diferente/ }).click();
  await page.waitForURL(/\/acompanar\/una-manana-diferente$/);
  for (const t of ['Antes del cuento', 'Durante el cuento', 'Después del cuento']) await page.getByRole('heading', { name: t, exact: true }).waitFor();
  // Fase 20: índice al principio; cada enlace lleva a su parte, visible y no tapada por la cabecera.
  const index = page.getByRole('navigation', { name: 'Partes de la guía' });
  assert((await index.boundingBox()).y < (await page.getByRole('heading', { name: 'Antes del cuento', exact: true }).boundingBox()).y, `${label}: índice antes de la guía`);
  for (const [link, heading] of [['Durante', 'Durante el cuento'], ['Después', 'Después del cuento'], ['Antes', 'Antes del cuento']]) {
    await index.getByRole('link', { name: link }).click();
    await page.waitForTimeout(200);
    const top = await page.getByRole('heading', { name: heading, exact: true }).evaluate((e) => { const r = e.getBoundingClientRect(); const header = document.querySelector('header'); const hb = header && getComputedStyle(header).position === 'sticky' ? header.getBoundingClientRect().bottom : 0; return { ok: r.top >= hb - 1 && r.top < innerHeight }; });
    assert(top.ok, `${label}: «${link}» lleva a su parte, visible`);
  }
  const text = await page.locator('main').innerText();
  assert(!/\d+\s?%/.test(text), `${label}: sin porcentajes`);
  assert.equal(await page.getByRole('button', { name: /^(14|41|27|72)$/ }).count(), 0, `${label}: sin puerta numérica`);
  assert(!/Historias exploradas|Estrategias practicadas|Escenas visitadas/.test(text), `${label}: sin panel de progreso del menor`);
  await noOverflow(page, `${label} guía`);
  await page.getByRole('link', { name: 'Empezar el cuento' }).first().click();
  await page.waitForURL(/\/historias\/una-manana-diferente\?desde=guia$/);
  assert(await page.getByRole('link', { name: 'Volver a la guía' }).isVisible(), `${label}: volver a la guía`);
  await page.locator('.format-comic').click();
  await page.waitForURL(/\/comic/);
  assert.match(await h1(page), /Qué está pasando/);
  await page.getByRole('button', { name: 'Salir del cuento' }).click();
  await page.waitForURL(/\/historias\/una-manana-diferente$/);
  await page.getByRole('link', { name: 'Guía para familias y docentes' }).click();
  await page.waitForURL(/\/acompanar\/una-manana-diferente$/);
}

try {
  const runs = [
    [390, 844], [820, 1180], [1180, 820], [640, 512], [320, 256],
    [390, 844, 'xl'], [1180, 820, 'xl'],
  ];
  for (const [width, height, size] of runs) {
    const label = `${width}×${height}${size ? ' letra muy grande' : ''}`;
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: size ? 'reduce' : 'no-preference' });
    if (size) await context.addInitScript(() => localStorage.setItem('nubi.v1.settings', JSON.stringify({ textSize: 'xl', motion: 'reduced' })));
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errors.push(m.text()); });

    // Teclado desde la portada: Tab hasta «Descubrir un cuento», foco visible, Enter.
    await page.goto(base + '/');
    for (let i = 0; i < 6 && !(await page.evaluate(() => document.activeElement?.tagName === 'A' && document.activeElement.textContent.trim().startsWith('Descubrir un cuento'))); i++) await page.keyboard.press('Tab');
    assert(await page.evaluate(() => document.activeElement.matches(':focus-visible')), `${label}: foco visible en la portada`);
    await page.keyboard.press('Enter');
    await page.waitForURL(/\/historias$/);

    await child(page, label);
    await adult(page, label);
    assert.deepEqual(errors, [], `${label}: consola`);
    console.log(`PASS ${label}: niño (inicio → cuento → decisión → consecuencia → otra decisión → final) y adulto (inicio → acompañar → guía → iniciar cuento)`);
    await context.close();
  }
} finally {
  await browser.close();
}
