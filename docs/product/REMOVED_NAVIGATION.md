# Navegación retirada · Fase 19

Rama: `feat/claude-social-stories-v1` (desde `review/phase-18-ux-qa`, `9f7d969`). Informe general: [PHASE_19_SIMPLIFICATION_REPORT.md](PHASE_19_SIMPLIFICATION_REPORT.md).

## En pocas palabras

Antes, NUBI tenía **siete destinos**: Mi mundo, Historias, Recreaciones, Mis emociones, Mis herramientas, Espacio familiar y Ajustes. Había cuatro pestañas abajo y dos botones arriba.

Ahora NUBI tiene **dos funciones**: **Descubrir un cuento** (para el niño o la niña) y **Para familias y docentes** (una guía para acompañar ese mismo cuento). **Ajustes** sigue existiendo como utilidad. Ya no hay pestañas.

Nada se ha borrado: las ilustraciones, los datos y el código de las secciones retiradas se conservan. Lo que cambia es que ya no son lugares a los que se va por separado.

## Qué ha pasado con cada sección

| Sección antigua | Dirección | Qué hace ahora | Qué se conserva |
|---|---|---|---|
| **Mi mundo** | `/mundo`, `/mundo/:lugar` | Su función, elegir una historia, la cumple **Descubrir un cuento** | Las 6 ilustraciones de lugares (archivos, registro y comprobación de hash en `art-batch-6`). Hoy ninguna pantalla las muestra |
| **Historias** | `/historias` | Pasa a ser **Descubrir un cuento**, en la misma dirección | Todo |
| **Recreaciones** | `/recreaciones`, `/recreaciones/:historia/:id` | Las decisiones se exploran dentro del cuento. Se pueden probar todas y volver a elegir | Los datos `story.recreations`. Un enlace antiguo a una recreación lleva a **la escena de la decisión** de su cuento |
| **Mis emociones** | `/emociones` | Las emociones aparecen dentro del cuento, en su pregunta opcional, con las ilustraciones de Nubi | Las 9 ilustraciones de emoción. El cuento piloto usa 5 (sorpresa, curiosidad, inseguridad, frustración, calma); alegría, tristeza, enfado y cansancio se conservan para futuras historias |
| **Mis herramientas** | `/herramientas`, `/herramientas/:id` | Los apoyos aparecen **dentro de la consecuencia** a la que se refieren («Apoyos que podrían ayudar») y en la guía adulta. La pregunta del cuento «¿Cuáles podrían ayudarte…?» sigue igual | Las 7 herramientas: textos, tarjetas, consejos para familias e ilustraciones |
| **Espacio familiar** | `/familias` | Pasa a ser **Para familias y docentes** (`/acompanar`): una guía por cuento, sin panel | Todo el texto de `familyGuide`. El borrado de datos pasa a **Ajustes** |
| **Ajustes** | `/ajustes` | Igual, más «Datos de este dispositivo» | Todas las preferencias |

## Compatibilidad de las direcciones antiguas

Una dirección antigua **no redirige sola**: así nadie aparece de golpe en otro sitio. Se abre una página corta que dice qué ha cambiado y ofrece un botón al destino nuevo:

- Título «NUBI ha cambiado», con el nombre de la sección antigua encima.
- Una o dos frases sobre dónde está ahora lo que se buscaba.
- Un botón principal (normalmente «Descubrir un cuento»), un segundo destino si hace falta («Para familias y docentes») y «Ir al inicio».

| Dirección antigua | Botón principal |
|---|---|
| `/mundo`, `/mundo/colegio`… | Descubrir un cuento |
| `/recreaciones` | Descubrir un cuento |
| `/recreaciones/una-manana-diferente/cuando-cambia-el-plan` | Ir a las decisiones de «Una mañana diferente» (`…/cuento?escena=posibilidades`) |
| `/emociones` | Descubrir un cuento |
| `/herramientas`, `/herramientas/descansar`… | Descubrir un cuento (+ Para familias y docentes) |
| `/familias` | Para familias y docentes |
| `/familias?historia=una-manana-diferente` | Guía de «Una mañana diferente» |
| Cualquier otra dirección inexistente | «Este camino no existe» → Ir al inicio |

Las direcciones de los cuentos **no cambian** (`/historias/:id`, `/historias/:id/cuento`, `/historias/:id/comic`, `?escena=`, `?continuar=1`). Los enlaces guardados a un cuento siguen funcionando igual.

## Progreso y datos guardados

- **No se ha cambiado ningún formato de almacenamiento.** Las partidas (`nubi.v1.run.<cuento>.<formato>`), los ajustes (`nubi.v1.settings`) y el registro local (`nubi.v1.progress`) se leen igual que antes.
- **Las partidas guardadas siguen sirviendo**: el motor, las escenas y los pasos son los mismos, así que la posición guardada apunta al mismo sitio. «Seguir donde lo dejaste» aparece en el formato correspondiente (comprobado en `tests/browser/journeys.mjs`).
- **Datos que ya no se muestran**: herramientas marcadas «la he probado», herramientas elegidas en los cuentos y opciones exploradas en Recreaciones. **No se borran**: siguen en el navegador hasta que alguien use «Borrar el progreso» en Ajustes. No se muestran a las personas adultas, porque la guía no es un panel de seguimiento.

## Código que sale de la navegación (sin borrar)

Las pantallas retiradas se movieron a `src/screens/legacy/` con un comentario en la cabecera. No tienen ruta y no entran en el paquete final (Vite solo incluye lo que se importa):

- `WorldScreen.tsx` (Mi mundo y lugares)
- `RecreationsScreen.tsx`
- `EmotionsScreen.tsx`
- `ToolsScreen.tsx` (catálogo y ficha de herramienta)
- `FamilyScreen.tsx` (espacio familiar con puerta numérica y panel)

Siguen compilando con `tsc`. Si en el futuro no se reutilizan dentro de los cuentos, se pueden borrar en otra fase con autorización.

## La puerta numérica de adultos

El Espacio familiar pedía pulsar un número escrito con letras («Pulsa el número veintisiete»). Era una **barrera de demostración**, no una protección real: cualquiera podía pasarla, y podía parecer seguridad sin serlo. **Se ha retirado.** En su lugar, la guía dice con claridad que es para personas adultas, que no muestra las respuestas del niño o la niña y que NUBI no tiene cuentas ni envía datos. No se ha añadido autenticación: no hace falta, porque la guía no contiene datos del menor.
