# Atlas de Ecuaciones Famosas

Proyecto web estático para GitHub Pages orientado a divulgación científica visual.

## Estado actual

Arquitectura moderna basada exclusivamente en la carpeta `formulas/`.

El sistema antiguo basado en `data/*.js` se ha retirado. La aplicación carga las fichas desde catálogos y carpetas individuales dentro de `formulas/`, y cada ficha puede tener secciones propias en archivos independientes.

## Estructura principal

```text
.
├── favicon.svg
├── index.html
├── formulas/
│   ├── catalog.json
│   ├── catalog-*.json
│   ├── manifest.js
│   ├── shared/
│   └── <formula-id>/
│       ├── meta.json
│       ├── formula.tex
│       ├── significado.md
│       ├── historia.md
│       ├── derivacion.md
│       ├── usos.md
│       ├── ficha.md
│       └── simulacion/
│           ├── index.js
│           └── styles.css
├── scripts/
├── styles/
└── .nojekyll
```

## Carga de fichas

La entrada principal es `scripts/main.js`, que carga las fórmulas mediante `scripts/formula-file-loader.js`.

El loader combina `formulas/catalog.json` y los suplementos `formulas/catalog-*.json`. Cada entrada apunta a una carpeta de fórmula dentro de `formulas/`.

## Cómo añadir una fórmula

Crea una carpeta nueva dentro de `formulas/` con este patrón:

```text
formulas/<formula-id>/
├── meta.json
├── formula.tex
├── significado.md
├── historia.md
├── derivacion.md
├── usos.md
├── ficha.md
└── simulacion/
    ├── index.js
    └── styles.css
```

Después añade la entrada al catálogo correspondiente o deja que el generador de catálogo la incorpore si procede.

## Secciones dinámicas

Las secciones estándar son:

- `formula.tex` → Fórmula
- `significado.md` → Significado
- `historia.md` → Historia
- `derivacion.md` → Derivación
- `usos.md` → Usos
- `ficha.md` → Ficha
- `simulacion/index.js` → Simulación

El loader también puede incorporar archivos `.md` o `.tex` adicionales de la raíz de cada fórmula como pestañas extra.

## Simulaciones

Cada simulación moderna vive dentro de su fórmula, en `formulas/<formula-id>/simulacion/`. El módulo debe exportar una función de montaje que reciba `root`, `canvas`, `controls` y `readout`.

## GitHub Pages

El proyecto sigue siendo completamente estático. No requiere backend ni proceso de compilación obligatorio para visualizarse en GitHub Pages.
