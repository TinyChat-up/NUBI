# Decisiones de accesibilidad · Fase 17

## Evidencia y alcance

Se distinguen criterios verificables, recomendaciones documentales e hipótesis específicas de NUBI. No se presume una preferencia compartida por todas las personas autistas. La ausencia de infracciones automáticas no equivale a conformidad WCAG ni a validación de comprensión infantil.

### Fuentes consultadas

Fecha de consulta: 17 de noviembre de 2026. Las cuatro URL del encargo devolvieron `Tunnel connection failed: 403 Forbidden` desde este entorno. Se consultó la fuente oficial de W3C en GitHub como alternativa:

1. [WCAG 2.2](https://www.w3.org/TR/WCAG22/): texto de criterios leído en [w3c/wcag](https://github.com/w3c/wcag/tree/2766fae25fc8286f60181d655115cba054b797e1/guidelines/sc), revisión `2766fae25fc8286f60181d655115cba054b797e1`. Criterios: 1.4.10 Reflow, 2.5.8 Target Size (Minimum), 2.4.11 Focus Not Obscured (Minimum), 3.2.3 Consistent Navigation, 2.2.2 Pause, Stop, Hide. Se trata del repositorio de elaboración, no de una copia certificada de la publicación estable.
2. [Making Content Usable for People with Cognitive and Learning Disabilities](https://www.w3.org/TR/coga-usable/) y [Design Guide](https://www.w3.org/TR/coga-usable/design_guide.html): patrones leídos en [w3c/coga/design-guide](https://github.com/w3c/coga/tree/f15bbd18d18f2acc32b94fe9b54f4519e2781ec5/design-guide), revisión `f15bbd18d18f2acc32b94fe9b54f4519e2781ec5`. No son requisitos normativos WCAG. Se consultaron propósito claro, espacio en blanco, cantidad manejable, control de cambios, simplificación y personalización.
3. [Leeds Autism AIM: información accesible para personas neurodivergentes](https://leedsautismaim.org.uk/resources/guide-to-making-information-accessible-for-neurodivergent-people/): **no se pudo acceder al texto**. Se conserva como referencia pendiente. No se le atribuyen recomendaciones no verificadas ni se afirma haberla estudiado.

No se ejecutaron scripts de estas fuentes en la aplicación ni se copiaron diseños. Las fuentes oficiales se descargaron solo a `/tmp` para lectura.

## De la recomendación a la implementación

| Tema / respaldo | Decisión en NUBI | Verificación técnica | Hipótesis o límite |
|---|---|---|---|
| Propósito claro, COGA `o1p01-clear-purpose` | Título visible, una entrada principal en portada, lugares con nombre y estado | Una h1 por ruta; enlaces semánticos y nombres accesibles | Hay que observar si «Entrar en mi mundo» anticipa bien lo que aparece |
| Navegación consistente, WCAG 3.2.3 | Mismo orden Mi mundo → Historias → Recreaciones → Herramientas; la ubicación solo cambia al cruzar un breakpoint | Teclado y foco en 12 rutas y zoom emulado | Una posición inferior en tableta horizontal cambia respecto a la base; requiere aprendizaje/observación |
| Cantidad manejable, COGA `o5p03-manageable-quantity` | Tres destinos disponibles primero; futuros separados; un botón principal en portada | Mismo contenido y destinos accesibles; no navegación espacial obligatoria | COGA sugiere pocas elecciones; no se reduce el conjunto pedagógico de seis decisiones u ocho respuestas |
| Espacio en blanco, COGA `o3p10-whitespace` | Separación por proximidad y papel liso; ilustraciones fuera del texto | Capturas de cinco viewports; reflow sin pérdida de contenido | Más aire y dibujos grandes aumentan el recorrido vertical |
| Comprensión de símbolos | Imagen + texto. La selección incluye ✓ y `aria-pressed`; ninguna inferencia emocional | Lotes 5/6 verifican etiquetas originales, teclado, alfa, estado y no duplicación de iconos | No se ha demostrado que expresiones o herramientas se reconozcan mejor a 96 px |
| Control del cambio, COGA `o8p01-motion` | Sin movimiento continuo; transiciones del lector iniciadas al avanzar; funciones de pausa conservadas | Movimiento reducido en capturas; quality/comic-flow/narration | El botón de animaciones controla transiciones aunque Nubi ya no se balancea |
| Personalización, COGA `o8p03-complexity`, `o8p04-interface` | Ajustes existentes intactos y reversibles; no se crean perfiles | 125 %, fuente/espaciado/mayúsculas disponibles; persistencia y borrado existentes | No se añade «Vista tranquila» sin saber qué simplificar para cada persona |
| Reajuste, WCAG 1.4.10 | Se mantiene `useTightViewport`; barras pasan al flujo al ocupar demasiado alto | Cuento y cómic completos en 320×256; matriz adicional 320×256 y 640×512 | Es emulación por viewport, no zoom real de navegador/SO |
| Foco, WCAG 2.4.11 | Anillo doble existente, vuelta al contenido tras avanzar; reservas de navegación ajustadas | focus-obscured; reflow con Tab y prueba de elemento realmente visible | Falta lector de pantalla y navegador/dispositivo real |
| Tamaño táctil | ≥48 px, normalmente 56/64, más estricto que los 24 px con excepciones de WCAG 2.5.8 | Matriz mide todos los botones, enlaces y summary visibles | No es una evaluación de precisión táctil infantil |
| Contraste | Tokens aprobados, superficies opacas, modo de contraste alto conservado | Axe y matriz de contraste aumentado; nombres y estados no dependen del color | Falta evaluación con baja visión y pantallas reales |
| Autonomía y formas de comunicación | Varias o ninguna emoción/herramienta; «No lo sé», «Otra cosa», CAA y apoyos intactos | quality, short-text, lotes 3–6 y diff sin cambios de contenido | Las decisiones editoriales sensibles de fases previas siguen abiertas |

## Decisiones concretas

### Controles del lector

Se comparó agrupar controles en un menú frente a mantenerlos visibles. Se eligió **mantener los cuatro controles secundarios visibles** en una franja más compacta. Un menú reduciría elementos a costa de esconder Escuchar y Detener animaciones, añadir un paso y complicar el descubrimiento. Atrás y Siguiente conservan posición y tamaño. Los botones completos miden al menos 48 px aunque su icono interior sea menor.

### Consecuencias

La primera ruta, ya existente, se presenta antes del contenido. En el piloto es «Probar otra posibilidad». No se duplican botones con el mismo nombre. Las demás rutas quedan tras la lectura; el motor y sus destinos no cambian. El coste: algunos usuarios podrían volver antes de leer; comprobarlo con observación, sin imponer bloqueos.

### Mis emociones

Se conserva el catálogo y su selección inicial. El estado añade una marca explícita. No se dice «así te sientes» y no se registran perfiles. En móvil la ficha sigue debajo del selector; el área viva existente comunica el cambio a tecnología de asistencia, pero **el descubrimiento visual de la ficha continúa como riesgo a probar**. No se introduce un salto automático al seleccionarla.

### Texto breve y sinopsis

La ficha usa el `tagline` que ya existía y conserva la sinopsis completa dentro de «Sobre esta historia». No se genera, resume ni reescribe texto educativo. «Textos cortos» sigue usando solo versiones existentes; no se integran borradores de fase 16.

### Formatos e imágenes

Cuento y Cómic son enlaces grandes con vista previa y texto; Vídeo mantiene «En producción» y su página explicativa. Las vistas previas del cómic son decorativas, no reemplazan sus viñetas y bocadillos de lectura. Todas las imágenes narrativas conservan su proporción y no se estiran. El paisaje de portada pasa de `cover` a `contain`.

### Compatibilidad local

No cambian esquema, prefijo `nubi.v1.`, preferencias, progreso ni respuestas. No hay nueva dependencia, telemetría, cuenta, servicio o IA en ejecución. La prueba quality recorre recuperación, multiselección, resumen, borrado y ausencia de solicitudes externas. La voz se activa solo por acción explícita y sigue siendo local.

## Pendientes

La guía de Leeds requiere una consulta posterior cuando haya acceso. Los protocolos M-01 a M-16, la revisión de los textos y las pruebas con personas siguen pendientes; el [plan humano](PENDING_USER_VALIDATION.md) indica cómo convertir las hipótesis en decisiones.
