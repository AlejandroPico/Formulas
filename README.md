# Atlas de Ecuaciones Famosas

Proyecto web estático para GitHub Pages orientado a divulgación científica visual. Forma parte del ecosistema de proyectos abiertos de ciencia y formación de **Oblitus**.

La primera versión funciona como una biblioteca interactiva de ecuaciones famosas. Cada entrada incluye fórmula renderizada, explicación conceptual, variables, contexto histórico, casos de uso, nivel educativo, derivación simplificada y una simulación visual conceptual.

## Ecuaciones incluidas en la v1

- Ley de gravitación universal de Newton.
- Identidad de Euler.
- Transformada de Fourier.
- Ecuaciones de Maxwell.
- Entropía de Boltzmann.
- Ley de Planck.
- Equivalencia masa-energía de Einstein.
- Ecuación de Schrödinger.
- Ecuación de Dirac.
- Navier-Stokes.

## Características

- Publicable directamente en GitHub Pages mediante `index.html`.
- Interfaz responsive con estética de atlas científico oscuro/claro.
- Filtros por área científica y nivel educativo.
- Búsqueda textual por autor, fórmula, uso, área o descripción.
- Ordenación por cronología, nombre, área o nivel.
- Fichas modales ampliadas para cada ecuación.
- Simulaciones conceptuales en canvas.
- Fórmulas renderizadas con MathJax.
- Arquitectura modular preparada para crecer.

## Estructura del proyecto

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
│   └── utils.js
├── styles/
│   ├── base.css
│   ├── components.css
│   ├── layout.css
│   ├── responsive.css
│   └── tokens.css
└── .nojekyll
```

## Cómo añadir una nueva ecuación

Añade un nuevo objeto al array `equations` en `data/equations.js` con esta estructura:

```js
{
  id: "identificador-unico",
  name: "Nombre de la ecuación",
  author: "Autor o autores",
  year: 1900,
  field: "Área científica",
  level: "Nivel educativo",
  color: "#77d9ff",
  formula: "E=mc^2",
  summary: "Resumen breve.",
  meaning: "Explicación conceptual.",
  variables: ["E: energía", "m: masa"],
  history: "Contexto histórico.",
  uses: ["Caso de uso 1", "Caso de uso 2"],
  derivation: "Derivación simplificada.",
  simulation: "energy"
}
```

Las simulaciones disponibles inicialmente son: `gravity`, `complex`, `wave`, `field`, `particles`, `spectrum`, `energy`, `quantum`, `spinor` y `flow`.

## GitHub Pages

Para publicarlo:

1. Entra en **Settings** del repositorio.
2. Abre **Pages**.
3. En **Build and deployment**, selecciona **Deploy from a branch**.
4. Elige la rama `main` y la carpeta `/root`.
5. Guarda los cambios.

GitHub Pages detectará `index.html` en la raíz y publicará el sitio.

## Próximas ampliaciones posibles

- Añadir categorías avanzadas: mecánica, cálculo, álgebra, relatividad, cuántica, termodinámica, fluidos, estadística, cosmología.
- Crear rutas educativas por nivel: ESO, Bachillerato, universidad inicial, grado, avanzado.
- Añadir comparador de ecuaciones relacionadas.
- Crear simuladores específicos por ecuación, no solo conceptuales.
- Añadir derivaciones paso a paso desplegables.
- Añadir bibliografía y enlaces a recursos externos.
- Crear modo presentación para aulas.
- Exportar fichas a PDF o Markdown.

## Estado

Versión inicial funcional: **v1.0**.
