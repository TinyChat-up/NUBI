import { useRef, type PointerEvent } from 'react';

/**
 * Deslizar horizontalmente (táctil o lápiz) para pasar página. Complementa —nunca sustituye—
 * a los botones Atrás/Siguiente. Ignora gestos verticales (desplazamiento) y el ratón.
 */
export function useSwipe({ onNext, onPrev, enabled }: { onNext: () => void; onPrev: () => void; enabled: boolean }) {
  const start = useRef<{ x: number; y: number; id: number } | null>(null);

  const onPointerDown = (e: PointerEvent) => {
    if (!enabled || e.pointerType === 'mouse' || !e.isPrimary) return;
    start.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
  };
  const onPointerUp = (e: PointerEvent) => {
    const s = start.current;
    start.current = null;
    if (!enabled || !s || s.id !== e.pointerId) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 1.6) return;
    if (dx < 0) onNext();
    else onPrev();
  };
  const onPointerCancel = () => {
    start.current = null;
  };

  return { onPointerDown, onPointerUp, onPointerCancel };
}
