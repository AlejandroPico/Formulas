# Atlas de Ecuaciones Famosas

Proyecto web estático para GitHub Pages orientado a divulgación científica visual.

## Estado actual

Versión **v2.9**: fichas pulidas para las fórmulas con simulador específico.

Cambios principales:

- Ampliadas las fichas de `Fórmula cuadrática`, `Ley de los senos`, `Ley de los cosenos`, `Ley de gravitación universal`, `Identidad de Euler` y `Ecuación de Bernoulli`.
- Cada una de esas fichas recibe ahora `summary`, `meaning`, `variables`, `history`, `uses`, `useDetails` y `derivation` desarrollados con estilo equivalente al trabajo realizado en Pitágoras.
- La pestaña `Significado` explica la interpretación conceptual de cada fórmula, no solo su uso mecánico.
- La pestaña `Derivación` incluye deducciones paso a paso adaptadas al nivel de cada fórmula.
- La pestaña `Usos` incorpora aplicaciones ampliadas por campo, con ejemplos concretos y lectura técnica.
- La ficha técnica queda reforzada porque los metadatos, variables, nivel, área, simulación y cobertura interna se alimentan de entradas más completas en `polished-equations.js`.
- Se mantienen los simuladores específicos ya integrados para Bernoulli, Newton, Euler, cuadrática, senos, cosenos y Pitágoras.
- Rediseñado por completo el sistema de mensajes flotantes de símbolos de fórmula.
- Añadido `formula-tooltips.js`, que calcula las posiciones reales de los símbolos MathJax y crea una capa HTML interactiva encima de la fórmula.
- Añadido `formula-tooltip-boot.js`, que observa la ficha abierta y monta automáticamente la capa de tooltips cuando la fórmula está visible.
- El tooltip ya no depende de eventos directos sobre nodos SVG internos de MathJax.
- El mensaje flotante usa ahora la clase independiente `formula-symbol-popover`, separada del antiguo `.symbol-tooltip`.
- Añadido botón flotante de búsqueda con icono de lupa.
- Al pulsar la lupa se despliega un campo de búsqueda hacia la izquierda del botón.
- Sustituido el buscador simple por búsqueda ponderada con ranking.
- La búsqueda indexa nombre, id, autor, área, nivel, resumen, significado, historia, derivación, variables, usos, ejemplos de uso y fórmulas.
- Separadas las secciones conceptuales en pestañas propias: `Historia`, `Derivación` y `Significado`.
- Pitágoras usa una ficha pulida con fórmula, variables, significado, derivación, usos explicados y simulación propia.
- Todas las fórmulas disponen de pestaña `Historia`.

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
│   ├── final-corrections.js
│   ├── history-essays.js
│   └── polished-equations.js
├── scripts/
│   ├── filtering.js
│   ├── formula-plugins.js
│   ├── formula-tooltip-boot.js
│   ├── formula-tooltips.js
│   ├── main.js
│   ├── modal-enhancements.js
│   ├── plugins/
│   │   ├── bernoulli-plugin.js
│   │   ├── cosines-plugin.js
│   │   ├── euler-plugin.js
│   │   ├── gravity-plugin.js
│   │   ├── plugin-utils.js
│   │   ├── pythagorean-plugin.js
│   │   ├── quadratic-plugin.js
│   │   └── sines-plugin.js
│   ├── render.js
│   ├── simulations.js
│   ├── state.js
│   ├── theme.js
│   └── utils.js
├── styles/
│   ├── base.css
│   ├── card-refresh.css
│   ├── components.css
│   ├── formula-plugins.css
│   ├── formula-popover-position.css
│   ├── interaction-fixes.css
│   ├── layout.css
│   ├── no-header-label.css
│   ├── pythagorean-simulation.css
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

Para aplicar una versión final especialmente cuidada de una ficha, añade un objeto en `data/polished-equations.js` con el mismo `id`. Este archivo se carga al final y tiene prioridad.

Para ampliar la historia de una fórmula, añade un objeto en `data/history-essays.js` con `id`, `title`, `note` y `paragraphs`. Si no existe, el sistema genera una ampliación histórica estructurada a partir de los datos de la ficha.

Propiedades principales:

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
- `useDetails`
- `derivation`
- `simulation`

`formula` puede ser una cadena LaTeX simple o un array de cadenas LaTeX cuando la ecuación se deba mostrar en varias líneas.

Simulaciones disponibles: `gravity`, `complex`, `wave`, `field`, `particles`, `spectrum`, `energy`, `quantum`, `spinor`, `flow`, `pythagorean` y plugins específicos montados por `formula-plugins.js`.
