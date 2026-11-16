import { useState } from 'react';
import { getAsset } from '../content/assets/index.ts';
import { Placeholder } from './placeholder/Placeholder.tsx';

interface IllustrationProps {
  id: string;
  className?: string;
  /** true si la imagen es decorativa (el texto ya la describe). */
  decorative?: boolean;
  showBadge?: boolean;
}

/**
 * Muestra el recurso definitivo si está marcado como `listo` y existe;
 * en caso contrario, un placeholder vectorial temporal.
 */
export function Illustration({ id, className = '', decorative = false, showBadge = false }: IllustrationProps) {
  const asset = getAsset(id);
  const [failed, setFailed] = useState(false);

  if (!asset) {
    return <div className={`bg-crema-200 ${className}`} role={decorative ? undefined : 'img'} aria-label={decorative ? undefined : 'Imagen no disponible'} />;
  }

  const ready = asset.status === 'listo' && !failed;
  const position = /\b(absolute|fixed)\b/.test(className) ? '' : 'relative';

  return (
    <div className={`${position} overflow-hidden ${className}`}>
      {ready ? (
        <img
          src={asset.file}
          alt={decorative ? '' : asset.alt}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
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
