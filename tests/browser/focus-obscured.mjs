// El foco de teclado no queda tapado por la cabecera fija ni por la barra inferior (WCAG 2.4.11).
// Recorre con Tab las pantallas con «chrome» y el reproductor en 390 / 820 / 1180 px, con letra normal y al 125 %.
// Falla si el centro del elemento enfocado lo cubre otro elemento fijo o pegajoso.
// Uso: NUBI_BROWSER_TOOLS=… CHROMIUM_PATH=… node tests/browser/focus-obscured.mjs  (Vite en 127.0.0.1:5173)
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const require = createRequire(process.env.NUBI_BROWSER_TOOLS + '/package.json');
const { chromium } = require('playwright');
const base = process.env.NUBI_URL || 'http://127.0.0.1:5173';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
const paths = ['/', '/mundo', '/mundo/colegio', '/historias', '/historias/una-manana-diferente', '/recreaciones', '/herramientas',
  '/herramientas/pedir-ayuda', '/emociones', '/familias', '/ajustes', '/historias/una-manana-diferente/cuento?escena=posibilidades'];
const problems = [];
try {
  for (const [width, height] of [[390, 844], [820, 1180], [1180, 820]]) {
    for (const textSize of ['m', 'xl']) {
      const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
      await context.addInitScript(t => localStorage.setItem('nubi.v1.settings', JSON.stringify({ ...JSON.parse(localStorage.getItem('nubi.v1.settings') || '{}'), textSize: t })), textSize);
      const page = await context.newPage();
      for (const path of paths) {
        await page.goto(base + path); await page.locator('h1').waitFor(); await page.waitForTimeout(250);
        const seen = new Set();
        for (let i = 0; i < 80; i++) {
          await page.keyboard.press('Tab');
          // Dos fotogramas: el desplazamiento al foco y el enlace de salto ya están pintados.
          await page.evaluate(() => new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done))));
          const r = await page.evaluate(() => {
            const a = document.activeElement; if (!a || a === document.body) return null;
            const rect = a.getBoundingClientRect();
            const label = (a.getAttribute('aria-label') || a.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40);
            const cx = Math.min(Math.max(rect.left + rect.width / 2, 0), innerWidth - 1);
            const cy = Math.min(Math.max(rect.top + rect.height / 2, 0), innerHeight - 1);
            const hit = document.elementFromPoint(cx, cy);
            const bar = hit && !a.contains(hit) && !hit.contains(a)
              ? [...document.querySelectorAll('header,nav,footer')].find(b => b.contains(hit) && ['fixed', 'sticky'].includes(getComputedStyle(b).position))
              : null;
            return { key: a.tagName + label + Math.round(rect.top + scrollY), label, covered: bar ? bar.tagName.toLowerCase() : null };
          });
          if (!r) continue;
          if (seen.has(r.key)) break;
          seen.add(r.key);
          if (r.covered) problems.push(`${width}/${textSize} ${path} «${r.label}» bajo ${r.covered}`);
        }
      }
      await context.close();
    }
  }
  assert.equal(problems.length, 0, problems.join('\n'));
  console.log(`PASS foco visible: ${paths.length} rutas × 3 tamaños × 2 tamaños de letra, sin controles enfocados bajo barras fijas`);
} finally { await browser.close(); }
