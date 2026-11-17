# Matriz de hallazgos y bloqueos del piloto

17/11/2026 · Rama `review/phase-14-pilot-readiness`. Clasificación según el encargo de la fase 14. Cada hallazgo remite a su evidencia. **No se han rellenado categorías por obligación:** no hay hallazgos CRÍTICOS.

## CRÍTICO — ninguno

Comprobado con evidencia: no hay incumplimientos de las líneas rojas de `AGENTS.md` §1.

- **Sin IA ni servicios externos.** `quality.mjs` verifica que no hay peticiones a otros dominios.
- **Sin datos de menores fuera del dispositivo.** Solo `localStorage` con el prefijo `nubi.v1.`, con borrado verificado en `quality.mjs`.
- **Sin puntuaciones ni aciertos.** Inspección de `SummaryView`, `FamilyScreen` e `interactions`.
- **Sin temporizadores ni sonido automático.** `narration.mjs`; el motor no tiene tiempos.
- **Neurodiversidad.** Ninguna reacción se presenta como incorrecta (`PEDAGOGICAL_REVIEW.md` §1).
- **Funcionamiento.** Cuento y cómic se completan en 390/820/1180 sin bloqueos (`quality.mjs`, `comic-flow.mjs`, recorrido de la fase 13).

## IMPORTANTE — corregir antes del piloto, o acotar el piloto

| ID | Hallazgo | Evidencia | Propuesta | Responsable |
|---|---|---|---|---|
| C-02 | «Textos cortos» solo afecta a 20 páginas del cuento. Consecuencias, preguntas, herramientas y cómic no tienen versión fácil, y 4 páginas carecen de `short` | `StoryPlayer.tsx` (único uso de `shortText`); `node scripts/content-report.ts` | D-04 | Persona responsable (textos) + Claude (esquema) |
| C-03 / P-02 | La versión corta de `cambio-4` elimina la CAA de Lía y atribuye emociones («Bruno se enfada», «Lía no está segura») | `story.ts`, `cambio-4.short` | D-05 | Persona responsable |
| C-01 | Con zoom del 400 % (320×256 px CSS) el reproductor deja **5 px** de contenido; las pantallas generales, 87 px | `node tests/browser/reflow-probe.mjs` (emulado). Confirmar en real con M-06 | D-10 | Claude, con aprobación de diseño |

**Acotación posible.** Si el primer piloto no incluye a niños o niñas que usen lectura fácil ni zoom alto, C-01 y C-02 pueden resolverse después; hay que dejarlo escrito en el plan del piloto. C-03 debe corregirse antes, porque afecta a la representación de la CAA, que es un objetivo central del episodio.

## MEJORA — no impide evaluar

| ID | Hallazgo | Evidencia |
|---|---|---|
| P-15 | Masculino genérico dirigido al lector en «Salir sin avisar» («preparado», «seguro») | `story.ts`, consecuencia `salir` |
| P-16 | Afirmaciones de certeza en herramientas («hace que», «ayuda a que», «Todo el mundo lo hace») | `tools.ts` |
| — | 6 frases de más de 15 palabras; 9 versiones `short` de más de 8 | `scripts/content-report.ts` |
| P-19 | «Biblioteca» como espacio tranquilo, cuando en la historia tiene eco | `tools.ts` / `estrategias-2` |
| C-04 | «Seguir con la historia» y «Siguiente» duplicados; «Probar otra posibilidad» bajo el pliegue | Interfaz; medición de la fase 7 |
| C-05 | Control «Subtítulos» deshabilitado siempre visible; «Leer» muestra el estado, no la acción | `StoryPlayer.tsx` |
| P-08 / P-11.3 / P-21 | Añadidos a la guía familiar | `familyGuide` |

## DECISIÓN HUMANA

D-01 logotipo · D-02 frase del horario · D-03 audio y vídeo · D-04 a D-15. Ver `DECISION_REGISTER.md`.

## PENDIENTE DE VALIDACIÓN — hipótesis que solo resuelven personas

| ID | Hipótesis | Cómo se valida |
|---|---|---|
| P-04 | La pregunta contrafáctica («Si estuvieras…») es difícil a los 6–7 años | Tarea 3 |
| P-05 / C-12 | Una intensidad para varias emociones es ambigua | Tarea 3; revisión profesional |
| P-07 | La escena 3 (saber / necesitar saber) es abstracta para 6–7 años | Tareas 2–3; revisión profesional |
| P-11 | «Salir sin avisar» no genera culpa y la alternativa es practicable | Revisión por persona autista adulta y profesionales; familias |
| P-13 / C-13 | Tras explorar, la continuación fija («Teo pidió el plan») se entiende | Tarea 5 |
| C-08 | Las emociones de Nubi se reconocen a 56–64 px (o la palabra basta) | Tarea 3 |
| C-09 | «Pedir ayuda» y «Expresar desacuerdo» se distinguen a 56 px | Tarea 6 |
| P-03 / C-10 | El lenguaje figurado («nudo en la tripa») se entiende literalmente | Revisión por persona autista adulta; tareas 2–3 |
| P-06 | Los nombres distintos entre el selector y Mis emociones no confunden | Tareas 3 y 6 |
| C-07 | 8 tarjetas de emoción no son demasiadas a los 6 años | Tarea 3 |
| C-11 | El resumen («me sentiría», «Posibilidades que exploré») se entiende | Cierre de la sesión |
| D-03 | La voz del sistema es aceptable sin narración humana | Familias; M-15 |
| — | Lectores de pantalla, zoom real, dispositivos táctiles, Safari y Firefox | `MANUAL_ACCESSIBILITY_PROTOCOL.md` M-01 a M-16 (todas PENDIENTES DE EJECUCIÓN MANUAL) |

## Requisitos para iniciar un piloto supervisado

1. Resolver o acotar los tres IMPORTANTES (C-03 obligatorio).
2. Revisión profesional y por al menos una persona autista adulta, con sus conclusiones en el registro de decisiones.
3. Decidir D-02 y D-07 (textos sensibles) antes de las sesiones.
4. Ejecutar como mínimo M-01 o M-03 (un lector de pantalla móvil), M-09, M-10 y M-12 en los dispositivos del piloto.
5. Consentimientos y asentimiento preparados según `CHILD_USABILITY_PROTOCOL.md` §3.
6. Mantener `validation.status: 'pendiente-validacion'`; solo una persona responsable lo cambia.
