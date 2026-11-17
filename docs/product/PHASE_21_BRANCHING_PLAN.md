# Plan técnico · Historias ramificadas (fase 21)

Estado: **propuesta**, sin implementar. No se ha creado ninguna escena, emoción ni desenlace nuevo. «Una mañana diferente» sigue igual.

## 1. Objetivo

Que una historia pueda recorrerse como un árbol:

```
SITUACIÓN → EMOCIÓN (opcional) → DECISIÓN ─┬─ opción A → CONSECUENCIA A → NUEVA DECISIÓN … → FINAL A1 / A2
                                           └─ opción B → CONSECUENCIA B → FINAL B
```

Requisitos:

- **Dos decisiones habituales por nodo.** No es un límite técnico: el validador avisará si hay más.
- **Varios finales posibles.**
- **Explorar otro camino** en cualquier decisión ya tomada, sin perder lo explorado.
- **No perder progreso ni contenido**: las partidas guardadas y las historias actuales siguen funcionando sin tocarlas.

## 2. Qué existe hoy (y sirve)

| Pieza | Hoy | Aprovechable |
|---|---|---|
| `Scene.next` | Escena siguiente fija | Sí: sigue valiendo para tramos lineales |
| `ChoiceStep.next` | **Una** escena de consecuencias para todas las opciones | Se mantiene como valor por defecto |
| `ConsequenceStep` | Muestra la consecuencia de la opción elegida, con rutas «otra decisión» / «seguir» | Sí, para consecuencias cortas dentro de un nodo |
| `RunState` | `position`, `history`, `responses`, `choices`, `explored`, `visitedScenes`, `completed` | Sí. Se amplía sin romper |
| `restoreRun` | Descarta partidas con escenas inexistentes | Sí. Se amplía con valores por defecto |
| `moments.ts` (fase 19) | Momentos deducidos de la estructura | Se generaliza por tipo de escena |

Hoy, las seis opciones del piloto llevan a la **misma** escena de consecuencias (`consecuencias`), que muestra la de la opción elegida. Después, todas continúan por el mismo tramo (`estrategias` → `cierre`). Es un árbol con **un solo** nodo de decisión y un tronco común.

## 3. Cambios en el modelo (`src/engine/types.ts`), todos opcionales

```ts
interface ChoiceOption {
  // …campos actuales…
  /** Escena a la que lleva ESTA opción. Si falta, se usa `ChoiceStep.next` (comportamiento actual). */
  next?: SceneId;
}

interface Scene {
  // …campos actuales…
  /** Papel narrativo; si falta, se deduce como hoy (moments.ts). */
  role?: 'situacion' | 'decision' | 'consecuencia' | 'final';
  /** Si es un final: identificador y nombre corto para el resumen («Teo pide ver el plan»). */
  ending?: { id: string; title: string };
}

interface Story {
  // …campos actuales…
  /** 1 = lineal con una decisión (actual). 2 = ramificada. Por defecto, 1. */
  engineVersion?: 1 | 2;
}
```

No se renombra ni se elimina ningún campo. Una historia de la versión 1 es válida en la versión 2 sin cambios.

## 4. Estado de partida (`RunState`), ampliado sin romper

```ts
interface RunState {
  // …campos actuales…
  /** Camino seguido: decisiones en orden. Permite «volver a esta decisión» y deshacer lo que vino después. */
  path?: { choiceStepId: StepId; optionId: string }[];
  /** Finales alcanzados alguna vez en esta partida (para el resumen: «Has descubierto 2 finales»). */
  endingsSeen?: string[];
}
```

- `restoreRun` rellena `path: []` y `endingsSeen: []` cuando faltan. Una partida guardada con la versión actual se reanuda en el mismo punto.
- La clave de almacenamiento no cambia (`nubi.v1.run.<cuento>.<formato>`). Si en el futuro un cambio no pudiera ser aditivo, se añadiría `runVersion` y una migración probada, nunca un borrado silencioso.

## 5. Motor (`storyEngine.ts`)

| Acción | Cambio |
|---|---|
| `next` en una decisión | Ir a `option.next ?? step.next` y añadir `{choiceStepId, optionId}` a `path` |
| `choose` | Igual que hoy (marca `choices` y `explored`) |
| **Nueva** `revisit` `{ choiceStepId }` | «Explorar otro camino»: vuelve a esa decisión y recorta `path` desde ese punto. Conserva `explored`, `responses` y `endingsSeen` |
| Llegar a una escena con `ending` | Añadir `ending.id` a `endingsSeen`; `completed = true` al terminar su último paso |
| `prev` | Igual (pila `history`) |
| `isAtEnd` | Verdadero en el último paso de una escena final, o en el resumen como hoy |

`canAdvance` no cambia: una decisión pide elegir, nada más. Ningún final es «el bueno»: el motor no ordena ni puntúa finales.

## 6. Validador (`validate.ts`)

Comprobaciones nuevas para `engineVersion: 2`:

1. Todas las escenas son alcanzables desde la primera.
2. Todo camino termina en una escena con `ending` (o en un resumen).
3. No hay ciclos, salvo las rutas explícitas de «otra decisión», que vuelven a una decisión anterior.
4. **Aviso** (no error) si una decisión tiene más de dos opciones. El piloto, con seis, sigue siendo válido.
5. Cada `option.next` existe y su escena de destino no es la misma decisión.

## 7. Presentación

- **Momentos** (`moments.ts`): se calculan por `scene.role` si existe; si no, como hoy. En un árbol, la cabecera muestra «Qué está pasando», «¿Qué podría hacer…?» o «Qué podría pasar» según el papel de la escena actual, no por posición.
- **Decisión de dos opciones**: dos tarjetas grandes, una junto a otra en tableta y apiladas en móvil, con el mismo tamaño y aspecto.
- **Final**: la última escena de un final ofrece «Explorar otro camino» (lista de las decisiones tomadas en `path`, con su ilustración), «Leer otra vez» y «Elegir otro cuento».
- **Índice «Escenas»**: muestra el camino recorrido; las ramas no visitadas aparecen como «por descubrir», sin bloquear el acceso.
- **Resumen**: «Caminos que exploré» (de `explored`) y «Finales que descubrí» (de `endingsSeen`), sin porcentajes ni recuentos de «faltan».

## 8. Progreso y familias

- `StoryProgress.endingsSeen?` (opcional), solo en el dispositivo.
- La guía para familias y docentes **no** muestra qué caminos ha tomado el niño o la niña. La guía describe la estructura del cuento («Hay dos decisiones y tres finales posibles»), no el recorrido personal.

## 9. «Una mañana diferente»

- Se queda en la versión 1: una decisión, seis opciones y un tronco común. **No se implementan nuevos desenlaces.**
- Convertir sus seis opciones en una secuencia de decisiones de dos opciones **cambiaría el contenido pedagógico y la causalidad de la historia**. Requiere guion nuevo, ilustraciones y aprobación editorial. Este plan solo prepara el motor para que esa versión (u otra historia) sea posible.

## 10. Orden de implementación propuesto

1. Tipos opcionales + validador (sin cambio de comportamiento). Tests: las historias actuales validan igual.
2. `option.next` + `path` en el motor, y `restoreRun` con valores por defecto. Tests: partidas antiguas guardadas → misma posición; una historia de prueba (solo en tests, no publicada) con dos decisiones y tres finales.
3. `revisit`, `endingsSeen` y `isAtEnd` por final. Tests de motor.
4. Presentación: momentos por `role`, tarjetas de dos opciones, pantalla de final y resumen.
5. Pruebas de navegador: `journeys.mjs` ampliado con una historia de prueba ramificada (servida solo en desarrollo) y las suites actuales sin cambios para el piloto.
6. Contenido nuevo, solo con guion e ilustraciones aprobados.

## 11. Riesgos

- **Contenido duplicado entre ramas**: un tronco común (como `estrategias` → `cierre`) puede reutilizarse con `Scene.next`.
- **Cómic por rama**: cada escena conserva su `comic?`. Una rama sin cómic usa los pasos del cuento, como hoy.
- **Precarga**: `upcomingImages` debe mirar las escenas de **todas** las opciones del nodo actual, como ya hace con las consecuencias.
- **Comprensión**: más finales pueden aumentar la carga. Se recomienda probarlo con niños y niñas antes de pasar de dos a más finales por historia.
