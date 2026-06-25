# Atlas de Ecuaciones Famosas

Proyecto web estático para GitHub Pages orientado a divulgación científica visual.

## Estado actual

Versión **v1.6**: mosaico dinámico, filtro simplificado y favicon.

Cambios principales:

- Tarjetas enteras clicables.
- Eliminado el botón interno `Abrir ficha`.
- Año, nivel educativo y área ocultos en la vista principal.
- Año, nivel educativo y área conservados dentro de la ficha ampliada.
- Tarjetas principales reducidas a nombre y fórmula.
- Fórmula sin cajetín interno.
- Eliminados borde de acento, punto decorativo y marcas de color visibles.
- Anchura de tarjeta calculada por niveles de fórmula, sin tarjetas a pantalla completa.
- Mosaico dinámico con cuadrícula densa: las tarjetas altas ocupan más filas y las demás rellenan huecos.
- Título siempre situado arriba en tarjetas de varias líneas.
- Soporte para fórmulas de varias líneas mediante arrays de LaTeX.
- Ecuaciones compuestas, como Maxwell, Cauchy-Riemann, Hamilton, Lotka-Volterra y relatividad general, se muestran apiladas verticalmente.
- Corregido el escapado LaTeX de las ecuaciones adicionales con `String.raw`.
- Filtro convertido en botón flotante con icono de embudo.
- Popover de filtro simplificado visualmente.
- Controles flotantes fijos durante el scroll.
- Fondo corregido a gradientes suaves sin cuadrícula.
- Añadido `favicon.svg` con símbolo matemático.
- Catálogo ampliado a 30 ecuaciones.

## Estructura

```text
.
├── favicon.svg
├── index.html
├── data/
│   ├── equations.js
│   └── extra-equations.js
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

El catálogo contiene 30 entradas, mezclando matemáticas, física clásica, relatividad, cuántica, termodinámica, fluidos, estadística, biología matemática, bioquímica y finanzas cuantitativas.

## Cómo añadir una ecuación

Añade un objeto nuevo en `data/equations.js` o `data/extra-equations.js`. Las propiedades principales son:

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
