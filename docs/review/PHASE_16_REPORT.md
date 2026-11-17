# NUBI — Fase 16 · Borradores de textos cortos

17/11/2026 · Rama `review/phase-16-short-text-drafts`, creada desde `feat/claude-pilot-remediation` (`2af208d`). **Fase editorial: no se ha modificado `story.ts`, ningún texto pedagógico, componente, CSS, motor ni ilustración.** El estado de validación sigue en `pendiente-validacion`. Sin merge a `main` ni despliegue.

**Ninguna propuesta está aprobada.** Son borradores para que la persona responsable decida uno a uno. Que las pruebas automáticas pasen con ellos aplicados no los valida: las comprobaciones son de forma (longitud, léxico, coherencia de datos), no de comprensión, y no ha habido ninguna prueba con niños y niñas.

## Entregables

| Documento | Contenido |
|---|---|
| [`phase-16/SHORT_TEXT_PROPOSALS.md`](phase-16/SHORT_TEXT_PROPOSALS.md) | Las **37** propuestas de consecuencias (S-01 a S-37) y las **4** páginas (N-01 a N-04). Cada una con texto completo, propuesta, alternativa si hay dudas, qué conserva, qué omite, observaciones y revisión previa sugerida |
| [`phase-16/EDITORIAL_COMPARISON.md`](phase-16/EDITORIAL_COMPARISON.md) | Original frente a propuesta: palabras, frase más larga, emociones, apoyos y CAA, personajes y cambios de significado; coherencia con la fase 15 y con las ilustraciones |
| [`phase-16/APPROVAL_CHECKLIST.md`](phase-16/APPROVAL_CHECKLIST.md) | Tabla para aprobar, rechazar o pedir cambios por ID, más D-05, D-02 y D-07 de la fase 15 y un registro de la decisión |
| [`phase-16/short-text-proposals.json`](phase-16/short-text-proposals.json) | Fuente única de las propuestas, de la que se generan los documentos anteriores |
| [`phase-16/short-text-preview.patch`](phase-16/short-text-preview.patch) | **Parche de previsualización, no aplicado.** Añade todas las propuestas principales a `story.ts` |
| `phase-16/borrador-preview-salir-390-{a,b}.webp` | Cómo se vería «Salir sin avisar» con «Textos cortos» (390×844), con el parche aplicado de forma temporal |

## Decisiones editoriales (criterios aplicados)

1. **Fidelidad antes que brevedad.** Las cifras bajan, pero se priorizan los hechos.
   - Palabras de las consecuencias: 603 → 511.
   - Frase más larga: de 20 a **12** palabras.
   - Nueve campos conservan alguna frase de 9–12 palabras (S-01, S-07, S-10, S-11, S-18, S-20, S-34, S-35 y S-36) porque acortarla habría quitado información esencial. Por ejemplo: la petición literal entre comillas (S-07), quién se beneficia del plan dibujado (S-10) o el matiz «antes de que estés listo o lista» (S-36).
2. **Mantener cuando ya es breve.** Cuatro campos de 7–9 palabras y literales se mantienen sin versión corta (S-15, S-23, S-27 y S-29). La app usa el texto completo.
3. **Sin emociones nuevas.** El detector léxico y la revisión manual no encuentran ninguna emoción que el original no nombre. Las emociones atribuidas (alegría de Pilar, preocupación de Andrés) son las del original.
4. **CAA y apoyos intactos.** No se pierde ninguna mención a la tarjeta de descanso, el comunicador, la señal, los cascos, la pelota ni los apoyos.
   - S-25 conserva «También podría enseñar su tarjeta de descanso» con el mismo valor que hablar.
   - S-37 enumera las formas de avisar empezando por la no oral.
   - S-31 cambia «sin decir nada» por «sin avisar», que no presupone el habla.
5. **Referencias claras.** Se sustituyen pronombres ambiguos por nombres: «Ella» → «Pilar» (S-13) y los «le» de S-14.
6. **Probabilidad, no certeza; invitación, no orden.**
   - «Tu recurso te calma» → «Tu recurso puede calmarte» (S-24).
   - «Se puede pedir…» → «Puedes pedir…» (S-12, S-30).
   - S-37 sin imperativos.
7. **Menos lenguaje figurado, sin metáforas nuevas.**
   - Se quitan «en la cabeza» (N-02), «te ves con fuerzas» (S-05) y «el cambio parece más pequeño» (S-09, propuesta principal).
   - «El nudo de la tripa» se conserva en S-20 porque es del original; hay una alternativa literal, pendiente de D-09.
8. **Secuencia y personajes.** Los momentos conservan el orden y su ilustración; ningún personaje desaparece y no se añade ninguna consecuencia.
9. **Coherencia con la fase 15.**
   - S-08 no menciona la orientación del horario, así que vale con o sin D-02.
   - S-34, S-36 y S-37 siguen el criterio de D-07 y son coherentes con el texto completo actual y con el propuesto.
   - Ninguna propuesta atribuye emociones a Lía (D-05).

### «Salir sin avisar» (S-31 a S-37)

Revisado con más cautela:

- **Validación de la necesidad.** «Necesitar salir está bien» (S-35); alternativa con «es válido».
- **Preocupación adulta como cuidado.** «Su trabajo es que estés a salvo» (S-34).
- **Consecuencias posibles, no inevitables, sin amenaza ni castigo.** «Pueden preocuparse», «Quizá te pregunten qué pasó» (S-36). La alternativa omite la parte de las preguntas.
- **Formas de avisar como opciones de igual valor.** S-37 recoge tarjeta, palabras y señal. La alternativa es más compacta, con «vuestra señal».
- **Sin presentar la regulación como obediencia.** El objetivo de la alternativa es «tener tu momento tranquilo», no cumplir una norma.

Todas requieren revisión por una persona autista adulta y por un profesional antes de aprobarse.

## Comprobaciones realizadas

**HECHO:**

1. **El parche se aplica limpio.** `git apply --check short-text-preview.patch`.
2. **Con el parche aplicado de forma temporal:**
   - Tipos correctos.
   - Validación de la historia correcta: ninguna versión corta vacía ni de momentos inexistentes.
   - 86 de 87 tests en verde. El que falla es la salvaguarda **intencionada** de `src/engine/readable.test.ts` («el piloto aún no tiene versiones cortas de consecuencias»), que impide que entren textos cortos sin que se note. **Al incorporar textos aprobados hay que actualizarla.**
3. **Navegador (390×844, con «Textos cortos»):**
   - `posibilidades-1` y la consecuencia «Salir sin avisar» muestran la versión corta.
   - La región `aria-live` dice exactamente lo que se ve.
   - No hay errores de consola.
4. **Después se restauró `story.ts`**, con el hash idéntico al original.
5. **`npm run check` sobre el árbol final** (sin el parche): ver la sección final.

## Riesgos y cuestiones pendientes

| Riesgo | IDs | Quién debe revisarlo |
|---|---|---|
| Cambios leves de significado al quitar lenguaje figurado o al pasar de certeza a probabilidad | S-05, S-09, S-24 | Profesional |
| Lenguaje figurado del original que se conserva | S-20 («nudo de la tripa»), S-27 («a tu ritmo») | Persona autista adulta (D-09) |
| Tono de la opción más sensible | S-31, S-34 a S-37 | Persona autista adulta + profesional (prioritario) |
| «Señal acordada» presupone un acuerdo previo con el colegio | S-37 | Guía familiar (D-11) |
| Texto breve ≠ lectura fácil validada | Todos | Prueba con niños y niñas (`CHILD_USABILITY_PROTOCOL.md`, tareas 2–5) |
| Si D-07 se rechaza, la versión corta suavizaría más que la completa | S-34, S-36 | Persona responsable, al decidir D-07 |

Sin cambios respecto a la fase 15:

- Las pruebas manuales M-01 a M-16 siguen pendientes.
- Las decisiones D-01 a D-15 siguen pendientes.
- La validación de la historia sigue en `pendiente-validacion`.

## Cómo seguir

1. Revisar `APPROVAL_CHECKLIST.md`, idealmente después de la revisión por una persona autista adulta y un profesional de los IDs marcados PA/PR.
2. Con la lista firmada, Claude incorporará **solo** los IDs aprobados en una rama nueva:
   - partirá de `short-text-preview.patch` o del texto modificado;
   - actualizará la salvaguarda de `readable.test.ts`;
   - ejecutará `npm run check` y las pruebas `short-text`, `quality`, `art-batch-3` y `story-fit`.
3. No se cambiará `validation.status`.

## Verificación final

- **Cambios de la rama:** solo `docs/review/PHASE_16_REPORT.md`, `docs/review/phase-16/*` y una línea de `CLAUDE.md`. Ningún cambio en `src/`, `tests/`, `scripts/` ni `public/`.
- **`npm run check`** sobre el árbol final, sin el parche: tipos, **87 tests en 13 archivos** y build correctos.
