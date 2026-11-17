/**
 * Informe de lenguaje (no invasivo, no falla): compara los textos infantiles con docs/CONTENT_STANDARD.md §2.
 * Uso: node scripts/content-report.ts
 *
 * Solo cuenta palabras; NO mide comprensión. Un texto que cumple las cifras puede ser difícil
 * (y al revés): las conclusiones requieren revisión humana y prueba con niños y niñas.
 */
import { storyList } from '../src/content/stories/index.ts';
import { toolList } from '../src/content/tools.ts';
import { emotionList } from '../src/content/emotions.ts';

const MAX_TEXT = 15; // palabras por frase en `text`
const MAX_SHORT = 8; // palabras en `short`

/** Divide en frases, también las que van dentro de «…». */
const sentences = (t: string) =>
  t
    .replace(/[«»]/g, ' ')
    .split(/(?<=[.?!…])\s+/)
    .map((s) => s.trim())
    .filter((s) => /\p{L}/u.test(s));
const words = (t: string) => t.replace(/[«»"¿?¡!.,:;…()]/g, ' ').split(/\s+/).filter(Boolean).length;

const long: string[] = [];
const shortLong: string[] = [];
const noShort: string[] = [];
const check = (where: string, text: string) => {
  for (const s of sentences(text)) if (words(s) > MAX_TEXT) long.push(`${where} (${words(s)}): ${s}`);
};

for (const story of storyList) {
  for (const scene of story.scenes) {
    for (const step of scene.steps) {
      if (step.type === 'beat') {
        check(`${story.id}/${step.id}`, step.text);
        if (step.short && words(step.short) > MAX_SHORT) shortLong.push(`${story.id}/${step.id} (${words(step.short)}): ${step.short}`);
        if (!step.short && sentences(step.text).length > 1) noShort.push(`${story.id}/${step.id}: ${step.text}`);
      }
      if (step.type === 'choice')
        for (const o of step.options) {
          if (!o.consequence) continue; // opción ramificada: su consecuencia son escenas
          o.consequence.story.forEach((f, i) => check(`${story.id}/${o.id}/momento-${i + 1}`, f.text));
          for (const k of ['youMayFeel', 'othersMay', 'helpsWhen', 'keepInMind', 'anotherWay'] as const) {
            const v = o.consequence[k];
            if (v) check(`${story.id}/${o.id}/${k}`, v);
          }
        }
    }
    for (const p of scene.comic ?? []) {
      if (p.caption) check(`${story.id}/${p.id}/leyenda`, p.caption);
      for (const b of p.bubbles) check(`${story.id}/${p.id}/${b.id}`, b.text);
    }
  }
}
for (const t of toolList) {
  check(`herramienta ${t.id}/childText`, t.childText);
  t.steps.forEach((s, i) => check(`herramienta ${t.id}/paso-${i + 1}`, s));
  check(`herramienta ${t.id}/note`, t.note);
}
for (const e of emotionList) check(`emoción ${e.id}`, e.childText);

const section = (title: string, list: string[]) => console.log(`\n${title} (${list.length})\n${list.map((l) => `- ${l}`).join('\n') || '- ninguna'}`);
console.log('Informe de lenguaje · CONTENT_STANDARD §2 (cifras orientativas, no miden comprensión)');
section(`Frases de más de ${MAX_TEXT} palabras`, long);
section(`Versiones «short» de más de ${MAX_SHORT} palabras`, shortLong);
section('Páginas de varias frases sin versión «short»', noShort);
