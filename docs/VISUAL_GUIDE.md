# Guía visual

NUBI debe parecer **un cuento interactivo de calidad editorial**, no una plataforma administrativa. Calma, exploración y curiosidad.

Este documento fija los **valores** (tokens, tipografías, formas). El **criterio** para componer pantallas —jerarquía, composición por orientación, estados, reglas para pantallas nuevas— está en [`NUBI_DESIGN_PRINCIPLES.md`](NUBI_DESIGN_PRINCIPLES.md).

## 1. Paleta

Tokens definidos en `src/index.css` (`@theme`). Usar siempre tokens, nunca hex sueltos en componentes.

| Token | Hex | Uso |
|---|---|---|
| `crema-100` | `#FBF5EA` | Fondo de página (papel) |
| `crema-50` | `#FFFCF6` | Tarjetas |
| `crema-200/300` | `#F4EAD7` / `#E9DBC0` | Superficies secundarias, bordes suaves |
| `petroleo-600` | `#22606B` | Acción principal, selección (texto crema encima: AA) |
| `petroleo-800/900` | `#163F47` / `#102F36` | Títulos |
| `coral-400/500` | `#EC8A6C` / `#E2704F` | Acentos, intensidad, progreso actual. Con texto `tinta` encima, nunca blanco |
| `coral-700` | `#A5432A` | Texto de acento (antetítulos), anillo de foco |
| `salvia-100…700` | | Calma, "ya explorado", herramientas de descanso |
| `mostaza-100…700` | | Avisos amables, anticipación |
| `tinta` / `tinta-suave` | `#22333A` / `#4B5F66` | Texto principal / secundario |

Reglas: sin rojo/verde de acierto-error; sin colores saturados; fondos siempre cálidos; máximo un acento fuerte por pantalla.

## 2. Tipografía

- **Nunito** (variable, autoalojada): redondeada y muy legible. Títulos 800-900; cuerpo ~560.
- **Atkinson Hyperlegible** (opción "Muy clara" en Ajustes): diseñada para baja visión.
- Texto de historia: 24-28 px (`text-2xl`/`1.75rem`), interlineado ≥ 1.45. Cuerpo general 18 px.
- Clase `reading-text` en todo texto infantil: activa mayúsculas, espaciado y demás ajustes de lectura.

## 3. Formas y composición

- Tarjetas grandes, radio `--radius-card` (28 px), sombra cálida suave (`--shadow-soft`), elevación al pasar (`--shadow-lift`).
- Botones en píldora, altura mínima 56 px (`min-h-14`), siempre con texto + icono.
- Mucho aire: una idea por pantalla. Máximo 4 secciones en la navegación principal.
- Iconos propios de trazo redondeado 2 px (`components/Icon.tsx`).
- Fondo `paper`: crema con dos manchas muy suaves de coral y salvia.

## 4. Personaje guía

**Nubi**: una pequeña nube crema con borde petróleo, ojos de punto y mejillas coral. Aparece para preguntar y acompañar, nunca para evaluar. Su arte definitivo es de Codex (`nubi-saludo`, `nubi-pensando`, `char-nubi`, con variantes 256/512 px) y se muestra con `components/illustration/GuideArt.tsx`. El vector de `components/Nubi.tsx` (expresiones `happy`, `calm`, `surprised`, `curious`, `worried`, `frustrated`, `thinking`) queda como respaldo mientras falten recursos (`emo-*`).

## 5. Ilustración

Dirección para el arte definitivo (detallada por recurso en `ASSET_REQUESTS.md`):

- 2D contemporánea, inspiración en el cuento ilustrado europeo; texturas de papel/gouache sutiles.
- Escenarios reconocibles y tranquilos; personajes con expresiones claras pero no exageradas.
- Sin texto dentro de las imágenes.
- Apoyos (cascos, comunicador, tarjetas) dibujados con naturalidad.
- Placeholders actuales: vectores planos generados desde metadatos, con etiqueta "Ilustración provisional" en la ficha de historia. **No son arte final.**

## 6. Movimiento

- Microanimaciones discretas: `page-next`/`page-prev` (pasar página: 18 px + fundido), `rise` (aparecer subiendo 14 px, 0,5 s), `pop` (escala 0,96→1), `fade`, `sway` (balanceo de Nubi recortada, 7 s), `float` (flotar ±8 px, 6 s), `drift` (nubes de portada provisional, 80 s; desaparecen con el paisaje final).
- Nada parpadea, nada se mueve rápido, ninguna información depende de una animación.
- Tres niveles de control: preferencia del sistema (`prefers-reduced-motion`), ajuste "Sin animaciones" y botón **Animaciones** del reproductor (pausa inmediata).

## 7. Sonido

- Nunca suena nada sin una acción del niño o la niña.
- Sin música de fondo ni efectos en la interfaz.
- La narración es opcional y se acompaña de subtítulos.

## 8. Accesibilidad visual

- Foco: anillo doble (crema + coral oscuro) visible sobre cualquier fondo.
- Contraste AA en todo texto; opción "Más contraste".
- Ajustes de lectura: tamaño (100/112,5/125 %), espaciado amplio, fuente legible, MAYÚSCULAS, textos cortos.
- Objetivos táctiles ≥ 48 px en todo control; texto infantil ≥ 14 px.
- Diseño mobile-first; prioridad tableta. Puntos de comprobación: 390, 820 y 1180 px.

## 9. Qué evitar

Menús recargados · tablas y métricas en zonas infantiles · insignias, estrellas de puntuación o confeti · rojo/verde de acierto · fotografías · estética genérica de "app educativa" · texto largo en botones · ventanas emergentes inesperadas.
