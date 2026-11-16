import { useCallback, useState, type CSSProperties } from 'react';
import { getAsset } from '../content/assets/index.ts';
import { Placeholder } from './placeholder/Placeholder.tsx';
import { buildSrcSet, cssAspect, defaultFit, isReady, objectPosition, type Fit } from './illustration/imageSource.ts';

interface IllustrationProps {
  id: string;
  /** Tamaño y forma del contenedor. */
  className?: string;
  /** true si la imagen es decorativa (el texto ya la describe). */
  decorative?: boolean;
  showBadge?: boolean;
  /** cover = llena el contenedor (recorta según `focus`); contain = nunca recorta. Por defecto según transparencia. */
  fit?: Fit;
  /** Si es true, el contenedor toma la proporción del registro (evita saltos de maquetación y recortes). */
  ratio?: boolean;
  /** Ilustración principal visible al cargar: sin carga diferida y con prioridad alta. */
  priority?: boolean;
  /** Atributo `sizes` para elegir variante (solo si el registro declara `variants`). */
  sizes?: string;
  /** Clases extra para la <img> definitiva (p. ej. sombra para recortes transparentes). */
  imgClassName?: string;
}

/**
 * Muestra el recurso definitivo si está `listo`; si no existe o falla, el placeholder temporal.
 * - width/height reales → el navegador reserva espacio (sin saltos).
 * - Carga diferida salvo `priority`; decodificación asíncrona; srcset si hay variantes.
 * - Mientras carga: fondo de papel liso; al cargar, aparición suave (sin animación con movimiento reducido).
 */
export function Illustration({
  id,
  className = '',
  decorative = false,
  showBadge = false,
  fit,
  ratio = false,
  priority = false,
  sizes = '100vw',
  imgClassName = '',
}: IllustrationProps) {
  const asset = getAsset(id);
  // Estado de carga ligado al id: si cambia el recurso, se reinicia en el mismo render.
  const [load, setLoad] = useState({ id, loaded: false, failed: false });
  if (load.id !== id) setLoad({ id, loaded: false, failed: false });
  const { loaded, failed } = load.id === id ? load : { loaded: false, failed: false };
  const markLoaded = useCallback(() => setLoad({ id, loaded: true, failed: false }), [id]);

  // Imágenes ya en caché pueden completarse antes de enlazar onLoad.
  const imgRef = useCallback(
    (img: HTMLImageElement | null) => {
      if (img?.complete && img.naturalWidth > 0) markLoaded();
    },
    [markLoaded],
  );

  if (!asset) {
    return <div className={`bg-crema-200 ${className}`} role={decorative ? undefined : 'img'} aria-label={decorative ? undefined : 'Imagen no disponible'} />;
  }

  const ready = isReady(asset) && !failed;
  const position = /\b(absolute|fixed)\b/.test(className) ? '' : 'relative';
  const style: CSSProperties | undefined = ratio ? { aspectRatio: cssAspect(asset.aspect) } : undefined;
  const mode = fit ?? defaultFit(asset);
  const srcSet = ready ? buildSrcSet(asset) : undefined;

  return (
    <div
      className={`${position} overflow-hidden ${ready && !loaded && !asset.transparent ? 'bg-crema-200' : ''} ${className}`}
      style={style}
      data-asset={asset.id}
      data-asset-state={ready ? (loaded ? 'cargado' : 'cargando') : failed ? 'error' : 'provisional'}
    >
      {ready ? (
        <img
          key={asset.id}
          ref={imgRef}
          src={asset.file}
          srcSet={srcSet}
          sizes={srcSet ? sizes : undefined}
          width={asset.size.width}
          height={asset.size.height}
          alt={decorative ? '' : asset.alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : undefined}
          decoding="async"
          draggable={false}
          onLoad={markLoaded}
          onError={() => setLoad({ id, loaded: false, failed: true })}
          className={`h-full w-full transition-opacity duration-500 ${mode === 'cover' ? 'object-cover' : 'object-contain'} ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
          style={{ objectPosition: objectPosition(asset) }}
        />
      ) : (
        <div className="h-full w-full" aria-hidden={decorative || undefined}>
          <Placeholder asset={asset} className="block h-full w-full" />
        </div>
      )}
      {showBadge && !ready && (
        <span className="pointer-events-none absolute top-2 left-2 rounded-full bg-crema-50/85 px-2.5 py-0.5 text-[0.7rem] font-bold tracking-wide text-tinta-suave">
          Ilustración provisional
        </span>
      )}
    </div>
  );
}

/** ¿El recurso definitivo está disponible? (para elegir entre arte final y alternativas provisionales). */
export const hasFinalArt = (id: string): boolean => isReady(getAsset(id));
