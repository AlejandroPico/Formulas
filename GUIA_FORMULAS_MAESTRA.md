# Guia maestra del proyecto Formulas

Cada formula vive en formulas/id y debe tener meta.json, formula.tex, significado.md, historia.md, derivacion.md, usos.md, ficha.md y simulacion si procede. La formula visible debe ser simbolica real. Los simuladores usan root, canvas, controls y readout. Deben aplicar sim-wide y calc-wide, usar canvas adaptativo y ResizeObserver. El readout no debe tapar titulo ni formula. Integra cada entrada en catalogo o lote de ultimas introducidas. Valida secciones, simulador, visibilidad, contador y duplicados.
