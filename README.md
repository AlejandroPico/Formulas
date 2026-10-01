# Atlas de Ecuaciones Famosas

Atlas educativo estático para GitHub Pages. La colección actual contiene **282 fórmulas**. No utiliza SQLite ni requiere backend.

## Arquitectura

`formulas/<id>/` contiene los metadatos, las expresiones y las pestañas de cada fórmula. El navegador descarga `formulas/catalog-index.json` para conocer toda la colección, dibuja las tarjetas por lotes al acercarse al final de la pantalla y carga los textos y simuladores al abrir sus pestañas.

La búsqueda de texto dentro de las pestañas usa `formulas/search-index.json`, descargado al empezar a buscar. Puede encontrar fórmulas cuyas tarjetas todavía no se han dibujado.

```text
formulas/<id>/
  meta.json
  formula.tex
  significado.md
  historia.md
  derivacion.md
  usos.md
  ficha.md
  aprendizaje.md
  unidades.md
  simulacion/index.js
  simulacion/styles.css
```

Los archivos adicionales `.md` y `.tex` también se descubren al generar el catálogo. GitHub Pages no permite listar carpetas en el navegador: después de editar o añadir archivos, regenera los índices con:

```sh
node tools/build-formula-catalog.mjs
node tools/check-atlas.mjs
```

El workflow `formula-catalog.yml` regenera y comprueba los índices al cambiar `formulas/`. Los catálogos antiguos y scripts de lotes quedan como referencia de la migración; ya no registran contenido durante el arranque.

## Símbolos y simuladores

`formula.tex` utiliza un bloque por expresión, separado por una línea en blanco. `meta.json` puede definir `symbolGlossary` y `formulaGlossaries` para explicar cada símbolo y distinguir significados entre expresiones. El motor MathJax 3.2.2 se incluye localmente.

Cada simulador exporta una función de montaje que recibe `{ root, canvas, controls, readout }` y devuelve una función de limpieza. Se carga cuando se visita Simulación y se limpia al salir. Los widgets antiguos migrados mantienen sus implementaciones originales mediante módulos de importación; su revisión pedagógica sigue pendiente.

## Revisiones

Mantén **Alt** y pulsa Filtros para acceder a Inventario, Cobertura, Validador y **Revisiones**. Los temas especiales siguen disponibles con Alt + clic en Estilos.

`formulas/revisions.json` guarda el historial permanente. Cada revisión registra fecha, número, alcance, versión del simulador, resumen y comprobaciones. Una fórmula solo se marca revisada después de revisar todas sus pestañas, símbolos y simulador. La creación se obtiene de su primera incorporación al historial de Git, no de su año histórico.

Pitágoras tiene un juego de seis puentes, exploración mediante arrastre y comparación de áreas. Es la primera fórmula revisada en esta etapa.

## Probar y previsualizar

```sh
node tools/serve.mjs
```

Abre `http://127.0.0.1:4173/Formulas/`. Las pruebas de navegador están en `tools/check-browser.mjs`; necesitan Playwright y Edge. Comprueban escritorio y móvil y guardan sus capturas e informe en `artifacts/`, excluido de Git.

En Android, abre [Fórmulas](https://alejandropico.github.io/Formulas/) en Chrome y elige **Instalar aplicación**. El service worker conserva el motor matemático y los recursos consultados. La primera descarga necesita conexión; la instalación requiere HTTPS o localhost.

Consulta [la primera revisión](docs/primera-revision.md) y `AGENTS.md` para los hallazgos pendientes y las reglas de futuras revisiones.
