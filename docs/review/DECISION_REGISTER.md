# Registro de decisiones humanas pendientes

17/11/2026. **Ninguna de estas decisiones se ha aplicado.** Las recomendaciones son provisionales y argumentadas; decide una persona responsable, tras la revisión profesional y con personas autistas adultas cuando se indique. Al decidir, anotar la fecha, quién decide (rol), la opción elegida y el motivo.

| ID | Decisión | Decide | Bloquea el piloto | Estado |
|---|---|---|---|---|
| D-01 | Logotipo de cabecera | Responsable de producto/marca | No | PENDIENTE |
| D-02 | Frase del horario («de arriba abajo») | Responsable pedagógica | No (conviene antes) | PENDIENTE |
| D-03 | Audio y vídeo | Responsable de producto | No | PENDIENTE |
| D-04 | Alcance de «Textos cortos» (C-02) | Pedagógica + producto | **Sí, si participan niños o niñas que usen lectura fácil** | PENDIENTE |
| D-05 | Versión corta de la escena 2: CAA de Lía (P-02) | Pedagógica | **Sí** (representación de la CAA) | PENDIENTE |
| D-06 | Escala de intensidad (P-05) | Pedagógica, tras observar | No (se observa en el piloto) | PENDIENTE |
| D-07 | Textos de «Salir sin avisar» (P-11, P-15) | Pedagógica + persona autista adulta | Conviene antes | PENDIENTE |
| D-08 | Posición del «NO SÉ» de Lía en la viñeta k2-4 | Pedagógica | No | PENDIENTE |
| D-09 | Política sobre lenguaje figurado e imperativos (P-03, P-10, P-16, P-17) | Pedagógica + persona autista adulta | No | PENDIENTE |
| D-10 | Reproductor con zoom alto (C-01) | Producto + diseño | Solo si participan personas que usen zoom alto | PENDIENTE |
| D-11 | Añadidos a la guía familiar (P-08, P-11.3, P-21) | Pedagógica | No (conviene antes de la revisión con familias) | PENDIENTE |
| D-12 | Nombres de emociones entre el selector y Mis emociones (P-06) | Pedagógica, tras observar | No | PENDIENTE |
| D-13 | Biblioteca como «espacio tranquilo» (P-19) | Pedagógica | No | PENDIENTE |
| D-14 | Frase puente tras las decisiones (P-13) | Pedagógica, tras observar | No | PENDIENTE |
| D-15 | Rediseño de `tool-expresar-desacuerdo` y refuerzo de emociones (A-1, A-2) | Responsable + Codex, tras validar | No | PENDIENTE |

---

## D-01 · Logotipo

- **Actual (HECHO):** vector de Nubi de trazo lineal (`components/Nubi.tsx`, a 40 px en `Logo`) junto a «NUBI».
- **Propuesta de Codex (HECHO):** `docs/art-batch-2/brand/nubi-header-proposal-{40,80,512}.png`, en gouache, sin conectar.

| Criterio | Vector actual | Propuesta de Codex |
|---|---|---|
| Fidelidad al personaje maestro | Baja: es un dibujo lineal simplificado, distinto del Nubi en gouache de toda la app | Alta: misma forma, textura y mejillas que `nubi-saludo` |
| Legibilidad a 40 px | Alta: contorno petróleo nítido sobre crema | Media: cuerpo crema sobre cabecera crema, con poco contraste de borde; rasgos pequeños |
| Coherencia con la app | Coherente con los iconos de interfaz (trazo de 2 px) | Coherente con las ilustraciones |
| Móvil (390 px) | Funciona | Funciona en tamaño; contraste de borde a comprobar en pantalla real |

**Recomendación provisional:** decidir qué representa la cabecera.
- Si es «marca y personaje», la propuesta es más fiel, pero conviene pedir a Codex una versión con el contorno reforzado para 40 px, probada sobre `crema-100`.
- Si es «icono de interfaz», el vector actual es más legible.

**No se ha cambiado.**

## D-02 · Frase del horario

- **Texto actual** (`ume-c-horario`, consecuencia «Pedir que le expliquen el horario», momento 2): «Andrés dibuja el plan en la pizarra: biblioteca, recreo, lengua, comida y plástica. Teo lo mira entero, **de arriba abajo**.»
- **Hecho visual:** el plan está dibujado en **horizontal**, cinco pictogramas en fila, en `ume-c-horario`, `ume-s6-plan` y la viñeta `ume-k6-1`.

| Opción | Coherencia con la imagen | Comprensión literal | Observación |
|---|---|---|---|
| A. «Teo lo mira entero, de arriba abajo.» (actual) | **No** | Un lector literal puede buscar una lista vertical | Contradice tres ilustraciones |
| B. «Teo lo mira entero, de principio a fin.» | Sí, independiente de la orientación | Clara: recorre el plan en orden | Mantiene «entero»; cambio mínimo |
| C. «Teo lo mira de principio a fin.» (propuesta del encargo) | Sí | Clara | Pierde el matiz «entero» (lo ve completo) |
| D. «… de izquierda a derecha.» | Sí, literal a la imagen | Clara | Ata el texto a la composición; frágil si cambia la imagen |

**Recomendación provisional:** B (o C si se prefiere la frase más corta). Las dos son coherentes con el horario horizontal y no dependen de la orientación del dibujo.

**No se ha cambiado.**

## D-03 · Audio y vídeo

| Elemento | Estado verificado |
|---|---|
| Lectura con la voz local del dispositivo (`speechSynthesis`) | **Disponible**, opcional (modo «Escuchar»). Solo voces locales (`localService`); las remotas se rechazan. Nunca suena sin una acción. Si no hay voz local, se muestra un aviso y el texto (`narration.mjs`). |
| Narración humana grabada | **No existe.** Ninguna página tiene `narration`; no hay archivos de audio en `public/`. |
| Vídeo producido | **No existe.** `video.status: 'pendiente'`. Los `.webm`/`.mp4` declarados no están en `public/`. La pantalla de vídeo lo dice («Vídeo en producción») y ofrece cuento y cómic. |
| Subtítulos del vídeo | Existe `una-manana-diferente.es.vtt` (guion de subtítulos), sin vídeo que sincronizar. |

**Decisión pendiente:**
- Si la voz del sistema es aceptable para el piloto (pregunta abierta n.º 4 de los fundamentos).
- Si se encarga narración humana y vídeo, cuándo y con qué guion aprobado.

No se ha generado audio ni vídeo.

## D-04 · Alcance de «Textos cortos»

Ver C-02. Opciones:

- (a) Mantener la lectura fácil solo en las páginas del cuento y documentarlo.
- (b) Añadir versiones cortas a consecuencias y preguntas: requiere textos aprobados y un cambio de esquema (`types.ts`).
- (c) Ofrecer en la consecuencia una vista reducida con los dos momentos y un solo bloque.

**Recomendación:** (b) para las consecuencias, que son el texto más denso. Los textos los escribe y aprueba una persona; Claude implementa el esquema.

## D-05 · Escena 2 en lectura fácil

Ver P-02. Propuesta: «Aya pregunta. Bruno protesta. Lía usa su comunicador.»

## D-06 · Intensidad

Ver P-05. Opciones:

- Mantener la intensidad global.
- Una intensidad por emoción.
- Mostrarla solo si hay una única elección.
- Permitir desactivarla en Ajustes.

**Recomendación:** decidir tras observar la tarea 3.

## D-07 · «Salir sin avisar»

Ver P-11 y P-15. Propuestas:

- Dividir `keepInMind` en frases más cortas.
- Usar «preparado o preparada» y «a salvo».
- Revisar con una persona autista adulta si «que te pidan explicaciones» se percibe como amenaza.

## D-08 · Bocadillo de Lía en k2-4

`bubble.position: 'bottom-right'` coloca «NO SÉ» junto a Bruno, no junto a Lía. La etiqueta «Lía · comunicador» lo aclara.

Moverlo implica cambiar `story.ts` y revisar las regiones protegidas de la viñeta (`docs/art-batch-4/protected-regions.json`). Decidir tras la tarea 7.

## D-09 · Lenguaje figurado e imperativos

Decidir si se aceptan como excepciones documentadas en `CONTENT_STANDARD.md`:

- «Nudo en la tripa» como vocabulario interoceptivo.
- Los imperativos en los pasos de las herramientas.

O bien sustituirlos. Revisar también las certezas de P-16.

## D-10 · Zoom alto

Ver C-01. Opciones para ventanas bajas:

- Controles no fijos.
- Controles secundarios agrupados.
- Cabecera compacta.

Requiere aprobación de diseño (`NUBI_DESIGN_PRINCIPLES.md` §6) y una prueba de regresión basada en `reflow-probe.mjs`.

## D-11 · Guía familiar

Añadidos propuestos:

- «Mirad las preguntas que eligió y respondedlas si podéis» (P-08).
- «Acordad la señal de descanso también con el colegio» (P-11.3).
- «Si os parece adecuado, y dejadlo si genera malestar» en la práctica p3 (P-21).

## D-12 a D-15

Ver P-06, P-19, P-13 y `CODEX_ART_REQUESTS.md`.
