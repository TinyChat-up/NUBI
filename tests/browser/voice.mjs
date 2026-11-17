// Voz del dispositivo (fase 20), con voces simuladas: Chromium sin cabeza no trae voces reales.
// Falla si: aparecen voces remotas o de otro idioma; la muestra cambia la voz guardada; elegir no se guarda;
// el lector no usa la voz elegida o la velocidad; algo suena sin pedirlo; «Escuchar otra vez» o «Parar la voz» no funcionan.
// Uso: NUBI_BROWSER_TOOLS=… CHROMIUM_PATH=… node tests/browser/voice.mjs  (Vite en 127.0.0.1:5173)
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const require = createRequire(process.env.NUBI_BROWSER_TOOLS + '/package.json');
const { chromium } = require('playwright');
const base = process.env.NUBI_URL || 'http://127.0.0.1:5173';
const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
try {
  for (const [width, height] of [[390, 844], [1180, 820]]) {
    const c = await b.newContext({ viewport: { width, height } });
    await c.addInitScript(() => {
      window.__spoken = []; window.__canceled = 0;
      const voices = [
        { name: 'eSpeak Spanish', lang: 'es-ES', localService: true, voiceURI: 'espeak' },
        { name: 'Paulina', lang: 'es-MX', localService: true, voiceURI: 'paulina' },
        { name: 'Mónica', lang: 'es-ES', localService: true, voiceURI: 'monica' },
        { name: 'Google español', lang: 'es-ES', localService: false, voiceURI: 'remota' },
        { name: 'Samantha', lang: 'en-US', localService: true, voiceURI: 'samantha' },
      ];
      Object.defineProperty(window, 'speechSynthesis', { value: { addEventListener: () => {}, removeEventListener: () => {}, getVoices: () => voices, speak: (u) => { window.__spoken.push({ text: u.text, voice: u.voice?.voiceURI, rate: u.rate }); }, cancel: () => { window.__canceled++; } } });
      window.SpeechSynthesisUtterance = class { constructor(t) { this.text = t; } };
    });
    const p = await c.newPage();
    const label = `${width}×${height}`;
    await p.goto(base + '/ajustes');
    await p.getByRole('heading', { name: 'Ajustes' }).waitFor();
    assert.equal(await p.evaluate(() => window.__spoken.length), 0, `${label}: nada suena al abrir`);
    const list = p.locator('.voice-list > li > button[aria-pressed]');
    assert.deepEqual(await list.allInnerTexts(), ['Mónica · España', 'Paulina · México', 'eSpeak Spanish · España'], `${label}: solo voces locales en español, ordenadas`);
    assert.equal(await list.first().getAttribute('aria-pressed'), 'true', `${label}: por defecto, la primera`);
    // Muestra de otra voz: suena con esa voz y NO cambia la preferencia.
    await p.getByRole('button', { name: 'Escuchar una muestra de Paulina · México' }).click();
    assert.equal(await p.evaluate(() => window.__spoken.at(-1).voice), 'paulina');
    assert.equal(await p.evaluate(() => JSON.parse(localStorage.getItem('nubi.v1.settings') ?? '{}').voiceURI), undefined, `${label}: la muestra no elige`);
    // Elegir y velocidad: se guardan.
    await p.getByRole('button', { name: 'Paulina · México', exact: true }).click();
    await p.getByRole('button', { name: 'Pausada', exact: true }).click();
    assert.deepEqual(await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('nubi.v1.settings')); return [s.voiceURI, s.voiceRate]; }), ['paulina', 0.85]);
    // Lector: no suena hasta pedirlo; luego con la voz y velocidad elegidas; repetir y parar.
    await p.goto(base + '/historias/una-manana-diferente/cuento');
    await p.locator('h1').waitFor();
    const before = await p.evaluate(() => window.__spoken.length);
    await p.waitForTimeout(800);
    assert.equal(await p.evaluate(() => window.__spoken.length), before, `${label}: sin reproducción automática`);
    await p.getByRole('button', { name: 'Modo leer activado. Cambiar a escuchar', exact: true }).click();
    const first = await p.evaluate(() => window.__spoken.at(-1));
    assert.equal(first.voice, 'paulina'); assert.equal(first.rate, 0.85); assert.match(first.text, /Es martes/);
    await p.getByRole('button', { name: 'Escuchar otra vez' }).click();
    assert.deepEqual(await p.evaluate(() => window.__spoken.at(-1).text), first.text, `${label}: repite la misma frase`);
    const canceled = await p.evaluate(() => window.__canceled);
    assert.equal(await p.getByRole('button', { name: 'Parar la voz' }).isEnabled(), true);
    await p.getByRole('button', { name: 'Parar la voz' }).click();
    assert((await p.evaluate(() => window.__canceled)) > canceled, `${label}: parar cancela la voz`);
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    console.log(`PASS ${label}: voces locales en español, muestra sin elegir, preferencia y velocidad guardadas, lector con la voz elegida, repetir y parar`);
    await c.close();
  }
} finally { await b.close(); }
