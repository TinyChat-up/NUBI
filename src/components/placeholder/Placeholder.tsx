import type { AspectRatio, AssetSpec, PlaceholderMotif } from '../../engine/types.ts';
import { Figure } from './figures.tsx';
import { Icon } from '../Icon.tsx';

/**
 * Placeholder visual TEMPORAL: compone una escena simple a partir de los metadatos
 * del recurso (motivo, personajes, emoción). Sirve para probar la experiencia
 * completa mientras se producen las ilustraciones definitivas.
 */

const VIEW: Record<AspectRatio, [number, number]> = {
  '16:9': [1600, 900],
  '4:3': [1200, 900],
  '3:2': [1350, 900],
  '1:1': [900, 900],
  '3:4': [900, 1200],
};

const TINTS = {
  crema: ['#F4EAD7', '#E9DBC0'],
  petroleo: ['#D9EBEC', '#B4D5D8'],
  coral: ['#FCE4DA', '#F8C9B7'],
  salvia: ['#E3ECDD', '#C9DAC0'],
  mostaza: ['#FAECC9', '#F3D898'],
} as const;

function Background({ motif, w, h, tint, uid }: { motif: PlaceholderMotif; w: number; h: number; tint: keyof typeof TINTS; uid: string }) {
  const floor = h * 0.72;
  switch (motif) {
    case 'landscape':
    case 'school-gate':
    case 'home':
    case 'park':
    case 'friends': {
      const outdoor = (
        <>
          <rect width={w} height={h} fill={`url(#sky-${uid})`} />
          <circle cx={w * 0.8} cy={h * 0.22} r={h * 0.09} fill="#F3D898" opacity={0.9} />
          <g fill="#FFFCF6" opacity={0.85}>
            <ellipse cx={w * 0.2} cy={h * 0.16} rx={w * 0.07} ry={h * 0.035} />
            <ellipse cx={w * 0.25} cy={h * 0.13} rx={w * 0.045} ry={h * 0.04} />
            <ellipse cx={w * 0.62} cy={h * 0.1} rx={w * 0.05} ry={h * 0.025} />
          </g>
          <path d={`M0 ${h * 0.62} Q ${w * 0.3} ${h * 0.5} ${w * 0.6} ${h * 0.6} T ${w} ${h * 0.56} V ${h} H 0z`} fill="#C9DAC0" />
          <path d={`M0 ${h * 0.74} Q ${w * 0.4} ${h * 0.64} ${w * 0.75} ${h * 0.72} T ${w} ${h * 0.7} V ${h} H 0z`} fill="#8EAB87" />
        </>
      );
      if (motif === 'landscape') {
        return (
          <>
            {outdoor}
            <path d={`M0 ${h * 0.84} Q ${w * 0.5} ${h * 0.76} ${w} ${h * 0.86} V ${h} H 0z`} fill="#2F7581" opacity={0.9} />
            {/* pueblo */}
            {[0.18, 0.3, 0.68, 0.84].map((p, i) => (
              <g key={i} transform={`translate(${w * p} ${h * 0.62 + (i % 2) * 14})`}>
                <rect x={-34} y={-50} width={68} height={56} rx={6} fill="#FFFCF6" />
                <path d="M-42 -48 L0 -86 L42 -48z" fill="#E2704F" />
                <rect x={-10} y={-24} width={20} height={30} rx={4} fill="#2F7581" />
              </g>
            ))}
            <g transform={`translate(${w * 0.48} ${h * 0.6})`}>
              <rect x={-90} y={-110} width={180} height={116} rx={8} fill="#F4EAD7" />
              <path d="M-104 -106 L0 -170 L104 -106z" fill="#A5432A" />
              <circle cx={0} cy={-70} r={18} fill="#FFFCF6" stroke="#22333A" strokeWidth={4} />
              <path d="M0 -70 V-82 M0 -70 H9" stroke="#22333A" strokeWidth={4} strokeLinecap="round" />
              <rect x={-20} y={-36} width={40} height={42} rx={6} fill="#2F7581" />
            </g>
            <path d={`M${w * 0.48} ${h * 0.66} C ${w * 0.45} ${h * 0.78}, ${w * 0.3} ${h * 0.82}, ${w * 0.26} ${h}`} stroke="#F4EAD7" strokeWidth={34} fill="none" strokeLinecap="round" />
          </>
        );
      }
      if (motif === 'school-gate') {
        return (
          <>
            {outdoor}
            <g transform={`translate(${w * 0.5} ${floor})`}>
              <rect x={-w * 0.3} y={-h * 0.42} width={w * 0.6} height={h * 0.42} rx={10} fill="#F4EAD7" />
              <path d={`M${-w * 0.33} ${-h * 0.41} L0 ${-h * 0.58} L${w * 0.33} ${-h * 0.41}z`} fill="#A5432A" />
              <circle cx={0} cy={-h * 0.47} r={h * 0.035} fill="#FFFCF6" stroke="#22333A" strokeWidth={5} />
              {[-0.22, -0.12, 0.12, 0.22].map((p, i) => (
                <rect key={i} x={w * p - 30} y={-h * 0.33} width={60} height={70} rx={8} fill="#B4D5D8" />
              ))}
              <rect x={-55} y={-h * 0.2} width={110} height={h * 0.2} rx={10} fill="#2F7581" />
            </g>
            <rect x={0} y={floor} width={w} height={h - floor} fill="#E9DBC0" />
            <g stroke="#4F909A" strokeWidth={8} strokeLinecap="round">
              {Array.from({ length: 14 }, (_, i) => (
                <line key={i} x1={i * (w / 13)} y1={floor + 6} x2={i * (w / 13)} y2={floor - 70} />
              ))}
              <line x1={0} y1={floor - 56} x2={w * 0.38} y2={floor - 56} />
              <line x1={w * 0.62} y1={floor - 56} x2={w} y2={floor - 56} />
            </g>
            <g transform={`translate(${w * 0.88} ${floor})`}>
              <rect x={-10} y={-120} width={20} height={120} fill="#8A5F12" />
              <circle cx={0} cy={-150} r={70} fill="#6F8F69" />
            </g>
          </>
        );
      }
      if (motif === 'home') {
        return (
          <>
            {outdoor}
            <g transform={`translate(${w * 0.5} ${floor + 20})`}>
              <rect x={-170} y={-260} width={340} height={260} rx={12} fill="#FAECC9" />
              <path d="M-200 -250 L0 -390 L200 -250z" fill="#E2704F" />
              {[-90, 90].map((dx) => (
                <rect key={dx} x={dx - 40} y={-210} width={80} height={70} rx={8} fill="#F3D898" stroke="#8A5F12" strokeWidth={6} />
              ))}
              <rect x={-40} y={-120} width={80} height={120} rx={10} fill="#2F7581" />
            </g>
          </>
        );
      }
      if (motif === 'park') {
        return (
          <>
            {outdoor}
            <g transform={`translate(${w * 0.25} ${floor + 40})`}>
              <rect x={-16} y={-200} width={32} height={200} fill="#8A5F12" />
              <circle cx={0} cy={-260} r={120} fill="#6F8F69" />
              <circle cx={-70} cy={-210} r={70} fill="#8EAB87" />
            </g>
            <g transform={`translate(${w * 0.72} ${floor + 30})`} stroke="#1C4F59" strokeWidth={10} strokeLinecap="round" fill="none">
              <path d="M-120 0 L-80 -220 L80 -220 L120 0" />
              <path d="M-30 -220 V-80 M30 -220 V-80" strokeWidth={5} />
              <rect x={-40} y={-84} width={80} height={14} rx={6} fill="#E2704F" stroke="none" />
            </g>
          </>
        );
      }
      return (
        <>
          {outdoor}
          <g transform={`translate(${w * 0.5} ${floor + 30})`}>
            <rect x={-220} y={-90} width={440} height={24} rx={10} fill="#8A5F12" />
            <rect x={-200} y={-66} width={18} height={70} fill="#8A5F12" />
            <rect x={182} y={-66} width={18} height={70} fill="#8A5F12" />
            <rect x={-150} y={-170} width={90} height={84} rx={22} fill="#E2704F" />
            <rect x={40} y={-160} width={80} height={74} rx={22} fill="#2F7581" />
            <circle cx={260} cy={-30} r={40} fill="#FFFCF6" stroke="#22333A" strokeWidth={5} />
          </g>
        </>
      );
    }
    case 'hallway':
      return (
        <>
          <rect width={w} height={h} fill="#F4EAD7" />
          <rect x={w * 0.62} y={h * 0.1} width={w * 0.3} height={h * 0.4} rx={12} fill="#D9EBEC" />
          <rect x={0} y={h * 0.3} width={w} height={14} fill="#E9DBC0" />
          {Array.from({ length: 8 }, (_, i) => (
            <g key={i} transform={`translate(${60 + i * (w * 0.07)} ${h * 0.34})`}>
              <circle cx={0} cy={0} r={8} fill="#8A5F12" />
              <rect x={-26} y={10} width={52} height={80} rx={18} fill={['#E2704F', '#2F7581', '#E3AE4C', '#8EAB87'][i % 4]} opacity={0.85} />
            </g>
          ))}
          {[0.12, 0.3, 0.45].map((p, i) => (
            <rect key={i} x={w * p} y={h * 0.1} width={110} height={80} rx={6} fill="#FFFCF6" stroke="#E9DBC0" strokeWidth={4} transform={`rotate(${i % 2 ? 3 : -2} ${w * p} ${h * 0.1})`} />
          ))}
          <rect x={0} y={floor} width={w} height={h - floor} fill="#D8C4A0" />
        </>
      );
    case 'classroom':
    case 'board-schedule': {
      const board = motif === 'board-schedule';
      return (
        <>
          <rect width={w} height={h} fill="#F4EAD7" />
          {!board && <rect x={w * 0.04} y={h * 0.1} width={w * 0.16} height={h * 0.38} rx={12} fill="#D9EBEC" stroke="#FFFCF6" strokeWidth={10} />}
          <rect
            x={board ? w * 0.08 : w * 0.28}
            y={h * (board ? 0.08 : 0.1)}
            width={board ? w * 0.84 : w * 0.48}
            height={h * (board ? 0.5 : 0.32)}
            rx={14}
            fill="#3E6655"
            stroke="#8A5F12"
            strokeWidth={12}
          />
          {board ? (
            <g>
              {[0, 1, 2, 3, 4].map((i) => {
                const bw = (w * 0.76) / 5;
                const x = w * 0.12 + i * bw;
                return (
                  <g key={i}>
                    <rect x={x + 10} y={h * 0.16} width={bw - 28} height={bw - 28} rx={18} fill="none" stroke="#FFFCF6" strokeWidth={5} opacity={0.85} />
                    <circle cx={x + bw / 2 - 4} cy={h * 0.16 + (bw - 28) / 2} r={(bw - 28) / 4.5} fill={['#F3D898', '#F8C9B7', '#B4D5D8', '#C9DAC0', '#F3A78D'][i]} />
                  </g>
                );
              })}
            </g>
          ) : (
            <g stroke="#FFFCF6" strokeWidth={5} strokeLinecap="round" opacity={0.7}>
              <path d={`M${w * 0.33} ${h * 0.18} h${w * 0.18}`} />
              <path d={`M${w * 0.33} ${h * 0.25} h${w * 0.28}`} />
              <path d={`M${w * 0.33} ${h * 0.32} h${w * 0.12}`} />
            </g>
          )}
          <rect x={0} y={floor} width={w} height={h - floor} fill="#D8C4A0" />
          {!board &&
            [0.1, 0.5, 0.9].map((p, i) => (
              <rect key={i} x={w * p - 110} y={floor - 30} width={220} height={26} rx={10} fill="#E3AE4C" opacity={0.75} />
            ))}
        </>
      );
    }
    case 'classroom-door':
      return (
        <>
          <rect width={w} height={h} fill="#F4EAD7" />
          <rect x={w * 0.36} y={h * 0.12} width={w * 0.28} height={floor - h * 0.12} rx={10} fill="#8A5F12" />
          <rect x={w * 0.38} y={h * 0.15} width={w * 0.24} height={floor - h * 0.15} rx={6} fill="#FAECC9" />
          <path d={`M${w * 0.38} ${h * 0.15} L${w * 0.3} ${h * 0.19} V${floor + 30} L${w * 0.38} ${floor}z`} fill="#2F7581" />
          <rect x={w * 0.44} y={h * 0.06} width={w * 0.12} height={40} rx={8} fill="#E2704F" />
          <rect x={0} y={floor} width={w} height={h - floor} fill="#D8C4A0" />
        </>
      );
    case 'library':
      return (
        <>
          <rect width={w} height={h} fill="#FAECC9" />
          {[0.06, 0.54].map((p, s) => (
            <g key={s} transform={`translate(${w * p} ${h * 0.08})`}>
              <rect width={w * 0.4} height={h * 0.56} rx={10} fill="#8A5F12" />
              {[0, 1, 2].map((row) => (
                <g key={row} transform={`translate(14 ${14 + row * (h * 0.18)})`}>
                  {Array.from({ length: 11 }, (_, i) => (
                    <rect key={i} x={i * (w * 0.034)} y={14 + (i % 3) * 6} width={w * 0.028} height={h * 0.14 - (i % 3) * 6} rx={4} fill={['#E2704F', '#2F7581', '#8EAB87', '#F3D898', '#F8C9B7'][(i + row + s) % 5]} />
                  ))}
                </g>
              ))}
            </g>
          ))}
          <rect x={0} y={floor} width={w} height={h - floor} fill="#E9DBC0" />
          <ellipse cx={w * 0.5} cy={floor + 60} rx={w * 0.34} ry={46} fill="#B4D5D8" />
        </>
      );
    case 'calm-corner':
      return (
        <>
          <rect width={w} height={h} fill="#E3ECDD" />
          <path d={`M${w * 0.12} ${floor} L${w * 0.3} ${h * 0.18} L${w * 0.48} ${floor}z`} fill="#FFFCF6" stroke="#8EAB87" strokeWidth={8} strokeLinejoin="round" />
          <circle cx={w * 0.78} cy={h * 0.2} r={h * 0.12} fill="#F3D898" opacity={0.5} />
          <rect x={w * 0.76} y={h * 0.2} width={10} height={floor - h * 0.2} fill="#8A5F12" />
          <rect x={0} y={floor} width={w} height={h - floor} fill="#C9DAC0" />
          <ellipse cx={w * 0.62} cy={floor + 10} rx={110} ry={40} fill="#F8C9B7" />
          <g transform={`translate(${w * 0.9} ${floor})`}>
            <rect x={-30} y={-60} width={60} height={60} rx={10} fill="#E2704F" />
            <path d="M0 -60 q-40 -60 -10 -110 M0 -60 q30 -70 20 -120" stroke="#46603F" strokeWidth={10} fill="none" strokeLinecap="round" />
          </g>
        </>
      );
    case 'emotions':
      return (
        <>
          <rect width={w} height={h} fill="#FCE4DA" />
          {[
            [0.22, 0.32, '#F3D898'],
            [0.55, 0.22, '#B4D5D8'],
            [0.8, 0.4, '#C9DAC0'],
            [0.35, 0.65, '#F8C9B7'],
            [0.7, 0.72, '#FFFCF6'],
          ].map(([x, y, c], i) => (
            <path
              key={i}
              transform={`translate(${w * (x as number) - 90} ${h * (y as number) - 60}) scale(1.4)`}
              d="M30 94a22 22 0 0 1-3.3-43.7A30 30 0 0 1 84.4 36a24 24 0 0 1 14.8 4.8A22 22 0 0 1 98 94z"
              fill={c as string}
            />
          ))}
        </>
      );
    case 'toolbox':
      return (
        <>
          <rect width={w} height={h} fill="#D9EBEC" />
          <g transform={`translate(${w * 0.5} ${h * 0.82})`}>
            <rect x={-170} y={-320} width={340} height={320} rx={60} fill="#E3AE4C" />
            <rect x={-120} y={-200} width={240} height={110} rx={24} fill="#8A5F12" opacity={0.3} />
            <path d="M-80 -320 q80 -90 160 0" stroke="#8A5F12" strokeWidth={22} fill="none" />
          </g>
          <path d={`M${w * 0.22} ${h * 0.42}a90 90 0 0 1 180 0`} stroke="#6F8F69" strokeWidth={26} fill="none" strokeLinecap="round" />
          <circle cx={w * 0.8} cy={h * 0.38} r={60} fill="#E2704F" />
          <rect x={w * 0.68} y={h * 0.55} width={150} height={100} rx={14} fill="#FFFCF6" transform={`rotate(-8 ${w * 0.68} ${h * 0.55})`} />
        </>
      );
    case 'portrait':
    case 'icon':
    default:
      return (
        <>
          <rect width={w} height={h} fill={TINTS[tint][0]} />
          <circle cx={w / 2} cy={h / 2} r={Math.min(w, h) * 0.36} fill={TINTS[tint][1]} />
        </>
      );
  }
}

export function Placeholder({ asset, className }: { asset: AssetSpec; className?: string }) {
  const [w, h] = VIEW[asset.aspect];
  const { motif, figures = [], icon, tint = 'crema' } = asset.placeholder;
  const scale = (Math.min(w, h) / 900) * (asset.kind === 'personaje' ? 3 : figures.length > 3 ? 1.35 : 1.6);
  const base = motif === 'portrait' ? h * 0.82 : h * 0.88;
  const spread = figures.length > 1 ? (w * (figures.length > 3 ? 0.78 : 0.6)) / (figures.length - 1) : 0;
  const start = w / 2 - (spread * (figures.length - 1)) / 2;
  const uid = asset.id.replace(/[^a-z0-9]/gi, '');
  const iconSize = Math.min(w, h) * 0.42;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} role="img" aria-label={asset.alt} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0" y2="1">
          {/* En el paisaje de portada el cielo es transparente para fundirse con el fondo de la página. */}
          <stop offset="0" stopColor="#FCE4DA" stopOpacity={motif === 'landscape' ? 0 : 1} />
          <stop offset="0.6" stopColor="#FBF5EA" stopOpacity={motif === 'landscape' ? 0 : 1} />
        </linearGradient>
        <filter id={`grain-${uid}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 0.13  0 0 0 0 0.2  0 0 0 0 0.23  0 0 0 0.05 0" />
        </filter>
      </defs>
      <Background motif={motif} w={w} h={h} tint={tint} uid={uid} />
      {motif === 'icon' && icon && (
        <g transform={`translate(${(w - iconSize) / 2} ${(h - iconSize) / 2})`} color="#1C4F59">
          <Icon name={icon} size={iconSize} strokeWidth={1.5} />
        </g>
      )}
      {figures.map((f, i) => (
        <Figure key={`${f.character}-${i}`} id={f.character} mood={f.mood} x={start + i * spread} base={base} scale={scale} showName={motif !== 'portrait'} />
      ))}
      <rect width={w} height={h} filter={`url(#grain-${uid})`} opacity={0.6} />
    </svg>
  );
}
