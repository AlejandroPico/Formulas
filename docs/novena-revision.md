# Novena revisión · 2 de octubre de 2026

El último lote completa 96 fichas pendientes, con 384 misiones y tres vistas por laboratorio. Se conservan la fecha de creación original y las revisiones anteriores de Hamiltoniano y regresión logística. El inventario alcanza 282 fórmulas revisadas.

| Familia | Fichas | Ejemplos y diferencias esenciales |
| :-- | --: | :-- |
| Cuántica | 24 | Estados normalizados, densidades radiales, operadores, evolución, medición, incertidumbre y fidelidad cuadrada. Bloch permite giro 3D. El corte de Fock conserva corrección de borde; Dirac se reduce a 1+1. |
| Cosmología | 5 | Estado, Friedmann, densidad crítica, redshift y Hubble. Recesión y velocidad local se distinguen; expansión futura integra desde a=1 y respeta el dominio. |
| Vida, química y electrónica | 15 | RK4 en epidemias y Hodgkin–Huxley, poblaciones, farmacocinética, GHK, ondas Fisher, Born–Haber, actividad, diodo y regiones MOSFET. |
| Información y estadística | 13 | Verosimilitud, intervalos, transformada Z, capacidad, entropías, divergencias, perplejidad y TF-IDF. Bases de logaritmos, soporte y región de convergencia explícitos. |
| Economía y finanzas | 14 | Producción 3D, consumo, bonos, VAN/TIR, Kelly, Solow, CAPM, Sharpe, paridad, opciones y VaR. Ejemplos hipotéticos, períodos y convenciones declarados. |
| Algoritmos | 16 | Lloyd y DBSCAN reales, PageRank con nodos sin salidas, objetivos TD, REINFORCE, optimizadores, retropropagación, pérdidas, kernel y margen. |
| Redes y transformers | 9 | Normalización por lote y muestra, GELU, atención con máscara, cabezas proyectadas, posición, RoPE y PPO firmado. Se muestran operaciones de ejemplos reducidos. |

Cada ficha revisa fórmula, significado, historia, derivación, usos, ficha, aprendizaje, unidades y simulación, además de pestañas adicionales que ya existían. La historia enlaza material científico de referencia. Los metadatos usan disciplinas y niveles canónicos y etiquetas temáticas, sin mezclar estado de revisión con contenido.

El motor compartido mantiene reintentos, pistas, respuesta numérica, ajuste de un objetivo y interpretación. Las escenas 3D admiten ratón, tacto y teclado. Los relojes físicos se pausan al ocultar la página y los módulos limpian listeners y animación al salir.

Se corrigió el escape del LaTeX al insertarlo en HTML: el signo `<` ya no recorta una condición, ni `&` altera una matriz. La comprobación recorre expresiones completas y rechaza errores y comandos rojos. Las zonas de símbolos estrechos se centran sobre el glifo; índices específicos admiten claves por base. Las tablas de notación excluyen símbolos ajenos a la ficha.

## Comprobaciones reproducibles

- `node tools/check-atlas.mjs`: catálogo, creación, taxonomía, contenido y modelos, incluidos 27.311 contrastes numéricos del último lote.
- `node tools/check-studio-scenes.mjs`: 4.404 escenas en escritorio y móvil con controles en sus extremos, coordenadas finitas, etiquetas válidas y geometría para teclado.
- `node tools/check-<familia>-browser.mjs`: las 96 fichas y 384 misiones, pestañas, símbolos, controles, cámaras, escritorio, móvil y limpieza.
- `node tools/check-studio-render.mjs`: 4.744 zonas de símbolo, hover de glifos estrechos, condiciones con `<`, funciones por tramos, matrices y temas Cuaderno, Colegio y Noche.
- `node tools/check-continuum-browser.mjs hamiltonian-operator logistic-regression-sigmoid-function`: las dos entradas previamente revisadas que también aparecían en la lista.
- `node tools/check-browser.mjs`: búsqueda, carga diferida, inventario, 282 módulos y todas las expresiones LaTeX.
- `node tools/check-learning-offline.mjs`: caché versión 10, recarga y laboratorios consultados sin conexión, incluidos ejemplos de las siete familias nuevas.

Las pruebas numéricas y de interacción contrastan estos experimentos educativos dentro de los dominios declarados. Los modelos reducidos no se presentan como resolución general de los problemas científicos correspondientes.
