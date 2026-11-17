import { useEffect, useState, type RefObject } from 'react';

/**
 * Ventana «baja»: las barras fijas (cabecera, controles, navegación inferior) ocupan tanto alto
 * que apenas queda sitio para el contenido. Pasa con zoom alto (400 % ≈ 320×256 px CSS),
 * en ventanas muy bajas o con letra grande. WCAG 1.4.10 (Reajuste).
 *
 * En ese caso las barras dejan de ser fijas y forman parte de una página con desplazamiento
 * vertical normal: no se quita ningún control, solo deja de tapar el contenido.
 *
 * Se decide midiendo las barras reales (dependen del ancho y del tamaño de letra), con histéresis
 * para que no alterne al cambiar de paso (la pista de la decisión añade una línea a los controles).
 */
export const TIGHT_ENTER = 0.5;
export const TIGHT_LEAVE = 0.45;

/** Lógica pura: ¿la ventana es baja, sabiendo si ya lo era? */
export function nextTight(wasTight: boolean, barsHeight: number, viewportHeight: number, enter = TIGHT_ENTER, leave = TIGHT_LEAVE): boolean {
  if (viewportHeight <= 0) return wasTight;
  const share = barsHeight / viewportHeight;
  return wasTight ? share > leave : share > enter;
}

/**
 * Umbral para una sola barra (fase 19: las pantallas generales ya no tienen navegación inferior, solo
 * cabecera). Con una barra, una cuarta parte del alto ya es mucho: a 320×256 la cabecera ocupa ≈ 28 %.
 */
export const SINGLE_BAR = { enter: 0.25, leave: 0.2 } as const;

/**
 * Mide las barras indicadas y devuelve si la ventana es baja. Mientras lo sea, marca
 * `<html data-tight>` (el CSS ajusta allí lo que no depende de un componente, como scroll-padding).
 * Con `enabled = false` no mide ni toca `<html>` (p. ej. pantallas sin barras).
 */
export function useTightViewport(refs: RefObject<HTMLElement | null>[], enabled = true, threshold: { enter: number; leave: number } = { enter: TIGHT_ENTER, leave: TIGHT_LEAVE }): boolean {
  const [tight, setTight] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const measure = () => {
      const bars = refs.reduce((sum, r) => sum + (r.current?.getBoundingClientRect().height ?? 0), 0);
      setTight((was) => nextTight(was, bars, window.innerHeight, threshold.enter, threshold.leave));
    };
    measure();
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure);
    for (const r of refs) if (r.current) observer?.observe(r.current);
    window.addEventListener('resize', measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
    };
    // Las refs son objetos estables de useRef; basta con volver a medir si cambia `enabled`.
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !tight) return;
    const root = document.documentElement;
    root.dataset.tight = '';
    return () => {
      delete root.dataset.tight;
    };
  }, [enabled, tight]);

  return enabled && tight;
}
