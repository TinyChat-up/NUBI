/**
 * Elección de voz del dispositivo (fase 20). Lógica pura, sin DOM, para poder probarla.
 *
 * - Solo voces LOCALES en español (`localService`): el texto del cuento no sale del dispositivo.
 * - Orden sugerido: primero español de España, luego otras variantes; se adelantan las voces que el
 *   propio sistema marca como de mayor calidad («Natural», «Premium», «Enhanced», «Mejorada»…) y se
 *   retrasan las que suelen sonar más mecánicas (eSpeak, «Compact»). Es una ayuda, no una garantía:
 *   la calidad real depende del dispositivo y solo se puede juzgar escuchando la muestra.
 * - Si la persona eligió una voz y sigue disponible, se respeta siempre.
 */
export interface VoiceLike {
  name: string;
  lang: string;
  localService: boolean;
  voiceURI: string;
  default?: boolean;
}

const BETTER = /natural|premium|enhanced|mejorad|neural|siri/i;
const ROBOTIC = /espeak|compact|compacta/i;

export function isSpanishLocal(v: VoiceLike): boolean {
  return Boolean(v.localService) && (v.lang ?? '').toLowerCase().replace('_', '-').startsWith('es');
}

export function voiceScore(v: VoiceLike): number {
  const lang = (v.lang ?? '').toLowerCase().replace('_', '-');
  const name = v.name ?? '';
  let score = lang === 'es-es' ? 3 : 1;
  if (BETTER.test(name)) score += 2;
  if (ROBOTIC.test(name)) score -= 3;
  if (v.default) score += 0.5;
  return score;
}

/** Voces locales en español, de la más recomendable a la menos (empate: por nombre). */
export function rankVoices<T extends VoiceLike>(voices: readonly T[]): T[] {
  return voices.filter(isSpanishLocal).sort((a, b) => voiceScore(b) - voiceScore(a) || (a.name ?? '').localeCompare(b.name ?? '', 'es'));
}

/** La voz que se usará: la preferida si sigue disponible; si no, la mejor clasificada. */
export function pickVoice<T extends VoiceLike>(voices: readonly T[], preferredURI?: string): T | undefined {
  const ranked = rankVoices(voices);
  return ranked.find((v) => v.voiceURI === preferredURI) ?? ranked[0];
}

const REGIONS: Record<string, string> = { es: 'España', mx: 'México', us: 'Estados Unidos', ar: 'Argentina', co: 'Colombia', cl: 'Chile', pe: 'Perú', '419': 'Latinoamérica' };

/** Nombre legible: «Mónica · España». No se valora la voz («dulce», «natural»…): eso lo decide quien escucha. */
export function voiceLabel(v: VoiceLike): string {
  const region = (v.lang ?? '').toLowerCase().replace('_', '-').split('-')[1];
  const name = (v.name ?? '').replace(/\s*\((?:[^)]*)\)\s*$/, '').trim() || v.name || 'Voz del dispositivo';
  return region && REGIONS[region] ? `${name} · ${REGIONS[region]}` : name;
}
