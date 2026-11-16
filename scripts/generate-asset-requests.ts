/**
 * Genera docs/ASSET_REQUESTS.md a partir del registro de recursos
 * (src/content/assets). Ejecutar: npm run assets:doc
 * Requiere Node >= 22.18 (ejecución nativa de TypeScript).
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { assetGroups } from '../src/content/assets/index.ts';
import { characters } from '../src/content/characters.ts';

const out = fileURLToPath(new URL('../docs/ASSET_REQUESTS.md', import.meta.url));
const total = assetGroups.reduce((n, g) => n + g.assets.length, 0);
const done = assetGroups.reduce((n, g) => n + g.assets.filter((a) => a.status === 'listo').length, 0);
const KIND: Record<string, string> = {
  portada: 'Portada',
  personaje: 'Personaje',
  lugar: 'Lugar',
  cubierta: 'Cubierta',
  escena: 'Escena de cuento',
  vineta: 'Viñeta de cómic',
  opcion: 'Opción / consecuencia',
  herramienta: 'Herramienta',
  emocion: 'Emoción',
};

const lines: string[] = [];
const p = (s = '') => lines.push(s);

p('# Solicitudes de recursos visuales');
p();
p('> Archivo **generado** con `npm run assets:doc` desde `src/content/assets/` y `src/content/stories/*/assets.ts`.');
p('> No lo edites a mano: cambia el registro y vuelve a generarlo.');
p();
p(`Estado: **${done} de ${total}** recursos entregados. Mientras un recurso esté \`pendiente\`, la app muestra un placeholder vectorial temporal.`);
p();
p('## Instrucciones generales para la producción (ChatGPT / equipo de ilustración)');
p();
p('- **Estilo:** ilustración 2D contemporánea con inspiración en el cuento infantil europeo. Formas suaves, texturas de papel o gouache digital muy sutiles, línea fina y cálida. Ver `docs/VISUAL_GUIDE.md`.');
p('- **Paleta:** crema `#FBF5EA`, azul petróleo `#22606B`, coral `#E2704F`, verde salvia `#6F8F69`, mostaza `#E3AE4C`, tinta `#22333A`. Sin colores saturados ni neón.');
p('- **Originalidad:** personajes, escenarios y composiciones originales de NUBI. No imitar personajes, estilos reconocibles de autores vivos ni marcas. No usar fotografías.');
p('- **Sin texto en las imágenes.** Textos, bocadillos y subtítulos los pone la app (permite traducir, ampliar letra y leer en voz alta).');
p('- **Representación respetuosa:** diversidad de rasgos, tonos de piel y familias. Los apoyos (cascos, comunicador de pictogramas, tarjetas) se dibujan con naturalidad, nunca como algo raro. Nadie mira fijamente a cámara por obligación; no se exige contacto visual.');
p('- **Calma sensorial:** sin destellos, patrones de alto contraste, rayas finas repetitivas ni escenas recargadas. Expresiones claras pero no exageradas.');
p('- **Consistencia:** respetar las hojas de personaje (`char-*`). Misma localización = mismos elementos (verja, reloj, pizarra, perchas).');
p('- **Formato de entrega:** WebP (calidad 85) para escenas; PNG o WebP con alfa cuando se pide transparencia. Dimensiones indicadas = tamaño de exportación (2x). sRGB.');
p('- **Entrega:** guardar el archivo en `public` + la ruta indicada (p. ej. `public/media/places/colegio.webp`) y cambiar `status` a `listo` en el registro.');
p();
p('## Reparto (referencia)');
p();
p('| Personaje | Papel | Descripción visual |');
p('|---|---|---|');
for (const c of Object.values(characters)) p(`| **${c.name}** | ${c.role} | ${c.visual} |`);
p();

for (const group of assetGroups) {
  p(`## ${group.title}`);
  p();
  p('| ID | Tipo | Archivo | Estado |');
  p('|---|---|---|---|');
  for (const a of group.assets) p(`| \`${a.id}\` | ${KIND[a.kind] ?? a.kind} | \`${a.file}\` | ${a.status} |`);
  p();
  for (const a of group.assets) {
    p(`### \`${a.id}\``);
    p();
    p(`- **Nombre de archivo:** \`public${a.file}\``);
    p(`- **Escena / uso:** ${a.usage}`);
    p(`- **Descripción visual:** ${a.description}`);
    p(`- **Personajes:** ${a.characters.length ? a.characters.map((id) => characters[id]?.name ?? id).join(', ') : '—'}`);
    p(`- **Emoción o acción:** ${a.emotionOrAction}`);
    p(`- **Proporción:** ${a.aspect}`);
    p(`- **Dimensiones recomendadas:** ${a.size.width} × ${a.size.height} px`);
    p(`- **Fondo y composición:** ${a.background}`);
    p(`- **Transparencia:** ${a.transparent ? 'Sí (canal alfa)' : 'No'}`);
    p(`- **Texto alternativo:** «${a.alt}»`);
    p();
  }
}

p('## Audio y vídeo (pendientes)');
p();
p('- **Narración por escena (opcional):** archivos MP3/OGG en `public/media/stories/<id>/audio/<paso>.mp3`, voz humana cálida y pausada, sin música de fondo. Se enlazan en el campo `narration` de cada paso `beat`.');
p('- **Vídeo del piloto:** `public/media/stories/una-manana-diferente/video/una-manana-diferente.{webm,mp4}`, 1920×1080, sin cortes bruscos ni destellos, música opcional muy suave y desactivable en la mezcla. Subtítulos: `una-manana-diferente.es.vtt` (borrador ya incluido). Al entregarlo, cambiar `video.status` a `listo` en `story.ts`.');
p();

writeFileSync(out, lines.join('\n'));
console.log(`docs/ASSET_REQUESTS.md generado (${total} recursos).`);
