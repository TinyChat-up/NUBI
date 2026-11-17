// «El libro de trenes» (fase 22, SOLO DESARROLLO): recorre los tres finales en móvil (390×844) y ordenador (1440×900).
// Falla si: el cuento aparece en la biblioteca; un final no se alcanza; Nubi obliga; las preguntas obligan;
// falta el marcador provisional en las ilustraciones pendientes; hay axe, desbordamiento o errores de consola.
// Uso: NUBI_BROWSER_TOOLS=… CHROMIUM_PATH=… node tests/browser/libro-trenes.mjs  (Vite DEV en 127.0.0.1:5173)
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const require = createRequire(process.env.NUBI_BROWSER_TOOLS + '/package.json');
const { chromium } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;
const base = process.env.NUBI_URL || 'http://127.0.0.1:5173';
const STAGE = '[aria-label="Contenido de la escena"]';
const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });

const next = (p) => p.getByRole('button', { name: 'Siguiente', exact: true }).click();
const axe = async (p, label) => {
  const r = await new AxeBuilder({ page: p }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  assert.deepEqual(r.violations.map((v) => v.id), [], `${label}: axe`);
};
const noOverflow = async (p, label) => assert.equal(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${label}: desbordamiento`);
/** Avanza con «Siguiente» hasta que aparezca el texto indicado en el escenario. */
async function until(p, text) {
  for (let i = 0; i < 12 && !(await p.locator(STAGE).getByText(text, { exact: false }).count()); i++) await next(p);
  await p.locator(STAGE).getByText(text, { exact: false }).first().waitFor();
}
const choose = (p, label) => p.locator(`${STAGE} .choice-path`, { hasText: label }).click();

async function open(context) {
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errors.push(m.text()); });
  return { page, errors };
}

try {
  for (const [width, height] of [[390, 844], [1440, 900]]) {
    const label = `${width}×${height}`;
    const ctx = await b.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });

    // 0. Fuera de la biblioteca y accesible solo en desarrollo.
    const lib = await open(ctx);
    await lib.page.goto(base + '/historias');
    await lib.page.locator('h1').waitFor();
    assert.equal(await lib.page.getByText('El libro de trenes').count(), 0, `${label}: el cuento no debe estar en la biblioteca`);
    await lib.page.goto(base + '/dev');
    await lib.page.getByRole('link', { name: 'El libro de trenes (cuento)' }).waitFor();
    await lib.page.close();

    // A. Enseñarle el libro → «Mirar los trenes juntos».
    {
      const { page, errors } = await open(ctx);
      await page.goto(base + '/dev/libro-de-trenes/cuento');
      await page.locator('h1').waitFor();
      assert.match(await page.locator('h1').innerText(), /Qué está pasando/);
      // Pregunta emocional opcional: se puede responder y también seguir sin responder.
      await until(page, 'Pregunta opcional');
      await page.getByRole('button', { name: 'Sorpresa', exact: true }).click();
      await page.getByRole('button', { name: 'Ganas de seguir leyendo', exact: true }).click();
      assert(await page.getByRole('button', { name: 'Siguiente', exact: true }).isEnabled(), `${label}: la emoción no obliga`);
      await until(page, 'Elige una. Después puedes probar la otra.');
      // Marcador provisional visible en la decisión (la opción A es un marcador).
      assert(await page.locator('svg[aria-label^="Marcador provisional"]').count() >= 1, `${label}: marcador provisional visible`);
      // Teclado: Tab hasta la primera opción con foco visible y Enter.
      await page.locator(STAGE).focus();
      await page.keyboard.press('Tab');
      assert(await page.locator(`${STAGE} .choice-path`).first().evaluate((e) => e === document.activeElement && e.matches(':focus-visible')), `${label}: foco visible en la decisión`);
      await axe(page, `${label} decisión`);
      await page.keyboard.press('Enter');
      await until(page, 'Teo gira el libro');
      await next(page);
      await page.getByRole('heading', { name: 'Mirar los trenes juntos', exact: true }).waitFor();
      await axe(page, `${label} final A`);
      await noOverflow(page, `${label} final A`);
      assert(await page.getByRole('heading', { name: 'Explorar otro camino' }).isVisible(), `${label}: explorar otro camino`);
      assert.deepEqual(errors, [], `${label} A: consola`);
      await page.close();
    }

    // B1. Seguir leyendo → Lía espera → «Ahora no. Luego sí» → «Ahora no, luego sí». Luego explorar otro camino (A).
    {
      const { page, errors } = await open(ctx);
      await page.goto(base + '/dev/libro-de-trenes/cuento');
      await page.locator('h1').waitFor();
      await until(page, 'Elige una. Después puedes probar la otra.');
      await choose(page, 'Seguir leyendo');
      await until(page, 'No sabe si Teo la ha visto');
      await until(page, '¿Cómo podría sentirse Lía?');
      await page.getByRole('button', { name: 'Tristeza', exact: true }).click();
      await until(page, 'Elige una. Después puedes probar la otra.');
      await choose(page, 'Decirle: «Ahora no. Luego sí»');
      await until(page, 'gesto de «luego»');
      await next(page);
      await page.getByRole('heading', { name: 'Ahora no, luego sí', exact: true }).waitFor();
      await axe(page, `${label} final B1`);
      await noOverflow(page, `${label} final B1`);
      // Explorar otro camino desde el final: volver a la primera decisión y elegir A.
      await page.locator(`${STAGE} .choice-path`, { hasText: 'Enseñarle el libro a Lía' }).click();
      await until(page, 'Teo gira el libro');
      await next(page);
      await page.getByRole('heading', { name: 'Mirar los trenes juntos', exact: true }).waitFor();
      assert.deepEqual(errors, [], `${label} B1: consola`);
      await page.close();
    }

    // B2. Seguir sin decir nada → Nubi pregunta (opcional) → «Seguir con mi elección» → «Cada uno con su libro».
    {
      const { page, errors } = await open(ctx);
      await page.goto(base + '/dev/libro-de-trenes/cuento');
      await page.locator('h1').waitFor();
      await until(page, 'Elige una. Después puedes probar la otra.');
      await choose(page, 'Seguir leyendo');
      await until(page, 'No sabe si Teo la ha visto');
      await next(page);
      await until(page, 'Elige una. Después puedes probar la otra.');
      await choose(page, 'Seguir sin decir nada');
      await until(page, 'Miran juntas un libro de volcanes');
      await next(page);
      await page.getByRole('heading', { name: '¿Quieres probar otra forma?', exact: true }).waitFor();
      await axe(page, `${label} oferta de Nubi`);
      for (const name of ['Seguir con mi elección', 'Volver atrás', 'Terminar']) assert(await page.getByRole('button', { name, exact: true }).isVisible(), `${label}: «${name}»`);
      assert.equal(await page.getByText(/correct|incorrect|mejor|peor|puntos/i).count(), 0, `${label}: sin valoraciones`);
      await page.getByRole('button', { name: 'Seguir con mi elección', exact: true }).click();
      await page.getByRole('heading', { name: 'Cada uno con su libro', exact: true }).waitFor();
      await axe(page, `${label} final B2`);
      await noOverflow(page, `${label} final B2`);
      assert.deepEqual(errors, [], `${label} B2: consola`);
      await page.close();
    }

    // Oferta de Nubi usada: probar otra forma (B1) desde B2 → «Ahora no, luego sí».
    {
      const { page, errors } = await open(ctx);
      await page.goto(base + '/dev/libro-de-trenes/cuento');
      await page.locator('h1').waitFor();
      await until(page, 'Elige una. Después puedes probar la otra.');
      await choose(page, 'Seguir leyendo');
      await until(page, 'No sabe si Teo la ha visto');
      await next(page);
      await until(page, 'Elige una. Después puedes probar la otra.');
      await choose(page, 'Seguir sin decir nada');
      await until(page, 'Miran juntas un libro de volcanes');
      await next(page);
      await page.getByRole('heading', { name: '¿Quieres probar otra forma?', exact: true }).waitFor();
      await page.locator(`${STAGE} .choice-path`, { hasText: 'Decirle' }).click();
      await page.getByRole('heading', { name: 'Ahora no, luego sí', exact: true }).waitFor().catch(async () => {
        await until(page, 'gesto de «luego»'); await next(page);
        await page.getByRole('heading', { name: 'Ahora no, luego sí', exact: true }).waitFor();
      });
      assert.deepEqual(errors, [], `${label} oferta→B1: consola`);
      await page.close();
    }
    await ctx.close();
    console.log(`PASS ${label}: fuera de la biblioteca; tres finales («Mirar los trenes juntos», «Ahora no, luego sí», «Cada uno con su libro»); preguntas opcionales; Nubi opcional; explorar otro camino; teclado; marcador provisional visible; axe; sin desbordamiento; consola limpia`);
  }
} finally {
  await b.close();
}
