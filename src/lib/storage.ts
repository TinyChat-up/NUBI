/**
 * Almacenamiento local seguro. Solo se guardan preferencias y progreso de prueba,
 * nunca datos personales. Si el navegador bloquea el almacenamiento, la app
 * funciona igual (sin recordar nada).
 */
const PREFIX = 'nubi.v1.';

export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw ? { ...fallback, ...(JSON.parse(raw) as T) } : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* almacenamiento no disponible: se ignora */
  }
}

export function removeKey(key: string): void {
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    /* ignorar */
  }
}

/** Borra lo que NUBI ha guardado en este dispositivo (salvo las claves indicadas). */
export function clearAll(keep: string[] = []): void {
  try {
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith(PREFIX) && !keep.includes(k.slice(PREFIX.length)))
      .forEach((k) => window.localStorage.removeItem(k));
  } catch {
    /* ignorar */
  }
}
