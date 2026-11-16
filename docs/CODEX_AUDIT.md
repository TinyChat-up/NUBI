# Auditoría técnica de NUBI — 16/11/2026

Base: `feat/claude-foundation`, commit `447edf0`. Trabajo en `feat/codex-quality`, sin merge. El encargo describía main como inicialización; al inspeccionar, main ya contenía el merge de la implementación de Claude.

## Hallazgos y correcciones

| Prioridad | Evidencia / reproducción | Resultado |
|---|---|---|
| Alta | Guardar una partida con storyId y position pero sin history; abrir con `?continuar=1`: excepción al leer length y pantalla vacía | Validación del estado completo, formato, posiciones actuales/anteriores, elecciones y colecciones antes de restaurar. Partidas incompatibles empiezan de nuevo. |
| Alta | `.anim-paused` pausaba también entradas con opacity inicial 0 y retraso | Desactivar animaciones y transiciones muestra inmediatamente texto y viñetas; se conserva el desplazamiento sin animación. |
| Alta | Una preferencia persistida escuchar iniciaba voz al entrar. Sin voz disponible y con subtítulos desactivados, el texto podía quedar oculto | Cada apertura empieza en lectura; escuchar requiere pulsación. Error asíncrono o falta de voz muestra alternativa textual. Solo voces españolas declaradas locales. Eventos antiguos no cambian el estado de una reproducción nueva. |
| Media | El botón de una opción desaparece al mostrar consecuencias; foco termina en body | Región de contenido enfocable al cambiar de paso; flechas consumen su evento de navegación. |
| Media | Axe detectó contraste insuficiente en nombre de personaje sobre su color, incluido el crema de Nubi | Nombre oscuro sobre crema; color del personaje en borde. Se retiró también el color de personaje como color del nombre en cuento. |
| Media | Tarjeta de vídeo absoluta dentro de un póster 16:9 no ofrece altura suficiente en móvil | En móvil el aviso ocupa espacio en el flujo; alternativas cuento/cómic accesibles. Slider y capítulos futuros tienen objetivos de 48 px. |
| Media | `decodeURIComponent` lanza excepción con segmento malformado | El router devuelve no coincidencia y ofrece volver a Mi mundo. El servidor Vite rechaza esas URLs en acceso directo; regresión cliente probada con History API. |
| Baja | La puerta familiar solo se explicaba como no segura en código | Aviso explícito de demo sin autenticación segura. Enlace Ver con altura mínima 48 px. |

## Recorrido visual y funcional

Capturas actuales en `audit/`, por ancho (390, 820, 1180). Las capturas del reproductor muestran la zona desplazable visible; el contenido que excede esa zona se comprueba mediante DOM y desplazamiento. Se revisaron las hojas de capturas y las pantallas relevantes; no son una simulación de las ilustraciones definitivas.

1. Portada: correcta, jerarquía clara y sin reproducción automática. [Móvil](audit/390-01-inicio.png).
2. Ficha: correcta, formatos y siete escenas accesibles; cubierta provisional. [Tableta](audit/820-02-ficha.png).
3. Cuento y cómic: operativos; corregidos foco, movimiento y contraste. [Cómic móvil](audit/390-03-comic.png).
4. Emociones: multiselección, No lo sé e intensidad opcional funcionan y se recuperan. [Tableta](audit/820-04-cuento-emociones.png).
5. Decisiones y consecuencias: seis alternativas en ambos formatos, vuelta y avance sin bloqueo. [Móvil](audit/390-05-cuento-consecuencia.png).
6. Estrategias y resumen: selección sin obligación; resumen conserva emociones, intensidad y posibilidades. [Tableta](audit/1180-06-comic-resumen.png).
7. Vídeo: aviso honesto y alternativas funcionales; vídeo y sincronización real pendientes del material final. [Móvil](audit/390-07-video.png).
8. Espacio familiar: demo local, borrado con confirmación; sin puntuaciones ni diagnósticos. [Tableta](audit/820-08-familias.png).

## Contenido, privacidad y arquitectura

Se conserva la separación motor/contenido/UI. Sin nuevas historias, dependencias de aplicación, servicios externos ni cambios de identidad. El código y los recorridos no muestran envío de progreso ni analítica; las fuentes son locales. Las pruebas registran solicitudes y comprueban que no hay destinos externos durante el recorrido (no equivale a auditar el sistema operativo).

El piloto está `pendiente-validacion`. Las referencias distinguen Social Situation Mapping, la denominación anterior y la escala propia de tres niveles. Se aclara que NUBI no produce Social Stories oficiales y que la obra original de la escala de cinco puntos sigue sin consultarse. No se han revalidado fuentes bibliográficas externas ni cambiado textos pedagógicos. Las alternativas respetan pedir ayuda, tiempo, comunicación aumentativa y apoyos sensoriales; salir sin avisar incluye una alternativa sin culpa. La comprensibilidad y el posible efecto de culpa requieren revisión humana.

## Recursos y rendimiento

72 recursos registrados, todos pendientes, con IDs, rutas individuales, dimensiones y alt. `npm run assets:doc` reproduce exactamente el documento. Regresión nueva comprueba unicidad de IDs/rutas y existencia de archivos cuando se marquen listos. Las imágenes finales usan lazy loading y decoding async, con placeholder al fallar; no hay aún imágenes definitivas con las que medir carga real. Build inicial: JS ~404 kB / gzip ~121 kB; no justifica refactorizar la aplicación en esta fase. Repetir medición cuando lleguen las imágenes.

## Límites

Axe y Chromium no certifican WCAG 2.2 AA. Faltan lector de pantalla real, Safari/iOS y Android físicos, zoom de 200–400 %, voces reales y vídeo/subtítulos finales. No se ha escuchado audio humano ni certificado que cada voz del SO cumpla su declaración localService. Se prueban errores de voz con dobles de navegador. La revisión técnica no es validación clínica ni pedagógica.
