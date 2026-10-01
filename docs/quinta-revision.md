# Quinta revisión

27 fichas completas, 108 misiones y tres modos por laboratorio. Cramer, continuidad local, Euler–Lagrange, Euler de fluidos, Bayes binario y multiclase, producto vectorial, Herón esférica, Laplace, tres fichas electrostáticas, interpolación, Parseval, convolución, advección, Ruffini, MSE, regresión, normal, integral de Gauss, TCL, tanh, Poisson, Fourier estacionario, Navier–Stokes incompresible y calor.

Las nueve pestañas tienen contenido propio. Los archivos adicionales de conducción estacionaria y tanh se revisan también. Símbolos, sombreros, complemento de eventos, índices y flujo q″ cuentan con explicaciones específicas. El registro se añade después de verificar el lote y conserva las fechas de creación e historiales anteriores.

## Geometría y modelos

Producto vectorial y triángulos esféricos usan geometría espacial giratoria. Potencial, Gauss, Poisson, vorticidad e historia térmica usan superficies giratorias que indican qué representan los ejes. Una altura de un campo sobre un plano no se presenta como una simulación física de tres dimensiones.

Cramer distingue sistema único, paralelo y coincidente. Bayes usa probabilidades normalizadas y evita condicionar evidencia imposible. L’Huilier usa radianes, lados menores y un triángulo convexo válido. La superficie del potencial excluye el núcleo y declara su recorte gráfico; la sonda conserva la ley puntual y detecta r=0.

Parseval especifica la normalización DFT y Fourier continua. Advección compara traslación exacta con upwind conservativo periódico y CFL≤1. El TCL calcula una binomial exacta y distingue densidad estandarizada de probabilidad discreta; sus hipótesis excluyen varianza infinita. MSE y regresión separan pérdida empírica, RMSE y varianza residual.

Poisson muestra una solución manufacturada exacta con fuente variable y borde cero. Fourier es estacionario. Calor suma dos modos con bordes fijos y tasas de decaimiento distintas. Taylor–Green es una solución exacta 2D periódica, con presión, divergencia y balance viscoso comprobables; no simula una singularidad 3D.

## Continuidad y taxonomía

`continuity-equation` conserva su revisión y ahora se llama «flujo estacionario entre secciones». `continuity-equation-fluid` se llama «conservación local de masa» y explica balance diferencial, acumulación y divergencia. Se mantienen ambos identificadores y sus fechas.

`taxonomy.js` y `tag-vocabulary.js` comparten nombres canónicos entre el generador y la carga del navegador. Se unifican variantes de acentos, traducciones conocidas y niveles con barras. Se conservan disciplinas distintas aunque compartan conceptos. Los metadatos escritos tienen prioridad sobre inferencias genéricas: no se inyectan niveles como etiquetas ni se rebaja Universidad avanzada. Normalizar metadatos de fichas pendientes no las marca como revisadas científicamente.

Cobertura añade las etiquetas de contenido junto a disciplina y nivel. Los totales de etiquetas pueden superar el número de fichas porque hay varias por fórmula. Revisión y versión del simulador se consultan en Revisiones.

## Estado de Navier–Stokes

Consultado el 1 de octubre de 2026: [OpenAI anunció el 8 de septiembre una demostración de ruptura forzada para C/D](https://openai.com/index/navier-stokes-solution/); la [página de Clay permanece activa](https://www.claymath.org/millennium/Navier-Stokes-Equation/). La historia distingue anuncio, estado oficial y ecuación. No se afirma adjudicación del premio ni se confunde el resultado con el ejemplo bidimensional.

## Comprobación

`check-horizon-labs.mjs` contrasta sistemas lineales, balances, acción por cuadratura, posteriores, ortogonalidad, exceso por ángulos, convergencia, gradiente eléctrico, interpolación cardinal, DFT, solape integrado, masa periódica, división, ecuaciones normales, área gaussiana, momentos binomiales y residuos de las EDP por diferencias independientes. `check-taxonomy.mjs` comprueba equivalencias, ausencia de variantes y todas las fechas originales.

`check-horizon-browser.mjs` revisa todas las pestañas descubiertas, símbolos, errores y aciertos, controles, cámaras con ratón/tacto/teclado, límites de dominio, escritorio, móvil, pausa y limpieza. `check-horizon-inputs.mjs` comprueba arrastres reales. Se ejecutan además los controles generales y la recarga sin conexión con caché 6.
