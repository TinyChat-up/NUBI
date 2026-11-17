# Cuento 2 · Inventario de ilustraciones

Cuento propuesto: **«El libro de trenes»** ([STORY_02_PROPOSAL.md](STORY_02_PROPOSAL.md)). Mapa: [STORY_02_BRANCH_MAP.md](STORY_02_BRANCH_MAP.md).

Fuente: registro `src/content/assets/` (72 recursos, todos `listo`). Revisado visualmente sobre los archivos de `public/media/`, no solo por su descripción. **No se ha generado ni modificado ninguna imagen.**

Criterio: una imagen se reutiliza **solo si lo que muestra coincide con lo que dice el texto** de la nueva pantalla. Si contradice, aunque sea en un detalle (quién tiene el libro, dónde está cada personaje), se pide una nueva.

## 1. Qué hay en los 72 recursos

| Grupo | Nº | Contenido | Uso posible en el cuento 2 |
|---|---|---|---|
| Portada | 1 | `portada-fondo` (pueblo y colegio) | Ninguno (es la portada de la app) |
| Nubi | 2 | `nubi-saludo`, `nubi-pensando` | **Sí**: guía y «¿Quieres probar otra forma?» (ya los usa el lector) |
| Hojas de personaje | 9 | Nubi, Teo, Aya, Bruno, Lía, Andrés, Carmen, Pilar, Rosa (cuerpo entero, transparentes) | **Sí**, como retrato de quien habla (fase 20) y como **referencia de estilo** para las ilustraciones nuevas |
| Lugares | 6 | colegio, casa, parque, amigos, emociones, herramientas | No: ninguno es la biblioteca y desde la fase 19 no se muestran |
| Herramientas | 7 | pedir ayuda, descansar, espacio tranquilo, comunicar una necesidad, anticipar cambios, expresar desacuerdo, apoyos sensoriales | **Sí**, como apoyos del cuento en la guía para familias y docentes (`story.strategies`). **No** como escenas: muestran a otros niños, no a Teo ni a Lía |
| Emociones (Nubi) | 9 | alegría, calma, sorpresa, curiosidad, inseguridad, frustración, tristeza, enfado, cansancio | **Sí**: preguntas emocionales opcionales |
| Cubierta del piloto | 1 | `ume-cover` | No (es la de otro cuento) |
| Escenas del piloto | 10 | llegada, pasillo, cambio, pizarra, Teo piensa, plan, **biblioteca**, salida | Solo `ume-s6-biblioteca` |
| Opciones y consecuencias del piloto | 12 | preguntar, horario, adulto, recurso, tiempo, salir | No: cuentan otra situación |
| Viñetas del cómic piloto | 15 | k1…k7 | Solo `ume-k6-2` (Teo leyendo trenes) |

**Personajes disponibles** (con hoja de modelo y estilo fijado): Teo, Lía, Aya, Bruno, Andrés, Pilar, Rosa, Carmen y Nubi. El cuento 2 usa **Teo, Lía y Aya**; Nubi solo como guía.

**Fondos disponibles**: la biblioteca escolar (estanterías, globo terráqueo, arcoíris de madera, pufs, mesa redonda), el aula, el pasillo, la verja y la calle. El cuento 2 ocurre entero en la **biblioteca**, el único fondo con dos ilustraciones existentes que encajan.

**Acciones ilustradas que encajan**:

- Teo leyendo un libro de trenes con los cascos puestos (`ume-k6-2`).
- Lía junto a Teo enseñando su comunicador (`ume-s6-biblioteca`).
- Aya con un libro de volcanes (`ume-s6-biblioteca`, al fondo).

## 2. Imágenes que se pueden reutilizar

| Recurso | Qué muestra (revisado) | Pantalla del cuento 2 | Condición |
|---|---|---|---|
| `ume-k6-2` | Teo con los cascos verdes, leyendo concentrado un libro de trenes en la biblioteca | **P1** (Teo lee) y tarjeta de la opción **B** («Seguir leyendo») | Es una viñeta 4:3 sin versión vertical: en móvil se ve entera, con franjas de fondo. Aceptable para la primera versión; una versión vertical sería una mejora |
| `ume-s6-biblioteca` | Teo con cascos y su libro de trenes; **Lía a su lado señalando su comunicador**; Aya con un libro de volcanes; Bruno en un puf | **P2** (Lía se acerca y le habla con su comunicador) | El texto **no** debe describir pictogramas concretos: en la imagen no se leen. En el piloto esta escena cierra la historia; reutilizarla en otro cuento no cambia lo que muestra |
| `emo-sorpresa`, `emo-curiosidad`, `emo-calma`, `emo-inseguridad`, `emo-tristeza`, `emo-alegria` | Nubi con cada emoción | Preguntas opcionales **P3** (Teo) y **P6** (Lía) | Siempre con su nombre escrito; «Otra cosa» y «No lo sé» con icono |
| `tool-comunicar-necesidad`, `tool-apoyos-sensoriales`, `tool-expresar-desacuerdo` | Pictograma, bocadillo y nota · cascos y otros apoyos · decir algo con calma | Guía para familias y docentes: «Apoyos que aparecen en el cuento» | Solo como tarjetas de apoyo, no como escenas. Para mostrarlos **dentro** de las escenas ramificadas (como los apoyos desplegables del piloto) haría falta un pequeño cambio de presentación, **no incluido** en esta fase |
| `char-teo`, `char-lia`, `char-aya` | Retratos de cuerpo entero | Retrato junto al nombre de quien habla | Ya funciona en el lector (fase 20) |
| `nubi-pensando`, `nubi-saludo` | Nubi | Oferta y final | Ya funciona en el lector (fase 21) |

**Total reutilizable: 2 escenas/viñetas, 6 emociones, 3 apoyos (en la guía) y 3 retratos**, más Nubi, sin cambiar el significado de ninguna.

## 3. Imágenes descartadas (y por qué)

| Recurso | Motivo |
|---|---|
| `ume-k6-3` (Bruno en un puf, Aya, Lía con comunicador) | Lía aparece lejos de Teo y hablando a otra persona; en P5b se necesita a Lía esperando junto a Teo |
| `ume-s6-biblioteca` para el final con Aya | Lía está junto a Teo, no con Aya: contradiría el final B2 |
| `ume-c-tiempo`, `ume-opt-tiempo` | Teo y Andrés en el aula, otra situación |
| `ume-opt-regulacion` / `ume-c-regulacion` | Teo se pone los cascos por el ruido: en este cuento ya los lleva puestos desde el principio |
| `place-*` | No son la biblioteca y no muestran la acción |
| `tool-*` como escena | Los protagonistas de esas imágenes no son Teo ni Lía |

## 4. Ilustraciones nuevas necesarias

Estilo: el mismo del proyecto (gouache cálido, paleta crema/petróleo/coral/salvia/mostaza), mismos modelos de personaje (`char-*`) y misma biblioteca de `ume-s6-biblioteca` (estanterías, globo, arcoíris de madera, mesa redonda, pufs). **Ninguna se encarga sin aprobación.**

| Id propuesto | Tipo | Proporción | Qué debe verse | Pantalla |
|---|---|---|---|---|
| `lt-cover` | cubierta | 4:3 | Teo, con cascos, sujeta su libro de trenes en la biblioteca; Lía cerca, con su comunicador visible. Ambiente tranquilo | Biblioteca de cuentos |
| `lt-opt-ensenar` | opción | 4:3 | Teo gira el libro abierto hacia Lía; aún lleva los cascos | P4, tarjeta A |
| `lt-juntos` | escena | 16:9 **+ vertical** | Teo y Lía miran juntos el libro abierto; Lía señala un tren con el dedo y su comunicador está sobre la mesa. Expresiones tranquilas | P5a / final A |
| `lt-espera` | escena | 16:9 **+ vertical** | Teo sigue leyendo con los cascos; Lía, de pie a su lado, espera con el comunicador en la mano. Sin dramatismo | P5b y tarjeta B2 |
| `lt-opt-luego` | opción | 4:3 | Teo levanta un momento la vista y hace a Lía un gesto o le enseña una tarjeta de «luego» (símbolo de reloj o de pausa, sin texto legible) | P6, tarjeta B1 |
| `lt-luego` | escena | 16:9 **+ vertical** | Lía asiente y se sienta con Aya, que tiene un libro de volcanes; al fondo, Teo lee. Más tarde (luz algo distinta), Teo le enseña el libro de trenes a Lía | Final B1 |
| `lt-con-aya` | escena | 16:9 **+ vertical** | Lía se acerca a Aya y miran juntas el libro de volcanes; Teo sigue leyendo al fondo. Nadie enfadado | Final B2 |

**Total: 7 ilustraciones nuevas** (1 cubierta, 2 opciones, 4 escenas) **y 4 composiciones verticales** de las escenas, según el contrato de `ILLUSTRATION_INTEGRATION.md`.

### Cómic (segunda entrega, opcional)

El cuento puede publicarse primero **solo como cuento**. Para el formato cómic harían falta unas **6 viñetas** con zonas libres para bocadillos (P1, P2, P5a, P5b, B1 y B2), como en el piloto. No se incluyen en el recuento anterior.
