// Portada inmersiva (fase 18): el paisaje `portada-fondo` es el fondo a sangre de la primera pantalla.
// Fase 19: dos entradas — «Descubrir un cuento» (principal) y «Para familias y docentes» (secundaria) — y Ajustes.
// Falla si:
//  - la ilustración no cubre toda la primera pantalla, está dentro de una tarjeta (bordes, radio, sombra,
//    márgenes) o se deforma (debe ser `object-fit: cover` sobre el arte 16:9 original);
//  - el encuadre no responde a la orientación: el colegio (punto focal) debe quedar a la vista y centrado,
//    y el texto y el botón no deben tapar el tejado ni el reloj;
//  - «Descubrir un cuento», «Para familias y docentes» y Ajustes no se ven sin desplazar, miden < 48 px, quedan
//    tapados o no llevan su palabra visible; las dos entradas no se distinguen; el título o el subtítulo quedan
//    tapados o reducidos;
//  - con teclado el foco no es visible;
//  - hay desbordamiento horizontal, o a 640×512 / 320×256 algún control no se puede alcanzar.
// Uso: NUBI_BROWSER_TOOLS=… CHROMIUM_PATH=… node tests/browser/homepage.mjs  (Vite en 127.0.0.1:5173)
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const require = createRequire(process.env.NUBI_BROWSER_TOOLS + '/package.json');
const { chromium } = require('playwright');
const base = process.env.NUBI_URL || 'http://127.0.0.1:5173';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
// Elementos de `portada-fondo` en coordenadas relativas del arte (revisados sobre la ilustración):
const CLOCK = { x: 0.49, y: 0.57 };   // reloj del colegio
const ROOF_TOP = 0.47;                // cumbrera del tejado del colegio

/** Posición en pantalla de un punto del arte con object-fit: cover y su object-position. */
const artMapper = page => page.evaluate(() => {
  const img = document.querySelector('[data-asset="portada-fondo"] img');
  const r = img.getBoundingClientRect();
  const [px, py] = getComputedStyle(img).objectPosition.split(' ').map(v => parseFloat(v) / 100);
  const scale = Math.max(r.width / img.naturalWidth, r.height / img.naturalHeight);
  const dw = img.naturalWidth * scale, dh = img.naturalHeight * scale;
  return { left: r.left + (r.width - dw) * px, top: r.top + (r.height - dh) * py, dw, dh, visibleShare: Math.min(1, r.width / dw) };
});
const at = (m, p) => ({ x: m.left + p.x * m.dw, y: m.top + p.y * m.dh });

/** El control está a la vista sin desplazar, mide ≥ 48 px y no lo tapa nada. */
const reachableInFirstScreen = (page, locator, label) => locator.evaluate((e, label) => {
  const r = e.getBoundingClientRect();
  const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
  return { label, ok: r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth && r.height >= 48 && r.width >= 48 && !!hit && (e === hit || e.contains(hit)), bottom: r.bottom };
}, label);

/** Título, subtítulo, botón, pastillas y nota caben enteros en el ancho (la sección recorta lo que sobresale). */
const insideWidth = page => page.evaluate(() => ['#home-title', '.home-hero-tagline', '.home-hero-cta', '.home-hero-adult', '.home-hero-note', ...[...document.querySelectorAll('.home-hero-pill')].map((_, i) => `.home-hero-pill:nth-of-type(${i + 1})`)]
  .map(sel => { const r = document.querySelector(sel).getBoundingClientRect(); return { sel, ok: r.left >= -0.5 && r.right <= innerWidth + 0.5 }; })
  .filter(x => !x.ok).map(x => x.sel));

try {
  for (const [width, height, dpr] of [[390, 844, 2], [820, 1180, 1], [1180, 820, 1], [1440, 900, 1]]) {
    const label = `${width}×${height}`;
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: dpr, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (['error', 'warning'].includes(m.type())) errors.push(m.text()); });
    await page.goto(base + '/');
    await page.locator('h1').waitFor();
    const img = page.locator('[data-asset="portada-fondo"] img');
    await img.evaluate(i => i.decode());

    // 1. Fondo a sangre, sin tarjeta y sin deformar.
    const art = await img.evaluate(i => {
      const r = i.getBoundingClientRect(), box = i.closest('[data-asset]'), b = box.getBoundingClientRect(), s = getComputedStyle(box);
      return { left: r.left, top: r.top, right: r.right, bottom: r.bottom, fit: getComputedStyle(i).objectFit, ratio: i.naturalWidth / i.naturalHeight,
        boxRadius: parseFloat(s.borderTopLeftRadius), boxShadow: s.boxShadow, boxBorder: parseFloat(s.borderTopWidth), boxSame: Math.abs(b.width - r.width) < 1 && Math.abs(b.height - r.height) < 1,
        src: i.currentSrc, shown: i.getBoundingClientRect().width * devicePixelRatio };
    });
    assert(art.left <= 0.5 && art.top <= 0.5 && art.right >= width - 0.5 && art.bottom >= height - 0.5, `${label}: el paisaje no cubre la primera pantalla`);
    assert.equal(art.fit, 'cover', `${label}: object-fit`);
    assert(Math.abs(art.ratio - 16 / 9) < 0.01, `${label}: arte original 16:9`);
    assert(art.boxRadius === 0 && art.boxShadow === 'none' && art.boxBorder === 0 && art.boxSame, `${label}: el paisaje está dentro de una tarjeta`);
    const sourceWidth = Number(/-(\d+)w\./.exec(art.src)?.[1] ?? 2400);
    assert(sourceWidth >= Math.min(2400, art.shown) - 1, `${label}: resolución ${sourceWidth}px para ${Math.round(art.shown)}px`);

    // 2. Encuadre por orientación: el colegio a la vista y centrado; nada encima del tejado ni del reloj.
    const m = await artMapper(page);
    const clock = at(m, CLOCK);
    assert(clock.x > width * 0.3 && clock.x < width * 0.7 && clock.y > 0 && clock.y < height, `${label}: el reloj del colegio queda fuera del encuadre (${Math.round(clock.x)},${Math.round(clock.y)})`);
    const roof = at(m, { x: 0.5, y: ROOF_TOP }).y;
    const sky = await page.locator('.home-hero-sky').evaluate(e => e.getBoundingClientRect().bottom);
    assert(sky <= roof + 8, `${label}: título y botón (${Math.round(sky)} px) tapan el tejado del colegio (${Math.round(roof)} px)`);

    // 3. Controles y textos de la primera pantalla.
    const checks = [
      await reachableInFirstScreen(page, page.getByRole('link', { name: 'Descubrir un cuento' }), 'Descubrir un cuento'),
      await reachableInFirstScreen(page, page.getByRole('link', { name: 'Ajustes', exact: true }), 'Ajustes'),
      await reachableInFirstScreen(page, page.getByRole('link', { name: /^Para familias y docentes/ }), 'Para familias y docentes'),
    ];
    for (const c of checks) assert(c.ok, `${label}: «${c.label}» no está a la vista, mide < 48 px o queda tapado`);
    assert(await page.locator('.home-hero-bar').getByText('Ajustes', { exact: true }).isVisible(), `${label}: «Ajustes» sin palabra visible`);
    assert(await page.locator('.home-hero-adult').getByText('Para familias y docentes', { exact: true }).isVisible(), `${label}: acceso adulto sin palabra visible`);
    // Las dos entradas se distinguen: la del niño es el botón relleno; la adulta, un borde sobre crema.
    const looks = await page.evaluate(() => ['.home-hero-cta', '.home-hero-adult'].map((sel) => getComputedStyle(document.querySelector(sel)).backgroundColor));
    assert.notEqual(looks[0], looks[1], `${label}: las dos entradas tienen el mismo aspecto`);
    assert.equal(await page.getByRole('link', { name: /Mi mundo|^Familias$/ }).count(), 0, `${label}: quedan accesos antiguos`);
    for (const sel of ['#home-title', '.home-hero-tagline']) {
      const t = await page.locator(sel).evaluate(e => { const r = e.getBoundingClientRect(); const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return { ok: r.top >= 0 && r.bottom <= innerHeight && (e === hit || e.contains(hit)), size: parseFloat(getComputedStyle(e).fontSize) }; });
      assert(t.ok, `${label}: ${sel} tapado o fuera de la vista`);
    }
    assert(parseFloat(await page.locator('.home-hero-tagline').evaluate(e => getComputedStyle(e).fontSize)) >= 20, `${label}: subtítulo reducido`);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${label}: desbordamiento horizontal`);
    assert.deepEqual(await insideWidth(page), [], `${label}: elementos recortados por el ancho`);

    // 4. Teclado: foco visible en Ajustes, Descubrir un cuento y Para familias y docentes.
    for (const name of ['Ajustes', 'Descubrir un cuento', 'Para familias y docentes']) {
      for (let i = 0; i < 6; i++) {
        await page.keyboard.press('Tab');
        if ((await page.evaluate(() => document.activeElement?.textContent?.trim() ?? '')).startsWith(name)) break;
      }
      const f = await page.evaluate(() => { const a = document.activeElement; const s = getComputedStyle(a); return { text: a.textContent.trim(), visible: a.matches(':focus-visible') && (s.outlineStyle !== 'none' || s.boxShadow !== 'none') }; });
      assert(f.text.startsWith(name) && f.visible, `${label}: foco de teclado en «${name}»`);
    }
    await page.getByRole('link', { name: 'Descubrir un cuento' }).click();
    await page.waitForURL(/\/historias$/);
    assert.deepEqual(errors, [], `${label}: consola`);
    console.log(`PASS ${label}: paisaje a sangre (cover, sin tarjeta), reloj centrado en x=${Math.round(clock.x)} px, texto en el cielo (${Math.round(sky)} ≤ tejado ${Math.round(roof)} px), controles a la vista ≥ 48 px, foco visible`);
    await context.close();
  }

  // 5. Zoom alto: la portada crece y se desplaza; todo alcanzable, sin desbordamiento ni letra reducida.
  for (const [width, height] of [[640, 512], [320, 256]]) {
    const label = `${width}×${height}`;
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto(base + '/');
    await page.locator('h1').waitFor();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${label}: desbordamiento horizontal`);
    assert.deepEqual(await insideWidth(page), [], `${label}: elementos recortados por el ancho`);
    const covered = await page.evaluate(() => {
      const section = document.querySelector('.home-hero').getBoundingClientRect(), art = document.querySelector('[data-asset="portada-fondo"]').getBoundingClientRect();
      return Math.abs(section.height - art.height) < 1 && Math.abs(section.width - art.width) < 1;
    });
    assert(covered, `${label}: el paisaje no acompaña a la portada cuando crece`);
    for (const [loc, name] of [[page.getByRole('link', { name: 'Ajustes', exact: true }), 'Ajustes'], [page.getByRole('link', { name: /^Para familias y docentes/ }), 'Para familias y docentes'], [page.getByRole('link', { name: 'Descubrir un cuento' }), 'Descubrir un cuento'], [page.locator('#home-title'), 'NUBI'], [page.locator('.home-hero-tagline'), 'subtítulo'], [page.locator('.home-hero-note'), 'nota']]) {
      const ok = await loc.evaluate(e => { e.scrollIntoView({ block: 'center' }); const r = e.getBoundingClientRect(); const hit = document.elementFromPoint(Math.min(Math.max(r.left + r.width / 2, 1), innerWidth - 2), Math.min(Math.max(r.top + Math.min(r.height / 2, 20), 1), innerHeight - 2)); return !!hit && (e === hit || e.contains(hit)); });
      assert(ok, `${label}: «${name}» no se puede alcanzar sin quedar tapado`);
    }
    assert(parseFloat(await page.locator('.home-hero-tagline').evaluate(e => getComputedStyle(e).fontSize)) >= 20, `${label}: subtítulo reducido`);
    await page.getByRole('link', { name: /^Para familias y docentes/ }).click();
    await page.waitForURL(/\/acompanar$/);
    console.log(`PASS ${label}: la portada crece y se desplaza; controles y textos alcanzables, sin desbordamiento ni letra reducida`);
    await context.close();
  }
} finally { await browser.close(); }
