# Atlas de Ecuaciones Famosas

Proyecto web estático para GitHub Pages orientado a divulgación científica visual.

## Estado actual

Versión **v2.6**: tooltip de fórmulas corregido en origen y pestaña Ficha rediseñada.

Cambios principales:

- Corregido el tooltip de símbolos desde `render.js`, que es donde se crean realmente los símbolos interactivos de MathJax.
- El tooltip se crea ahora siempre como elemento global directo en `body`, no dentro del diálogo.
- Cada símbolo anotado recibe listeners propios, y la hitbox SVG transparente también recibe listeners propios.
- Reducida la distancia del tooltip al puntero a una separación mínima de lectura.
- Corregido el escapado de delimitadores MathJax `\\(...\\)` en el render de fórmulas.
- La pestaña `Ficha` deja de ser una lista técnica con líneas y pasa a una presentación textual limpia.
- `Ficha` ahora muestra un resumen técnico, autoría, fecha, área, nivel, simulación asociada y cobertura interna.
- Separadas las secciones conceptuales en pestañas propias: `Historia`, `Derivación` y `Significado`.
- Eliminada la pestaña `Contexto` como contenedor mixto.
- La simulación de Pitágoras se ha simplificado visualmente: canvas y controles en una única zona funcional, sin cajas anidadas ni paneles internos redundantes.
- Los controles de la simulación de Pitágoras quedan en una franja compacta y visible dentro de la pestaña.
- Los usos de Pitágoras se han ampliado con explicación concreta por campo: geometría, topografía, gráficos, distancias, álgebra lineal, física vectorial e informática.
- Añadido `polished-equations.js` para overrides finales de fórmulas especialmente cuidadas.
- Pitágoras usa una ficha pulida con fórmula, variables, significado, derivación, usos explicados y simulación propia.
- Añadido simulador específico `pythagorean`, inspirado en el HTML de demostración aportado por el usuario.
- Añadido `pythagorean-simulation.css` con adaptación visual al sistema de estilos del atlas.
- Añadidos tooltips estructurales para raíces, potencias, fracciones, subíndices, superíndices y marcas vectoriales generadas por MathJax.
- Todas las fórmulas disponen de pestaña `Historia`.
- Si existe un ensayo histórico manual en `history-essays.js`, se muestra ese texto.
- Si todavía no existe ensayo manual, se genera una historia ampliada desde los metadatos de la fórmula.

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
