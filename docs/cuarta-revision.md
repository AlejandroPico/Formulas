# Cuarta revisión de fórmulas

Esta tanda revisa veinte fichas completas, incluidos los archivos adicionales de interés compuesto, convección y vigas. Renueva fórmulas LaTeX, significados, historia con referencias, derivaciones, usos, ficha, aprendizaje, unidades y simulación. Los símbolos se explican mediante metadatos propios; atan2 distingue el nombre del operador de una potencia o factor dos.

## Laboratorios

Cada laboratorio incluye cuatro misiones con pistas, reintentos y resultado oculto, exploración libre y una tercera vista explicativa. Los controles funcionan con teclado; secantes, límites, coordenadas polares y fase compleja admiten arrastre. Las órbitas y la membrana se giran con ratón, tacto y flechas.

| Familia | Escenas y revisiones |
| :-- | :-- |
| Finanzas y coordenadas | Interés simple/compuesto/continuo, inflación separada, radar polar y círculo complejo de Euler. |
| Cálculo y análisis | Secantes con límites laterales, integración por partes firmada, Taylor con centro móvil, Maclaurin en cero y correcciones de Euler–Maclaurin. |
| Mecánica | Choques aislados con restitución, caída hasta el primer impacto, órbitas keplerianas, fuerza neta y ménsulas con dos cargas. |
| Fluidos y calor | Continuidad de masa, Bernoulli ideal, pérdidas y bomba en metros de carga, convección con constante de tiempo y criterio de Biot. |
| Circuitos y ondas | Carga/descarga RC con balance de energía, onda viajera/estacionaria y modos de una membrana rectangular en 3D. |

## Correcciones científicas

Bernoulli real suma términos en metros de carga, nunca una pérdida en metros directamente a una presión. El condensador distingue energía suministrada, almacenada y disipada. La continuidad conserva masa incluso con densidades diferentes. La gravedad orbital usa velocidades keplerianas y una estrella en el foco. La caída congela el estado inmediatamente anterior al impacto sin inventar un rebote. Las vigas convierten cm⁴ a m⁴ y separan fuerza extrema de carga por longitud.

Taylor y Maclaurin distinguen polinomio, serie infinita, dominio y resto; la derivabilidad infinita no garantiza analiticidad. Euler–Maclaurin conserva un resto y no garantiza precisión creciente al añadir indefinidamente términos. Las visualizaciones indican sus escalas y modelos idealizados.

## Interfaz y carga

Alt + clic en Filtros muestra Inventario y Superprompt. Inventario reúne las cuatro vistas técnicas existentes. Se elimina «Últimas primero» y su antiguo observador global; «Últimas introducidas» permanece en el filtro normal. Los textos y módulos nuevos siguen cargándose al abrir sus pestañas. La caché pasa a v5 y conserva el uso sin conexión de recursos visitados, incluida la membrana.

## Comprobaciones

`check-frontier-labs.mjs` contrasta 6481 casos matemáticos y los 80 retos. `check-frontier-browser.mjs` recorre todas las pestañas y símbolos, resuelve retos, prueba dominios, teclado, cámaras, tacto, móvil y limpieza. `check-frontier-inputs.mjs` usa arrastres reales de secante, límite, radar y fase. `check-browser.mjs` verifica carga progresiva, búsqueda, menú, registro y renderizado LaTeX de la colección. `check-learning-offline.mjs` prueba recarga y simuladores visitados sin red.

Las veinte entradas se añaden al historial solo tras completar esas comprobaciones. Se conservan las fechas de creación y las revisiones previas; una migración técnica no se considera revisión completa.
