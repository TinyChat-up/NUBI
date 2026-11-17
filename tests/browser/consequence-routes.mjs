// Consecuencias (fase 17/18): «Probar otra posibilidad» arriba, antes del texto, y «Seguir con la historia» al final
// como acción principal (botón primario, flecha detrás). Falla si:
//  - la vuelta no aparece a la vista sin desplazar o no queda antes del texto de la consecuencia;
//  - «Seguir con la historia» deja de ser la acción principal o cambia de posición;
//  - volver a la decisión pierde lo explorado, o hay que leer/desplazar para poder continuar.
// Uso: NUBI_BROWSER_TOOLS=… CHROMIUM_PATH=… node tests/browser/consequence-routes.mjs  (Vite en 127.0.0.1:5173)
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const require = createRequire(process.env.NUBI_BROWSER_TOOLS + '/package.json');
const { chromium } = require('playwright');
const base = process.env.NUBI_URL || 'http://127.0.0.1:5173';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
const STAGE = '[aria-label="Contenido de la escena"]';

try {
  for (const [width, height] of [[390, 844], [820, 1180], [1180, 820]]) {
    const label = `${width}×${height}`;
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errors.push(m.text()); });

    const toConsequence = async (option) => {
      await page.goto(base + '/historias/una-manana-diferente/cuento?escena=posibilidades');
      await page.locator('h1').waitFor();
      for (let i = 0; i < 4 && !(await page.getByRole('button', { name: option }).count()); i++) await page.getByRole('button', { name: 'Siguiente', exact: true }).click();
      await page.getByRole('button', { name: option }).click();
      await page.getByRole('heading', { name: option, exact: true }).waitFor();
    };

    await toConsequence('Salir de clase sin avisar');
    const layout = await page.evaluate((sel) => {
      const stage = document.querySelector(sel);
      const buttons = [...stage.querySelectorAll('button')];
      const retry = buttons.filter((b) => b.textContent.trim() === 'Probar otra posibilidad');
      const onward = buttons.filter((b) => b.textContent.trim() === 'Seguir con la historia');
      const heading = [...stage.querySelectorAll('h2,h3')].find((h) => h.textContent.trim() === 'Salir de clase sin avisar');
      const r = retry[0]?.getBoundingClientRect();
      const footerTop = document.querySelector('footer').getBoundingClientRect().top;
      const o = onward[0];
      return {
        retry: retry.length, onward: onward.length,
        retryVisible: !!r && r.top >= 0 && r.bottom <= footerTop,
        retryBeforeText: !!heading && !!retry[0] && !!(retry[0].compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING),
        onwardPrimary: !!o && o.className.includes('bg-petroleo-600'),
        onwardArrowAfter: !!o && o.lastElementChild?.tagName.toLowerCase() === 'svg' && o.firstChild?.nodeType === Node.TEXT_NODE,
        onwardLast: !!o && buttons.indexOf(o) === buttons.length - 1,
        nextEnabled: !document.querySelector('footer').querySelector('button:last-of-type')?.disabled,
      };
    }, STAGE);
    assert.equal(layout.retry, 1, `${label}: una sola «Probar otra posibilidad»`);
    assert.equal(layout.onward, 1, `${label}: una sola «Seguir con la historia»`);
    assert(layout.retryVisible, `${label}: «Probar otra posibilidad» no se ve sin desplazar`);
    assert(layout.retryBeforeText, `${label}: «Probar otra posibilidad» no está antes de la consecuencia`);
    assert(layout.onwardPrimary, `${label}: «Seguir con la historia» ha dejado de ser la acción principal`);
    assert(layout.onwardArrowAfter, `${label}: la flecha de «Seguir con la historia» debe ir detrás del texto`);
    assert(layout.onwardLast, `${label}: «Seguir con la historia» debe cerrar la consecuencia`);
    assert(layout.nextEnabled, `${label}: no se obliga a leer: «Siguiente» sigue disponible`);

    // Volver arriba conserva lo explorado y lleva a la decisión.
    await page.getByRole('button', { name: 'Probar otra posibilidad' }).click();
    await page.locator('#choice-hint').waitFor();
    const explored = await page.evaluate(() => {
      const key = Object.keys(localStorage).find((k) => k.startsWith('nubi.v1.run.una-manana-diferente.cuento'));
      return JSON.parse(localStorage.getItem(key)).explored;
    });
    assert.deepEqual(explored['posibilidades-elegir'], ['salir'], `${label}: se pierde lo explorado`);

    // Otra posibilidad y «Seguir con la historia» avanza a la escena siguiente.
    await page.getByRole('button', { name: 'Preguntar qué va a pasar' }).click();
    await page.getByRole('heading', { name: 'Preguntar qué va a pasar', exact: true }).waitFor();
    assert.match(await page.locator(STAGE).textContent(), /Has explorado 2 de 6/, `${label}: contador de exploración`);
    await page.getByRole('button', { name: 'Seguir con la historia' }).click();
    await page.getByRole('heading', { name: /Cuáles podrían ayudarte|Estrategias/ }).first().waitFor();
    assert.deepEqual(errors, [], `${label}: consola`);
    console.log(`PASS ${label}: «Probar otra posibilidad» arriba y a la vista, «Seguir con la historia» principal al final, exploración conservada`);
    await context.close();
  }
} finally {
  await browser.close();
}
