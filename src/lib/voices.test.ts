import { describe, expect, it } from 'vitest';
import { pickVoice, rankVoices, voiceLabel, type VoiceLike } from './voices.ts';

const v = (name: string, lang: string, localService = true, extra: Partial<VoiceLike> = {}): VoiceLike => ({ name, lang, localService, voiceURI: `${name}-${lang}`, ...extra });

const voices = [
  v('eSpeak Spanish', 'es-ES'),
  v('Paulina', 'es-MX'),
  v('Mónica', 'es-ES'),
  v('Google español', 'es-ES', false), // remota: nunca
  v('Samantha', 'en-US'),
  v('Marisol (Mejorada)', 'es-ES'),
];

describe('Voces del dispositivo (fase 20)', () => {
  it('solo voces locales en español, nunca remotas ni de otros idiomas', () => {
    const names = rankVoices(voices).map((x) => x.name);
    expect(names).not.toContain('Google español');
    expect(names).not.toContain('Samantha');
    expect(names).toHaveLength(4);
  });

  it('adelanta las de mejor calidad declarada y el español de España; retrasa las mecánicas', () => {
    expect(rankVoices(voices).map((x) => x.name)).toEqual(['Marisol (Mejorada)', 'Mónica', 'Paulina', 'eSpeak Spanish']);
  });

  it('respeta la voz elegida si sigue disponible; si no, la mejor', () => {
    expect(pickVoice(voices, 'Paulina-es-MX')?.name).toBe('Paulina');
    expect(pickVoice(voices, 'ya-no-existe')?.name).toBe('Marisol (Mejorada)');
    expect(pickVoice(voices, 'Google español-es-ES')?.name).toBe('Marisol (Mejorada)'); // la remota no se usa aunque se pida
    expect(pickVoice([v('Samantha', 'en-US')])).toBeUndefined();
  });

  it('nombres legibles sin valoraciones', () => {
    expect(voiceLabel(v('Mónica', 'es-ES'))).toBe('Mónica · España');
    expect(voiceLabel(v('Paulina', 'es_MX'))).toBe('Paulina · México');
    expect(voiceLabel(v('Marisol (Mejorada)', 'es-ES'))).toBe('Marisol · España');
  });
});
