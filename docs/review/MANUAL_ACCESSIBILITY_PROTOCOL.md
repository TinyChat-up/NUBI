# Protocolo manual de accesibilidad técnica

17/11/2026 · Para ejecutar sobre `review/phase-14-pilot-readiness` o la rama de integración vigente, servida en local (`npm run dev -- --host 0.0.0.0 --port 5173`) o en una vista previa privada. **No desplegar en producción para probar.**

**Regla:** una prueba solo se marca **SUPERADA** cuando una persona la ha ejecutado de verdad en el dispositivo indicado. Si no se ha ejecutado, su estado es **PENDIENTE DE EJECUCIÓN MANUAL**. En esta fase **no se ha ejecutado ninguna prueba manual**: no hay lector de pantalla ni dispositivos físicos disponibles en el entorno cloud.

## 0. Ya cubierto por pruebas automáticas (Chromium emulado, Linux)

Ejecutado en esta fase (detalle y resultados en `PHASE_14_READINESS_REPORT.md` §1). **No sustituye** a lo que sigue:

- axe (WCAG 2.0/2.1/2.2 A/AA) en 36 estados del recorrido y 9 rutas: sin infracciones automáticas.
- Teclado (Tab, Enter, flechas, Escape), foco visible y foco no tapado por barras fijas.
- Controles ≥ 48 px; ausencia de desbordamiento horizontal en 390/820/1180.
- Movimiento reducido emulado (`prefers-reduced-motion`).
- Ausencia de sonido automático.
- Sonda de reajuste con zoom emulado (`tests/browser/reflow-probe.mjs`). **Detecta un problema con el 400 %** (C-01).

## 1. Registro de cada ejecución

Copiar por cada prueba. **Sin datos personales.**

```
Prueba: ___  Fecha: ___  Persona (rol, no nombre): ___
Dispositivo y sistema: ___  Navegador y versión: ___  Tecnología de apoyo y versión: ___
Rama/commit: ___
Resultado: SUPERADA / NO SUPERADA / PARCIAL / NO APLICABLE
Pasos donde falla: ___   Evidencia (captura sin datos personales): ___   Observaciones: ___
```

## 2. Pruebas

Los recorridos de referencia son:

- **R1:** portada → Mi mundo → Colegio → «Una mañana diferente» → Cuento hasta la pregunta de emociones; elegir dos emociones e intensidad.
- **R2:** continuar hasta la decisión; elegir «Salir de clase sin avisar», leer la consecuencia, «Probar otra posibilidad», elegir otra y «Seguir con la historia».
- **R3:** estrategias (elegir dos) → resumen → Salir.
- **R4:** Cómic: descubrir las viñetas de la escena 2 hasta la de Lía («NO SÉ»).
- **R5:** Mis herramientas → «Pedir ayuda» → «Mi tarjeta» → «Marcar: la he probado».
- **R6:** Ajustes: cambiar tamaño de letra y «Textos cortos».

| ID | Prueba | Dispositivo / tecnología | Qué verificar | Criterio de superación | Estado |
|---|---|---|---|---|---|
| M-01 | VoiceOver iOS | iPad o iPhone, Safari, VoiceOver | R1–R5 con gestos de VoiceOver | Ver §3 | PENDIENTE DE EJECUCIÓN MANUAL |
| M-02 | VoiceOver macOS | Mac, Safari, VoiceOver | R1–R6 con teclado + VO | Ver §3 | PENDIENTE DE EJECUCIÓN MANUAL |
| M-03 | TalkBack | Tableta Android, Chrome, TalkBack | R1–R5 | Ver §3 | PENDIENTE DE EJECUCIÓN MANUAL |
| M-04 | NVDA | Windows, Firefox y Chrome, NVDA | R1–R6 en modo foco y modo exploración | Ver §3 | PENDIENTE DE EJECUCIÓN MANUAL |
| M-05 | Zoom del navegador 200 % | Escritorio 1280×1024 (Chrome, Firefox, Safari) | R1–R3 y R5 | Sin desplazamiento horizontal (salvo rejillas propias); texto completo legible; controles alcanzables | PENDIENTE DE EJECUCIÓN MANUAL |
| M-06 | Zoom del navegador 400 % | Escritorio 1280×1024 | R1, R2, R5 | WCAG 1.4.10: contenido usable a 320 px CSS. **Fallo previsto en el reproductor** (C-01): confirmar en real | PENDIENTE DE EJECUCIÓN MANUAL |
| M-07 | Zoom y tamaño de texto del sistema | iPadOS (Texto más grande) y Android (Tamaño de fuente / Zoom) | R1, R6 | El texto crece sin cortarse ni solaparse | PENDIENTE DE EJECUCIÓN MANUAL |
| M-08 | Solo teclado | Escritorio, cualquier navegador | R1–R6 sin ratón | Todo alcanzable con Tab, Mayús+Tab, Enter, Espacio, flechas y Escape; foco siempre visible y no tapado; sin trampas de foco (diálogo «Escenas» y puerta familiar) | PENDIENTE DE EJECUCIÓN MANUAL (cubierto en parte de forma automática) |
| M-09 | Orientación | Tableta física | Girar en R1 (escena con 3:4/16:9), en la pregunta de emociones y en el cómic | No se pierde el progreso ni la selección; la escena cambia de composición sin recortarse; los controles siguen visibles | PENDIENTE DE EJECUCIÓN MANUAL |
| M-10 | Táctil real | Tableta y móvil físicos | R1–R5 con dedo; deslizar en páginas y viñetas | Objetivos cómodos; sin zoom accidental por doble toque; el deslizamiento no se dispara al desplazar en vertical; botones alternativos al gesto | PENDIENTE DE EJECUCIÓN MANUAL |
| M-11 | Movimiento reducido real | iOS/iPadOS (Reducir movimiento), Android (Quitar animaciones), macOS, Windows | R1, R4 | Sin animaciones de página ni de viñetas; nada se pierde | PENDIENTE DE EJECUCIÓN MANUAL |
| M-12 | Safari | iPadOS y macOS | R1–R6 | Igual que en Chromium: imágenes (WebP/PNG con alfa), `<picture>` 3:4, `min()` en `sizes` del cómic, `<dialog>`, `localStorage` | PENDIENTE DE EJECUCIÓN MANUAL |
| M-13 | Firefox | Escritorio | R1–R6 | Ídem; comprobar especialmente el respaldo de `sizes` del cómic | PENDIENTE DE EJECUCIÓN MANUAL |
| M-14 | Chrome Android | Tableta | R1–R6 | Ídem | PENDIENTE DE EJECUCIÓN MANUAL |
| M-15 | Voz local del dispositivo | iPad, Android y escritorio con voces instaladas | R1 en modo «Escuchar» | Solo suena tras pulsar; se puede detener; no usa voces remotas; con la voz no disponible aparece el aviso y el texto sigue | PENDIENTE DE EJECUCIÓN MANUAL |
| M-16 | Contraste en pantalla real | Tableta física al sol y en interior; opción «Más contraste» | R1, R6 | Texto y estados seleccionados distinguibles | PENDIENTE DE EJECUCIÓN MANUAL |

## 3. Criterios específicos para lectores de pantalla (M-01 a M-04)

1. **Cambio de pantalla.** Al navegar se anuncia el título (`h1`) de la nueva pantalla. En el reproductor se anuncia «Escena N de 7: …».
2. **Paso del cuento.** Al pulsar «Siguiente» se lee el texto de la página una vez (región `aria-live`), sin duplicarse con el foco del escenario.
3. **Tarjetas seleccionables** (emociones, preguntas, herramientas):
   - Se anuncian como botón con su texto («Sorpresa», «Pedir ayuda. Pedir ayuda es una forma de cuidarse…») y su estado («seleccionado / no seleccionado» o «pulsado»).
   - **La ilustración de Nubi o de la herramienta no se anuncia** (es decorativa).
4. **Intensidad.** Se entiende que «Un poco / Bastante / Mucho» responde a «¿Cuánto? (si quieres)» (grupo con leyenda).
5. **Decisión.** Las 6 posibilidades se anuncian con su texto. La pista «Elige una posibilidad. Tómate el tiempo que necesites» está asociada al botón «Siguiente» deshabilitado.
6. **Consecuencia.** Se leen en orden: título («Si Teo elige…»), los dos momentos y los bloques. «Probar otra posibilidad» se alcanza sin perderse.
7. **Cómic.**
   - Cada viñeta tiene texto alternativo.
   - Se leen la leyenda y los bocadillos con su hablante («Lía: QUIERO SENTARME CON TEO»), sin duplicar la versión superpuesta y la de lista.
   - «Descubrir la siguiente viñeta» se anuncia como botón.
8. **Diálogos.** «Escenas» se abre como diálogo, se cierra con Escape (o gesto de escape) y devuelve el foco.
9. **Puerta familiar.** Se entiende la instrucción («Pulsa el número…») y los botones numéricos tienen nombre.
10. **Imágenes.** Las ilustraciones narrativas (escenas, opciones, fichas) tienen una descripción útil. Las decorativas se omiten.

## 4. Notas

- Las pruebas manuales se hacen sin niños ni niñas. Las sesiones infantiles siguen `CHILD_USABILITY_PROTOCOL.md`.
- Abrir un issue por cada NO SUPERADA, con el ID (M-xx), los pasos y la evidencia, sin datos personales.
- Volver a ejecutar las pruebas afectadas tras cada corrección.
