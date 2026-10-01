# Atlas de fórmulas

Por indicación expresa del propietario, trabaja directamente en `main` y publica los cambios en esa rama. No crees ramas secundarias ni pull requests salvo que el usuario lo pida explícitamente.

Lee `GUIA_FORMULAS_MAESTRA.md` y `formulas/README.md`. La fuente editable es `formulas/<id>/`; el catálogo y el índice de búsqueda se generan con `node tools/build-formula-catalog.mjs`. No añadas lotes de registro en JavaScript ni nuevas capas de parche sobre `window.fetch`.

Las nueve pestañas habituales son fórmula, significado, historia, derivación, usos, ficha, aprendizaje, unidades y simulación. Para una revisión completa, edita archivos propios para aprendizaje y unidades, y define los símbolos en `meta.json` mediante `symbolGlossary` y, si una letra cambia de significado entre expresiones, `formulaGlossaries`.

Conserva el minimalismo y las esquinas rectas del menú, las fichas y el detalle. Respeta los temas existentes, especialmente Cuaderno y Colegio. Los simuladores deben ser adaptativos, permitir teclado y entrada táctil, y devolver una función que limpie listeners, observadores y animaciones. No dejes animaciones ejecutándose cuando se cambia de pestaña o se cierra el diálogo.

El registro persistente es `formulas/revisions.json`. Cada fórmula tiene un historial de revisiones. Añade una entrada solo después de revisar **todas** sus pestañas, sus símbolos y su simulador, con fecha real, número de revisión, versión del simulador, alcance, resumen y comprobaciones. Una migración de archivos, un rediseño global o pasar el validador técnico no cuentan como revisión completa. No inventes fechas de creación: se obtienen del historial de Git.

Comprueba `node tools/check-atlas.mjs`. Para cambios en interfaz o simuladores, ejecuta `tools/check-browser.mjs` con Playwright y revisa las capturas en escritorio y móvil. `tools/migrate-legacy-catalog.mjs` y `tools/refactor-entry.mjs` documentan la migración inicial; no deben ejecutarse de nuevo sobre contenido revisado.

Las diez fórmulas de la segunda revisión usan `formulas/shared/learning-lab.js`, con cálculos puros, escenas y misiones separadas. Si cambias ese motor compartido, ejecuta también `tools/check-learning-browser.mjs`: una modificación puede afectar a las diez. Conserva las tres opciones de juego claramente visibles y los casos especiales verdaderos, como a = 0, r = 1, vector cero y lados imposibles. Los símbolos de `meta.json` admiten claves `structure:msqrt`, `^2` y `_x:2` para explicar una estructura, un exponente y un índice según su base.
