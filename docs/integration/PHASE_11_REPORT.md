# NUBI — Fase 11 · Integración de las nueve emociones

17/11/2026 · Rama `integration/phase-11`, creada desde `integration/phase-9` (`3416c7a`) con `feat/codex-art-batch-5` (`0f22300`) fusionada. **Sin merge a `main` y sin despliegue.**

Resumen: las nueve emociones de Codex están integradas sin conflictos. Ahora el **mismo Nubi** de «Mis emociones» aparece también en la pregunta «Si estuvieras en la clase de Teo, ¿cómo te sentirías?», en cuento y en cómic. El cambio se hizo en dos piezas:

- **`ToggleCard`** admite un recurso visual inicial, `leading`, en el mismo hueco que el icono.
- **`FeelingsView`** lo usa solo cuando la opción declara `emotion`.

Los textos, los IDs de las respuestas, su almacenamiento, el motor y el arte no cambian.

---

## 1. Estado de Git

| Dato | Valor |
|---|---|
| Base | `integration/phase-9` @ `3416c7a` (fase 9 publicada) |
| Rama artística | `feat/codex-art-batch-5` @ `0f22300`: un único commit sobre `3416c7a`. Se comprobó que parte de la base |
| Merge | `git merge --no-ff origin/feat/codex-art-batch-5` → `fb1f773` |
| Conflictos | **Ninguno.** El árbol tras el merge es idéntico al de la rama artística |
| Commits de esta fase | Merge + integración React y pruebas + documentación |

## 2. Resultado de la integración artística

Se conservan sin cambios:

- 9 PNG principales de 1024 px y 18 variantes de 256 y 512 px en `public/media/emotions/`.
- Los originales de 1254 px y la serie exploratoria en `docs/art-batch-5/originals/`.
- El registro (`common.ts`: `status: 'listo'` y `variants: [256, 512]` en las nueve `emo-*`).
- Las láminas de revisión (colección, tamaños pequeños, alfa).
- `exports.json`, `generation.json` y los resultados de validación.
- `tests/art-batch-5-files.py`, `scripts/export-art-batch-5.py` y el manifiesto de entrega.

`tests/browser/art-batch-5.mjs` escribe sus capturas y `browser-results.json` en `docs/art-batch-5/`. Tras cada ejecución de esta fase se restauraron con `git checkout`, de modo que las evidencias de Codex quedan como él las entregó: muestran el selector **antes** de la integración.

## 3. Estado del catálogo

Calculado desde los registros: **72 recursos · 59 listos · 13 pendientes**. Coincide con lo esperado. `npm run assets:doc` no genera diferencias.

| Tipo | Listos | Pendientes |
|---|---|---|
| Portada, cubierta | 2 | 0 |
| Personajes (incluido Nubi) | 11 | 0 |
| Escenas (con composición 3:4) | 10 | 0 |
| Opciones y consecuencias | 12 | 0 |
| Viñetas | 15 | 0 |
| **Emociones** | **9** | **0** |
| Herramientas | 0 | **7**: `tool-pedir-ayuda`, `tool-descansar`, `tool-espacio-tranquilo`, `tool-comunicar-necesidad`, `tool-anticipar-cambios`, `tool-expresar-desacuerdo`, `tool-apoyos-sensoriales` |
| Lugares | 0 | **6**: `place-colegio`, `place-casa`, `place-parque`, `place-amigos`, `place-emociones`, `place-herramientas` |

## 4. Cambios en React

| Archivo | Cambio |
|---|---|
| `src/components/player/Toggle.tsx` | `ToggleCard` acepta `leading?: ReactNode` (ver detalle abajo) |
| `src/components/player/interactions.tsx` | `FeelingsView`: si la opción tiene `o.emotion`, pasa `leading` (ver detalle abajo) |

**`ToggleCard`.** Si recibe `leading`, ese contenido ocupa **el mismo hueco** que el icono: `size-14` (56 px) con el fondo tintado de la tarjeta. El hueco se marca `aria-hidden` y `data-leading`. Si no recibe `leading`, se muestra el icono como antes. No cambian la selección, el borde, la marca ✓, `aria-pressed`, el foco ni el resto de usos (saber/necesitar, estrategias).

**`FeelingsView`.** Pasa `leading={<EmotionArt emotion={…} mood={emotions[o.emotion].mood} size={56} />}`, con el `mood` tomado del catálogo `emotions` y sin ningún mapa nuevo. Las opciones sin `emotion` conservan `icon`.

Decisiones:

- **Solo el campo tipado `o.emotion`** decide la ilustración, nunca la etiqueta, el ID de la opción ni el de la historia. Una historia futura funciona sin condiciones específicas.
- **56 px** llena el hueco del icono; «Mis emociones» usa 64 px en su rejilla. La escala es coherente y las tarjetas mantienen la misma altura que antes (86 px).
- La imagen es **decorativa** (`alt=""` dentro de un hueco `aria-hidden`). El nombre accesible sigue siendo el texto visible y no hay anuncios duplicados.
- `sizes="56px"` → se descarga la variante de **256 px**, nítida también en DPR 2.
- Sin animaciones nuevas.

No se modificaron el motor, `story.ts`, `emotions.ts`, los registros ni ningún archivo gráfico.

## 5. Selector antes y después

| | Antes (fase 9) | Después (fase 11) |
|---|---|---|
| Sorpresa, Curiosidad, Nervios o inseguridad, Frustración, Tranquilidad | Iconos SVG genéricos (destello, lupa, nube, nudo, hoja) | Ilustración de Nubi `emo-sorpresa`, `emo-curiosidad`, `emo-inseguridad`, `emo-frustracion`, `emo-calma` |
| Ganas de saber el plan, Otra cosa, No lo sé | Iconos (calendario, puntos, interrogación) | **Sin cambios** |
| Textos visibles | — | Idénticos («Nervios o inseguridad» sigue leyéndose así; «Tranquilidad» usa `emo-calma`) |
| Selección, «No lo sé» junto a otras respuestas, intensidad opcional, continuar sin responder, recuperación | — | Sin cambios (mismos IDs y almacenamiento) |

Capturas del «antes» en las evidencias de Codex: [390](../art-batch-5/previews/390-selector-cuento.png) · [820](../art-batch-5/previews/820-selector-cuento.png) · [1180](../art-batch-5/previews/1180-selector-cuento.png). El «después», en §7.

## 6. Pruebas automatizadas

### Nuevas y actualizadas

- **`src/components/player/feelings.test.ts`** (8 tests unitarios, `react-dom/server`, sin dependencias nuevas):
  - `ToggleCard` sin `leading` muestra el icono.
  - Con `leading`, lo muestra en el mismo hueco, decorativo y sin duplicar el icono.
  - La selección sigue indicándose con borde y ✓.
  - Cada emoción del catálogo tiene su `emo-<id>` listo, 1:1 y transparente, y coincide con el `illustration` del catálogo.
  - Toda opción con `emotion` apunta al catálogo.
  - `FeelingsView` del piloto: 5 ilustraciones correctas + 3 iconos y textos intactos.
  - Paso sintético: «Sorpresa» sin `emotion` → icono; «Cómo me siento» con `emotion: 'cansancio'` → `emo-cansancio`.
  - Se recupera la selección guardada, con «No lo sé» junto a otra respuesta.
  - **Sin la integración fallan 3 de los 8.**
- **`tests/browser/art-batch-5.mjs`**: se reemplazó **solo** el bloque del selector, que antes comprobaba que seguía usando SVG. Ahora, en **cuento y cómic** × 390/820/1180, comprueba:
  - Cinco opciones con `EmotionArt` y la imagen exacta de cada `EmotionId`.
  - Tres opciones con icono y la marca ✓.
  - Texto visible original.
  - Imagen cargada, transparente (alfa 0 en la esquina, con dibujo en el centro), de 56 a 64 px, cuadrada, `contain`, dentro de su hueco, decorativa y servida en 256w.
  - Tab desde el escenario hasta la primera tarjeta, con `:focus-visible` y contorno.
  - Enter para seleccionar y deseleccionar; selección múltiple con «No lo sé».
  - Intensidad opcional y ausencia de desbordamiento.
  - Además, un listener de **errores y avisos de consola** para toda la prueba.

  Las verificaciones de Codex sobre «Mis emociones» (teclado, `aria-pressed`, títulos, `contain`, 256w, axe) no cambian. **Sin la integración, la prueba falla** («390/comic sorpresa: EmotionArt emo-sorpresa»).

### Ejecución final sobre el código definitivo

Chromium 153 (preinstalado), Playwright 1.63.0 y `@axe-core/playwright` 4.14.0 en `/tmp/nubi-browser-tools`; Vite en `127.0.0.1:5173`.

| Prueba | Resultado | Tiempo |
|---|---|---|
| `npm run assets:doc` | ✅ 72 recursos, sin diferencias | — |
| `npm run check` | ✅ tipos, **63 tests en 8 archivos** (55 de base + 8 nuevos) y build | — |
| `art-files.mjs` | ✅ 59 recursos / 185 archivos: decodificación, dimensiones, hashes y alfa | 7 s |
| `art-layout.mjs` | ✅ 390/820/1180: cargado 163, provisional 42 (herramientas y lugares), **error 0**; solo el recorte decorativo previsto de `portada-fondo` | 69 s |
| `art-batch-2.mjs` | ✅ 10 escenas × 3 tamaños | 22 s |
| `art-batch-3.mjs` | ✅ seis decisiones y doce momentos × 3 tamaños | 12 s |
| `art-batch-4.mjs` | ✅ 15 viñetas × 3 tamaños, 62 regiones protegidas | 12 s |
| `art-batch-5.mjs` (actualizada) | ✅ Mis emociones + selector en cuento y cómic × 3 tamaños | 13 s |
| `quality.mjs` | ✅ cuento, cómic, emociones, intensidad, resumen, persistencia, borrado, teclado; axe sin infracciones | 127 s |
| `story-fit.mjs` | ✅ 23 páginas × 3 tamaños × 2 tamaños de letra | 58 s |
| `focus-obscured.mjs` | ✅ | 75 s |
| `narration.mjs` | ✅ | 2 s |
| `screens.mjs` | ✅ | 8 s |
| `comic-sizes.mjs` | ✅ | 20 s |
| `comic-flow.mjs` | ✅ | 10 s |

No se modificó ninguna otra prueba ni se relajó ninguna comprobación.

## 7. Capturas

Selector con Sorpresa y Tranquilidad seleccionadas, intensidad «Un poco» y foco de teclado en Curiosidad:

| | 390 × 844 (DPR 2) | 820 × 1180 | 1180 × 820 |
|---|---|---|---|
| Cuento | [selector](phase-11/390-cuento-selector.webp) | [selector](phase-11/820-cuento-selector.webp) | [selector](phase-11/1180-cuento-selector.webp) |
| Cómic | [selector](phase-11/390-comic-selector.webp) | [selector](phase-11/820-comic-selector.webp) | [selector](phase-11/1180-comic-selector.webp) |
| Mis emociones | [rejilla](phase-11/390-emociones.webp) | [rejilla](phase-11/820-emociones.webp) | [rejilla](phase-11/1180-emociones.webp) |

Medidas, iguales en cuento y cómic:

| Viewport | Columnas | Alto de tarjeta | Etiqueta | Arte | Desbordamiento |
|---|---|---|---|---|---|
| 390 × 844 | 1 | 86 px | 18 px | 56 px, 256w | No; el escenario se desplaza por encima de los controles |
| 820 × 1180 | 2 | 86 px | 18 px | 56 px, 256w | No; cabe sin desplazar |
| 1180 × 820 | 4 | 86 px | 18 px | 56 px, 256w | No; cabe sin desplazar |

## 8. Accesibilidad

- **Nombre accesible = texto visible.** La imagen es decorativa y el lector no la anuncia ni la duplica. Las pruebas localizan cada tarjeta por su nombre exacto.
- **Estado.** `aria-pressed`, borde de 3 px y marca ✓; la ilustración nunca es el único indicador.
- **Teclado y foco.** Tab llega a las tarjetas en orden, Enter selecciona y deselecciona, y el anillo de foco es visible. No hay foco tapado por barras (`focus-obscured`).
- **Objetivos táctiles.** Tarjetas de 86 px de alto a ancho de columna (≥ 48 px).
- **Texto.** Sin reducción de tamaño (18 px, `reading-text`); los ajustes de lectura siguen aplicándose.
- **Contraste.** axe sin infracciones en `quality.mjs`, `screens.mjs` y «Mis emociones» (`art-batch-5.mjs`).
- **Movimiento reducido.** No hay animación nueva; la del detalle de «Mis emociones» ya respeta los tres interruptores.
- **Comunicación.** La palabra sigue siendo la referencia. Las expresiones de Nubi son metáforas y no atribuyen emociones al niño o la niña.

No es una certificación WCAG. No se ha probado con lector de pantalla real ni en dispositivos físicos.

## 9. Regresiones encontradas y corregidas

- **Ninguna en la aplicación.** Todas las baterías anteriores pasan sin cambios.
- **En la propia prueba, durante el desarrollo:** la comprobación de transparencia con `<canvas>` provocaba un aviso de Chromium por lecturas repetidas, y el nuevo listener de consola lo detectó. Se corrigió con `getContext('2d', { willReadFrequently: true })`.
- `art-batch-5.mjs` sobrescribe evidencias versionadas de Codex. No se cambió (se pidió tocar solo el bloque del selector); se restauraron tras cada ejecución. Recomendación en §11.

## 10. Pendiente y estado de la identidad gráfica

### Ya con ilustración definitiva

- Portada.
- Nubi guía (`nubi-saludo`, `nubi-pensando`) en portada, cuento, resumen y Mi mundo.
- Personajes del reparto.
- Cubierta.
- Las 10 escenas del cuento con versión 3:4.
- Seis decisiones y sus doce consecuencias.
- Las 15 viñetas del cómic.
- **Las nueve emociones**, en «Mis emociones» y en el selector «¿Cómo te sentirías?».

### Todavía provisional o con iconos

| Zona | Estado | Depende de |
|---|---|---|
| *Mis herramientas* (rejilla y detalle) | Placeholder vectorial «provisional» | `tool-*` (Codex) |
| Selector «¿Cuáles podrían ayudarte?» (estrategias del cuento y del cómic) | Iconos SVG en `ToggleCard` | `tool-*`. Cuando lleguen, el mismo patrón `leading` servirá, decidido por el `ToolId` tipado |
| *Mi mundo* (tarjetas de lugar) | Placeholder vectorial | `place-*` (Codex) |
| Logotipo de la cabecera (`Logo`) | Vector de Nubi | Decisión de marca pendiente; la propuesta de Codex sigue sin conectar |
| Página «Este camino no existe» | Vector de Nubi pensativo | Podría usar `GuideArt` (`nubi-pensando`); cambio menor, no hecho por estar fuera de alcance |
| Opciones sin emoción (Ganas de saber el plan, Otra cosa, No lo sé) e iconos de «Puede notarse así» | Iconos de interfaz | Diseño previsto, no son provisionales |

Otros pendientes:

1. Frase «de arriba abajo» de `ume-c-horario`, que sigue esperando decisión humana.
2. Precarga de escenas en vertical (fase 9, §10.4).
3. Revisión humana y pedagógica del reconocimiento de emociones a 56–64 px. Codex advierte de que a ese tamaño los rasgos son pequeños; por eso las palabras siguen siendo la referencia.

## 11. Recomendaciones para Codex (siguiente lote: herramientas y lugares)

- **Base:** `feat/codex-art-batch-6`, creada desde `integration/phase-11`.
- **Herramientas (7).** Se ven en *Mis herramientas* a 96 px (rejilla) y unos 176–208 px (detalle). Cuando estén, Claude puede mostrarlas también en el selector de estrategias del cuento con el mismo patrón `leading` (56 px). Por eso deben leerse bien desde 56 px:
  - una sola acción por imagen,
  - fondo transparente sin halo,
  - sin texto,
  - apoyos (cascos, tarjeta de pausa, comunicador) coherentes con las escenas.
  Variantes recomendadas: 256 y 512 px.
- **Lugares (6).** Tarjetas 4:3 de *Mi mundo*, a ancho de columna (1 → 2 → 3 columnas). Variantes recomendadas: 800 y 1200 px.
- **Verificación:** `assets:doc`, `check`, `art-files`, `art-layout`, `screens`, `quality` y `focus-obscured`.
- **Pruebas que escriben evidencias:** usar una variable de entorno de salida (como `NUBI_ART_EVIDENCE` en el resto de pruebas) en lugar de una ruta fija en `docs/`, para no reescribir evidencias versionadas al repetir pruebas.
- **No cambiar** textos, IDs ni el contrato de imágenes sin aprobación humana.

## 12. Herramientas de diseño

`design-taste-frontend` y `web-design-guidelines` siguen instaladas en `.claude/skills/` (excluidas de Git en local) y aparecen en la lista de skills de esta sesión. **No se han reinstalado ni invocado**, y no se ha ejecutado el hook `Stop` de Taste Skill.

Se aplicaron a mano las reglas pertinentes de las Web Interface Guidelines:

- Imágenes decorativas con `alt=""`.
- Botones con nombre visible.
- Estado con `aria-pressed`.
- Foco visible.
- Imágenes con dimensiones y `sizes` honesto.
- Ninguna animación nueva.

La identidad de NUBI (crema, petróleo/coral/salvia/mostaza, Nunito/Atkinson, radios, espaciado) no cambia.
