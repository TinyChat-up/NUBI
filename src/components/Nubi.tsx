import type { Mood } from '../engine/types.ts';

/**
 * Nubi — personaje guía PROVISIONAL (vector simple).
 * Se sustituirá por la ilustración definitiva (assets nubi-saludo / nubi-pensando).
 */
interface NubiProps {
  mood?: Mood;
  size?: number;
  className?: string;
  /** Si se omite, es decorativo. */
  label?: string;
  wave?: boolean;
}

export function Nubi({ mood = 'happy', size = 160, className, label, wave = false }: NubiProps) {
  const eyes = (() => {
    switch (mood) {
      case 'calm':
        return (
          <g stroke="#22333A" strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M44 62q5 4 10 0" />
            <path d="M74 62q5 4 10 0" />
          </g>
        );
      case 'happy':
        return (
          <g stroke="#22333A" strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M44 63q5-6 10 0" />
            <path d="M74 63q5-6 10 0" />
          </g>
        );
      case 'surprised':
        return (
          <g fill="#22333A">
            <circle cx="49" cy="61" r="4.5" />
            <circle cx="79" cy="61" r="4.5" />
          </g>
        );
      case 'worried':
        return (
          <g>
            <g fill="#22333A">
              <circle cx="49" cy="63" r="3.4" />
              <circle cx="79" cy="63" r="3.4" />
            </g>
            <g stroke="#22333A" strokeWidth="2.4" strokeLinecap="round">
              <path d="M43 54l9 2" />
              <path d="M85 54l-9 2" />
            </g>
          </g>
        );
      case 'thinking':
        return (
          <g fill="#22333A">
            <circle cx="51" cy="59" r="3.6" />
            <circle cx="81" cy="59" r="3.6" />
          </g>
        );
      case 'frustrated':
        return (
          <g>
            <g fill="#22333A">
              <circle cx="49" cy="64" r="3.4" />
              <circle cx="79" cy="64" r="3.4" />
            </g>
            <g stroke="#22333A" strokeWidth="2.4" strokeLinecap="round">
              <path d="M43 53l9 4" />
              <path d="M85 53l-9 4" />
            </g>
          </g>
        );
      case 'curious':
        return (
          <g>
            <g fill="#22333A">
              <circle cx="49" cy="62" r="3.6" />
              <circle cx="79" cy="61" r="4.4" />
            </g>
            <path d="M73 51q6-5 12 0" stroke="#22333A" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          </g>
        );
      default:
        return (
          <g fill="#22333A">
            <circle cx="49" cy="62" r="3.6" />
            <circle cx="79" cy="62" r="3.6" />
          </g>
        );
    }
  })();

  const mouth =
    mood === 'surprised' ? (
      <ellipse cx="64" cy="76" rx="4" ry="5" fill="#22333A" />
    ) : mood === 'worried' || mood === 'frustrated' ? (
      <path d="M58 78q6-4 12 0" stroke="#22333A" strokeWidth="3" fill="none" strokeLinecap="round" />
    ) : mood === 'thinking' ? (
      <path d="M59 76h9" stroke="#22333A" strokeWidth="3" strokeLinecap="round" />
    ) : (
      <path d="M57 73q7 7 14 0" stroke="#22333A" strokeWidth="3" fill="none" strokeLinecap="round" />
    );

  return (
    <svg
      viewBox="0 0 128 112"
      width={size}
      height={(size * 112) / 128}
      className={className}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <ellipse cx="64" cy="106" rx="34" ry="4" fill="#22333A" opacity="0.08" />
      {wave && (
        <path
          d="M108 52q10-10 6-22"
          stroke="#2F7581"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
          className="origin-[108px_52px] animate-[float_3s_ease-in-out_infinite]"
        />
      )}
      <path
        d="M30 94a22 22 0 0 1-3.3-43.7A30 30 0 0 1 84.4 36a24 24 0 0 1 14.8 4.8A22 22 0 0 1 98 94z"
        fill="#FFFCF6"
        stroke="#2F7581"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path d="M38 40a24 24 0 0 1 20-14" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.9" />
      {eyes}
      {mouth}
      <circle cx="38" cy="72" r="5.5" fill="#EC8A6C" opacity="0.55" />
      <circle cx="90" cy="72" r="5.5" fill="#EC8A6C" opacity="0.55" />
      {mood === 'thinking' && (
        <g fill="#E3AE4C">
          <circle cx="112" cy="22" r="5" />
          <circle cx="104" cy="34" r="3" />
        </g>
      )}
    </svg>
  );
}
