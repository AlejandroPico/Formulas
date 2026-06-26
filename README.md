# Atlas de Ecuaciones Famosas

Proyecto web estático para GitHub Pages orientado a divulgación científica visual.

## Estado actual

Versión **v2.4**: Pitágoras como ficha patrón pulida.

Cambios principales:

- Añadido `polished-equations.js` para overrides finales de fórmulas especialmente cuidadas.
- Pitágoras pasa a usar una ficha pulida con fórmula, variables, significado, derivación y simulación propia.
- Añadido simulador específico `pythagorean`, inspirado en el HTML de demostración aportado por el usuario.
- El simulador de Pitágoras incluye cuadrados sobre los catetos y la hipotenusa, sliders para `a` y `b`, cálculo vivo de `c`, áreas y sustitución numérica.
- Añadido `pythagorean-simulation.css` con adaptación visual al sistema de estilos del atlas.
- Corregido el posicionamiento de tooltips con `position: fixed` global para evitar desplazamientos respecto al ratón.
- Añadidos tooltips estructurales para raíces, potencias, fracciones, subíndices, superíndices y marcas vectoriales generadas por MathJax.
- Corregida la sincronización de pestañas cuando existe la pestaña `Historia`.
- La pestaña `Historia` ya no rompe `Fórmula`, `Contexto`, `Usos`, `Ficha` ni `Simulación`.
- Todas las fórmulas disponen de pestaña `Historia`.
- Si existe un ensayo histórico manual en `history-essays.js`, se muestra ese texto.
- Si todavía no existe ensayo manual, se genera una historia ampliada desde los metadatos de la fórmula para evitar fichas con una sola frase.
- Corregida la posición de los tooltips de símbolos usando coordenadas relativas al diálogo.
- Añadido `modal-enhancements.js` para mejoras progresivas del modal sin sobrecargar el render principal.
- Añadido `history-essays.js` con la primera tanda de historias ampliadas.
- La sección breve de historia se elimina automáticamente de `Contexto` cuando la fórmula tiene una pestaña `Historia` ampliada.
- Primera tanda de historias manuales ampliadas: Pitágoras, gravitación de Newton, Maxwell, Schrödinger, Bayes y fórmula cuadrática.
- Eliminada la pantalla inicial animada de presentación.
- Eliminado el canvas de entrada y su temporizador de espera.
- Desactivado el menú contextual interno de MathJax para evitar menús ocultos o anclados tras cerrar una ficha.
- Añadido `interaction-fixes.css` para ajustes finales de tooltips, menús y simulaciones.
- Tarjetas enteras clicables.
- Eliminado el botón interno `Abrir ficha`.
- Año, nivel educativo y área ocultos en la vista principal.
- Metadatos movidos a una pestaña interna `Ficha`.
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
- Rediseñada la ficha ampliada con pestañas internas: Fórmula, Historia, Contexto, Usos, Ficha y Simulación.
- Eliminada la pestaña visible de Variables: las variables pasan a integrarse en la fórmula mediante tooltips.
- Corregida la capa de tooltips: ahora se monta dentro del diálogo para que aparezca por encima de la ficha.
- Eliminado el cursor de ayuda con interrogante en los símbolos de fórmula.
- Añadido glosario interactivo sobre símbolos MathJax con definiciones por ecuación y glosario global.
- Las pestañas activas ya no se muestran como burbujas; se distinguen por peso tipográfico y color.
- La pestaña Fórmula escala automáticamente la fórmula para intentar mostrarla completa sin scroll.
- Variables, usos y contexto simplificados sin cajetines anidados.
- La simulación se carga solo al abrir su pestaña y reparte el espacio entre canvas y controles.
- Las simulaciones usan el tamaño real del canvas y colores derivados del tema para mejorar contraste.
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

Las simulaciones disponibles inicialmente son: `gravity`, `complex`, `wave`, `field`, `particles`, `spectrum`, `energy`, `quantum`, `spinor`, `flow` y `pythagorean`.
