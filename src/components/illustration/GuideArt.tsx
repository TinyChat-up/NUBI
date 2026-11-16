import type { EmotionId, Mood } from '../../engine/types.ts';
import { Illustration, hasFinalArt } from '../Illustration.tsx';
import { Nubi } from '../Nubi.tsx';

/**
 * Nubi con arte definitivo cuando Codex lo entregue (`nubi-saludo`, `nubi-pensando`);
 * mientras tanto, el vector provisional. Ningún componente debe dibujar a Nubi por su cuenta.
 */
export function GuideArt({ mood = 'happy', size = 120, className = '', label }: { mood?: Mood; size?: number; className?: string; label?: string }) {
  const id = mood === 'thinking' || mood === 'curious' ? 'nubi-pensando' : 'nubi-saludo';
  if (hasFinalArt(id)) {
    // Tamaño fijo por defecto; `className` puede sobrescribir el ancho (p. ej. w-36 sm:w-48).
    return (
      <span className={`block shrink-0 ${className}`} style={/\bw-/.test(className) ? undefined : { width: size }}>
        <Illustration id={id} decorative={!label} className="w-full" fit="contain" ratio imgClassName="drop-shadow-[0_10px_14px_rgba(34,51,58,0.12)]" sizes={`${size}px`} />
      </span>
    );
  }
  return <Nubi mood={mood} size={size} className={className} label={label} />;
}

/** Emoción: ilustración `emo-<id>` si está lista; si no, Nubi con la expresión provisional. */
export function EmotionArt({ emotion, mood, size = 64, className = '' }: { emotion: EmotionId; mood: Mood; size?: number; className?: string }) {
  const id = `emo-${emotion}`;
  if (hasFinalArt(id)) {
    return (
      <span className={`block shrink-0 ${className}`} style={{ width: size, height: size }}>
        <Illustration id={id} decorative className="h-full w-full" fit="contain" sizes={`${size}px`} />
      </span>
    );
  }
  return <Nubi mood={mood} size={size} className={className} />;
}
