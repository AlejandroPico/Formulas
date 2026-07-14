# Arquitectura moderna de `formulas/`

Esta carpeta es la fuente principal del **Atlas de Ecuaciones Famosas**. Las fórmulas nuevas no deben añadirse a `data/` ni depender de arrays globales repartidos por scripts.

## Estructura de una fórmula

Cada fórmula vive en una carpeta propia:

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

Los archivos de simulación solo son obligatorios cuando la fórmula dispone de un widget interactivo.

## Catálogos

GitHub Pages no permite listar directorios del repositorio desde el navegador. Por ello, las carpetas se registran mediante los archivos `formulas/catalog*.json`.

Cada entrada debe incluir como mínimo:

```json
{
  "id": "pythagorean-theorem",
  "name": "Teorema de Pitágoras",
  "author": "Tradición pitagórica",
  "year": -500,
  "field": "Geometría",
  "level": "ESO",
  "color": "#5d5af6",
  "folder": "formulas/pythagorean-theorem",
  "formula": ["a^2+b^2=c^2"],
  "formulaText": ["cateto a² + cateto b² = hipotenusa c²"],
  "summary": "Relaciona los lados de un triángulo rectángulo.",
  "simulation": "pythagorean-theorem"
}
```

El loader combina actualmente:

- `catalog.json`
- `catalog-recent.json`
- `catalog-lorentz.json`
- `catalog-quantum.json`
- `catalog-chemistry.json`
- `catalog-statistics.json`
- `catalog-machine-learning.json`
- `catalog-applied-models.json`
- `catalog-formula-fixes.json`

Una fórmula nueva debe registrarse en uno de estos catálogos sin duplicar `id` ni nombre.

## Pestañas estándar

La ficha completa contiene:

1. Fórmula
2. Significado
3. Historia
4. Derivación
5. Usos
6. Ficha
7. Aprendizaje
8. Unidades
9. Simulación, cuando exista

`Aprendizaje` y `Unidades` pueden generarse a partir de los metadatos, prerrequisitos, etiquetas, símbolos y dimensionalidad. Los demás contenidos deben existir en archivos propios.

Cualquier archivo `.md` o `.tex` adicional en la raíz de la carpeta puede declararse como pestaña extra desde el catálogo.

## Reglas de `formula.tex`

- Una expresión por bloque.
- Varias fórmulas se separan mediante una línea en blanco.
- No se separan con comas para mostrarlas en la tarjeta.
- Las llaves, paréntesis y corchetes deben estar equilibrados.
- `\left` y `\right` deben aparecer emparejados.
- Se debe preferir LaTeX estándar compatible con MathJax.

En el mosaico principal, cada bloque se representa en una línea independiente, una fórmula debajo de otra.

## Metadatos y niveles

`meta.json` debe incluir `id`, `name`, `author`, `year`, `field`, `level`, `color`, `simulation`, `formulaText` y `summary`.

Niveles normalizados:

- ESO
- Bachillerato
- Universidad inicial
- Universidad
- Avanzado

## Simuladores

`simulacion/index.js` debe exportar una función de montaje por defecto o nombrada. Recibe un objeto con `root`, `canvas`, `controls` y `readout`. Si crea listeners persistentes, intervalos o animaciones, debe devolver una función de limpieza.

Los estilos específicos se mantienen en `simulacion/styles.css` y deben estar encapsulados dentro del componente.

## Validación

Antes de integrar una fórmula:

- comprobar que la carpeta y `formula.tex` existen;
- comprobar las pestañas estándar;
- comprobar metadatos, nivel y etiquetas;
- comprobar llaves, paréntesis, corchetes, `left/right` y `begin/end`;
- comprobar que el simulador exporta una función de montaje;
- comprobar que no se referencia la carpeta antigua `data/`;
- comprobar que no existen duplicados por `id` o nombre.

## Migración del sistema antiguo

Los archivos `scripts/latest-formula-batch-*.js` son una capa de compatibilidad temporal. No deben utilizarse para fórmulas nuevas. Su contenido debe migrarse gradualmente a carpetas dentro de `formulas/` y a los catálogos JSON correspondientes. Una vez migrado todo el inventario, esos scripts podrán eliminarse del arranque.
