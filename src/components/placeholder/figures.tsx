import type { Mood } from '../../engine/types.ts';
import { characters } from '../../content/characters.ts';

/** Figuras simplificadas para placeholders. NO son el diseño final de los personajes. */

interface Look {
  skin: string;
  hair: string;
  style: 'messy' | 'buns' | 'curls' | 'short-clip' | 'short-beard' | 'short' | 'braid' | 'bun';
  adult?: boolean;
  prop?: 'tablet' | 'folder' | 'headphones' | 'bag';
}

const looks: Record<string, Look> = {
  teo: { skin: '#F1C9A5', hair: '#5A3B26', style: 'messy', prop: 'headphones' },
  aya: { skin: '#E3AD86', hair: '#1F1B1A', style: 'buns' },
  bruno: { skin: '#F6D5BD', hair: '#B5532B', style: 'curls' },
  lia: { skin: '#EFC6A3', hair: '#9A7A45', style: 'short-clip', prop: 'tablet' },
  andres: { skin: '#C68D63', hair: '#2C2420', style: 'short-beard', adult: true, prop: 'folder' },
  carmen: { skin: '#E7BD9C', hair: '#9DA3A6', style: 'short', adult: true },
  pilar: { skin: '#B07A55', hair: '#2A211D', style: 'braid', adult: true },
  rosa: { skin: '#F0CEB6', hair: '#E9E6E1', style: 'bun', adult: true, prop: 'bag' },
};

const INK = '#22333A';

function Face({ mood, x, y }: { mood: Mood; x: number; y: number }) {
  const e = 14;
  const stroke = { stroke: INK, strokeWidth: 3.2, strokeLinecap: 'round' as const, fill: 'none' };
  const eyes = (() => {
    switch (mood) {
      case 'happy':
        return (
          <>
            <path d={`M${x - e - 5} ${y}q5 -6 10 0`} {...stroke} />
            <path d={`M${x + e - 5} ${y}q5 -6 10 0`} {...stroke} />
          </>
        );
      case 'calm':
        return (
          <>
            <path d={`M${x - e - 5} ${y - 2}q5 5 10 0`} {...stroke} />
            <path d={`M${x + e - 5} ${y - 2}q5 5 10 0`} {...stroke} />
          </>
        );
      case 'thinking':
        return (
          <>
            <circle cx={x - e + 3} cy={y - 4} r={4} fill={INK} />
            <circle cx={x + e + 3} cy={y - 4} r={4} fill={INK} />
          </>
        );
      default:
        return (
          <>
            <circle cx={x - e} cy={y} r={mood === 'surprised' ? 5 : 4} fill={INK} />
            <circle cx={x + e} cy={y} r={mood === 'surprised' ? 5 : 4} fill={INK} />
          </>
        );
    }
  })();
  const brows =
    mood === 'worried' ? (
      <>
        <path d={`M${x - e - 7} ${y - 12}l10 -3`} {...stroke} strokeWidth={2.6} />
        <path d={`M${x + e + 7} ${y - 12}l-10 -3`} {...stroke} strokeWidth={2.6} />
      </>
    ) : mood === 'frustrated' ? (
      <>
        <path d={`M${x - e - 7} ${y - 15}l10 4`} {...stroke} strokeWidth={2.6} />
        <path d={`M${x + e + 7} ${y - 15}l-10 4`} {...stroke} strokeWidth={2.6} />
      </>
    ) : mood === 'curious' ? (
      <path d={`M${x + e - 6} ${y - 16}q6 -5 12 0`} {...stroke} strokeWidth={2.6} />
    ) : null;
  const my = y + 17;
  const mouth = (() => {
    switch (mood) {
      case 'happy':
        return <path d={`M${x - 9} ${my - 2}q9 9 18 0`} {...stroke} />;
      case 'surprised':
        return <ellipse cx={x} cy={my} rx={4.5} ry={6} fill={INK} />;
      case 'worried':
        return <path d={`M${x - 8} ${my + 2}q4 -4 8 0t8 0`} {...stroke} />;
      case 'frustrated':
        return <path d={`M${x - 8} ${my + 2}q8 -6 16 0`} {...stroke} />;
      case 'thinking':
        return <path d={`M${x - 4} ${my}h9`} {...stroke} />;
      default:
        return <path d={`M${x - 7} ${my - 1}q7 5 14 0`} {...stroke} />;
    }
  })();
  return (
    <g>
      {brows}
      {eyes}
      {mouth}
      <circle cx={x - 25} cy={y + 10} r={6} fill="#EC8A6C" opacity={0.4} />
      <circle cx={x + 25} cy={y + 10} r={6} fill="#EC8A6C" opacity={0.4} />
    </g>
  );
}

function Hair({ look, x, y }: { look: Look; x: number; y: number }) {
  const c = look.hair;
  switch (look.style) {
    case 'messy':
      return <path d={`M${x - 42} ${y - 4}q-2 -40 42 -42q44 2 42 42q-10 -14 -20 -16q-6 10 -22 8q-10 -12 -18 -4q-12 -8 -24 12z`} fill={c} />;
    case 'buns':
      return (
        <g fill={c}>
          <circle cx={x - 34} cy={y - 34} r={15} />
          <circle cx={x + 34} cy={y - 34} r={15} />
          <path d={`M${x - 41} ${y - 2}q0 -40 41 -40q41 0 41 40q-20 -22 -41 -22t-41 22z`} />
        </g>
      );
    case 'curls':
      return (
        <g fill={c}>
          {[-36, -18, 0, 18, 36].map((dx, i) => (
            <circle key={i} cx={x + dx} cy={y - 32 + Math.abs(dx) / 3} r={15} />
          ))}
        </g>
      );
    case 'short-clip':
      return (
        <g>
          <path d={`M${x - 42} ${y + 6}q-4 -46 42 -46q46 0 42 46q-6 -24 -42 -26q-36 2 -42 26z`} fill={c} />
          <path d={`M${x + 22} ${y - 30}l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z`} fill="#E3AE4C" />
        </g>
      );
    case 'short-beard':
      return (
        <g fill={c}>
          <path d={`M${x - 41} ${y - 6}q0 -36 41 -36q41 0 41 36q-14 -16 -41 -16t-41 16z`} />
          <path d={`M${x - 34} ${y + 10}q34 50 68 0q-6 26 -34 28q-28 -2 -34 -28z`} opacity={0.85} />
        </g>
      );
    case 'short':
      return <path d={`M${x - 43} ${y + 4}q-2 -46 43 -46q45 0 43 46q-8 -26 -43 -28q-35 2 -43 28z`} fill={c} />;
    case 'braid':
      return (
        <g fill={c}>
          <path d={`M${x - 42} ${y + 8}q-2 -48 42 -48q44 0 42 48q-10 -28 -42 -30q-32 2 -42 30z`} />
          <path d={`M${x + 36} ${y}q14 40 2 86`} stroke={c} strokeWidth={14} strokeLinecap="round" fill="none" />
        </g>
      );
    case 'bun':
      return (
        <g fill={c}>
          <circle cx={x} cy={y - 46} r={17} />
          <path d={`M${x - 42} ${y + 2}q0 -44 42 -44q42 0 42 44q-16 -24 -42 -24t-42 24z`} />
        </g>
      );
  }
}

export function Figure({ id, mood = 'neutral', x, base, scale, showName = true }: { id: string; mood?: Mood; x: number; base: number; scale: number; showName?: boolean }) {
  const character = characters[id];
  if (!character) return null;

  if (id === 'nubi') {
    const s = scale * 1.4;
    return (
      <g transform={`translate(${x - 64 * s} ${base - 330 * scale}) scale(${s})`}>
        <path
          d="M30 94a22 22 0 0 1-3.3-43.7A30 30 0 0 1 84.4 36a24 24 0 0 1 14.8 4.8A22 22 0 0 1 98 94z"
          fill="#FFFCF6"
          stroke="#2F7581"
          strokeWidth={3.5}
        />
        <g transform="translate(0 4)">
          <Face mood={mood} x={64} y={60} />
        </g>
      </g>
    );
  }

  const look = looks[id] ?? { skin: '#EFC6A3', hair: '#5A3B26', style: 'short' as const };
  const s = scale * (look.adult ? 1.24 : 1);
  const legH = 52;
  const torsoH = 92;
  const torsoW = 84;
  const headR = 40;

  return (
    <g transform={`translate(${x} ${base}) scale(${s})`}>
      <ellipse cx={0} cy={2} rx={58} ry={9} fill={INK} opacity={0.1} />
      {/* piernas */}
      <rect x={-26} y={-legH} width={20} height={legH} rx={9} fill="#3B4A50" />
      <rect x={6} y={-legH} width={20} height={legH} rx={9} fill="#3B4A50" />
      {/* torso */}
      <rect x={-torsoW / 2} y={-legH - torsoH + 8} width={torsoW} height={torsoH} rx={32} fill={character.color} />
      {/* brazos */}
      <path d={`M${-torsoW / 2 + 6} ${-legH - torsoH + 36}q-16 30 -6 56`} stroke={character.color} strokeWidth={18} strokeLinecap="round" fill="none" />
      <path d={`M${torsoW / 2 - 6} ${-legH - torsoH + 36}q16 30 6 56`} stroke={character.color} strokeWidth={18} strokeLinecap="round" fill="none" />
      {look.prop === 'tablet' && <rect x={-22} y={-legH - 34} width={44} height={32} rx={6} fill="#22333A" stroke="#FFFCF6" strokeWidth={4} />}
      {look.prop === 'folder' && <rect x={18} y={-legH - 46} width={36} height={46} rx={4} fill="#E3AE4C" />}
      {look.prop === 'bag' && <rect x={30} y={-legH - 30} width={34} height={38} rx={10} fill="#C9DAC0" />}
      {/* cabeza */}
      <circle cx={0} cy={-legH - torsoH - headR + 14} r={headR} fill={look.skin} />
      <Hair look={look} x={0} y={-legH - torsoH - headR + 14} />
      <Face mood={mood} x={0} y={-legH - torsoH - headR + 18} />
      {look.prop === 'headphones' && (
        <path d={`M-34 ${-legH - torsoH + 14}q34 26 68 0`} stroke="#6F8F69" strokeWidth={10} strokeLinecap="round" fill="none" />
      )}
      {/* nombre */}
      {showName && <g transform={`translate(0 24) scale(${1 / s})`}>
        <rect x={-46} y={-2} width={92} height={34} rx={17} fill="#FFFCF6" opacity={0.92} />
        <text x={0} y={21} textAnchor="middle" fontSize={20} fontWeight={800} fill={INK} fontFamily="Nunito Variable, Nunito, sans-serif">
          {character.name}
        </text>
      </g>}
    </g>
  );
}
