# NUBI — Project Brief

## Qué es

NUBI es un **mundo interactivo de historias** para niños y niñas de 6 a 12 años. Está especialmente adaptado al alumnado autista, pero abierto a cualquier niño o niña. No es una plataforma de fichas, cuestionarios ni deberes.

Nombre comercial provisional: **NUBI** · Eslogan: **«Un mundo de historias por descubrir»**.

## Qué pueden hacer los niños y las niñas

- Ver pequeñas películas educativas (formato preparado; primer vídeo en producción).
- Leer o escuchar cuentos ilustrados.
- Descubrir cómics viñeta a viñeta.
- Explorar situaciones sociales y elegir entre varias actuaciones posibles.
- Descubrir consecuencias posibles, sin juicios de bien o mal.
- Conocer emociones y necesidades.
- Practicar estrategias de autorregulación ("Mis herramientas").

## Para quién

| Usuario | Necesita | Cómo lo resuelve NUBI |
|---|---|---|
| Niño o niña (6-12) | Entender qué hacer sin instrucciones largas; previsibilidad; control del ritmo | Navegación visual de 4 secciones, botones grandes con texto, sin temporizadores, mapa de escenas |
| Niño o niña autista | Anticipación, entorno sensorial tranquilo, distintas formas de comunicación | Contenido descriptivo, sin sonidos inesperados, animaciones desactivables, opciones de lectura, comunicador en la historia |
| Familia | Saber qué se ha explorado y cómo acompañar | Espacio familiar: guía por historia, práctica cotidiana, sin evaluar |
| Docente (futuro) | Recursos para el aula | Misma guía; materiales imprimibles en preparación |

## Principios

1. **Historias, no ejercicios.** La experiencia se parece a un cuento, no a una plataforma administrativa.
2. **Varias respuestas válidas.** Las decisiones muestran consecuencias posibles; ninguna se marca como "la correcta".
3. **Respeto a la neurodiversidad.** Ver `AGENTS.md` §1.5.
4. **Sin IA, sin datos, sin evaluación.** Ver `AGENTS.md` §1.
5. **Una historia excelente antes que muchas incompletas.** Arquitectura preparada para crecer; contenido solo cuando esté a la altura.
6. **Honestidad sobre el estado.** Lo provisional se marca como provisional.

## Prioridad de dispositivos

1. Tableta (horizontal y vertical) · 2. Móvil · 3. Ordenador.

## Alcance de esta versión (v0.1)

**Incluido:** las 8 pantallas (portada, Mi mundo, historias, reproductor, cómic, recreaciones, herramientas, espacio familiar) + emociones y ajustes; episodio piloto completo jugable en cuento y cómic; reproductor de vídeo accesible con estado "en producción"; motor de historias basado en datos; placeholders vectoriales; encargo de ilustraciones; despliegue en Vercel.

**Fuera de alcance:** backend, cuentas, pagos, sincronización entre dispositivos, panel docente, vídeos e ilustraciones definitivas, narración grabada, otros idiomas.

## Riesgos y validaciones pendientes

| Riesgo | Mitigación prevista |
|---|---|
| Contenido no validado por profesionales ni por personas autistas | Revisión externa antes de uso comercial (estado `pendiente-validacion` en los datos) |
| Nivel de lectura alto para 6 años | Modo "textos cortos" + narración; validar con lectores reales |
| Voz del sistema de calidad variable | Sustituir por narración humana grabada (campo `narration`) |
| Puerta de adultos trivial | Aceptable en demo; revisar si se añaden datos reales |
| Términos de marcas registradas | No se usan para describir el contenido propio (ver fundamentos) |

## Próximos pasos sugeridos

1. Validación del piloto con familias, docentes de educación especial y personas autistas adultas.
2. Producción de ilustraciones según `docs/ASSET_REQUESTS.md`.
3. Narración humana y vídeo del piloto.
4. Materiales imprimibles (horario visual, tarjetas de herramientas, nota para el colegio).
5. Segunda historia (otro lugar de Mi mundo) para validar que el motor escala sin código nuevo.
