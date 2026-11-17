import { useCallback, useEffect, useRef, useState } from 'react';
import { useSettings } from '../state/settings.tsx';
import { pickVoice, rankVoices } from './voices.ts';

/**
 * Narración accesible.
 * 1. Si la escena tiene audio grabado (`src`), se reproduce ese archivo.
 * 2. Si no, y la familia lo permite en Ajustes, se usa la voz del sistema
 *    (Web Speech API del navegador: síntesis local, sin servicios externos ni IA generativa).
 * Nunca suena nada sin que el niño o la niña lo haya pedido (modo "Escuchar" o botón de escuchar).
 */
export function useNarration() {
  const { settings } = useSettings();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState(false);
  const generation = useRef(0);
  const synthSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  // Voces locales en español, ordenadas (src/lib/voices.ts). Se actualizan cuando el sistema las carga.
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>(() => (synthSupported ? rankVoices(window.speechSynthesis.getVoices()) : []));
  useEffect(() => {
    if (!synthSupported) return;
    const refresh = () => setVoices(rankVoices(window.speechSynthesis.getVoices()));
    refresh();
    window.speechSynthesis.addEventListener('voiceschanged', refresh);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', refresh);
  }, [synthSupported]);
  const localVoice = voices.length > 0;
  const voice = pickVoice(voices, settings.voiceURI);
  const canSpeak = synthSupported && settings.deviceVoice && localVoice;

  const stop = useCallback(() => {
    generation.current++;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (synthSupported) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [synthSupported]);

  /**
   * Lee un texto. `src`: narración humana grabada, que siempre tiene prioridad (preparado para el futuro).
   * `options.voiceURI`: probar otra voz (muestra en Ajustes) sin cambiar la preferencia guardada.
   */
  const speak = useCallback(
    (text: string, src?: string, options: { voiceURI?: string; rate?: number } = {}) => {
      stop();
      setError(false);
      const current = generation.current;
      const failed = () => { if (current === generation.current) { setSpeaking(false); setError(true); } };
      if (src) {
        const audio = new Audio(src);
        audioRef.current = audio;
        audio.onended = () => { if (current === generation.current) setSpeaking(false); };
        audio.onerror = failed;
        setSpeaking(true);
        audio.play().catch(failed);
        return true;
      }
      if (!canSpeak || !text.trim()) return false;
      const utterance = new SpeechSynthesisUtterance(text.replace(/[«»]/g, ''));
      utterance.lang = 'es-ES';
      utterance.rate = options.rate ?? settings.voiceRate;
      // Solo voces locales: el texto infantil permanece en el dispositivo.
      const chosen = pickVoice(rankVoices(window.speechSynthesis.getVoices()), options.voiceURI ?? settings.voiceURI);
      if (!chosen) return false;
      utterance.voice = chosen;
      utterance.lang = chosen.lang;
      utterance.onend = () => { if (current === generation.current) setSpeaking(false); };
      utterance.onerror = failed;
      setSpeaking(true);
      try { window.speechSynthesis.speak(utterance); } catch { failed(); return false; }
      return true;
    },
    [canSpeak, settings.voiceRate, settings.voiceURI, stop],
  );

  useEffect(() => stop, [stop]);

  return { speak, stop, speaking, error, available: canSpeak, voices, voice };
}
