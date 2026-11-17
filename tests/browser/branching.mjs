// Motor ramificado (fase 21) con la historia TÉCNICA de prueba, servida solo en desarrollo (/dev/historia-ramificada).
// Falla si: la pregunta emocional obliga; las dos opciones no son iguales; una opción no lleva a su rama;
// Nubi no ofrece otra forma o la impone; el final no permite explorar otro camino; Atrás mezcla caminos;
// la partida no se reanuda; el cómic no ramifica; hay violaciones axe, desbordamiento o errores de consola.
// Uso: NUBI_BROWSER_TOOLS=… CHROMIUM_PATH=… node tests/browser/branching.mjs  (Vite DEV en 127.0.0.1:5173)
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const require = createRequire(process.env.NUBI_BROWSER_TOOLS + '/package.json');
const { chromium } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;
const base = process.env.NUBI_URL || 'http://127.0.0.1:5173';
const STAGE = '[aria-label="Contenido de la escena"]';
const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });

const stage = (p) => p.locator(STAGE).innerText();
const next = (p) => p.getByRole('button', { name: 'Siguiente', exact: true }).click();
const axe = async (p, label) => {
  const r = await new AxeBuilder({ page: p }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  assert.deepEqual(r.violations.map((v) => v.id), [], `${label}: axe`);
};
const noOverflow = async (p, label) => assert.equal(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${label}: desbordamiento`);

try {
  for (const [width, height] of [[390, 844], [820, 1180], [1180, 820]]) {
    const label = `${width}×${height}`;
    const c = await b.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
    const p = await c.newPage();
    const errors = [];
    p.on('pageerror', (e) => errors.push(e.message));
    p.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errors.push(m.text()); });
    const seen = [];
    const track = async () => seen.push(await stage(p));

    await p.goto(base + '/dev/historia-ramificada/cuento');
    await p.locator('h1').waitFor();
    assert.match(await p.locator('h1').innerText(), /Qué está pasando/);
    // Pregunta emocional opcional: se puede seguir sin responder.
    for (let i = 0; i < 5 && !(await p.getByText('Pregunta opcional').count()); i++) await next(p);
    assert(await p.getByRole('button', { name: 'Siguiente', exact: true }).isEnabled(), `${label}: la emoción no es obligatoria`);
    for (let i = 0; i < 5 && !(await p.locator('#choice-hint').count()); i++) await next(p);

    // Decisión con dos opciones iguales; elegir B con teclado.
    const cards = p.locator(`${STAGE} .choice-path`);
    assert.equal(await cards.count(), 2, `${label}: dos opciones`);
    const widths = await cards.evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().width)));
    assert(Math.abs(widths[0] - widths[1]) <= 1, `${label}: mismo tamaño`);
    await cards.first().focus();
    await p.keyboard.press('Tab');
    assert(await cards.nth(1).evaluate((e) => e === document.activeElement && e.matches(':focus-visible')), `${label}: foco visible en la opción B`);
    await p.keyboard.press('Enter');
    await p.locator(STAGE).getByText('Prueba: rama B. Aparece una dificultad.').waitFor();
    await track();

    // Nubi ofrece otra forma, sin imponerla.
    await next(p);
    await p.getByRole('heading', { name: '¿Quieres probar otra forma?' }).waitFor();
    assert.match(await p.locator('[aria-live="polite"]').first().innerText(), /probar otra forma/, `${label}: anuncio y voz`);
    for (const name of ['Seguir con mi elección', 'Volver atrás', 'Terminar']) assert(await p.getByRole('button', { name }).isVisible(), `${label}: «${name}»`);
    assert.equal(await p.locator(`${STAGE} .choice-path`).count(), 1, `${label}: la otra opción, ilustrada`);
    assert.equal(await p.getByText(/correct|incorrect|mejor|peor|puntos/i).count(), 0, `${label}: sin valoraciones`);
    await axe(p, `${label} oferta`);
    await noOverflow(p, `${label} oferta`);
    await p.getByRole('button', { name: 'Seguir con mi elección' }).click();

    // Final B: su página narrativa y después el cierre, con salida y otro camino.
    await p.locator(STAGE).getByText('Prueba: final B.').waitFor();
    await next(p);
    await p.getByRole('heading', { name: 'Final de prueba B' }).waitFor();
    assert(await p.getByRole('button', { name: 'Salir', exact: true }).isVisible(), `${label}: terminar`);
    await axe(p, `${label} final`);
    await noOverflow(p, `${label} final`);
    await p.getByRole('heading', { name: 'Explorar otro camino' }).waitFor();
    await p.locator(`${STAGE} .choice-path`, { hasText: 'Camino A' }).click();

    // Rama A → segunda decisión → final A1.
    await p.locator(STAGE).getByText('Prueba: rama A. Aparece otra decisión.').waitFor();
    for (let i = 0; i < 4 && !(await p.locator('#choice-hint').count()); i++) await next(p);
    await p.locator(`${STAGE} .choice-path`, { hasText: 'Camino A1' }).click();
    await p.locator(STAGE).getByText('Prueba: final A1.').waitFor();
    await next(p);
    await p.getByRole('heading', { name: 'Final de prueba A1' }).waitFor();
    const found = await p.getByRole('heading', { name: 'Finales que has descubierto' }).locator('..').innerText();
    for (const t of ['Final de prueba B', 'Final de prueba A1']) assert(found.includes(t), `${label}: recuerda «${t}»`);
    assert.equal(await p.getByText('Elegiste: Camino A', { exact: false }).count() >= 1, true);

    // Reanudar: la partida vuelve al mismo final.
    await p.goto(base + '/dev/historia-ramificada/cuento?continuar=1');
    await p.getByRole('heading', { name: 'Final de prueba A1' }).waitFor();

    // Atrás desde A1 nunca pasa por la rama B.
    for (let i = 0; i < 12 && (await p.getByRole('button', { name: 'Atrás', exact: true }).isEnabled()); i++) {
      await p.getByRole('button', { name: 'Atrás', exact: true }).click();
      await track();
    }
    assert.equal(seen.slice(1).some((t) => t.includes('rama B')), false, `${label}: Atrás mezcló caminos`);
    assert.match(await p.locator('h1').innerText(), /Qué está pasando/, `${label}: Atrás llega al principio`);

    // Índice: solo el camino recorrido.
    await p.getByRole('button', { name: 'Escenas' }).click();
    const menu = await p.getByRole('dialog').innerText();
    assert(!menu.includes('Rama B') && !menu.includes('Final de prueba'), `${label}: el índice no muestra ramas no recorridas`);
    await p.keyboard.press('Escape');

    // Cómic: también ramifica.
    await p.goto(base + '/dev/historia-ramificada/comic');
    await p.locator('h1').waitFor();
    for (let i = 0; i < 8 && !(await p.locator('#choice-hint').count()); i++) await next(p);
    await p.locator(`${STAGE} .choice-path`, { hasText: 'Camino A' }).click();
    for (let i = 0; i < 6 && !(await p.locator('#choice-hint').count()); i++) await next(p);
    await p.locator(`${STAGE} .choice-path`, { hasText: 'Camino A2' }).click();
    for (let i = 0; i < 4 && !(await p.getByRole('heading', { name: 'Final de prueba A2' }).count()); i++) await next(p);
    await p.getByRole('heading', { name: 'Final de prueba A2' }).waitFor();

    assert.deepEqual(errors, [], `${label}: consola`);
    console.log(`PASS ${label}: emoción opcional, dos opciones iguales (teclado), Nubi ofrece otra forma, tres finales, explorar otro camino, Atrás sin mezclar, reanudar, índice del camino, cómic, axe`);
    await c.close();
  }
} finally {
  await b.close();
}
