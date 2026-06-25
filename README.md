# Atlas de Ecuaciones Famosas

Proyecto web estático para GitHub Pages orientado a divulgación científica visual.

## Estado actual

Versión **v1.8**: anchuras medidas y ficha con pestañas.

Cambios principales:

- Tarjetas enteras clicables.
- Eliminado el botón interno `Abrir ficha`.
- Año, nivel educativo y área ocultos en la vista principal.
- Año, nivel educativo y área conservados dentro de la ficha ampliada.
- Tarjetas principales reducidas a nombre y fórmula.
- Fórmula sin cajetín interno.
- Eliminados borde de acento, punto decorativo y marcas de color visibles.
- Anchura de tarjeta calculada por niveles de fórmula y ajustada después con medición real de MathJax.
- Mosaico dinámico con cuadrícula densa: las tarjetas altas ocupan más filas y las demás rellenan huecos.
- Título siempre situado arriba en tarjetas de varias líneas.
- Soporte para fórmulas de varias líneas mediante arrays de LaTeX.
- Corregido el escapado LaTeX de las ecuaciones adicionales con `String.raw`.
- Añadido `advanced-equations.js` con 30 fórmulas nuevas de matemáticas, física, electricidad, cuántica, información e IA.
- Añadido `complete-equations.js` para reemplazar entradas simplificadas por versiones más completas sin duplicarlas.
- Añadido `final-corrections.js` para correcciones finales de LaTeX sin reescribir catálogos completos.
- Corregido el Teorema de Gauss para evitar comandos LaTeX no soportados visualmente.
- Rediseñada la ficha ampliada con pestañas internas: Fórmula, Variables, Contexto, Usos y Simulación.
- La simulación se carga solo al abrir su pestaña.
- Fórmulas base ampliadas: Newton, Euler, Fourier, Boltzmann, Planck, Einstein, Schrödinger, Dirac y Navier-Stokes.
- Entradas reemplazadas con versiones completas: Pitágoras, cuadrática, Bayes, normal, Bernoulli, gases ideales, Heisenberg, Lorentz, relatividad general y Friedmann.
- Filtro convertido en botón flotante con icono de embudo.
- Popover de filtro simplificado visualmente.
- Controles flotantes fijos durante el scroll.
- Fondo corregido a gradientes suaves sin cuadrícula.
- Añadido `favicon.svg` con símbolo matemático.
- Catálogo ampliado a 60 ecuaciones finales, aplicando reemplazos por `id`.

## Estructura

```text
.
├── favicon.svg
├── index.html
├── data/
│   ├── advanced-equations.js
│   ├── complete-equations.js
│   ├── equations.js
│   ├── extra-equations.js
│   └── final-corrections.js
├── scripts/
│   ├── filtering.js
│   ├── main.js
│   ├── render.js
│   ├── simulations.js
│   ├── state.js
│   ├── theme.js
│   └── utils.js
├── styles/
│   ├── base.css
│   ├── card-refresh.css
│   ├── components.css
│   ├── layout.css
│   ├── no-header-label.css
│   ├── responsive.css
│   ├── responsive-refresh.css
│   ├── tokens.css
│   ├── tool-controls.css
│   └── visual-refresh.css
└── .nojekyll
```

## Ecuaciones incluidas

El catálogo final contiene 60 entradas, mezclando matemáticas, trigonometría, electricidad, circuitos, física clásica, relatividad, cuántica, termodinámica, fluidos, estadística, biología matemática, bioquímica, información, telecomunicaciones, finanzas cuantitativas e inteligencia artificial.

## Cómo añadir, completar o corregir una ecuación

Añade un objeto nuevo en `data/equations.js`, `data/extra-equations.js` o `data/advanced-equations.js`.

Para sustituir una entrada existente por una versión más completa sin duplicarla, añade un objeto con el mismo `id` en `data/complete-equations.js`.

Para aplicar una corrección final puntual, añade un objeto con el mismo `id` en `data/final-corrections.js`.

Las propiedades principales son:

- `id`
- `name`
- `author`
- `year`
- `field`
- `level`
- `color`
- `formula`
- `summary`
- `meaning`
- `variables`
- `history`
- `uses`
- `derivation`
- `simulation`

`formula` puede ser una cadena LaTeX simple o un array de cadenas LaTeX cuando la ecuación se deba mostrar en varias líneas.

Las simulaciones disponibles inicialmente son: `gravity`, `complex`, `wave`, `field`, `particles`, `spectrum`, `energy`, `quantum`, `spinor` y `flow`.
