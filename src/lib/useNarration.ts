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
  const [error, setError] = useState(false);
  const generation = useRef(0);
  const synthSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const [localVoice, setLocalVoice] = useState(() => synthSupported && window.speechSynthesis.getVoices().some((v) => v.localService && v.lang?.toLowerCase().startsWith('es')));
  useEffect(() => {
    if (!synthSupported) return;
    const refresh = () => setLocalVoice(window.speechSynthesis.getVoices().some((v) => v.localService && v.lang?.toLowerCase().startsWith('es')));
    refresh();
    window.speechSynthesis.addEventListener('voiceschanged', refresh);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', refresh);
  }, [synthSupported]);
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

  const speak = useCallback(
    (text: string, src?: string) => {
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
      utterance.rate = settings.voiceRate;
      // Evitar voces remotas del sistema: el texto infantil permanece en el dispositivo.
      const voice = window.speechSynthesis.getVoices().find((v) => v.localService && v.lang?.toLowerCase().startsWith('es'));
      if (!voice) return false;
      if (voice) utterance.voice = voice;
      utterance.onend = () => { if (current === generation.current) setSpeaking(false); };
      utterance.onerror = failed;
      setSpeaking(true);
      try { window.speechSynthesis.speak(utterance); } catch { failed(); return false; }
      return true;
    },
    [canSpeak, settings.voiceRate, stop],
  );

  useEffect(() => stop, [stop]);

  return { speak, stop, speaking, error, available: canSpeak };
}
