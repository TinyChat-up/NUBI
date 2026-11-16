import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { readJSON, writeJSON } from '../lib/storage.ts';

/** Preferencias de lectura, sonido y movimiento. Se guardan solo en este dispositivo. */
export interface Settings {
  textSize: 'm' | 'l' | 'xl';
  spacing: 'normal' | 'wide';
  font: 'nunito' | 'legible';
  letterCase: 'normal' | 'upper';
  /** Texto corto (lectura fácil) en las historias. */
  shortText: boolean;
  /** auto = sigue la preferencia del sistema. */
  motion: 'auto' | 'reduced' | 'full';
  contrast: 'normal' | 'high';
  /** Preferencia antigua conservada por compatibilidad; abrir siempre en lectura evita audio automático. */
  playerMode: 'leer' | 'escuchar';
  subtitles: boolean;
  /** Permitir la voz del dispositivo cuando no hay audio grabado. */
  deviceVoice: boolean;
  voiceRate: number;
}

export const DEFAULT_SETTINGS: Settings = {
  textSize: 'm',
  spacing: 'normal',
  font: 'nunito',
  letterCase: 'normal',
  shortText: false,
  motion: 'auto',
  contrast: 'normal',
  playerMode: 'leer',
  subtitles: true,
  deviceVoice: true,
  voiceRate: 0.9,
};

interface SettingsContextValue {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
  reset: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => readJSON('settings', DEFAULT_SETTINGS));

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.textSize = settings.textSize;
    root.dataset.spacing = settings.spacing;
    root.dataset.font = settings.font;
    root.dataset.case = settings.letterCase;
    root.dataset.motion = settings.motion;
    root.dataset.contrast = settings.contrast;
    writeJSON('settings', settings);
  }, [settings]);

  const value = useMemo<SettingsContextValue>(
    () => ({
      settings,
      update: (patch) => setSettings((s) => ({ ...s, ...patch })),
      reset: () => setSettings(DEFAULT_SETTINGS),
    }),
    [settings],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings fuera de SettingsProvider');
  return ctx;
}

/** ¿Debe reducirse el movimiento ahora mismo? */
export function usePrefersReducedMotion(): boolean {
  const { settings } = useSettings();
  const [system, setSystem] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;
    const on = () => setSystem(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  if (settings.motion === 'reduced') return true;
  if (settings.motion === 'full') return false;
  return Boolean(system);
}
