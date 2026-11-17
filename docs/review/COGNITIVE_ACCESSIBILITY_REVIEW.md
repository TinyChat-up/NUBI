# Revisión de accesibilidad cognitiva · piloto

17/11/2026 · Rama `review/phase-14-pilot-readiness`.

**Método.** Inspección del código y de la interfaz real en Chromium (390×844, 820×1180, 1180×820 y viewports equivalentes a zoom), con mediciones reproducibles. **No se afirma que la experiencia sea cognitivamente accesible para todos los niños y niñas autistas**: los perfiles son muy diversos y solo la prueba con personas puede indicarlo.

Cada punto se clasifica como:

- **OBSERVABLE**: se puede comprobar en el producto, con evidencia.
- **HIPÓTESIS**: necesita una prueba con niños y niñas o con profesionales.

Perfiles considerados:

- Dificultades de comprensión lectora.
- Necesidad de más tiempo.
- Preferencia por apoyos visuales.
- Comunicación sin habla.
- Sensibilidad al ruido o al movimiento.
- Interpretación literal.
- Uso de tecnología de apoyo.

---

## 1. Lo que ya está resuelto (OBSERVABLE)

| Necesidad | Evidencia |
|---|---|
| Más tiempo | No hay temporizadores ni autoavance. La decisión dice «Tómate el tiempo que necesites». El progreso se guarda y se retoma (`?continuar=1`, `quality.mjs`) |
| Omitir respuestas | Solo la decisión exige elegir para avanzar. Emociones, preguntas y herramientas permiten «ninguna» (`storyEngine.test.ts`; recorrido de la fase 13) |
| Volver atrás | Botón «Atrás» y flecha ← en todos los pasos; mapa de «Escenas»; «Probar otra posibilidad» en cada consecuencia (`comic-flow.mjs`, `quality.mjs`) |
| Ruido y movimiento | Nada suena sin una acción. Hay tres interruptores de movimiento: sistema, Ajustes y botón «Animaciones» (`quality.mjs`, `narration.mjs`). Las escenas no se animan |
| Apoyos visuales | Las 72 ilustraciones son definitivas. Cada pregunta lleva una miniatura de la escena. Emociones y herramientas tienen ilustración en los selectores |
| Comunicación sin habla | Ninguna interacción exige hablar. Lía modela el uso de CAA. Las herramientas incluyen pictogramas, gestos, escritura y señalar |
| Lectura | Letra de 24–28 px en el cuento, 18 px en las tarjetas y nunca menos de 14 px. Ajustes de tamaño (hasta 125 %), espaciado, fuente Atkinson Hyperlegible, MAYÚSCULAS y «Textos cortos» |
| Tecnología de apoyo | Nombres accesibles, `aria-pressed`, región `aria-live` en el reproductor, foco visible y no tapado; axe sin infracciones automáticas (fase 13) |
| Consistencia | La acción principal («Siguiente») va siempre abajo a la derecha. Hay una sola familia de tarjetas seleccionables, con borde y ✓ |

---

## 2. Problemas observables

**C-01 · Con zoom del 400 % el reproductor queda sin espacio** — IMPORTANTE
- **Evidencia:** `node tests/browser/reflow-probe.mjs` (emulación de zoom por viewport, no zoom real del sistema).
  - Con 320×256 px CSS (400 % de 1280×1024), el escenario del cuento y del cómic mide **5 px**: la cabecera (82–102 px) y los controles (169 px) ocupan la pantalla.
  - En las pantallas generales, la cabecera pegajosa y la barra inferior fija ocupan 169 de 256 px.
  - Con 640×512 (200 %) el escenario conserva 275 px y no hay desbordamiento horizontal en ningún caso.
- **Por qué importa:** WCAG 1.4.10 (Reajuste). Una persona con baja visión que usa zoom alto en una pantalla apaisada no puede leer el cuento.
- **Propuesta (Claude, con aprobación de diseño):** en ventanas bajas (p. ej. `max-height` ≈ 30rem), dejar de fijar la cabecera y los controles para que formen parte del desplazamiento, o agrupar los cuatro controles secundarios.
- **No se ha implementado:** cambia la composición del reproductor (`NUBI_DESIGN_PRINCIPLES.md` §6) y requiere decisión.

**C-02 · «Textos cortos» solo cubre las páginas del cuento** — IMPORTANTE
- **Evidencia:** `settings.shortText` solo se usa en `StoryPlayer.tsx` para los `beat`.
  - Las consecuencias (2 momentos + 4–5 bloques: cómo te puedes sentir, cómo pueden sentirse otros, puede ayudar cuando, a tener en cuenta, otra forma), los pasos interactivos, las herramientas, el cómic y el resumen se muestran igual.
  - Además, 4 de las 20 páginas no tienen versión corta (`node scripts/content-report.ts`).
- **Por qué importa:** quien activa la lectura fácil encuentra el texto más denso del episodio, las consecuencias, sin simplificar. En móvil, una consecuencia exige 1150–1640 px de desplazamiento (medido en la fase 7).
- **Propuesta:**
  - Decidir qué partes deben tener versión corta. Las consecuencias son la prioridad.
  - Los textos los escribe y aprueba una persona.
  - Claude ampliaría el esquema con campos `short` opcionales; es un cambio de `types.ts` que requiere aprobación.

**C-03 · La versión corta de la escena 2 pierde la CAA de Lía** — IMPORTANTE (ver `PEDAGOGICAL_REVIEW.md` P-02).

**C-04 · Dos controles hacen lo mismo en las consecuencias** — MEJORA
- **Evidencia:**
  - En cada consecuencia, «Seguir con la historia» (dentro del contenido) y «Siguiente» (en los controles) llevan al mismo sitio.
  - «Probar otra posibilidad» queda bajo el pliegue en móvil y en 1180×820 (500–640 px por debajo, fase 7).
  - La tarjeta que asoma sirve de pista, pero no hay una indicación explícita.
- **HIPÓTESIS:** puede que no se descubra la vuelta a otras posibilidades.
- **Propuesta:** observar en la tarea 5 antes de cambiar nada.

**C-05 · Controles del reproductor en móvil** — MEJORA / HIPÓTESIS
- **Evidencia:** hay 6 controles siempre visibles:
  - Repetir, Leer/Escuchar, Subtítulos (deshabilitado en modo Leer), Animaciones, Atrás y Siguiente.
  - El botón de modo muestra el **estado** («Leer») y no la acción; el nombre accesible lo aclara («Modo leer activado. Cambiar a escuchar»).
- **HIPÓTESIS:** un control deshabilitado siempre visible, y una etiqueta de estado que parece una orden, pueden confundir.
- **Propuesta:** observar en la tarea 2.

**C-06 · Instrucciones** — OBSERVABLE, sin problema grave. Las ayudas son cortas y explícitas: «Puedes elegir varias. O ninguna.», «Elige las preguntas que quieras.», «Elige una para ver qué puede pasar. Después puedes probar otras.». La más larga, la de la decisión, tiene 14 palabras en tres frases cortas.

**C-07 · Estímulos simultáneos** — OBSERVABLE. Las pantallas más cargadas son:
- La pregunta de emociones: 8 tarjetas con ilustración, más intensidad, miniatura y 6 controles.
- La decisión: 6 tarjetas con ilustración.

No hay movimiento simultáneo ni sonido. **HIPÓTESIS:** 8 tarjetas pueden ser muchas para algunos niños y niñas de 6 años. Observar en la tarea 3.

**C-08 · Ilustraciones de emociones a 56–64 px** — PENDIENTE DE VALIDACIÓN
- **Evidencia** (revisión visual a tamaño real, DPR 1 y 2; impresión de diseño, no prueba de reconocimiento):
  - Calma (silueta horizontal), Curiosidad (lupa) y Cansancio (luna) se distinguen por forma u objeto.
  - Alegría, Sorpresa, Frustración, Tristeza y Enfado comparten silueta y se diferencian sobre todo por rasgos faciales de unos 20 px.
  - En el selector del cuento conviven Sorpresa, Inseguridad y Frustración.
- **Mitigación existente:** la palabra siempre está visible y es la referencia.
- **Propuesta:** observarlo; solo si se confirma una dificultad, pedir a Codex señales de silueta más distintas (ver `CODEX_ART_REQUESTS.md`).

**C-09 · «Pedir ayuda» y «Expresar desacuerdo» a 56 px** — PENDIENTE DE VALIDACIÓN
- **Evidencia:**
  - Las dos ilustraciones comparten composición: niño o niña de pie a la izquierda y Andrés agachado a la derecha.
  - El elemento diferenciador es una tarjeta con una mano frente a una mano abierta. A 56 px ocupa unos 8 px y en escala de grises casi desaparece.
  - En «Expresar desacuerdo», Aya sonríe y hace un gesto de explicar, que no se asocia de forma evidente con el desacuerdo.
  - Ambas se distinguen sin depender del color solo por quién aparece (Teo frente a Aya) y por la tarjeta, no por la acción.
- **Mitigación:** nombre y descripción visibles.
- **Propuesta:** petición condicional a Codex (`CODEX_ART_REQUESTS.md`, A-1).

**C-10 · Lenguaje figurado** — OBSERVABLE, con efecto en HIPÓTESIS (`PEDAGOGICAL_REVIEW.md` P-03, P-10, P-16). Para quien interpreta literalmente, «nudo en la tripa», «muchas preguntas en la cabeza» y «los cambios sean más pequeños» pueden resultar confusos.

**C-11 · Comprensión del resumen** — OBSERVABLE, sin problema técnico.
- Tiene 4 secciones con títulos en primera persona («Cómo me sentiría», «Lo que me gustaría saber», «Posibilidades que exploré», «Herramientas que podrían ayudarme»).
- Los estados vacíos son amables («No elegiste ninguna. También está bien.»).
- **HIPÓTESIS:** el condicional («me sentiría», «podrían») y la palabra «Posibilidades» pueden ser abstractos a los 6–7 años. Observar en la tarea 4 y al final.

**C-12 · Intensidad única** (`PEDAGOGICAL_REVIEW.md` P-05) — OBSERVABLE la ambigüedad; el efecto es HIPÓTESIS.

**C-13 · Continuidad narrativa tras explorar** (`PEDAGOGICAL_REVIEW.md` P-13) — HIPÓTESIS.

---

## 3. Separación clara

| Tipo | Puntos |
|---|---|
| Problemas observables que deberían resolverse antes de un piloto | C-01 (si participan personas que usan zoom alto), C-02, C-03 |
| Mejoras observables | C-04, C-05 |
| Hipótesis que necesitan prueba con niños y niñas | C-07, C-08, C-09, C-11, C-12, C-13 y el contrafáctico de la escena 2 (P-04) |
| Necesitan revisión profesional o de personas autistas adultas | C-03, C-10 y el tratamiento de «Salir sin avisar» (P-11) |
