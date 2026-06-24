# Atlas de Ecuaciones Famosas

Proyecto web estático para GitHub Pages orientado a divulgación científica visual.

## Estado actual

Versión **v1.1**: limpieza visual inicial.

Cambios principales:

- Eliminada la cabecera superior.
- Eliminado el menú hamburguesa.
- Eliminado el panel lateral de búsqueda, filtros y contadores.
- Eliminado el botón de reiniciar vista.
- Añadida pantalla de entrada temporal tipo splash screen.
- Vista principal centrada en tarjetas de ecuaciones.
- Conservado el selector de ordenación.
- Ocultado el nivel educativo en las tarjetas y en la lectura rápida.
- Añadido sistema de tema `Auto`, `Día`, `Tarde` y `Noche`.

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
│   ├── components.css
│   ├── layout.css
│   ├── responsive.css
│   ├── responsive-refresh.css
│   ├── tokens.css
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
