# fix: endurecer recuperación, narración y accesibilidad del reproductor

Base: `feat/claude-foundation` · Head: `feat/codex-quality`

Una partida incompleta podía dejar NUBI en blanco al continuar; detener animaciones podía ocultar texto nuevo y las decisiones perdían el foco al mostrar consecuencias. Se valida la restauración, se desactivan correctamente las animaciones y se lleva el foco al contenido. Se corrigen URLs malformadas, contraste de personajes, aviso de vídeo móvil y objetivos táctiles. La narración requiere activación en cada apertura, solo acepta voces locales españolas y ofrece texto ante errores.

Se conserva la implementación y la identidad de Claude, sin historias ni dependencias nuevas. Se añade aviso explícito de que la puerta familiar no es autenticación segura.

Validación: `npm run check` (36 tests, tipos y build), Chromium en 390/820/1180, seis alternativas en cuento/cómic, persistencia y borrado, teclado, movimiento, narración simulada y axe. Catálogo de 72 assets reproducible. Evidencias, límites y siguientes pasos en CODEX_AUDIT.md, TEST_RESULTS.md y NEXT_STEPS.md. Faltan lectores de pantalla/dispositivos reales y medios finales; no se afirma certificación WCAG ni validación pedagógica.

No fusionar sin autorización.
