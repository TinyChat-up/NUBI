import { useCallback, useEffect, useRef, useState } from 'react';
import { useSettings } from '../state/settings.tsx';

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
  const synthSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const canSpeak = synthSupported && settings.deviceVoice;

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (synthSupported) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [synthSupported]);

  const speak = useCallback(
    (text: string, src?: string) => {
      stop();
      if (src) {
        const audio = new Audio(src);
        audioRef.current = audio;
        audio.onended = () => setSpeaking(false);
        audio.onerror = () => setSpeaking(false);
        setSpeaking(true);
        audio.play().catch(() => setSpeaking(false));
        return true;
      }
      if (!canSpeak || !text.trim()) return false;
      const utterance = new SpeechSynthesisUtterance(text.replace(/[«»]/g, ''));
      utterance.lang = 'es-ES';
      utterance.rate = settings.voiceRate;
      const voice = window.speechSynthesis.getVoices().find((v) => v.lang?.toLowerCase().startsWith('es'));
      if (voice) utterance.voice = voice;
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      setSpeaking(true);
      window.speechSynthesis.speak(utterance);
      return true;
    },
    [canSpeak, settings.voiceRate, stop],
  );

  useEffect(() => stop, [stop]);

  return { speak, stop, speaking, available: canSpeak };
}
