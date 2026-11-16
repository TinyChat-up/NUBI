import type { AssetSpec } from '../../engine/types.ts';
import { defineAsset } from './helpers.ts';

/** Recursos compartidos por toda la plataforma (portada, personajes, lugares, herramientas, emociones). */

const TRANSPARENT_BG = 'Sin fondo (PNG/WebP con canal alfa). Sombra de contacto suave opcional, en capa separada.';

// ───────────── Portada y guía ─────────────

const portada: AssetSpec[] = [
  defineAsset('portada', {
    id: 'portada-fondo',
    status: 'listo',
    variants: [1200],
    focus: { x: 50, y: 66 },
    file: '/media/common/portada-fondo.webp',
    usage: 'Portada (pantalla A) — fondo panorámico',
    description:
      'Paisaje panorámico al amanecer visto desde una colina: un pequeño pueblo europeo con tejados coral, un colegio con reloj, un parque con un árbol grande y una casa con jardín, conectados por un camino serpenteante. Nubes suaves. Mucho aire en el tercio superior para el logotipo.',
    emotionOrAction: 'Calma, exploración, curiosidad',
    aspect: '16:9',
    background: 'Cielo crema-melocotón degradado. Colinas en verde salvia y azul petróleo en capas (preparar en capas separadas para un parallax opcional).',
    alt: 'Un pueblo tranquilo al amanecer, con un colegio, un parque y casas unidos por un camino.',
    placeholder: { motif: 'landscape', tint: 'crema' },
  }),
  defineAsset('personaje', {
    id: 'nubi-saludo',
    status: 'listo',
    variants: [256, 512],
    file: '/media/characters/nubi-saludo.png',
    usage: 'Portada y pantallas de bienvenida',
    description: 'Nubi, la nube guía, flotando y saludando con un pequeño brazo de nube. Expresión amable y serena.',
    characters: ['nubi'],
    emotionOrAction: 'Saludo tranquilo',
    aspect: '1:1',
    transparent: true,
    background: TRANSPARENT_BG,
    alt: 'Nubi, una nube pequeña y amable, saluda.',
    placeholder: { motif: 'portrait', figures: [{ character: 'nubi', mood: 'happy' }] },
  }),
  defineAsset('personaje', {
    id: 'nubi-pensando',
    status: 'listo',
    variants: [256, 512],
    file: '/media/characters/nubi-pensando.png',
    usage: 'Escenas de reflexión (preguntas de Nubi)',
    description: 'Nubi ligeramente inclinada, mirando hacia arriba, con una pequeña chispa de idea a su lado.',
    characters: ['nubi'],
    emotionOrAction: 'Pensar, preguntarse',
    aspect: '1:1',
    transparent: true,
    background: TRANSPARENT_BG,
    alt: 'Nubi piensa.',
    placeholder: { motif: 'portrait', figures: [{ character: 'nubi', mood: 'thinking' }] },
  }),
];

// ───────────── Hojas de personaje (referencia de estilo) ─────────────

const characterSheet = (id: string, name: string, notes: string, status: AssetSpec['status'] = 'pendiente'): AssetSpec =>
  defineAsset('personaje', {
    id: `char-${id}`,
    status,
    variants: status === 'listo' ? [384] : undefined,
    file: `/media/characters/${id}.png`,
    usage: 'Presentación de personajes en la ficha de historia · referencia de consistencia para todas las ilustraciones',
    description: `Retrato de cuerpo entero de ${name}, de frente y en reposo. ${notes} Entregar además (fuera de la app) una hoja de modelo con vistas de frente, perfil y espalda y 4 expresiones: tranquilo, sorpresa, preocupación, alegría.`,
    characters: [id],
    emotionOrAction: 'Neutral, amable',
    aspect: '3:4',
    transparent: true,
    background: TRANSPARENT_BG,
    alt: `${name}.`,
    placeholder: { motif: 'portrait', figures: [{ character: id, mood: 'neutral' }] },
  });

const characterSheets: AssetSpec[] = [
  characterSheet('nubi', 'Nubi', 'Diseño maestro editorial entregado; movimientos muy suaves (flotar, parpadear).', 'listo'),
  characterSheet('teo', 'Teo', 'Cascos antirruido verdes visibles colgando de la mochila.', 'listo'),
  characterSheet('aya', 'Aya', 'Gafas redondas, postura abierta y curiosa.', 'listo'),
  characterSheet('bruno', 'Bruno', 'Energía de movimiento, rodilleras de fútbol.', 'listo'),
  characterSheet('lia', 'Lía', 'Su comunicador de pictogramas siempre visible y presentado con naturalidad, como parte de ella.', 'listo'),
  characterSheet('andres', 'Andrés', 'Adulto cercano; evitar rasgos de autoridad intimidante.', 'listo'),
  characterSheet('carmen', 'Carmen', 'Aparece solo en recuerdos o retratos.', 'listo'),
  characterSheet('pilar', 'Pilar', 'Transmite confianza y calma.', 'listo'),
  characterSheet('rosa', 'Rosa', 'Abuela activa, con bolso de tela.', 'listo'),
];

// ───────────── Lugares de "Mi mundo" ─────────────

const place = (id: string, description: string, alt: string, tint: AssetSpec['placeholder']['tint'], icon: string): AssetSpec =>
  defineAsset('lugar', {
    id: `place-${id}`,
    file: `/media/places/${id}.webp`,
    usage: 'Mi mundo (pantalla B) — tarjeta de lugar',
    description,
    aspect: '4:3',
    background: 'Escena completa, composición centrada con el elemento principal en el tercio inferior. Margen superior despejado.',
    emotionOrAction: 'Lugar acogedor y reconocible, sin personas en primer plano',
    alt,
    placeholder: { motif: id === 'colegio' ? 'school-gate' : id === 'casa' ? 'home' : id === 'parque' ? 'park' : id === 'amigos' ? 'friends' : id === 'emociones' ? 'emotions' : 'toolbox', tint, icon },
  });

const places: AssetSpec[] = [
  place('colegio', 'Fachada de un colegio pequeño de ladrillo claro, con reloj, árbol y bicicletas aparcadas. Puerta abierta, luz de mañana.', 'Un colegio con la puerta abierta por la mañana.', 'petroleo', 'school'),
  place('casa', 'Casa de dos plantas con ventanas iluminadas, jardín pequeño y un gato en la ventana. Tarde tranquila.', 'Una casa acogedora con las ventanas encendidas.', 'mostaza', 'home'),
  place('parque', 'Parque con un árbol grande, columpios, un banco y un camino. Sin multitudes.', 'Un parque tranquilo con columpios y un árbol grande.', 'salvia', 'tree'),
  place('amigos', 'Un banco bajo un árbol con dos mochilas, una pelota y un libro abierto: señales de amistad sin mostrar caras.', 'Dos mochilas, una pelota y un libro en un banco.', 'coral', 'friends'),
  place('emociones', 'Un jardín de nubes de colores suaves, cada una con una forma distinta. Ambiente onírico y sereno.', 'Nubes de colores suaves con formas diferentes.', 'coral', 'heart'),
  place('herramientas', 'Una mochila abierta de la que salen objetos de apoyo: cascos, tarjetas, una pelota blanda, un horario dibujado.', 'Una mochila abierta con cascos, tarjetas y una pelota blanda.', 'petroleo', 'backpack'),
];

// ───────────── Herramientas ─────────────

const tool = (id: string, description: string, alt: string, icon: string, tint: AssetSpec['placeholder']['tint']): AssetSpec =>
  defineAsset('herramienta', {
    id: `tool-${id}`,
    file: `/media/tools/${id}.png`,
    usage: 'Mis herramientas (pantalla G) y escena 6 del piloto',
    description,
    aspect: '1:1',
    transparent: true,
    background: TRANSPARENT_BG,
    emotionOrAction: 'Acción de la estrategia, mostrada con calma',
    alt,
    placeholder: { motif: 'icon', icon, tint },
  });

const tools: AssetSpec[] = [
  tool('pedir-ayuda', 'Un niño o niña se acerca a un adulto y le enseña una tarjeta. El adulto se agacha a su altura. No hace falta que se miren a los ojos.', 'Un niño enseña una tarjeta a un adulto que se agacha para atenderle.', 'hand', 'petroleo'),
  tool('descansar', 'Un niño o niña sentado en un cojín, con un vaso de agua, balanceándose suavemente.', 'Una niña descansa sentada en un cojín.', 'pause', 'salvia'),
  tool('espacio-tranquilo', 'Rincón con tienda de tela, cojines, luz suave y una planta.', 'Un rincón tranquilo con cojines y una lámpara suave.', 'leaf', 'salvia'),
  tool('comunicar-necesidad', 'Tres formas de comunicar a la vez: un bocadillo, una mano que señala un pictograma y una nota escrita.', 'Un bocadillo de diálogo, un pictograma y una nota escrita.', 'chat', 'coral'),
  tool('anticipar-cambios', 'Un horario visual de la mañana con dibujos sencillos, una pieza cambiada de sitio con una flecha.', 'Un horario con dibujos en el que una actividad cambia de sitio.', 'calendar', 'mostaza'),
  tool('expresar-desacuerdo', 'Un niño o niña con una mano levantada, diciendo algo con calma a un adulto que escucha.', 'Un niño expresa con calma que no está de acuerdo y un adulto le escucha.', 'scale', 'coral'),
  tool('apoyos-sensoriales', 'Cascos antirruido, gafas de sol, una pelota blanda y una manta, ordenados como un pequeño kit.', 'Cascos, gafas de sol, una pelota blanda y una manta.', 'headphones', 'petroleo'),
];

// ───────────── Emociones ─────────────

const emotion = (id: string, name: string, description: string, icon: string): AssetSpec =>
  defineAsset('emocion', {
    id: `emo-${id}`,
    file: `/media/emotions/${id}.png`,
    usage: 'Mis emociones · selector "¿Cómo te sentirías?"',
    description: `${description} Representar la emoción con Nubi (cara y forma de la nube), no con una persona, para que cualquier niño o niña pueda identificarse. Expresión clara pero no exagerada.`,
    characters: ['nubi'],
    emotionOrAction: name,
    aspect: '1:1',
    transparent: true,
    background: TRANSPARENT_BG,
    alt: `Nubi expresa ${name.toLowerCase()}.`,
    placeholder: { motif: 'icon', icon, tint: 'crema' },
  });

const emotions: AssetSpec[] = [
  emotion('alegria', 'Alegría', 'Nubi con forma redondeada y expandida, ojos en media luna.', 'sun'),
  emotion('calma', 'Calma', 'Nubi alargada y horizontal, ojos cerrados, flotando bajo.', 'leaf'),
  emotion('sorpresa', 'Sorpresa', 'Nubi algo más alta, ojos abiertos y pequeñas líneas de movimiento.', 'spark'),
  emotion('curiosidad', 'Curiosidad', 'Nubi inclinada hacia una lupa.', 'search'),
  emotion('inseguridad', 'Inseguridad', 'Nubi algo encogida, borde ondulado, mirando de reojo.', 'cloud'),
  emotion('frustracion', 'Frustración', 'Nubi con un pequeño nudo dibujado en su interior, ceño suave.', 'knot'),
  emotion('tristeza', 'Tristeza', 'Nubi gris clara dejando caer una gota.', 'drop'),
  emotion('enfado', 'Enfado', 'Nubi más oscura con bordes algo más marcados; sin rasgos agresivos.', 'flame'),
  emotion('cansancio', 'Cansancio', 'Nubi caída, ojos entrecerrados, con una pequeña luna.', 'moon'),
];

export const commonAssets: AssetSpec[] = [...portada, ...characterSheets, ...places, ...tools, ...emotions];

