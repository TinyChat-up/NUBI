import type { Place, PlaceId } from '../engine/types.ts';

export const placeList: Place[] = [
  { id: 'colegio', name: 'Colegio', description: 'Clases, recreo y cambios de planes.', icon: 'school', illustration: 'place-colegio', color: 'petroleo', kind: 'stories' },
  { id: 'casa', name: 'Casa', description: 'Rutinas, familia y momentos tranquilos.', icon: 'home', illustration: 'place-casa', color: 'mostaza', kind: 'stories' },
  { id: 'parque', name: 'Parque', description: 'Juegos, turnos y espacios abiertos.', icon: 'tree', illustration: 'place-parque', color: 'salvia', kind: 'stories' },
  { id: 'amigos', name: 'Amigos', description: 'Jugar, compartir y entenderse.', icon: 'friends', illustration: 'place-amigos', color: 'coral', kind: 'stories' },
  { id: 'emociones', name: 'Mis emociones', description: 'Conocer lo que sentimos.', icon: 'heart', illustration: 'place-emociones', color: 'coral', kind: 'emotions' },
  { id: 'herramientas', name: 'Mis herramientas', description: 'Ideas que pueden ayudar.', icon: 'backpack', illustration: 'place-herramientas', color: 'petroleo', kind: 'tools' },
];

export const places: Record<PlaceId, Place> = Object.fromEntries(placeList.map((p) => [p.id, p])) as Record<PlaceId, Place>;
