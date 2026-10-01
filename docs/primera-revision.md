# Primera revisión del atlas · 1 de octubre de 2026

El proyecto actual es estático: no utiliza SQLite ni necesita servidor de base de datos. Había 109 fórmulas registradas en los catálogos de archivos y 173 entradas adicionales aportadas por lotes de JavaScript. Se conservan las **282 entradas**, incluidos sus simuladores, después de la migración.

## Cambios aplicados

- Los lotes 7–32 dejan de ejecutarse al arrancar. Su contenido pasa a carpetas con metadatos, expresiones, pestañas y un módulo de simulación que importa el widget original cuando se necesita. Migrar estos widgets no los marca como revisados.
- Un catálogo generado reúne todos los metadatos y las expresiones. La búsqueda completa de las pestañas usa un segundo índice, solicitado al empezar a buscar.
- La carga deja de sustituir temporalmente `window.fetch`. El mosaico dibuja lotes de 24 y prepara más tarjetas al acercarse al final; buscar no depende de que una tarjeta esté dibujada.
- MathJax 3.2.2 se conserva como motor y se distribuye localmente. Se eliminan los temporizadores repetitivos de las capas antiguas de ajuste y tooltips; las anotaciones se actualizan tras representar las fórmulas y al redimensionar.
- Los simuladores se limpian al cambiar de pestaña, cerrar por botón o pulsar Escape; las importaciones que llegan tarde no montan una ficha ya cerrada. MathJax libera las expresiones retiradas de la interfaz.
- Menú con la silueta y medidas de Nucleidos v34: barra continua, separadores finos y esquinas rectas. Fichas y detalle comparten esas esquinas. Catálogo, cobertura y validador reciben una presentación más sobria.
- Nueva pestaña Revisiones: creación según Git, estado pendiente/revisada, fecha y número de revisión, versión del simulador e historial. Los datos viajan con el repositorio y aparecen en las exportaciones.
- Pitágoras: revisión de las nueve pestañas, definiciones por símbolo y por expresión, y juego de seis puentes con pistas, intentos, puntos, arrastre, teclado y animación de cruce. Incluye exploración y comparación de áreas.

## Hallazgos que requieren siguientes revisiones

| Hallazgo | Implicación |
| --- | --- |
| Dos pares comparten nombre: continuidad y geodésica | Comprobar si deben combinarse o distinguirse por alcance; se conserva el contenido. |
| Frenet–Serret y métrica riemanniana contienen texto provisional en sus expresiones | El validador avisa aunque MathJax pueda interpretar el texto como letras multiplicadas. |
| Algunas expresiones difieren entre catálogos antiguos y `formula.tex` | La carpeta es ahora la fuente; comparar casos y condiciones al revisar cada fórmula. |
| Muchos textos de historia, derivación, aprendizaje y unidades eran genéricos | Revisión científica y editorial pendiente en las 281 fórmulas restantes. |
| Numerosas hojas CSS y simuladores compartidos de distintas épocas | Consolidar gradualmente, verificando los temas y cada widget antes de retirar código. |

## Verificación

Las pruebas de inventario verifican identificadores, archivos declarados, procedencia de fechas y sincronización del índice. Las matemáticas de Pitágoras se comprueban con 144 combinaciones de catetos, inversión, escalado, distancia, entradas inválidas y tolerancia de las seis misiones.

Las pruebas de navegador comprueban búsqueda en el contenido, símbolos, las nueve pestañas, respuestas incorrectas y correctas, recorrido completo del juego, cierre con Escape, filtros de revisiones y pantalla móvil. Además importan los 282 módulos de simulación y procesan todas las expresiones con MathJax. Importar un módulo confirma que puede cargarse; no certifica científicamente ni prueba la interacción de los 281 simuladores pendientes.

Las capturas y el informe de cada ejecución quedan en `artifacts/` (excluido de Git). Los tiempos de ese informe corresponden al navegador de pruebas y un servidor local; no son una garantía para otros dispositivos o conexiones.

## Continuar

Revisa una fórmula completa, comprueba su simulador en escritorio y móvil, añade una entrada a `formulas/revisions.json` y regenera los índices. La primera revisión completa corresponde a Pitágoras. El resto sigue pendiente, aunque su estructura se haya migrado.
