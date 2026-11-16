# Solicitudes de recursos visuales

> Archivo **generado** con `npm run assets:doc` desde `src/content/assets/` y `src/content/stories/*/assets.ts`.
> No lo edites a mano: cambia el registro y vuelve a generarlo.

Estado: **14 de 72** recursos entregados. Mientras un recurso esté `pendiente`, la app muestra un placeholder vectorial temporal.

## Instrucciones generales para la producción (ChatGPT / equipo de ilustración)

- **Estilo:** ilustración 2D contemporánea con inspiración en el cuento infantil europeo. Formas suaves, texturas de papel o gouache digital muy sutiles, línea fina y cálida. Ver `docs/VISUAL_GUIDE.md`.
- **Paleta:** crema `#FBF5EA`, azul petróleo `#22606B`, coral `#E2704F`, verde salvia `#6F8F69`, mostaza `#E3AE4C`, tinta `#22333A`. Sin colores saturados ni neón.
- **Originalidad:** personajes, escenarios y composiciones originales de NUBI. No imitar personajes, estilos reconocibles de autores vivos ni marcas. No usar fotografías.
- **Sin texto en las imágenes.** Textos, bocadillos y subtítulos los pone la app (permite traducir, ampliar letra y leer en voz alta).
- **Representación respetuosa:** diversidad de rasgos, tonos de piel y familias. Los apoyos (cascos, comunicador de pictogramas, tarjetas) se dibujan con naturalidad, nunca como algo raro. Nadie mira fijamente a cámara por obligación; no se exige contacto visual.
- **Calma sensorial:** sin destellos, patrones de alto contraste, rayas finas repetitivas ni escenas recargadas. Expresiones claras pero no exageradas.
- **Consistencia:** respetar las hojas de personaje (`char-*`). Misma localización = mismos elementos (verja, reloj, pizarra, perchas).
- **Formato de entrega:** WebP (calidad 85) para escenas; PNG o WebP con alfa cuando se pide transparencia. Dimensiones indicadas = tamaño de exportación (2x). sRGB.
- **Entrega:** guardar el archivo en `public` + la ruta indicada (p. ej. `public/media/places/colegio.webp`) y cambiar `status` a `listo` en el registro.

## Reparto (referencia)

| Personaje | Papel | Descripción visual |
|---|---|---|
| **Nubi** | Guía del mundo de historias | Pequeña nube redondeada, color crema cálido con borde azul petróleo suave, ojos de punto, mejillas coral. Sin boca grande ni gestos exagerados. Flota a poca altura. Diseño maestro editorial en docs/art-direction/models/nubi.webp. |
| **Teo** | Protagonista · 8 años | Niño de 8 años, pelo castaño despeinado, sudadera azul petróleo con capucha, mochila mostaza con un llavero de tren. Lleva unos cascos antirruido verdes colgados de la mochila. |
| **Aya** | Compañera de clase | Niña de 8 años, pelo negro recogido en dos moños, jersey coral, gafas redondas. |
| **Bruno** | Compañero de clase | Niño de 9 años, pelo rizado pelirrojo, camiseta mostaza, rodilleras de jugar al fútbol. |
| **Lía** | Compañera de clase | Niña de 7 años, pelo corto rubio oscuro con horquilla de estrella, peto verde salvia. Lleva una tableta pequeña de comunicación con pictogramas en una funda con asa. |
| **Andrés** | Maestro sustituto | Adulto de unos 35 años, barba corta, camisa de cuadros azul y crema, sonrisa tranquila, lleva una carpeta. |
| **Carmen** | Maestra de siempre | Adulta de unos 50 años, pelo gris corto, chaqueta de punto coral, pendientes de botón. |
| **Pilar** | Maestra de apoyo | Adulta de unos 40 años, pelo largo oscuro trenzado, jersey verde salvia, colgante de madera. |
| **Rosa** | Abuela de Teo | Adulta mayor, pelo blanco recogido, abrigo mostaza, bufanda azul. |

## Plataforma (portada, personajes, lugares, herramientas, emociones)

| ID | Tipo | Archivo | Estado |
|---|---|---|---|
| `portada-fondo` | Portada | `/media/common/portada-fondo.webp` | listo |
| `nubi-saludo` | Personaje | `/media/characters/nubi-saludo.png` | listo |
| `nubi-pensando` | Personaje | `/media/characters/nubi-pensando.png` | listo |
| `char-nubi` | Personaje | `/media/characters/nubi.png` | listo |
| `char-teo` | Personaje | `/media/characters/teo.png` | listo |
| `char-aya` | Personaje | `/media/characters/aya.png` | listo |
| `char-bruno` | Personaje | `/media/characters/bruno.png` | listo |
| `char-lia` | Personaje | `/media/characters/lia.png` | listo |
| `char-andres` | Personaje | `/media/characters/andres.png` | listo |
| `char-carmen` | Personaje | `/media/characters/carmen.png` | listo |
| `char-pilar` | Personaje | `/media/characters/pilar.png` | listo |
| `char-rosa` | Personaje | `/media/characters/rosa.png` | listo |
| `place-colegio` | Lugar | `/media/places/colegio.webp` | pendiente |
| `place-casa` | Lugar | `/media/places/casa.webp` | pendiente |
| `place-parque` | Lugar | `/media/places/parque.webp` | pendiente |
| `place-amigos` | Lugar | `/media/places/amigos.webp` | pendiente |
| `place-emociones` | Lugar | `/media/places/emociones.webp` | pendiente |
| `place-herramientas` | Lugar | `/media/places/herramientas.webp` | pendiente |
| `tool-pedir-ayuda` | Herramienta | `/media/tools/pedir-ayuda.png` | pendiente |
| `tool-descansar` | Herramienta | `/media/tools/descansar.png` | pendiente |
| `tool-espacio-tranquilo` | Herramienta | `/media/tools/espacio-tranquilo.png` | pendiente |
| `tool-comunicar-necesidad` | Herramienta | `/media/tools/comunicar-necesidad.png` | pendiente |
| `tool-anticipar-cambios` | Herramienta | `/media/tools/anticipar-cambios.png` | pendiente |
| `tool-expresar-desacuerdo` | Herramienta | `/media/tools/expresar-desacuerdo.png` | pendiente |
| `tool-apoyos-sensoriales` | Herramienta | `/media/tools/apoyos-sensoriales.png` | pendiente |
| `emo-alegria` | Emoción | `/media/emotions/alegria.png` | pendiente |
| `emo-calma` | Emoción | `/media/emotions/calma.png` | pendiente |
| `emo-sorpresa` | Emoción | `/media/emotions/sorpresa.png` | pendiente |
| `emo-curiosidad` | Emoción | `/media/emotions/curiosidad.png` | pendiente |
| `emo-inseguridad` | Emoción | `/media/emotions/inseguridad.png` | pendiente |
| `emo-frustracion` | Emoción | `/media/emotions/frustracion.png` | pendiente |
| `emo-tristeza` | Emoción | `/media/emotions/tristeza.png` | pendiente |
| `emo-enfado` | Emoción | `/media/emotions/enfado.png` | pendiente |
| `emo-cansancio` | Emoción | `/media/emotions/cansancio.png` | pendiente |

### `portada-fondo`

- **Nombre de archivo:** `public/media/common/portada-fondo.webp`
- **Escena / uso:** Portada (pantalla A) — fondo panorámico
- **Descripción visual:** Paisaje panorámico al amanecer visto desde una colina: un pequeño pueblo europeo con tejados coral, un colegio con reloj, un parque con un árbol grande y una casa con jardín, conectados por un camino serpenteante. Nubes suaves. Mucho aire en el tercio superior para el logotipo.
- **Personajes:** —
- **Emoción o acción:** Calma, exploración, curiosidad
- **Proporción:** 16:9
- **Dimensiones recomendadas:** 2400 × 1350 px
- **Fondo y composición:** Cielo crema-melocotón degradado. Colinas en verde salvia y azul petróleo en capas (preparar en capas separadas para un parallax opcional).
- **Transparencia:** No
- **Texto alternativo:** «Un pueblo tranquilo al amanecer, con un colegio, un parque y casas unidos por un camino.»

### `nubi-saludo`

- **Nombre de archivo:** `public/media/characters/nubi-saludo.png`
- **Escena / uso:** Portada y pantallas de bienvenida
- **Descripción visual:** Nubi, la nube guía, flotando y saludando con un pequeño brazo de nube. Expresión amable y serena.
- **Personajes:** Nubi
- **Emoción o acción:** Saludo tranquilo
- **Proporción:** 1:1
- **Dimensiones recomendadas:** 1024 × 1024 px
- **Fondo y composición:** Sin fondo (PNG/WebP con canal alfa). Sombra de contacto suave opcional, en capa separada.
- **Transparencia:** Sí (canal alfa)
- **Texto alternativo:** «Nubi, una nube pequeña y amable, saluda.»

### `nubi-pensando`

- **Nombre de archivo:** `public/media/characters/nubi-pensando.png`
- **Escena / uso:** Escenas de reflexión (preguntas de Nubi)
- **Descripción visual:** Nubi ligeramente inclinada, mirando hacia arriba, con una pequeña chispa de idea a su lado.
- **Personajes:** Nubi
- **Emoción o acción:** Pensar, preguntarse
- **Proporción:** 1:1
- **Dimensiones recomendadas:** 1024 × 1024 px
- **Fondo y composición:** Sin fondo (PNG/WebP con canal alfa). Sombra de contacto suave opcional, en capa separada.
- **Transparencia:** Sí (canal alfa)
- **Texto alternativo:** «Nubi piensa.»

### `char-nubi`

- **Nombre de archivo:** `public/media/characters/nubi.png`
- **Escena / uso:** Presentación de personajes en la ficha de historia · referencia de consistencia para todas las ilustraciones
- **Descripción visual:** Retrato de cuerpo entero de Nubi, de frente y en reposo. Diseño maestro editorial entregado; movimientos muy suaves (flotar, parpadear). Entregar además (fuera de la app) una hoja de modelo con vistas de frente, perfil y espalda y 4 expresiones: tranquilo, sorpresa, preocupación, alegría.
- **Personajes:** Nubi
- **Emoción o acción:** Neutral, amable
- **Proporción:** 3:4
- **Dimensiones recomendadas:** 1536 × 2048 px
- **Fondo y composición:** Sin fondo (PNG/WebP con canal alfa). Sombra de contacto suave opcional, en capa separada.
- **Transparencia:** Sí (canal alfa)
- **Texto alternativo:** «Nubi.»

### `char-teo`

- **Nombre de archivo:** `public/media/characters/teo.png`
- **Escena / uso:** Presentación de personajes en la ficha de historia · referencia de consistencia para todas las ilustraciones
- **Descripción visual:** Retrato de cuerpo entero de Teo, de frente y en reposo. Cascos antirruido verdes visibles colgando de la mochila. Entregar además (fuera de la app) una hoja de modelo con vistas de frente, perfil y espalda y 4 expresiones: tranquilo, sorpresa, preocupación, alegría.
- **Personajes:** Teo
- **Emoción o acción:** Neutral, amable
- **Proporción:** 3:4
- **Dimensiones recomendadas:** 1536 × 2048 px
- **Fondo y composición:** Sin fondo (PNG/WebP con canal alfa). Sombra de contacto suave opcional, en capa separada.
- **Transparencia:** Sí (canal alfa)
- **Texto alternativo:** «Teo.»

### `char-aya`

- **Nombre de archivo:** `public/media/characters/aya.png`
- **Escena / uso:** Presentación de personajes en la ficha de historia · referencia de consistencia para todas las ilustraciones
- **Descripción visual:** Retrato de cuerpo entero de Aya, de frente y en reposo. Gafas redondas, postura abierta y curiosa. Entregar además (fuera de la app) una hoja de modelo con vistas de frente, perfil y espalda y 4 expresiones: tranquilo, sorpresa, preocupación, alegría.
- **Personajes:** Aya
- **Emoción o acción:** Neutral, amable
- **Proporción:** 3:4
- **Dimensiones recomendadas:** 1536 × 2048 px
- **Fondo y composición:** Sin fondo (PNG/WebP con canal alfa). Sombra de contacto suave opcional, en capa separada.
- **Transparencia:** Sí (canal alfa)
- **Texto alternativo:** «Aya.»

### `char-bruno`

- **Nombre de archivo:** `public/media/characters/bruno.png`
- **Escena / uso:** Presentación de personajes en la ficha de historia · referencia de consistencia para todas las ilustraciones
- **Descripción visual:** Retrato de cuerpo entero de Bruno, de frente y en reposo. Energía de movimiento, rodilleras de fútbol. Entregar además (fuera de la app) una hoja de modelo con vistas de frente, perfil y espalda y 4 expresiones: tranquilo, sorpresa, preocupación, alegría.
- **Personajes:** Bruno
- **Emoción o acción:** Neutral, amable
- **Proporción:** 3:4
- **Dimensiones recomendadas:** 1536 × 2048 px
- **Fondo y composición:** Sin fondo (PNG/WebP con canal alfa). Sombra de contacto suave opcional, en capa separada.
- **Transparencia:** Sí (canal alfa)
- **Texto alternativo:** «Bruno.»

### `char-lia`

- **Nombre de archivo:** `public/media/characters/lia.png`
- **Escena / uso:** Presentación de personajes en la ficha de historia · referencia de consistencia para todas las ilustraciones
- **Descripción visual:** Retrato de cuerpo entero de Lía, de frente y en reposo. Su comunicador de pictogramas siempre visible y presentado con naturalidad, como parte de ella. Entregar además (fuera de la app) una hoja de modelo con vistas de frente, perfil y espalda y 4 expresiones: tranquilo, sorpresa, preocupación, alegría.
- **Personajes:** Lía
- **Emoción o acción:** Neutral, amable
- **Proporción:** 3:4
- **Dimensiones recomendadas:** 1536 × 2048 px
- **Fondo y composición:** Sin fondo (PNG/WebP con canal alfa). Sombra de contacto suave opcional, en capa separada.
- **Transparencia:** Sí (canal alfa)
- **Texto alternativo:** «Lía.»

### `char-andres`

- **Nombre de archivo:** `public/media/characters/andres.png`
- **Escena / uso:** Presentación de personajes en la ficha de historia · referencia de consistencia para todas las ilustraciones
- **Descripción visual:** Retrato de cuerpo entero de Andrés, de frente y en reposo. Adulto cercano; evitar rasgos de autoridad intimidante. Entregar además (fuera de la app) una hoja de modelo con vistas de frente, perfil y espalda y 4 expresiones: tranquilo, sorpresa, preocupación, alegría.
- **Personajes:** Andrés
- **Emoción o acción:** Neutral, amable
- **Proporción:** 3:4
- **Dimensiones recomendadas:** 1536 × 2048 px
- **Fondo y composición:** Sin fondo (PNG/WebP con canal alfa). Sombra de contacto suave opcional, en capa separada.
- **Transparencia:** Sí (canal alfa)
- **Texto alternativo:** «Andrés.»

### `char-carmen`

- **Nombre de archivo:** `public/media/characters/carmen.png`
- **Escena / uso:** Presentación de personajes en la ficha de historia · referencia de consistencia para todas las ilustraciones
- **Descripción visual:** Retrato de cuerpo entero de Carmen, de frente y en reposo. Aparece solo en recuerdos o retratos. Entregar además (fuera de la app) una hoja de modelo con vistas de frente, perfil y espalda y 4 expresiones: tranquilo, sorpresa, preocupación, alegría.
- **Personajes:** Carmen
- **Emoción o acción:** Neutral, amable
- **Proporción:** 3:4
- **Dimensiones recomendadas:** 1536 × 2048 px
- **Fondo y composición:** Sin fondo (PNG/WebP con canal alfa). Sombra de contacto suave opcional, en capa separada.
- **Transparencia:** Sí (canal alfa)
- **Texto alternativo:** «Carmen.»

### `char-pilar`

- **Nombre de archivo:** `public/media/characters/pilar.png`
- **Escena / uso:** Presentación de personajes en la ficha de historia · referencia de consistencia para todas las ilustraciones
- **Descripción visual:** Retrato de cuerpo entero de Pilar, de frente y en reposo. Transmite confianza y calma. Entregar además (fuera de la app) una hoja de modelo con vistas de frente, perfil y espalda y 4 expresiones: tranquilo, sorpresa, preocupación, alegría.
- **Personajes:** Pilar
- **Emoción o acción:** Neutral, amable
- **Proporción:** 3:4
- **Dimensiones recomendadas:** 1536 × 2048 px
- **Fondo y composición:** Sin fondo (PNG/WebP con canal alfa). Sombra de contacto suave opcional, en capa separada.
- **Transparencia:** Sí (canal alfa)
- **Texto alternativo:** «Pilar.»

### `char-rosa`

- **Nombre de archivo:** `public/media/characters/rosa.png`
- **Escena / uso:** Presentación de personajes en la ficha de historia · referencia de consistencia para todas las ilustraciones
- **Descripción visual:** Retrato de cuerpo entero de Rosa, de frente y en reposo. Abuela activa, con bolso de tela. Entregar además (fuera de la app) una hoja de modelo con vistas de frente, perfil y espalda y 4 expresiones: tranquilo, sorpresa, preocupación, alegría.
- **Personajes:** Rosa
- **Emoción o acción:** Neutral, amable
- **Proporción:** 3:4
- **Dimensiones recomendadas:** 1536 × 2048 px
- **Fondo y composición:** Sin fondo (PNG/WebP con canal alfa). Sombra de contacto suave opcional, en capa separada.
- **Transparencia:** Sí (canal alfa)
- **Texto alternativo:** «Rosa.»

### `place-colegio`

- **Nombre de archivo:** `public/media/places/colegio.webp`
- **Escena / uso:** Mi mundo (pantalla B) — tarjeta de lugar
- **Descripción visual:** Fachada de un colegio pequeño de ladrillo claro, con reloj, árbol y bicicletas aparcadas. Puerta abierta, luz de mañana.
- **Personajes:** —
- **Emoción o acción:** Lugar acogedor y reconocible, sin personas en primer plano
- **Proporción:** 4:3
- **Dimensiones recomendadas:** 2048 × 1536 px
- **Fondo y composición:** Escena completa, composición centrada con el elemento principal en el tercio inferior. Margen superior despejado.
- **Transparencia:** No
- **Texto alternativo:** «Un colegio con la puerta abierta por la mañana.»

### `place-casa`

- **Nombre de archivo:** `public/media/places/casa.webp`
- **Escena / uso:** Mi mundo (pantalla B) — tarjeta de lugar
- **Descripción visual:** Casa de dos plantas con ventanas iluminadas, jardín pequeño y un gato en la ventana. Tarde tranquila.
- **Personajes:** —
- **Emoción o acción:** Lugar acogedor y reconocible, sin personas en primer plano
- **Proporción:** 4:3
- **Dimensiones recomendadas:** 2048 × 1536 px
- **Fondo y composición:** Escena completa, composición centrada con el elemento principal en el tercio inferior. Margen superior despejado.
- **Transparencia:** No
- **Texto alternativo:** «Una casa acogedora con las ventanas encendidas.»

### `place-parque`

- **Nombre de archivo:** `public/media/places/parque.webp`
- **Escena / uso:** Mi mundo (pantalla B) — tarjeta de lugar
- **Descripción visual:** Parque con un árbol grande, columpios, un banco y un camino. Sin multitudes.
- **Personajes:** —
- **Emoción o acción:** Lugar acogedor y reconocible, sin personas en primer plano
- **Proporción:** 4:3
- **Dimensiones recomendadas:** 2048 × 1536 px
- **Fondo y composición:** Escena completa, composición centrada con el elemento principal en el tercio inferior. Margen superior despejado.
- **Transparencia:** No
- **Texto alternativo:** «Un parque tranquilo con columpios y un árbol grande.»

### `place-amigos`

- **Nombre de archivo:** `public/media/places/amigos.webp`
- **Escena / uso:** Mi mundo (pantalla B) — tarjeta de lugar
- **Descripción visual:** Un banco bajo un árbol con dos mochilas, una pelota y un libro abierto: señales de amistad sin mostrar caras.
- **Personajes:** —
- **Emoción o acción:** Lugar acogedor y reconocible, sin personas en primer plano
- **Proporción:** 4:3
- **Dimensiones recomendadas:** 2048 × 1536 px
- **Fondo y composición:** Escena completa, composición centrada con el elemento principal en el tercio inferior. Margen superior despejado.
- **Transparencia:** No
- **Texto alternativo:** «Dos mochilas, una pelota y un libro en un banco.»

### `place-emociones`

- **Nombre de archivo:** `public/media/places/emociones.webp`
- **Escena / uso:** Mi mundo (pantalla B) — tarjeta de lugar
- **Descripción visual:** Un jardín de nubes de colores suaves, cada una con una forma distinta. Ambiente onírico y sereno.
- **Personajes:** —
- **Emoción o acción:** Lugar acogedor y reconocible, sin personas en primer plano
- **Proporción:** 4:3
- **Dimensiones recomendadas:** 2048 × 1536 px
- **Fondo y composición:** Escena completa, composición centrada con el elemento principal en el tercio inferior. Margen superior despejado.
- **Transparencia:** No
- **Texto alternativo:** «Nubes de colores suaves con formas diferentes.»

### `place-herramientas`

- **Nombre de archivo:** `public/media/places/herramientas.webp`
- **Escena / uso:** Mi mundo (pantalla B) — tarjeta de lugar
- **Descripción visual:** Una mochila abierta de la que salen objetos de apoyo: cascos, tarjetas, una pelota blanda, un horario dibujado.
- **Personajes:** —
- **Emoción o acción:** Lugar acogedor y reconocible, sin personas en primer plano
- **Proporción:** 4:3
- **Dimensiones recomendadas:** 2048 × 1536 px
- **Fondo y composición:** Escena completa, composición centrada con el elemento principal en el tercio inferior. Margen superior despejado.
- **Transparencia:** No
- **Texto alternativo:** «Una mochila abierta con cascos, tarjetas y una pelota blanda.»

### `tool-pedir-ayuda`

- **Nombre de archivo:** `public/media/tools/pedir-ayuda.png`
- **Escena / uso:** Mis herramientas (pantalla G) y escena 6 del piloto
- **Descripción visual:** Un niño o niña se acerca a un adulto y le enseña una tarjeta. El adulto se agacha a su altura. No hace falta que se miren a los ojos.
- **Personajes:** —
- **Emoción o acción:** Acción de la estrategia, mostrada con calma
- **Proporción:** 1:1
- **Dimensiones recomendadas:** 1024 × 1024 px
- **Fondo y composición:** Sin fondo (PNG/WebP con canal alfa). Sombra de contacto suave opcional, en capa separada.
- **Transparencia:** Sí (canal alfa)
- **Texto alternativo:** «Un niño enseña una tarjeta a un adulto que se agacha para atenderle.»

### `tool-descansar`

- **Nombre de archivo:** `public/media/tools/descansar.png`
- **Escena / uso:** Mis herramientas (pantalla G) y escena 6 del piloto
- **Descripción visual:** Un niño o niña sentado en un cojín, con un vaso de agua, balanceándose suavemente.
- **Personajes:** —
- **Emoción o acción:** Acción de la estrategia, mostrada con calma
- **Proporción:** 1:1
- **Dimensiones recomendadas:** 1024 × 1024 px
- **Fondo y composición:** Sin fondo (PNG/WebP con canal alfa). Sombra de contacto suave opcional, en capa separada.
- **Transparencia:** Sí (canal alfa)
- **Texto alternativo:** «Una niña descansa sentada en un cojín.»

### `tool-espacio-tranquilo`

- **Nombre de archivo:** `public/media/tools/espacio-tranquilo.png`
- **Escena / uso:** Mis herramientas (pantalla G) y escena 6 del piloto
- **Descripción visual:** Rincón con tienda de tela, cojines, luz suave y una planta.
- **Personajes:** —
- **Emoción o acción:** Acción de la estrategia, mostrada con calma
- **Proporción:** 1:1
- **Dimensiones recomendadas:** 1024 × 1024 px
- **Fondo y composición:** Sin fondo (PNG/WebP con canal alfa). Sombra de contacto suave opcional, en capa separada.
- **Transparencia:** Sí (canal alfa)
- **Texto alternativo:** «Un rincón tranquilo con cojines y una lámpara suave.»

### `tool-comunicar-necesidad`

- **Nombre de archivo:** `public/media/tools/comunicar-necesidad.png`
- **Escena / uso:** Mis herramientas (pantalla G) y escena 6 del piloto
- **Descripción visual:** Tres formas de comunicar a la vez: un bocadillo, una mano que señala un pictograma y una nota escrita.
- **Personajes:** —
- **Emoción o acción:** Acción de la estrategia, mostrada con calma
- **Proporción:** 1:1
- **Dimensiones recomendadas:** 1024 × 1024 px
- **Fondo y composición:** Sin fondo (PNG/WebP con canal alfa). Sombra de contacto suave opcional, en capa separada.
- **Transparencia:** Sí (canal alfa)
- **Texto alternativo:** «Un bocadillo de diálogo, un pictograma y una nota escrita.»

### `tool-anticipar-cambios`

- **Nombre de archivo:** `public/media/tools/anticipar-cambios.png`
- **Escena / uso:** Mis herramientas (pantalla G) y escena 6 del piloto
- **Descripción visual:** Un horario visual de la mañana con dibujos sencillos, una pieza cambiada de sitio con una flecha.
- **Personajes:** —
- **Emoción o acción:** Acción de la estrategia, mostrada con calma
- **Proporción:** 1:1
- **Dimensiones recomendadas:** 1024 × 1024 px
- **Fondo y composición:** Sin fondo (PNG/WebP con canal alfa). Sombra de contacto suave opcional, en capa separada.
- **Transparencia:** Sí (canal alfa)
- **Texto alternativo:** «Un horario con dibujos en el que una actividad cambia de sitio.»

### `tool-expresar-desacuerdo`

- **Nombre de archivo:** `public/media/tools/expresar-desacuerdo.png`
- **Escena / uso:** Mis herramientas (pantalla G) y escena 6 del piloto
- **Descripción visual:** Un niño o niña con una mano levantada, diciendo algo con calma a un adulto que escucha.
- **Personajes:** —
- **Emoción o acción:** Acción de la estrategia, mostrada con calma
- **Proporción:** 1:1
- **Dimensiones recomendadas:** 1024 × 1024 px
- **Fondo y composición:** Sin fondo (PNG/WebP con canal alfa). Sombra de contacto suave opcional, en capa separada.
- **Transparencia:** Sí (canal alfa)
- **Texto alternativo:** «Un niño expresa con calma que no está de acuerdo y un adulto le escucha.»

### `tool-apoyos-sensoriales`

- **Nombre de archivo:** `public/media/tools/apoyos-sensoriales.png`
- **Escena / uso:** Mis herramientas (pantalla G) y escena 6 del piloto
- **Descripción visual:** Cascos antirruido, gafas de sol, una pelota blanda y una manta, ordenados como un pequeño kit.
- **Personajes:** —
- **Emoción o acción:** Acción de la estrategia, mostrada con calma
- **Proporción:** 1:1
- **Dimensiones recomendadas:** 1024 × 1024 px
- **Fondo y composición:** Sin fondo (PNG/WebP con canal alfa). Sombra de contacto suave opcional, en capa separada.
- **Transparencia:** Sí (canal alfa)
- **Texto alternativo:** «Cascos, gafas de sol, una pelota blanda y una manta.»

### `emo-alegria`

- **Nombre de archivo:** `public/media/emotions/alegria.png`
- **Escena / uso:** Mis emociones · selector "¿Cómo te sentirías?"
- **Descripción visual:** Nubi con forma redondeada y expandida, ojos en media luna. Representar la emoción con Nubi (cara y forma de la nube), no con una persona, para que cualquier niño o niña pueda identificarse. Expresión clara pero no exagerada.
- **Personajes:** Nubi
- **Emoción o acción:** Alegría
- **Proporción:** 1:1
- **Dimensiones recomendadas:** 1024 × 1024 px
- **Fondo y composición:** Sin fondo (PNG/WebP con canal alfa). Sombra de contacto suave opcional, en capa separada.
- **Transparencia:** Sí (canal alfa)
- **Texto alternativo:** «Nubi expresa alegría.»

### `emo-calma`

- **Nombre de archivo:** `public/media/emotions/calma.png`
- **Escena / uso:** Mis emociones · selector "¿Cómo te sentirías?"
- **Descripción visual:** Nubi alargada y horizontal, ojos cerrados, flotando bajo. Representar la emoción con Nubi (cara y forma de la nube), no con una persona, para que cualquier niño o niña pueda identificarse. Expresión clara pero no exagerada.
- **Personajes:** Nubi
- **Emoción o acción:** Calma
- **Proporción:** 1:1
- **Dimensiones recomendadas:** 1024 × 1024 px
- **Fondo y composición:** Sin fondo (PNG/WebP con canal alfa). Sombra de contacto suave opcional, en capa separada.
- **Transparencia:** Sí (canal alfa)
- **Texto alternativo:** «Nubi expresa calma.»

### `emo-sorpresa`

- **Nombre de archivo:** `public/media/emotions/sorpresa.png`
- **Escena / uso:** Mis emociones · selector "¿Cómo te sentirías?"
- **Descripción visual:** Nubi algo más alta, ojos abiertos y pequeñas líneas de movimiento. Representar la emoción con Nubi (cara y forma de la nube), no con una persona, para que cualquier niño o niña pueda identificarse. Expresión clara pero no exagerada.
- **Personajes:** Nubi
- **Emoción o acción:** Sorpresa
- **Proporción:** 1:1
- **Dimensiones recomendadas:** 1024 × 1024 px
- **Fondo y composición:** Sin fondo (PNG/WebP con canal alfa). Sombra de contacto suave opcional, en capa separada.
- **Transparencia:** Sí (canal alfa)
- **Texto alternativo:** «Nubi expresa sorpresa.»

### `emo-curiosidad`

- **Nombre de archivo:** `public/media/emotions/curiosidad.png`
- **Escena / uso:** Mis emociones · selector "¿Cómo te sentirías?"
- **Descripción visual:** Nubi inclinada hacia una lupa. Representar la emoción con Nubi (cara y forma de la nube), no con una persona, para que cualquier niño o niña pueda identificarse. Expresión clara pero no exagerada.
- **Personajes:** Nubi
- **Emoción o acción:** Curiosidad
- **Proporción:** 1:1
- **Dimensiones recomendadas:** 1024 × 1024 px
- **Fondo y composición:** Sin fondo (PNG/WebP con canal alfa). Sombra de contacto suave opcional, en capa separada.
- **Transparencia:** Sí (canal alfa)
- **Texto alternativo:** «Nubi expresa curiosidad.»

### `emo-inseguridad`

- **Nombre de archivo:** `public/media/emotions/inseguridad.png`
- **Escena / uso:** Mis emociones · selector "¿Cómo te sentirías?"
- **Descripción visual:** Nubi algo encogida, borde ondulado, mirando de reojo. Representar la emoción con Nubi (cara y forma de la nube), no con una persona, para que cualquier niño o niña pueda identificarse. Expresión clara pero no exagerada.
- **Personajes:** Nubi
- **Emoción o acción:** Inseguridad
- **Proporción:** 1:1
- **Dimensiones recomendadas:** 1024 × 1024 px
- **Fondo y composición:** Sin fondo (PNG/WebP con canal alfa). Sombra de contacto suave opcional, en capa separada.
- **Transparencia:** Sí (canal alfa)
- **Texto alternativo:** «Nubi expresa inseguridad.»

### `emo-frustracion`

- **Nombre de archivo:** `public/media/emotions/frustracion.png`
- **Escena / uso:** Mis emociones · selector "¿Cómo te sentirías?"
- **Descripción visual:** Nubi con un pequeño nudo dibujado en su interior, ceño suave. Representar la emoción con Nubi (cara y forma de la nube), no con una persona, para que cualquier niño o niña pueda identificarse. Expresión clara pero no exagerada.
- **Personajes:** Nubi
- **Emoción o acción:** Frustración
- **Proporción:** 1:1
- **Dimensiones recomendadas:** 1024 × 1024 px
- **Fondo y composición:** Sin fondo (PNG/WebP con canal alfa). Sombra de contacto suave opcional, en capa separada.
- **Transparencia:** Sí (canal alfa)
- **Texto alternativo:** «Nubi expresa frustración.»

### `emo-tristeza`

- **Nombre de archivo:** `public/media/emotions/tristeza.png`
- **Escena / uso:** Mis emociones · selector "¿Cómo te sentirías?"
- **Descripción visual:** Nubi gris clara dejando caer una gota. Representar la emoción con Nubi (cara y forma de la nube), no con una persona, para que cualquier niño o niña pueda identificarse. Expresión clara pero no exagerada.
- **Personajes:** Nubi
- **Emoción o acción:** Tristeza
- **Proporción:** 1:1
- **Dimensiones recomendadas:** 1024 × 1024 px
- **Fondo y composición:** Sin fondo (PNG/WebP con canal alfa). Sombra de contacto suave opcional, en capa separada.
- **Transparencia:** Sí (canal alfa)
- **Texto alternativo:** «Nubi expresa tristeza.»

### `emo-enfado`

- **Nombre de archivo:** `public/media/emotions/enfado.png`
- **Escena / uso:** Mis emociones · selector "¿Cómo te sentirías?"
- **Descripción visual:** Nubi más oscura con bordes algo más marcados; sin rasgos agresivos. Representar la emoción con Nubi (cara y forma de la nube), no con una persona, para que cualquier niño o niña pueda identificarse. Expresión clara pero no exagerada.
- **Personajes:** Nubi
- **Emoción o acción:** Enfado
- **Proporción:** 1:1
- **Dimensiones recomendadas:** 1024 × 1024 px
- **Fondo y composición:** Sin fondo (PNG/WebP con canal alfa). Sombra de contacto suave opcional, en capa separada.
- **Transparencia:** Sí (canal alfa)
- **Texto alternativo:** «Nubi expresa enfado.»

### `emo-cansancio`

- **Nombre de archivo:** `public/media/emotions/cansancio.png`
- **Escena / uso:** Mis emociones · selector "¿Cómo te sentirías?"
- **Descripción visual:** Nubi caída, ojos entrecerrados, con una pequeña luna. Representar la emoción con Nubi (cara y forma de la nube), no con una persona, para que cualquier niño o niña pueda identificarse. Expresión clara pero no exagerada.
- **Personajes:** Nubi
- **Emoción o acción:** Cansancio
- **Proporción:** 1:1
- **Dimensiones recomendadas:** 1024 × 1024 px
- **Fondo y composición:** Sin fondo (PNG/WebP con canal alfa). Sombra de contacto suave opcional, en capa separada.
- **Transparencia:** Sí (canal alfa)
- **Texto alternativo:** «Nubi expresa cansancio.»

## Episodio piloto · Una mañana diferente

| ID | Tipo | Archivo | Estado |
|---|---|---|---|
| `ume-cover` | Cubierta | `/media/stories/una-manana-diferente/cover.webp` | listo |
| `ume-s1-puerta` | Escena de cuento | `/media/stories/una-manana-diferente/scenes/s1-puerta.webp` | listo |
| `ume-s1-pasillo` | Escena de cuento | `/media/stories/una-manana-diferente/scenes/s1-pasillo.webp` | pendiente |
| `ume-s2-puerta` | Escena de cuento | `/media/stories/una-manana-diferente/scenes/s2-puerta.webp` | pendiente |
| `ume-s2-anuncio` | Escena de cuento | `/media/stories/una-manana-diferente/scenes/s2-anuncio.webp` | pendiente |
| `ume-s2-reacciones` | Escena de cuento | `/media/stories/una-manana-diferente/scenes/s2-reacciones.webp` | pendiente |
| `ume-s3-pizarra` | Escena de cuento | `/media/stories/una-manana-diferente/scenes/s3-pizarra.webp` | pendiente |
| `ume-s4-teo-piensa` | Escena de cuento | `/media/stories/una-manana-diferente/scenes/s4-teo-piensa.webp` | pendiente |
| `ume-s6-plan` | Escena de cuento | `/media/stories/una-manana-diferente/scenes/s6-plan.webp` | pendiente |
| `ume-s6-biblioteca` | Escena de cuento | `/media/stories/una-manana-diferente/scenes/s6-biblioteca.webp` | pendiente |
| `ume-s7-salida` | Escena de cuento | `/media/stories/una-manana-diferente/scenes/s7-salida.webp` | pendiente |
| `ume-opt-preguntar` | Opción / consecuencia | `/media/stories/una-manana-diferente/options/opt-preguntar.webp` | pendiente |
| `ume-c-preguntar` | Opción / consecuencia | `/media/stories/una-manana-diferente/options/c-preguntar.webp` | pendiente |
| `ume-opt-horario` | Opción / consecuencia | `/media/stories/una-manana-diferente/options/opt-horario.webp` | pendiente |
| `ume-c-horario` | Opción / consecuencia | `/media/stories/una-manana-diferente/options/c-horario.webp` | pendiente |
| `ume-opt-adulto` | Opción / consecuencia | `/media/stories/una-manana-diferente/options/opt-adulto.webp` | pendiente |
| `ume-c-adulto` | Opción / consecuencia | `/media/stories/una-manana-diferente/options/c-adulto.webp` | pendiente |
| `ume-opt-regulacion` | Opción / consecuencia | `/media/stories/una-manana-diferente/options/opt-regulacion.webp` | pendiente |
| `ume-c-regulacion` | Opción / consecuencia | `/media/stories/una-manana-diferente/options/c-regulacion.webp` | pendiente |
| `ume-opt-tiempo` | Opción / consecuencia | `/media/stories/una-manana-diferente/options/opt-tiempo.webp` | pendiente |
| `ume-c-tiempo` | Opción / consecuencia | `/media/stories/una-manana-diferente/options/c-tiempo.webp` | pendiente |
| `ume-opt-salir` | Opción / consecuencia | `/media/stories/una-manana-diferente/options/opt-salir.webp` | pendiente |
| `ume-c-salir` | Opción / consecuencia | `/media/stories/una-manana-diferente/options/c-salir.webp` | pendiente |
| `ume-k1-1` | Viñeta de cómic | `/media/stories/una-manana-diferente/comic/k1-1.webp` | pendiente |
| `ume-k1-2` | Viñeta de cómic | `/media/stories/una-manana-diferente/comic/k1-2.webp` | pendiente |
| `ume-k1-3` | Viñeta de cómic | `/media/stories/una-manana-diferente/comic/k1-3.webp` | pendiente |
| `ume-k2-1` | Viñeta de cómic | `/media/stories/una-manana-diferente/comic/k2-1.webp` | pendiente |
| `ume-k2-2` | Viñeta de cómic | `/media/stories/una-manana-diferente/comic/k2-2.webp` | pendiente |
| `ume-k2-3` | Viñeta de cómic | `/media/stories/una-manana-diferente/comic/k2-3.webp` | pendiente |
| `ume-k2-4` | Viñeta de cómic | `/media/stories/una-manana-diferente/comic/k2-4.webp` | pendiente |
| `ume-k3-1` | Viñeta de cómic | `/media/stories/una-manana-diferente/comic/k3-1.webp` | pendiente |
| `ume-k3-2` | Viñeta de cómic | `/media/stories/una-manana-diferente/comic/k3-2.webp` | pendiente |
| `ume-k4-1` | Viñeta de cómic | `/media/stories/una-manana-diferente/comic/k4-1.webp` | pendiente |
| `ume-k6-1` | Viñeta de cómic | `/media/stories/una-manana-diferente/comic/k6-1.webp` | pendiente |
| `ume-k6-2` | Viñeta de cómic | `/media/stories/una-manana-diferente/comic/k6-2.webp` | pendiente |
| `ume-k6-3` | Viñeta de cómic | `/media/stories/una-manana-diferente/comic/k6-3.webp` | pendiente |
| `ume-k7-1` | Viñeta de cómic | `/media/stories/una-manana-diferente/comic/k7-1.webp` | pendiente |
| `ume-k7-2` | Viñeta de cómic | `/media/stories/una-manana-diferente/comic/k7-2.webp` | pendiente |

### `ume-cover`

- **Nombre de archivo:** `public/media/stories/una-manana-diferente/cover.webp`
- **Escena / uso:** Tarjeta en el catálogo de historias, ficha de la historia y póster del vídeo
- **Descripción visual:** Teo, de espaldas a tres cuartos, en la puerta abierta de su clase. Dentro se intuye una figura adulta nueva (Andrés) junto a una pizarra con dibujos cambiados de sitio. Luz de mañana entrando por la ventana. Sensación de umbral: algo nuevo, pero no amenazante.
- **Personajes:** Teo, Andrés
- **Emoción o acción:** Curiosidad y un poco de incertidumbre
- **Proporción:** 4:3
- **Dimensiones recomendadas:** 2048 × 1536 px
- **Fondo y composición:** Interior de colegio en tonos crema y azul petróleo, acentos coral. Margen superior despejado. Sin texto dentro de la imagen (los textos y bocadillos los pone la app).
- **Transparencia:** No
- **Texto alternativo:** «Teo en la puerta de su clase, donde hay una persona nueva.»

### `ume-s1-puerta`

- **Nombre de archivo:** `public/media/stories/una-manana-diferente/scenes/s1-puerta.webp`
- **Escena / uso:** Escena 1 · pasos 1-2
- **Descripción visual:** Teo y su abuela Rosa llegan a la verja del colegio. Rosa le da la mano. Otros niños entran al fondo. Teo mira el reloj del colegio.
- **Personajes:** Teo, Rosa
- **Emoción o acción:** Rutina conocida, tranquilidad
- **Proporción:** 16:9
- **Dimensiones recomendadas:** 2400 × 1350 px
- **Fondo y composición:** Exterior del colegio por la mañana: verja, árbol, reloj en la fachada. Dejar el cuarto inferior con poco detalle: ahí se superpone el texto en móvil. Sin texto dentro de la imagen (los textos y bocadillos los pone la app).
- **Transparencia:** No
- **Texto alternativo:** «Teo llega al colegio de la mano de su abuela.»

### `ume-s1-pasillo`

- **Nombre de archivo:** `public/media/stories/una-manana-diferente/scenes/s1-pasillo.webp`
- **Escena / uso:** Escena 1 · pasos 3-4
- **Descripción visual:** Teo en el pasillo, junto a las perchas, con la mano dentro de la mochila tocando sus cascos verdes. A su alrededor, niños pasan corriendo (ligeramente desenfocados).
- **Personajes:** Teo
- **Emoción o acción:** Busca su apoyo; pasillo ruidoso
- **Proporción:** 16:9
- **Dimensiones recomendadas:** 2400 × 1350 px
- **Fondo y composición:** Pasillo con perchas de colores, dibujos infantiles en la pared, luz de ventanal. Dejar el cuarto inferior con poco detalle: ahí se superpone el texto en móvil. Sin texto dentro de la imagen (los textos y bocadillos los pone la app).
- **Transparencia:** No
- **Texto alternativo:** «Teo en el pasillo toca sus cascos dentro de la mochila.»

### `ume-s2-puerta`

- **Nombre de archivo:** `public/media/stories/una-manana-diferente/scenes/s2-puerta.webp`
- **Escena / uso:** Escena 2 · paso 1
- **Descripción visual:** Puerta de la clase. Andrés, desconocido para Teo, espera en la puerta con una carpeta. Teo se ha detenido a unos pasos, sorprendido.
- **Personajes:** Teo, Andrés
- **Emoción o acción:** Sorpresa
- **Proporción:** 16:9
- **Dimensiones recomendadas:** 2400 × 1350 px
- **Fondo y composición:** Puerta de aula con un cartel de la clase (sin texto legible). Dejar el cuarto inferior con poco detalle: ahí se superpone el texto en móvil. Sin texto dentro de la imagen (los textos y bocadillos los pone la app).
- **Transparencia:** No
- **Texto alternativo:** «En la puerta de la clase hay una persona que Teo no conoce.»

### `ume-s2-anuncio`

- **Nombre de archivo:** `public/media/stories/una-manana-diferente/scenes/s2-anuncio.webp`
- **Escena / uso:** Escena 2 · pasos 2-3
- **Descripción visual:** Andrés, de pie delante de la pizarra, habla a la clase con gesto tranquilo. Los niños sentados escuchan.
- **Personajes:** Andrés, Teo, Aya, Bruno, Lía
- **Emoción o acción:** Andrés se presenta y explica el cambio
- **Proporción:** 16:9
- **Dimensiones recomendadas:** 2400 × 1350 px
- **Fondo y composición:** Aula luminosa con pizarra verde, mesas en grupos, ventana a la izquierda. Dejar el cuarto inferior con poco detalle: ahí se superpone el texto en móvil. Sin texto dentro de la imagen (los textos y bocadillos los pone la app).
- **Transparencia:** No
- **Texto alternativo:** «Andrés se presenta a la clase delante de la pizarra.»

### `ume-s2-reacciones`

- **Nombre de archivo:** `public/media/stories/una-manana-diferente/scenes/s2-reacciones.webp`
- **Escena / uso:** Escena 2 · pasos 4-6
- **Descripción visual:** Plano de la clase con cuatro reacciones distintas: Aya inclinada hacia delante con la mano levantada (curiosidad), Bruno con los brazos cruzados (frustración), Lía mirando su comunicador (inseguridad), Teo quieto moviendo los dedos (sorpresa). Ninguna reacción se ve como "mala".
- **Personajes:** Aya, Bruno, Lía, Teo
- **Emoción o acción:** Curiosidad, frustración, inseguridad, sorpresa
- **Proporción:** 16:9
- **Dimensiones recomendadas:** 2400 × 1350 px
- **Fondo y composición:** Aula, plano medio, fondo simplificado para que destaquen las cuatro figuras. Dejar el cuarto inferior con poco detalle: ahí se superpone el texto en móvil. Sin texto dentro de la imagen (los textos y bocadillos los pone la app).
- **Transparencia:** No
- **Texto alternativo:** «Aya levanta la mano, Bruno cruza los brazos, Lía mira su comunicador y Teo mueve los dedos.»

### `ume-s3-pizarra`

- **Nombre de archivo:** `public/media/stories/una-manana-diferente/scenes/s3-pizarra.webp`
- **Escena / uso:** Escena 3 · paso 1
- **Descripción visual:** Nubi flota junto a una pizarra dividida en dos columnas: a la izquierda, cuatro dibujos sencillos (una silueta de maestra con una flecha de "mañana", un adulto, un libro, una paleta); a la derecha, signos de interrogación.
- **Personajes:** Nubi
- **Emoción o acción:** Ordenar lo que sabemos y lo que no
- **Proporción:** 16:9
- **Dimensiones recomendadas:** 2400 × 1350 px
- **Fondo y composición:** Pizarra grande ocupando dos tercios, aula difuminada detrás. Dejar el cuarto inferior con poco detalle: ahí se superpone el texto en móvil. Sin texto dentro de la imagen (los textos y bocadillos los pone la app).
- **Transparencia:** No
- **Texto alternativo:** «Nubi junto a una pizarra con dos columnas: lo que sabemos y lo que no.»

### `ume-s4-teo-piensa`

- **Nombre de archivo:** `public/media/stories/una-manana-diferente/scenes/s4-teo-piensa.webp`
- **Escena / uso:** Escena 3 · paso final, escena 4 · paso 1, portada de la recreación
- **Descripción visual:** Teo sentado en su mesa, con varias burbujas de pensamiento vacías flotando sobre él (reloj, libro, puerta, cascos, pizarra). Mueve los dedos.
- **Personajes:** Teo
- **Emoción o acción:** Pensar qué hacer
- **Proporción:** 16:9
- **Dimensiones recomendadas:** 2400 × 1350 px
- **Fondo y composición:** Mesa de Teo en primer plano, aula muy difuminada. Dejar el cuarto inferior con poco detalle: ahí se superpone el texto en móvil. Sin texto dentro de la imagen (los textos y bocadillos los pone la app).
- **Transparencia:** No
- **Texto alternativo:** «Teo piensa en su mesa, rodeado de burbujas de pensamiento.»

### `ume-s6-plan`

- **Nombre de archivo:** `public/media/stories/una-manana-diferente/scenes/s6-plan.webp`
- **Escena / uso:** Escena 6 · paso 1
- **Descripción visual:** Andrés dibuja en la pizarra un horario visual con cinco dibujos en fila (libro, pelota, lápiz, plato, pincel). Teo, a su lado, lo señala.
- **Personajes:** Andrés, Teo
- **Emoción o acción:** Anticipación; Teo más tranquilo
- **Proporción:** 16:9
- **Dimensiones recomendadas:** 2400 × 1350 px
- **Fondo y composición:** Pizarra en primer plano. Dibujos de tiza sencillos y reconocibles. Dejar el cuarto inferior con poco detalle: ahí se superpone el texto en móvil. Sin texto dentro de la imagen (los textos y bocadillos los pone la app).
- **Transparencia:** No
- **Texto alternativo:** «Andrés dibuja el plan de la mañana en la pizarra y Teo lo señala.»

### `ume-s6-biblioteca`

- **Nombre de archivo:** `public/media/stories/una-manana-diferente/scenes/s6-biblioteca.webp`
- **Escena / uso:** Escena 6 · pasos 2-4
- **Descripción visual:** Biblioteca escolar. Teo con sus cascos verdes elige un libro de trenes. Lía, sentada a su lado, señala su comunicador. Aya hojea un libro de volcanes. Bruno, en un puf, respira tranquilo.
- **Personajes:** Teo, Lía, Aya, Bruno
- **Emoción o acción:** Cada uno usa su estrategia
- **Proporción:** 16:9
- **Dimensiones recomendadas:** 2400 × 1350 px
- **Fondo y composición:** Estanterías bajas de madera, alfombra, pufs, luz cálida. Dejar el cuarto inferior con poco detalle: ahí se superpone el texto en móvil. Sin texto dentro de la imagen (los textos y bocadillos los pone la app).
- **Transparencia:** No
- **Texto alternativo:** «En la biblioteca, Teo lleva sus cascos, Lía usa su comunicador, Aya lee y Bruno descansa en un puf.»

### `ume-s7-salida`

- **Nombre de archivo:** `public/media/stories/una-manana-diferente/scenes/s7-salida.webp`
- **Escena / uso:** Escena 7 · todos los pasos
- **Descripción visual:** Mediodía. Teo sale del colegio y camina junto a su abuela Rosa, contándole algo con las manos. Nubi flota en el cielo.
- **Personajes:** Teo, Rosa, Nubi
- **Emoción o acción:** Cierre tranquilo, satisfacción
- **Proporción:** 16:9
- **Dimensiones recomendadas:** 2400 × 1350 px
- **Fondo y composición:** Exterior del colegio a mediodía, luz más cálida que en la escena 1 (misma localización). Dejar el cuarto inferior con poco detalle: ahí se superpone el texto en móvil. Sin texto dentro de la imagen (los textos y bocadillos los pone la app).
- **Transparencia:** No
- **Texto alternativo:** «Teo sale del colegio con su abuela y le cuenta cómo ha ido la mañana.»

### `ume-opt-preguntar`

- **Nombre de archivo:** `public/media/stories/una-manana-diferente/options/opt-preguntar.webp`
- **Escena / uso:** Escena 4 · opción "Preguntar" y escena 5
- **Descripción visual:** Teo levanta la mano desde su sitio. Andrés le mira atento.
- **Personajes:** Teo, Andrés
- **Emoción o acción:** Preguntar
- **Proporción:** 4:3
- **Dimensiones recomendadas:** 2048 × 1536 px
- **Fondo y composición:** Aula. Composición legible en tamaño pequeño (tarjeta de opción de 300 px). Sin texto dentro de la imagen (los textos y bocadillos los pone la app).
- **Transparencia:** No
- **Texto alternativo:** «Teo levanta la mano para preguntar.»

### `ume-c-preguntar`

- **Nombre de archivo:** `public/media/stories/una-manana-diferente/options/c-preguntar.webp`
- **Escena / uso:** Escena 5 · consecuencia de "Preguntar"
- **Descripción visual:** Andrés responde contando con los dedos. Teo escucha con los hombros más relajados.
- **Personajes:** Teo, Andrés
- **Emoción o acción:** Tranquilidad al saber
- **Proporción:** 4:3
- **Dimensiones recomendadas:** 2048 × 1536 px
- **Fondo y composición:** Aula. Composición legible en tamaño pequeño (tarjeta de opción de 300 px). Sin texto dentro de la imagen (los textos y bocadillos los pone la app).
- **Transparencia:** No
- **Texto alternativo:** «Andrés responde a Teo, que se relaja.»

### `ume-opt-horario`

- **Nombre de archivo:** `public/media/stories/una-manana-diferente/options/opt-horario.webp`
- **Escena / uso:** Escena 4 · opción "Horario" y escena 5
- **Descripción visual:** Teo, junto a la mesa del maestro, señala la pizarra vacía.
- **Personajes:** Teo, Andrés
- **Emoción o acción:** Pedir ver el plan
- **Proporción:** 4:3
- **Dimensiones recomendadas:** 2048 × 1536 px
- **Fondo y composición:** Aula, pizarra. Composición legible en tamaño pequeño (tarjeta de opción de 300 px). Sin texto dentro de la imagen (los textos y bocadillos los pone la app).
- **Transparencia:** No
- **Texto alternativo:** «Teo pide a Andrés que le enseñe el plan.»

### `ume-c-horario`

- **Nombre de archivo:** `public/media/stories/una-manana-diferente/options/c-horario.webp`
- **Escena / uso:** Escena 5 · consecuencia de "Horario"
- **Descripción visual:** Pizarra con el horario dibujado (cinco iconos). Teo lo recorre con el dedo.
- **Personajes:** Teo
- **Emoción o acción:** Alivio
- **Proporción:** 4:3
- **Dimensiones recomendadas:** 2048 × 1536 px
- **Fondo y composición:** Pizarra en primer plano. Composición legible en tamaño pequeño (tarjeta de opción de 300 px). Sin texto dentro de la imagen (los textos y bocadillos los pone la app).
- **Transparencia:** No
- **Texto alternativo:** «El plan dibujado en la pizarra; Teo lo recorre con el dedo.»

### `ume-opt-adulto`

- **Nombre de archivo:** `public/media/stories/una-manana-diferente/options/opt-adulto.webp`
- **Escena / uso:** Escena 4 · opción "Adulto de confianza" y escena 5
- **Descripción visual:** Teo camina por el pasillo hacia la puerta abierta del aula de apoyo, donde está Pilar.
- **Personajes:** Teo, Pilar
- **Emoción o acción:** Buscar apoyo
- **Proporción:** 4:3
- **Dimensiones recomendadas:** 2048 × 1536 px
- **Fondo y composición:** Pasillo, puerta del aula de apoyo. Composición legible en tamaño pequeño (tarjeta de opción de 300 px). Sin texto dentro de la imagen (los textos y bocadillos los pone la app).
- **Transparencia:** No
- **Texto alternativo:** «Teo va a buscar a Pilar, su maestra de apoyo.»

### `ume-c-adulto`

- **Nombre de archivo:** `public/media/stories/una-manana-diferente/options/c-adulto.webp`
- **Escena / uso:** Escena 5 · consecuencia de "Adulto de confianza"
- **Descripción visual:** Pilar, Teo y Andrés hablando juntos en la puerta de la clase. Pilar apoya la mano en el hombro de Teo (si él lo acepta).
- **Personajes:** Pilar, Teo, Andrés
- **Emoción o acción:** Seguridad, acompañamiento
- **Proporción:** 4:3
- **Dimensiones recomendadas:** 2048 × 1536 px
- **Fondo y composición:** Puerta de clase. Composición legible en tamaño pequeño (tarjeta de opción de 300 px). Sin texto dentro de la imagen (los textos y bocadillos los pone la app).
- **Transparencia:** No
- **Texto alternativo:** «Pilar acompaña a Teo a hablar con Andrés.»

### `ume-opt-regulacion`

- **Nombre de archivo:** `public/media/stories/una-manana-diferente/options/opt-regulacion.webp`
- **Escena / uso:** Escena 4 · opción "Recurso para calmarse" y escena 5
- **Descripción visual:** Teo se pone los cascos verdes y aprieta una pelota blanda.
- **Personajes:** Teo
- **Emoción o acción:** Autorregulación sensorial
- **Proporción:** 4:3
- **Dimensiones recomendadas:** 2048 × 1536 px
- **Fondo y composición:** Mesa de Teo. Composición legible en tamaño pequeño (tarjeta de opción de 300 px). Sin texto dentro de la imagen (los textos y bocadillos los pone la app).
- **Transparencia:** No
- **Texto alternativo:** «Teo se pone los cascos y aprieta una pelota blanda.»

### `ume-c-regulacion`

- **Nombre de archivo:** `public/media/stories/una-manana-diferente/options/c-regulacion.webp`
- **Escena / uso:** Escena 5 · consecuencia de "Recurso para calmarse"
- **Descripción visual:** Misma composición; las ondas de ruido alrededor de Teo se han vuelto suaves y lejanas. Teo con expresión calmada.
- **Personajes:** Teo
- **Emoción o acción:** Calma
- **Proporción:** 4:3
- **Dimensiones recomendadas:** 2048 × 1536 px
- **Fondo y composición:** Mesa de Teo, ondas de sonido estilizadas. Composición legible en tamaño pequeño (tarjeta de opción de 300 px). Sin texto dentro de la imagen (los textos y bocadillos los pone la app).
- **Transparencia:** No
- **Texto alternativo:** «Con los cascos, el ruido se vuelve suave y Teo está más tranquilo.»

### `ume-opt-tiempo`

- **Nombre de archivo:** `public/media/stories/una-manana-diferente/options/opt-tiempo.webp`
- **Escena / uso:** Escena 4 · opción "Necesito tiempo" y escena 5
- **Descripción visual:** Teo enseña a Andrés su tarjeta de descanso (sin texto legible, un símbolo de pausa).
- **Personajes:** Teo, Andrés
- **Emoción o acción:** Pedir tiempo
- **Proporción:** 4:3
- **Dimensiones recomendadas:** 2048 × 1536 px
- **Fondo y composición:** Aula. Composición legible en tamaño pequeño (tarjeta de opción de 300 px). Sin texto dentro de la imagen (los textos y bocadillos los pone la app).
- **Transparencia:** No
- **Texto alternativo:** «Teo enseña su tarjeta a Andrés para pedir un momento.»

### `ume-c-tiempo`

- **Nombre de archivo:** `public/media/stories/una-manana-diferente/options/c-tiempo.webp`
- **Escena / uso:** Escena 5 · consecuencia de "Necesito tiempo"
- **Descripción visual:** Teo, sentado junto a la puerta, observa a la clase que prepara sus cosas. Andrés le hace un gesto tranquilo desde lejos.
- **Personajes:** Teo, Andrés
- **Emoción o acción:** Ir a su ritmo
- **Proporción:** 4:3
- **Dimensiones recomendadas:** 2048 × 1536 px
- **Fondo y composición:** Aula vista desde la puerta. Composición legible en tamaño pequeño (tarjeta de opción de 300 px). Sin texto dentro de la imagen (los textos y bocadillos los pone la app).
- **Transparencia:** No
- **Texto alternativo:** «Teo observa desde la puerta mientras la clase se prepara.»

### `ume-opt-salir`

- **Nombre de archivo:** `public/media/stories/una-manana-diferente/options/opt-salir.webp`
- **Escena / uso:** Escena 4 · opción "Salir sin avisar" y escena 5
- **Descripción visual:** Teo en el pasillo vacío, apoyado en la pared, respirando. Sin dramatismo.
- **Personajes:** Teo
- **Emoción o acción:** Alivio momentáneo
- **Proporción:** 4:3
- **Dimensiones recomendadas:** 2048 × 1536 px
- **Fondo y composición:** Pasillo vacío, luz tranquila. Composición legible en tamaño pequeño (tarjeta de opción de 300 px). Sin texto dentro de la imagen (los textos y bocadillos los pone la app).
- **Transparencia:** No
- **Texto alternativo:** «Teo está solo en el pasillo, apoyado en la pared.»

### `ume-c-salir`

- **Nombre de archivo:** `public/media/stories/una-manana-diferente/options/c-salir.webp`
- **Escena / uso:** Escena 5 · consecuencia de "Salir sin avisar"
- **Descripción visual:** Andrés sale de la clase mirando a ambos lados del pasillo, preocupado. Teo, al fondo, no le ha visto aún.
- **Personajes:** Andrés, Teo
- **Emoción o acción:** Preocupación del adulto (no enfado)
- **Proporción:** 4:3
- **Dimensiones recomendadas:** 2048 × 1536 px
- **Fondo y composición:** Pasillo. Composición legible en tamaño pequeño (tarjeta de opción de 300 px). Sin texto dentro de la imagen (los textos y bocadillos los pone la app).
- **Transparencia:** No
- **Texto alternativo:** «Andrés busca a Teo por el pasillo con cara de preocupación.»

### `ume-k1-1`

- **Nombre de archivo:** `public/media/stories/una-manana-diferente/comic/k1-1.webp`
- **Escena / uso:** Cómic · escena 1 · viñeta 1
- **Descripción visual:** Plano medio: Rosa se despide de Teo en la verja. Bocadillos: Rosa arriba a la derecha, Teo abajo a la izquierda.
- **Personajes:** Rosa, Teo
- **Emoción o acción:** Despedida tranquila
- **Proporción:** 4:3
- **Dimensiones recomendadas:** 2048 × 1536 px
- **Fondo y composición:** Verja del colegio. Reservar una zona despejada para los bocadillos indicada en la descripción. Línea de contorno algo más marcada que en el cuento. Sin texto dentro de la imagen (los textos y bocadillos los pone la app).
- **Transparencia:** No
- **Texto alternativo:** «Rosa se despide de Teo en la puerta del colegio.»

### `ume-k1-2`

- **Nombre de archivo:** `public/media/stories/una-manana-diferente/comic/k1-2.webp`
- **Escena / uso:** Cómic · escena 1 · viñeta 2
- **Descripción visual:** Pasillo lleno de movimiento, niños corriendo. Teo en primer plano. Zona arriba a la derecha para onomatopeya; abajo a la izquierda para pensamiento.
- **Personajes:** Teo
- **Emoción o acción:** Ruido
- **Proporción:** 4:3
- **Dimensiones recomendadas:** 2048 × 1536 px
- **Fondo y composición:** Pasillo. Reservar una zona despejada para los bocadillos indicada en la descripción. Línea de contorno algo más marcada que en el cuento. Sin texto dentro de la imagen (los textos y bocadillos los pone la app).
- **Transparencia:** No
- **Texto alternativo:** «Teo en un pasillo lleno de niños corriendo.»

### `ume-k1-3`

- **Nombre de archivo:** `public/media/stories/una-manana-diferente/comic/k1-3.webp`
- **Escena / uso:** Cómic · escena 1 · viñeta 3
- **Descripción visual:** Primer plano de la mano de Teo dentro de la mochila tocando los cascos verdes.
- **Personajes:** Teo
- **Emoción o acción:** Seguridad
- **Proporción:** 16:9
- **Dimensiones recomendadas:** 2400 × 1350 px
- **Fondo y composición:** Interior de mochila, detalle. Reservar una zona despejada para los bocadillos indicada en la descripción. Línea de contorno algo más marcada que en el cuento. Sin texto dentro de la imagen (los textos y bocadillos los pone la app).
- **Transparencia:** No
- **Texto alternativo:** «La mano de Teo toca sus cascos dentro de la mochila.»

### `ume-k2-1`

- **Nombre de archivo:** `public/media/stories/una-manana-diferente/comic/k2-1.webp`
- **Escena / uso:** Cómic · escena 2 · viñeta 1
- **Descripción visual:** Teo ante la puerta de la clase, desde atrás. Arriba a la izquierda, espacio para pensamiento.
- **Personajes:** Teo
- **Emoción o acción:** Extrañeza
- **Proporción:** 4:3
- **Dimensiones recomendadas:** 2048 × 1536 px
- **Fondo y composición:** Puerta de clase. Reservar una zona despejada para los bocadillos indicada en la descripción. Línea de contorno algo más marcada que en el cuento. Sin texto dentro de la imagen (los textos y bocadillos los pone la app).
- **Transparencia:** No
- **Texto alternativo:** «Teo se detiene ante la puerta de su clase.»

### `ume-k2-2`

- **Nombre de archivo:** `public/media/stories/una-manana-diferente/comic/k2-2.webp`
- **Escena / uso:** Cómic · escena 2 · viñeta 2
- **Descripción visual:** Andrés, plano medio, se presenta con la mano en el pecho. Espacio arriba a la derecha.
- **Personajes:** Andrés
- **Emoción o acción:** Presentación amable
- **Proporción:** 4:3
- **Dimensiones recomendadas:** 2048 × 1536 px
- **Fondo y composición:** Aula. Reservar una zona despejada para los bocadillos indicada en la descripción. Línea de contorno algo más marcada que en el cuento. Sin texto dentro de la imagen (los textos y bocadillos los pone la app).
- **Transparencia:** No
- **Texto alternativo:** «Andrés se presenta.»

### `ume-k2-3`

- **Nombre de archivo:** `public/media/stories/una-manana-diferente/comic/k2-3.webp`
- **Escena / uso:** Cómic · escena 2 · viñeta 3
- **Descripción visual:** Andrés mueve en la pizarra el dibujo de un pincel hacia la parte de la tarde. Espacio arriba a la izquierda.
- **Personajes:** Andrés
- **Emoción o acción:** Explicar el cambio
- **Proporción:** 16:9
- **Dimensiones recomendadas:** 2400 × 1350 px
- **Fondo y composición:** Pizarra. Reservar una zona despejada para los bocadillos indicada en la descripción. Línea de contorno algo más marcada que en el cuento. Sin texto dentro de la imagen (los textos y bocadillos los pone la app).
- **Transparencia:** No
- **Texto alternativo:** «Andrés mueve la plástica a la tarde en el horario de la pizarra.»

### `ume-k2-4`

- **Nombre de archivo:** `public/media/stories/una-manana-diferente/comic/k2-4.webp`
- **Escena / uso:** Cómic · escena 2 · viñeta 4
- **Descripción visual:** Panorámica de la clase con las cuatro reacciones (ver ume-s2-reacciones). Bocadillos arriba a izquierda y derecha; comunicador de Lía abajo a la derecha.
- **Personajes:** Aya, Bruno, Lía, Teo
- **Emoción o acción:** Reacciones diversas
- **Proporción:** 16:9
- **Dimensiones recomendadas:** 2400 × 1350 px
- **Fondo y composición:** Aula. Reservar una zona despejada para los bocadillos indicada en la descripción. Línea de contorno algo más marcada que en el cuento. Sin texto dentro de la imagen (los textos y bocadillos los pone la app).
- **Transparencia:** No
- **Texto alternativo:** «Aya pregunta, Bruno protesta, Lía usa su comunicador y Teo mueve los dedos.»

### `ume-k3-1`

- **Nombre de archivo:** `public/media/stories/una-manana-diferente/comic/k3-1.webp`
- **Escena / uso:** Cómic · escena 3 · viñeta 1
- **Descripción visual:** Nubi flota delante de la pizarra de dos columnas.
- **Personajes:** Nubi
- **Emoción o acción:** Pregunta abierta
- **Proporción:** 4:3
- **Dimensiones recomendadas:** 2048 × 1536 px
- **Fondo y composición:** Pizarra. Reservar una zona despejada para los bocadillos indicada en la descripción. Línea de contorno algo más marcada que en el cuento. Sin texto dentro de la imagen (los textos y bocadillos los pone la app).
- **Transparencia:** No
- **Texto alternativo:** «Nubi pregunta qué sabemos.»

### `ume-k3-2`

- **Nombre de archivo:** `public/media/stories/una-manana-diferente/comic/k3-2.webp`
- **Escena / uso:** Cómic · escena 3 · viñeta 2
- **Descripción visual:** Teo en su mesa con una gran burbuja de pensamiento (arriba a la izquierda).
- **Personajes:** Teo
- **Emoción o acción:** Dudas
- **Proporción:** 4:3
- **Dimensiones recomendadas:** 2048 × 1536 px
- **Fondo y composición:** Mesa. Reservar una zona despejada para los bocadillos indicada en la descripción. Línea de contorno algo más marcada que en el cuento. Sin texto dentro de la imagen (los textos y bocadillos los pone la app).
- **Transparencia:** No
- **Texto alternativo:** «Teo piensa en sus dudas.»

### `ume-k4-1`

- **Nombre de archivo:** `public/media/stories/una-manana-diferente/comic/k4-1.webp`
- **Escena / uso:** Cómic · escena 4 · viñeta 1
- **Descripción visual:** Teo en el centro; a su alrededor, seis pequeños caminos o puertas que representan posibilidades (sin texto).
- **Personajes:** Teo
- **Emoción o acción:** Considerar opciones
- **Proporción:** 16:9
- **Dimensiones recomendadas:** 2400 × 1350 px
- **Fondo y composición:** Fondo abstracto crema con caminos. Reservar una zona despejada para los bocadillos indicada en la descripción. Línea de contorno algo más marcada que en el cuento. Sin texto dentro de la imagen (los textos y bocadillos los pone la app).
- **Transparencia:** No
- **Texto alternativo:** «Teo rodeado de varios caminos posibles.»

### `ume-k6-1`

- **Nombre de archivo:** `public/media/stories/una-manana-diferente/comic/k6-1.webp`
- **Escena / uso:** Cómic · escena 6 · viñeta 1
- **Descripción visual:** Teo y Andrés frente a la pizarra; Andrés empieza a dibujar. Bocadillos arriba izquierda y abajo derecha.
- **Personajes:** Teo, Andrés
- **Emoción o acción:** Colaboración
- **Proporción:** 4:3
- **Dimensiones recomendadas:** 2048 × 1536 px
- **Fondo y composición:** Pizarra. Reservar una zona despejada para los bocadillos indicada en la descripción. Línea de contorno algo más marcada que en el cuento. Sin texto dentro de la imagen (los textos y bocadillos los pone la app).
- **Transparencia:** No
- **Texto alternativo:** «Teo pide a Andrés que dibuje el plan.»

### `ume-k6-2`

- **Nombre de archivo:** `public/media/stories/una-manana-diferente/comic/k6-2.webp`
- **Escena / uso:** Cómic · escena 6 · viñeta 2
- **Descripción visual:** Teo con cascos en la biblioteca, sosteniendo un libro de trenes. Ondas de sonido suaves al fondo.
- **Personajes:** Teo
- **Emoción o acción:** Calma
- **Proporción:** 4:3
- **Dimensiones recomendadas:** 2048 × 1536 px
- **Fondo y composición:** Biblioteca. Reservar una zona despejada para los bocadillos indicada en la descripción. Línea de contorno algo más marcada que en el cuento. Sin texto dentro de la imagen (los textos y bocadillos los pone la app).
- **Transparencia:** No
- **Texto alternativo:** «Teo con sus cascos en la biblioteca.»

### `ume-k6-3`

- **Nombre de archivo:** `public/media/stories/una-manana-diferente/comic/k6-3.webp`
- **Escena / uso:** Cómic · escena 6 · viñeta 3
- **Descripción visual:** Bruno en un puf (izquierda), Aya junto a la estantería (derecha), Lía mostrando su comunicador (abajo derecha).
- **Personajes:** Bruno, Aya, Lía
- **Emoción o acción:** Estrategias distintas
- **Proporción:** 16:9
- **Dimensiones recomendadas:** 2400 × 1350 px
- **Fondo y composición:** Biblioteca. Reservar una zona despejada para los bocadillos indicada en la descripción. Línea de contorno algo más marcada que en el cuento. Sin texto dentro de la imagen (los textos y bocadillos los pone la app).
- **Transparencia:** No
- **Texto alternativo:** «Bruno descansa, Aya busca libros y Lía usa su comunicador.»

### `ume-k7-1`

- **Nombre de archivo:** `public/media/stories/una-manana-diferente/comic/k7-1.webp`
- **Escena / uso:** Cómic · escena 7 · viñeta 1
- **Descripción visual:** Teo y Rosa salen por la verja. Bocadillos arriba derecha y abajo izquierda.
- **Personajes:** Teo, Rosa
- **Emoción o acción:** Reencuentro
- **Proporción:** 4:3
- **Dimensiones recomendadas:** 2048 × 1536 px
- **Fondo y composición:** Verja del colegio a mediodía. Reservar una zona despejada para los bocadillos indicada en la descripción. Línea de contorno algo más marcada que en el cuento. Sin texto dentro de la imagen (los textos y bocadillos los pone la app).
- **Transparencia:** No
- **Texto alternativo:** «Rosa recoge a Teo a la salida.»

### `ume-k7-2`

- **Nombre de archivo:** `public/media/stories/una-manana-diferente/comic/k7-2.webp`
- **Escena / uso:** Cómic · escena 7 · viñeta 2
- **Descripción visual:** Teo y Rosa caminando de espaldas por la acera; Nubi en el cielo.
- **Personajes:** Teo, Rosa, Nubi
- **Emoción o acción:** Cierre tranquilo
- **Proporción:** 4:3
- **Dimensiones recomendadas:** 2048 × 1536 px
- **Fondo y composición:** Calle arbolada. Reservar una zona despejada para los bocadillos indicada en la descripción. Línea de contorno algo más marcada que en el cuento. Sin texto dentro de la imagen (los textos y bocadillos los pone la app).
- **Transparencia:** No
- **Texto alternativo:** «Teo y su abuela caminan hacia casa.»

## Audio y vídeo (pendientes)

- **Narración por escena (opcional):** archivos MP3/OGG en `public/media/stories/<id>/audio/<paso>.mp3`, voz humana cálida y pausada, sin música de fondo. Se enlazan en el campo `narration` de cada paso `beat`.
- **Vídeo del piloto:** `public/media/stories/una-manana-diferente/video/una-manana-diferente.{webm,mp4}`, 1920×1080, sin cortes bruscos ni destellos, música opcional muy suave y desactivable en la mezcla. Subtítulos: `una-manana-diferente.es.vtt` (borrador ya incluido). Al entregarlo, cambiar `video.status` a `listo` en `story.ts`.
