/**
 * Iconos propios de NUBI: trazo redondeado de 2px sobre rejilla de 24.
 * Decorativos por defecto (aria-hidden); usa `label` si el icono transmite información por sí solo.
 */
const paths: Record<string, string> = {
  hand: 'M8 13V5.5a1.5 1.5 0 0 1 3 0V11 M11 10V4.5a1.5 1.5 0 0 1 3 0V11 M14 10.5V6a1.5 1.5 0 0 1 3 0v6.5 M8 13l-1.6-1.7a1.6 1.6 0 0 0-2.4 2.1l3.2 4.2A6 6 0 0 0 12 20h1a5 5 0 0 0 5-5v-2.5',
  pause: 'M9 6v12 M15 6v12',
  leaf: 'M5 19c0-8 5-13 14-14 0 9-5 14-13 14z M5 19l7-7',
  chat: 'M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4h0A1.5 1.5 0 0 1 4 14.5z M8.5 10h.01 M12 10h.01 M15.5 10h.01',
  calendar: 'M5 6.5A1.5 1.5 0 0 1 6.5 5h11A1.5 1.5 0 0 1 19 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 17.5z M5 9.5h14 M9 3v4 M15 3v4 M8.5 13h2 M13.5 13h2 M8.5 16h2',
  scale: 'M12 4v16 M7 20h10 M5 8h14 M5 8l-2.5 6a2.5 2.5 0 0 0 5 0z M19 8l-2.5 6a2.5 2.5 0 0 0 5 0z',
  headphones: 'M4 15v-3a8 8 0 0 1 16 0v3 M4 15a2 2 0 0 1 2-2h1v6H6a2 2 0 0 1-2-2z M20 15a2 2 0 0 0-2-2h-1v6h1a2 2 0 0 0 2-2z',
  sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M12 2.5v2 M12 19.5v2 M2.5 12h2 M19.5 12h2 M5.3 5.3l1.4 1.4 M17.3 17.3l1.4 1.4 M5.3 18.7l1.4-1.4 M17.3 6.7l1.4-1.4',
  spark: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z M18.5 16.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z',
  search: 'M11 4.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13z M16 16l4 4',
  cloud: 'M7.5 18a4 4 0 0 1-.6-7.96A5.5 5.5 0 0 1 17.4 9.5 4.25 4.25 0 0 1 17 18z',
  knot: 'M6 12c0-3 2.5-5 5-5s3 2 3 3.5S12 14 10 14s-2-2 0-3.5 6-1.5 8 1.5 M18 12c0 3-2.5 5-5 5 M3 12h3 M18 12h3',
  drop: 'M12 3.5s-6 6.5-6 10.5a6 6 0 0 0 12 0c0-4-6-10.5-6-10.5z',
  flame: 'M12 21a6 6 0 0 0 6-6c0-4-3-6-3.5-9.5C12 7 10.5 9 10.5 11 9 10 8.5 8.5 8.5 8 7 9.5 6 12 6 15a6 6 0 0 0 6 6z',
  moon: 'M19 14.5A7.5 7.5 0 0 1 9.5 5 7.5 7.5 0 1 0 19 14.5z',
  school: 'M3 20h18 M5 20V10l7-5 7 5v10 M10 20v-5h4v5 M12 9.5a1.5 1.5 0 1 0 0 .01',
  home: 'M4 10.5L12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z',
  tree: 'M12 21v-6 M12 15c-4 0-7-2.5-7-6a7 7 0 0 1 14 0c0 3.5-3 6-7 6z M9 21h6',
  friends: 'M8.5 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M2.5 20a6 6 0 0 1 12 0 M16 11a2.5 2.5 0 1 0 0-5 M17 14a5 5 0 0 1 4.5 5',
  heart: 'M12 20s-7.5-4.5-7.5-10A4.5 4.5 0 0 1 12 7.2 4.5 4.5 0 0 1 19.5 10c0 5.5-7.5 10-7.5 10z',
  backpack: 'M6 9a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v10a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1z M9.5 5V3.5h5V5 M9 13h6v4H9z',
  dots: 'M6 12h.01 M12 12h.01 M18 12h.01',
  question: 'M9 9.2a3 3 0 1 1 4.3 2.7c-.8.4-1.3 1.1-1.3 2v.6 M12 18h.01',
  user: 'M12 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M5 20a7 7 0 0 1 14 0',
  person: 'M12 7.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z M8 21v-6.5L6.5 11a2 2 0 0 1 1.8-2.5h7.4a2 2 0 0 1 1.8 2.5L16 14.5V21',
  book: 'M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5z M13 4h5.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H13z',
  palette: 'M12 3.5a8.5 8.5 0 0 0 0 17c1.2 0 1.8-.8 1.8-1.7 0-1.3-1-1.5-1-2.5S13.6 15 15 15h2a3.5 3.5 0 0 0 3.5-3.5C20.5 7 16.7 3.5 12 3.5z M8 11h.01 M10.5 7.5h.01 M14.5 7.5h.01',
  'arrow-right': 'M5 12h14 M13 6l6 6-6 6',
  'arrow-left': 'M19 12H5 M11 6l-6 6 6 6',
  'chevron-right': 'M9 5l7 7-7 7',
  'chevron-left': 'M15 5l-7 7 7 7',
  clock: 'M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17z M12 7.5V12l3 2',
  chair: 'M7 4h10v8H7z M5 12h14 M7 12v8 M17 12v8 M7 16h10',
  ear: 'M7 9a5 5 0 0 1 10 0c0 3-3 4-3 7a3 3 0 0 1-5.5 1.5 M10 9.5a2 2 0 0 1 4 0',
  check: 'M5 12.5l4.5 4.5L19 7',
  door: 'M6 20V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v15 M4 20h16 M13 12h.01 M16 6.5l3-1.5v14l-3 1',
  refresh: 'M4.5 12a7.5 7.5 0 0 1 13-5.1L20 9.5 M20 4.5v5h-5 M19.5 12a7.5 7.5 0 0 1-13 5.1L4 14.5 M4 19.5v-5h5',
  play: 'M8 5.5v13l10.5-6.5z',
  close: 'M6 6l12 12 M18 6L6 18',
  settings: 'M4 7h9 M17 7h3 M4 17h3 M11 17h9 M15 5v4 M9 15v4',
  volume: 'M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z M15.5 9a4 4 0 0 1 0 6 M18 6.5a7.5 7.5 0 0 1 0 11',
  'volume-off': 'M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z M16 9.5l5 5 M21 9.5l-5 5',
  subtitles: 'M3.5 7A2 2 0 0 1 5.5 5h13a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z M7 12.5h3 M12.5 12.5H17 M7 15.5h7 M16 15.5h1',
  repeat: 'M4 12a8 8 0 1 0 2.4-5.7L4 8.5 M4 4v4.5h4.5',
  'motion-off': 'M5 12c2-3 4-3 6 0s4 3 6 0 M4 4l16 16',
  motion: 'M3 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0',
  map: 'M9 4.5L3.5 6.5v13L9 17.5l6 2 5.5-2v-13L15 6.5z M9 4.5v13 M15 6.5v13',
  film: 'M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5z M8 4v16 M16 4v16 M4 9h4 M4 15h4 M16 9h4 M16 15h4',
  comic: 'M3.5 5A1.5 1.5 0 0 1 5 3.5h6v8h-7.5z M13 3.5h6A1.5 1.5 0 0 1 20.5 5v3H13z M13 10h7.5v9a1.5 1.5 0 0 1-1.5 1.5h-6z M3.5 13.5H11v7H5A1.5 1.5 0 0 1 3.5 19z',
  story: 'M5 4.5h10.5a3.5 3.5 0 0 1 3.5 3.5v12H8.5A3.5 3.5 0 0 1 5 16.5z M5 16.5A3.5 3.5 0 0 1 8.5 13H19 M9 8h6',
  star: 'M12 4l2.3 4.8 5.2.7-3.8 3.6.9 5.2L12 15.8l-4.6 2.5.9-5.2-3.8-3.6 5.2-.7z',
  lock: 'M6 11h12v9H6z M8.5 11V8a3.5 3.5 0 0 1 7 0v3',
  trash: 'M4.5 7h15 M9.5 7V4.5h5V7 M6.5 7l1 13h9l1-13',
  info: 'M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17z M12 11v5.5 M12 7.8h.01',
  print: 'M7 9V4h10v5 M7 17H5a1.5 1.5 0 0 1-1.5-1.5v-5A1.5 1.5 0 0 1 5 9h14a1.5 1.5 0 0 1 1.5 1.5v5A1.5 1.5 0 0 1 19 17h-2 M7 14h10v6H7z',
  text: 'M5 6h14 M5 10.5h14 M5 15h9 M5 19.5h6',
  sparkle: 'M12 4v4 M12 16v4 M4 12h4 M16 12h4 M6.5 6.5l2.2 2.2 M15.3 15.3l2.2 2.2 M6.5 17.5l2.2-2.2 M15.3 8.7l2.2-2.2',
  grown: 'M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M3 21v-6a5 5 0 0 1 10 0v6 M17.5 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M14.5 21v-4a3 3 0 0 1 6 0v4',
  card: 'M3.5 7A2 2 0 0 1 5.5 5h13a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z M7 10h10 M7 14h6',
  footsteps: 'M7 13c-1.5 0-2.5-1.8-2.5-4S5.5 5 7 5s2.5 2 2.5 4-1 4-2.5 4z M5 15.5h4 M17 18c-1.5 0-2.5-1.8-2.5-4s1-4 2.5-4 2.5 2 2.5 4-1 4-2.5 4z M15 20.5h4',
};

export const iconNames = Object.keys(paths);

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  label?: string;
  strokeWidth?: number;
}

export function Icon({ name, size = 24, className, label, strokeWidth = 2 }: IconProps) {
  const d = paths[name] ?? paths.sparkle;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {d.split(' M').map((seg, i) => (
        <path key={i} d={i === 0 ? seg : `M${seg}`} />
      ))}
    </svg>
  );
}
