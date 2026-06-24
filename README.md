# Atlas de Ecuaciones Famosas

Proyecto web estático para GitHub Pages orientado a divulgación científica visual.

## Estado actual

Versión **v1.2**: tarjetas mínimas y controles flotantes.

Cambios principales:

- Tarjetas enteras clicables.
- Eliminado el botón interno `Abrir ficha`.
- Año y nivel educativo ocultos en la vista principal.
- Año y nivel educativo conservados dentro de la ficha ampliada.
- Tarjetas principales simplificadas: área, nombre y fórmula.
- Fórmulas largas con tarjetas de mayor anchura.
- Filtro convertido en botón flotante con icono de embudo.
- Selector de ordenación movido al panel flotante de filtro.
- Controles flotantes fijos durante el scroll.
- Paleta visual reajustada hacia estética de herramienta científica.

## Estructura

```text
.
├── index.html
├── data/
│   └── equations.js
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

Newton, Euler, Fourier, Maxwell, Boltzmann, Planck, Einstein, Schrödinger, Dirac y Navier-Stokes.

## Cómo añadir una ecuación

Añade un objeto nuevo en `data/equations.js`. Las propiedades principales son:

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

Las simulaciones disponibles inicialmente son: `gravity`, `complex`, `wave`, `field`, `particles`, `spectrum`, `energy`, `quantum`, `spinor` y `flow`.
