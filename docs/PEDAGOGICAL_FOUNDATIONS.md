# Fundamentos pedagógicos

Este documento relaciona cada fuente de referencia con decisiones concretas de NUBI y separa con claridad:

- ✅ **Fundamento verificado**: lo que se ha comprobado en la fuente indicada (consultada el 16/11/2026).
- 🟡 **Propuesta propia**: decisión de NUBI inspirada en la fuente, **pendiente de validación** profesional y con personas autistas.

NUBI **no reproduce** materiales, personajes, actividades, plantillas ni metodologías registradas de estas fuentes. Todo el contenido es original. Los datos estructurados equivalentes están en `src/content/references.ts` y en `story.references` de cada historia.

---

## Rafael Bisquerra — Educación emocional

Fuente: <https://www.rafaelbisquerra.com/educacion-emocional/>

✅ **Verificado:** la educación emocional se presenta como innovación educativa que responde a necesidades sociales no atendidas por las materias académicas, orientada a desarrollar **competencias emocionales** en cinco bloques: conciencia emocional, regulación emocional, autonomía emocional (autogestión), competencia social (inteligencia interpersonal) y competencias para la vida y el bienestar. *(La página consultada nombra los bloques; las subcompetencias no se han verificado en esta revisión.)*

| Decisión en NUBI | Tipo |
|---|---|
| Cada objetivo de historia se etiqueta con un bloque (`Objective.area`) | ✅ estructura del marco |
| Orden de escenas: conciencia (escena 2) → autonomía (3) → regulación y social (4-6) | 🟡 secuencia propia |
| "Mis emociones" como espacio para nombrar emociones y sus manifestaciones | ✅ conciencia emocional |

## Begoña Ibarrola — Cuentos para sentir

Fuente: <https://www.begoibarrola.com/cuentos>

✅ **Verificado:** colecciones de cuentos breves centrados, cada uno, en una emoción o valor, con materiales de acompañamiento para familias y docentes.

| Decisión en NUBI | Tipo |
|---|---|
| Una historia = una situación cotidiana con pocas emociones nombradas | ✅ formato |
| Cada historia lleva guía familiar (antes/durante/después, práctica cotidiana) | ✅ acompañamiento adulto |
| Personajes, tramas y textos 100 % originales | — (límite) |

## Carol Gray — Social Stories™

Fuente: <https://carolgraysocialstories.com/social-stories/what-is-a-social-story/>

✅ **Verificado:** una Social Story describe con precisión un tema relevante para la persona siguiendo **diez criterios definidos**; su enfoque es descriptivo, significativo y respetuoso, garantiza seguridad física, social y emocional, y tiene una cualidad paciente y no presuntuosa. El término es marca y existe una única definición; la autora distingue sus historias de guiones sociales o listas de habilidades.

| Decisión en NUBI | Tipo |
|---|---|
| Narrador descriptivo y paciente, sin órdenes ni juicios (`CONTENT_STANDARD` §2) | ✅ tono |
| Se describe lo que otras personas pueden pensar o sentir antes de proponer opciones | 🟡 inspirado, no verificado como criterio concreto |
| **Las historias de NUBI no son Social Stories™** y no afirman cumplir los diez criterios; no usamos el término | — (límite) |

## The Zones of Regulation® (Leah Kuypers)

Fuente: <https://zonesofregulation.com/curriculum/>

✅ **Verificado:** currículo de regulación emocional para mayores de 4 años, presentado como compatible con diversos neurotipos y preferencias de comunicación; incluye estrategias de comunicación para la expresión emocional y la **corregulación**, y busca un lenguaje común; la regulación se trata como habilidades que se enseñan y practican. Marca registrada con licencia propia.

| Decisión en NUBI | Tipo |
|---|---|
| "Mis herramientas": estrategias concretas, practicables, con varias formas de hacerlas | ✅ regulación como habilidad |
| Corregulación visible (Teo busca a Pilar; Andrés dibuja el plan) | ✅ |
| **No** usamos zonas de colores, sus nombres ni su estructura | — (límite) |

## Kari Dunn Buron y Mitzi Curtis — The Incredible 5-Point Scale

Fuente: obra publicada (AAPC). Verificación **parcial** a través de una ficha de aula de terceros; falta consultar la obra original.

✅ **Verificado (parcial):** escala personalizada de 1 a 5 para reconocer niveles de una emoción o conducta, asociando cada nivel a cómo se ve, cómo se siente y qué se puede intentar.

| Decisión en NUBI | Tipo |
|---|---|
| Intensidad **opcional** de tres niveles ("un poco / bastante / mucho"), sin números ni colores, en `feelings` | 🟡 propuesta: validar si 3 niveles bastan y si conviene personalizar |
| Cada emoción enlaza a herramientas que pueden ayudar | 🟡 inspirado en "qué puedo intentar" |

## Michelle Garcia Winner y Pamela Crooke — Social Situation Mapping

Fuente: <https://www.socialthinking.com/products/social-situation-mapping> (Social Thinking®). Libro de 2023, antes titulado *Social Behavior Mapping* (2007).

✅ **Verificado:** herramienta para usar la observación de la situación y decidir qué hacer o decir; relaciona acciones, cómo pueden sentirse otras personas, consecuencias y cómo se siente uno mismo.

| Decisión en NUBI | Tipo |
|---|---|
| Cada consecuencia muestra: lo que puede pasar → cómo pueden sentirse otros → cómo te puedes sentir tú → cuándo ayuda | ✅ estructura acción-consecuencia |
| **No** usamos la dicotomía "esperado/inesperado" ni etiquetas de acierto | 🟡 decisión propia (afirmación de la neurodiversidad) |
| No reproducimos mapas, plantillas ni terminología de Social Thinking® | — (límite) |

## Afirmación de la neurodiversidad (principio transversal)

🟡 **Propuesta propia**, alineada con el encargo del proyecto, que requiere validación con personas autistas:

- Aceptar todas las formas de comunicación (Lía y su comunicador).
- Normalizar pedir ayuda y pedir tiempo.
- Respetar necesidades sensoriales (cascos, eco en la biblioteca).
- No penalizar autorregulación inocua (Teo mueve los dedos; nadie lo corrige).
- No exigir contacto visual (ilustraciones y guía familiar).
- No enseñar a ocultar emociones (Bruno dice "no me gusta este cambio" y se le escucha).
- Ofrecer varias opciones socialmente válidas.

---

## Preguntas abiertas para la validación del piloto

1. ¿Es comprensible para 6-7 años la escena 3 (lo que sabemos / lo que necesito saber)?
2. ¿La opción "salir sin avisar" y su alternativa resultan útiles o generan culpa?
3. ¿La escala de tres niveles es suficiente? ¿Debería poder omitirse por completo desde Ajustes?
4. ¿La voz del sistema es aceptable mientras no exista narración humana?
5. ¿El resumen personal debería poder imprimirse o compartirse con el colegio?
