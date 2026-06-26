# Atlas de Ecuaciones Famosas

Proyecto web estático para GitHub Pages orientado a divulgación científica visual.

## Estado actual

Versión **v2.8**: tooltips de fórmula rediseñados con capa HTML independiente.

Cambios principales:

- Rediseñado por completo el sistema de mensajes flotantes de símbolos de fórmula.
- Añadido `formula-tooltips.js`, que calcula las posiciones reales de los símbolos MathJax y crea una capa HTML interactiva encima de la fórmula.
- Añadido `formula-tooltip-boot.js`, que observa la ficha abierta y monta automáticamente la capa de tooltips cuando la fórmula está visible.
- El tooltip ya no depende de eventos directos sobre nodos SVG internos de MathJax.
- El mensaje flotante usa ahora la clase independiente `formula-symbol-popover`, separada del antiguo `.symbol-tooltip`.
- Se crean zonas HTML para símbolos (`mi`, `mo`, `mn`) y también para estructuras matemáticas como raíces, potencias, fracciones, subíndices y límites.
- Añadido botón flotante de búsqueda con icono de lupa.
- Al pulsar la lupa se despliega un campo de búsqueda hacia la izquierda del botón.
- La búsqueda se conecta a `state.query` y actualiza el mosaico en tiempo real.
- Sustituido el buscador simple por búsqueda ponderada con ranking.
- La búsqueda indexa nombre, id, autor, área, nivel, resumen, significado, historia, derivación, variables, usos, ejemplos de uso y fórmulas.
- La búsqueda normaliza tildes, potencias, texto LaTeX básico y fórmulas compactas como `emc2`.
- Añadidos alias útiles: `pitagoras/pythagoras`, `schrodinger/schroedinger`, `ia/ai`, `energia/e=mc2`, `distancia/vector/norma`, y símbolos griegos habituales.
- La pestaña `Ficha` muestra un resumen técnico, autoría, fecha, área, nivel, simulación asociada y cobertura interna.
- Separadas las secciones conceptuales en pestañas propias: `Historia`, `Derivación` y `Significado`.
- La simulación de Pitágoras se ha simplificado visualmente: canvas y controles en una única zona funcional, sin cajas anidadas ni paneles internos redundantes.
- Los usos de Pitágoras se han ampliado con explicación concreta por campo: geometría, topografía, gráficos, distancias, álgebra lineal, física vectorial e informática.
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
│   ├── formula-tooltip-boot.js
│   ├── formula-tooltips.js
│   ├── main.js
│   ├── modal-enhancements.js
│   ├── render.js
│   ├── simulations.js
│   ├── state.js
│   ├── theme.js
│   └── utils.js
├── styles/
│   ├── base.css
│   ├── card-refresh.css
│   ├── components.css
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

Simulaciones disponibles: `gravity`, `complex`, `wave`, `field`, `particles`, `spectrum`, `energy`, `quantum`, `spinor`, `flow` y `pythagorean`.
