# NUBI — Fase 14 · Preparación del piloto · Informe principal

17/11/2026 · Rama `review/phase-14-pilot-readiness`, creada desde `integration/phase-13` (`779f554`). Rama de integración estable: `integration/phase-13`. **Sin merge a `main`, sin despliegue y sin cambios en historias, textos educativos, personajes, ilustraciones, logotipo, motor ni diseño.** `validation.status` sigue en `pendiente-validacion`.

**Conclusión breve.** Técnicamente, NUBI está en buen estado: el catálogo está completo, el cuento y el cómic se recorren sin bloqueos y no hay incumplimientos de las líneas rojas. El análisis documental encuentra un enfoque pedagógico respetuoso y coherente con sus fundamentos. Antes de un piloto con niños y niñas hay **tres problemas IMPORTANTES**, uno de ellos de representación de la CAA, y un conjunto de hipótesis que **solo pueden resolver personas**. Nada de este informe valida el contenido.

Notación: **HECHO** (verificado aquí), **HIPÓTESIS** (necesita personas), **PROPUESTA** (requiere aprobación).

Documentos de la fase:

- [PEDAGOGICAL_REVIEW.md](PEDAGOGICAL_REVIEW.md): observaciones P-01 a P-22.
- [COGNITIVE_ACCESSIBILITY_REVIEW.md](COGNITIVE_ACCESSIBILITY_REVIEW.md): C-01 a C-13.
- [MANUAL_ACCESSIBILITY_PROTOCOL.md](MANUAL_ACCESSIBILITY_PROTOCOL.md): M-01 a M-16.
- [CHILD_USABILITY_PROTOCOL.md](CHILD_USABILITY_PROTOCOL.md): 8 tareas.
- [DECISION_REGISTER.md](DECISION_REGISTER.md): D-01 a D-15.
- [PILOT_BLOCKERS.md](PILOT_BLOCKERS.md): matriz de hallazgos.
- [CODEX_ART_REQUESTS.md](CODEX_ART_REQUESTS.md): A-1 y A-2.

---

## 1. ¿Qué partes de NUBI están técnicamente verificadas?

**HECHO.** Ejecutado en esta fase sobre el código de `integration/phase-13`, más los dos archivos de diagnóstico añadidos. Chromium 153 emulado en Linux, Playwright 1.63 y axe-core 4.14.

| Comprobación | Resultado |
|---|---|
| `npm run check` | ✅ tipos, **73 tests en 10 archivos** y build (también con los dos archivos de diagnóstico añadidos) |
| Catálogo | ✅ 72/72 recursos listos (calculado desde los registros) |
| `art-files.mjs` | ✅ 72 recursos / 224 archivos: hashes, decodificación, dimensiones y alfa |
| `art-layout.mjs` | ✅ 390/820/1180: 0 provisionales, 0 errores |
| `art-batch-4.mjs` | ✅ 15 viñetas, 62 regiones protegidas sin bocadillos encima |
| `art-batch-6.mjs` | ✅ herramientas, lugares y selector de estrategias (cuento y cómic) |
| `quality.mjs` | ✅ cuento y cómic completos, seis posibilidades, emociones, intensidad, resumen, persistencia, borrado, teclado, vídeo; **axe sin infracciones** en 36 estados; sin peticiones externas |
| `focus-obscured.mjs` | ✅ foco nunca bajo barras fijas (letra normal y 125 %) |
| `screens.mjs` | ✅ 9 rutas, axe sin infracciones |
| `story-fit.mjs` | ✅ texto sin desplazamiento con letra normal; con 125 % se desplaza sin tapar nada |
| `narration.mjs` | ✅ sin sonido automático; solo voz local; alternativa textual |
| `comic-flow.mjs` | ✅ 15 viñetas en orden con ratón, teclado y Tab + Enter; Atrás; recuperación del progreso; movimiento reducido |
| `story-preload.mjs` | ✅ nada se descarga sin mostrarse ni dos veces; composición 3:4/16:9 correcta (DPR 1 y 2) |
| `reflow-probe.mjs` (nuevo, diagnóstico) | ⚠️ zoom emulado: 200 % correcto; **400 % deja el reproductor sin espacio** (C-01) |
| `scripts/content-report.ts` (nuevo, diagnóstico) | 6 frases > 15 palabras, 9 `short` > 8, 4 páginas sin `short` |

No se ejecutó `art-batch-5.mjs`, porque reescribe evidencias versionadas de Codex y no hay cambios que la afecten (pasó en la fase 13). **No es una certificación WCAG**: axe y Chromium emulado no sustituyen lector de pantalla, zoom real ni dispositivos.

## 2. ¿Qué aspectos pedagógicos parecen adecuados según el análisis documental?

**HECHO** sobre el texto; que funcione con niños y niñas es una **HIPÓTESIS**:

- El cambio se explica de forma tranquilizadora: «Está bien y vuelve mañana»; «la plástica no se ha quitado».
- Hay reacciones diversas sin jerarquía y nadie corrige la autorregulación de Teo.
- La CAA de Lía tiene voz propia en el texto completo y en el cómic.
- Los apoyos sensoriales se normalizan: «como ponerse unas gafas».
- Los adultos son respetuosos y hay corregulación (Pilar).
- Seis decisiones sin etiqueta de acierto, todas explorables. «Salir sin avisar» valida la necesidad, explica el efecto en otras personas sin dramatizar y ofrece otra forma de conseguir lo mismo.
- La actividad de emociones permite no responder, combinar «No lo sé» con otras respuestas, elegir «Otra cosa» y una necesidad. No hay inferencia emocional.
- Las herramientas son concretas, con varias formas de hacerse (también no orales) y notas que no prometen resultados universales.
- La guía familiar no plantea obediencia, recompensas ni castigos; incluye señales para parar y notas de respeto.

## 3. ¿Qué riesgos o problemas concretos se han encontrado?

**IMPORTANTE (HECHO):**

1. **C-03 / P-02.** La versión de lectura fácil de la escena 2 **elimina la CAA de Lía** y atribuye emociones («Bruno se enfada», «Lía no está segura»).
2. **C-02.** «Textos cortos» solo cubre las 20 páginas del cuento. Las consecuencias, el texto más denso, no se simplifican, y 4 páginas no tienen versión corta.
3. **C-01.** Con zoom del 400 % (emulado), el reproductor deja 5 px de contenido (WCAG 1.4.10).

**MEJORA (HECHO):**

- Masculino genérico dirigido al lector en «Salir sin avisar» (P-15).
- Afirmaciones de certeza en herramientas (P-16).
- Frases largas (§1).
- Coherencia biblioteca / espacio tranquilo (P-19).
- Controles duplicados en consecuencias y control deshabilitado siempre visible (C-04, C-05).
- Añadidos a la guía familiar (P-08, P-11.3, P-21).

**HIPÓTESIS de riesgo** (ver §4):

- Ambigüedad de la intensidad única (P-05).
- Continuidad narrativa tras las decisiones (P-13).
- Reconocimiento de ilustraciones pequeñas (C-08, C-09).
- Lenguaje figurado (P-03).

## 4. ¿Qué aspectos requieren validación humana?

- **Revisión profesional y por personas autistas adultas:**
  - «Salir sin avisar» (P-11).
  - Lenguaje figurado e imperativos (D-09).
  - Escala de intensidad (P-05).
  - Práctica de «pequeños cambios» en casa (P-21).
  - Realismo de las respuestas adultas (P-12).
  - Los textos propuestos en D-02, D-05 y D-07.
- **Con niños y niñas** (tareas del protocolo):
  - Contrafáctico (P-04).
  - Abstracción de la escena 3 (P-07).
  - Continuidad (P-13).
  - Reconocimiento de emociones y herramientas a 56–64 px (C-08, C-09).
  - Densidad de 8 tarjetas (C-07).
  - Comprensión del resumen (C-11).
  - Descubrimiento de «Probar otra posibilidad» (C-04).
  - Asociación del «NO SÉ» de Lía (D-08).
- **Con familias:** utilidad de la guía; aceptabilidad de la voz del sistema (D-03).

## 5. ¿Qué pruebas necesitan dispositivos físicos?

Todas las del `MANUAL_ACCESSIBILITY_PROTOCOL.md`, **PENDIENTES DE EJECUCIÓN MANUAL**:

- VoiceOver iOS y macOS, TalkBack y NVDA.
- Zoom real del navegador (200 y 400 %) y del sistema.
- Orientación en tableta física.
- Uso táctil real.
- Movimiento reducido del sistema.
- Safari, Firefox y Chrome Android.
- Voz local en dispositivos reales.
- Contraste en pantalla real.

No se ha ejecutado ninguna en esta fase.

## 6. ¿Qué falta para iniciar un piloto supervisado?

1. Corregir C-03 (texto, decisión D-05) y resolver o **acotar por escrito** C-01 y C-02.
2. Revisión por al menos una persona profesional (PT, AL u orientación) y una persona autista adulta, registrada en `DECISION_REGISTER.md`.
3. Decidir D-02 (frase del horario) y D-07 («Salir sin avisar»).
4. Ejecutar como mínimo un lector de pantalla móvil (M-01 o M-03), orientación (M-09), uso táctil (M-10) y el navegador de los dispositivos del piloto (M-12 o M-14).
5. Preparar consentimientos, asentimiento, señal de parar y hojas anónimas (`CHILD_USABILITY_PROTOCOL.md`).
6. Usar los dispositivos del piloto con el progreso borrado y sin ninguna analítica.

## 7. ¿Qué falta para considerar un lanzamiento público?

Además de lo anterior:

- Completar el piloto y aplicar sus conclusiones.
- `validation.status: 'validado'`, decidido por una persona responsable tras la revisión profesional, de personas autistas adultas y de familias (`CONTENT_STANDARD.md` §8).
- Resolver C-01, C-02 y todas las pruebas M-01 a M-16.
- Decidir D-01 (logotipo) y D-03 (narración humana o voz del sistema; vídeo o retirar la promesa del formato).
- Producir los recursos «en preparación» de la guía o retirarlos.
- Revisión legal y de privacidad del despliegue: aviso de privacidad, `localStorage`, ausencia de terceros.
- Plan de soporte y de retirada de contenido.

## 8. ¿Qué corresponde a Claude, a Codex o a una persona responsable?

| Quién | Acciones |
|---|---|
| **Persona responsable** | Decidir D-01 a D-15. Aprobar o redactar los textos (D-02, D-05, D-07, D-09, D-11). Organizar las revisiones y el piloto con las garantías del protocolo. Ejecutar o encargar las pruebas manuales M-01 a M-16. Decidir el alcance del piloto (acotación de C-01 y C-02). Es la única que puede cambiar el estado de validación |
| **Claude** | Tras la aprobación: implementar el esquema de versiones cortas (D-04), el ajuste del reproductor con zoom alto (D-10) con una prueba de regresión basada en `reflow-probe.mjs`, los cambios de texto aprobados (sin redactarlos por iniciativa propia) y la reubicación del bocadillo si se aprueba D-08. Mantener las pruebas |
| **Codex** | A-1 (`tool-expresar-desacuerdo`) y A-2 (refuerzo de emociones), **solo si la validación lo confirma**. Versión del logotipo con contorno reforzado si D-01 lo pide |

## 9. Cambios de esta fase

| Archivo | Tipo |
|---|---|
| `docs/review/*.md` (8 documentos) | Documentación |
| `scripts/content-report.ts` | Diagnóstico de lenguaje, no invasivo; no se ejecuta en `check` |
| `tests/browser/reflow-probe.mjs` | Sonda de reajuste con zoom, solo diagnóstico (no falla) |
| `CLAUDE.md` | Enlace a este informe; la rama estable sigue siendo `integration/phase-13` |

No se ha cambiado código de la aplicación, contenido, imágenes ni evidencias históricas.
