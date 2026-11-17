# «El libro de trenes» · Versión jugable de desarrollo

Solo para revisión. **No está en la biblioteca, no está publicada y el guion sigue pendiente de aprobación editorial.** Guion: [STORY_02_PROPOSAL.md](STORY_02_PROPOSAL.md). Mapa: [STORY_02_BRANCH_MAP.md](STORY_02_BRANCH_MAP.md).

## Abrir y jugar

```bash
npm install
npm run dev
```

Después, abrir en el navegador:

- Índice de historias de desarrollo: http://127.0.0.1:5173/dev
- Jugar «El libro de trenes»: http://127.0.0.1:5173/dev/libro-de-trenes/cuento

Los tres finales:

| Camino | Cómo llegar | Final |
|---|---|---|
| A | Decisión 1: «Enseñarle el libro a Lía» | «Mirar los trenes juntos» |
| B1 | Decisión 1: «Seguir leyendo» → decisión 2: «Decirle: “Ahora no. Luego sí”» | «Ahora no, luego sí» |
| B2 | Decisión 1: «Seguir leyendo» → decisión 2: «Seguir sin decir nada» → Nubi → «Seguir con mi elección» | «Cada uno con su libro» |

En el camino B2, Nubi pregunta «¿Quieres probar otra forma?»: puede tocar la otra tarjeta, seguir con su elección, volver atrás o terminar. En cada final, «Explorar otro camino» vuelve a una decisión ya tomada.

## Qué es provisional

Las ilustraciones que no existen todavía son **marcadores**: tienen un borde discontinuo y la etiqueta «PROVISIONAL · sin ilustración definitiva». Son las 7 del inventario:

`lt-cover`, `lt-opt-ensenar`, `lt-juntos`, `lt-espera`, `lt-opt-luego`, `lt-luego`, `lt-con-aya`.

Las demás ilustraciones son las existentes del proyecto, sin cambios.

## Garantías técnicas

- Los recursos y la historia solo se cargan en desarrollo (`import.meta.env.DEV`, importación diferida). El paquete de producción no contiene el texto del cuento ni sus ids (comprobado con `npm run build`).
- `/historias` no lista el cuento (prueba `libro-trenes.mjs`).
- La validación sigue en «borrador».

## Pruebas

```bash
npm run check                                   # TypeScript, 125 tests, build
NUBI_BROWSER_TOOLS=… CHROMIUM_PATH=… node tests/browser/libro-trenes.mjs
```

La prueba recorre los tres finales en 390×844 y 1440×900, con teclado, axe y consola.
