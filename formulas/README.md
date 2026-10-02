# Fuente de las fórmulas

Cada entrada vive en `formulas/<id>/`. Edita sus archivos; no añadas registros en los scripts de lotes antiguos. El navegador consume un único catálogo generado, `catalog-index.json`. `search-index.json` permite buscar el texto de todas las pestañas y se carga al utilizar la búsqueda.

```text
<id>/meta.json
<id>/formula.tex
<id>/significado.md
<id>/historia.md
<id>/derivacion.md
<id>/usos.md
<id>/ficha.md
<id>/aprendizaje.md
<id>/unidades.md
<id>/simulacion/index.js
<id>/simulacion/styles.css
```

`meta.json` define al menos id, nombre, autor, año histórico, área, nivel, color, resumen y simulación. Las expresiones de `formula.tex` se separan con una línea en blanco. Usa símbolos LaTeX reales y documenta las condiciones de validez.

`aprendizaje.md` y `unidades.md` prevalecen sobre el contenido genérico de compatibilidad. Los archivos adicionales `.md` o `.tex` de la raíz se convierten en pestañas extra cuando se regeneran los índices. No es posible descubrirlos en ejecución mediante listados de GitHub Pages.

`symbolGlossary` relaciona símbolos con sus definiciones. `formulaGlossaries` contiene un diccionario por expresión y permite precisar significados diferentes de una misma letra. Las claves `_1`, `_2`, `_n` describen subíndices; `bold:x` describe el vector x completo. Ver Pitágoras como ejemplo.

Las simulaciones exportan una función que recibe `{ root, canvas, controls, readout }` y devuelve la limpieza de listeners, observadores, intervalos y animaciones. Usa canvas adaptativo, ResizeObserver, controles accesibles y estilos encapsulados. Los módulos de importación de los widgets antiguos preservan esos simuladores y no implican una revisión pedagógica.

Después de añadir o editar archivos:

```sh
node tools/build-formula-catalog.mjs
node tools/check-atlas.mjs
```

Los niveles canónicos son ESO, ESO y Bachillerato, Bachillerato, Bachillerato y universidad inicial, Universidad inicial, Universidad intermedia, Universidad y Universidad avanzada. Evita duplicados por id o nombre. Comprueba la existencia de archivos, expresión simbólica, delimitadores, pestañas, interacción del simulador y presentación en escritorio y móvil.

`revisions.json` es el registro de revisiones completas. Contiene un historial por id, con revisión, fecha real, versión del simulador, alcance, resumen y comprobaciones. Conserva las entradas anteriores; no marques una fórmula como revisada por migrar sus archivos o superar comprobaciones automáticas. La fecha de creación se obtiene del historial de Git; las entradas migradas conservan `originalSource` y su fecha original.

Disciplina, nivel y etiquetas se revisan con cada ficha. `shared/taxonomy.js` y `shared/tag-vocabulary.js` proporcionan nombres canónicos compartidos por el generador y el navegador. Las etiquetas describen conceptos; los niveles y el estado de revisión tienen sus propios campos. Los metadatos explícitos no se amplían con etiquetas genéricas al cargar la página. Una normalización de acentos no constituye una revisión completa.

Las 33 fichas de la sexta revisión comparten el motor de misiones, pero cada una tiene un modelo y representación específicos en `shared/continuum-*.js`. Comprueba cálculos con `check-atlas.mjs`, las 132 misiones y presentación con `check-continuum-browser.mjs`, y arrastres de ratón/tacto con `check-continuum-inputs.mjs`. Las vistas 3D permiten giro sin cambiar los parámetros. Los experimentos distinguen unidades físicas y reducidas, condiciones de contorno y límites del modelo. No marques una ficha antes de revisar contenido y resultados visuales.

Las 52 fichas de la séptima revisión usan `shared/spectrum-*.js`: 208 misiones, controles, reproducción cuando corresponde y escenas 3D de geometría y electromagnetismo. `check-spectrum-browser.mjs` revisa todas sus pestañas, símbolos, misiones, vistas, limpieza y presentación móvil; `check-spectrum-inputs.mjs` comprueba ratón y tacto. El contraste numérico independiente está incluido en `check-atlas.mjs`. Las figuras geométricas conservan escala, las fórmulas explican dominios y conversiones, y las vistas diferencian aproximaciones de identidades.

La comprobación general de LaTeX incluye avisos rojos de comandos desconocidos. Las macros de integrales cerradas están configuradas localmente en `index.html`; evita depender de extensiones no incluidas que se descarguen al abrir una ficha.
