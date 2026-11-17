/**
 * Qué texto se lee: completo (por defecto) o la versión corta de Ajustes → «Textos cortos».
 * Lógica pura, sin React: la usan la pantalla, la región aria-live y la narración, para que
 * el lector de pantalla y la voz digan exactamente lo que se ve.
 * Una versión corta solo existe si una persona la ha escrito; si falta, se usa el texto completo.
 */
import type { BeatStep, Consequence } from './types.ts';

const pick = (full: string, short: string | undefined, useShort: boolean): string => (useShort && short?.trim() ? short : full);

/** Texto de una página del cuento. */
export const readableBeat = (beat: Pick<BeatStep, 'text' | 'short'>, useShort: boolean): string => pick(beat.text, beat.short, useShort);

/** Textos de una consecuencia, ya resueltos. */
export interface ReadableConsequence {
  story: string[];
  youMayFeel: string;
  othersMay: string;
  helpsWhen: string;
  keepInMind: string;
  anotherWay?: string;
}

export function readableConsequence(c: Consequence, useShort: boolean): ReadableConsequence {
  const s = c.short ?? {};
  return {
    story: c.story.map((frame, i) => pick(frame.text, s.story?.[i], useShort)),
    youMayFeel: pick(c.youMayFeel, s.youMayFeel, useShort),
    othersMay: pick(c.othersMay, s.othersMay, useShort),
    helpsWhen: pick(c.helpsWhen, s.helpsWhen, useShort),
    keepInMind: pick(c.keepInMind, s.keepInMind, useShort),
    anotherWay: c.anotherWay === undefined ? undefined : pick(c.anotherWay, s.anotherWay, useShort),
  };
}
