# Historia

Ba, Kiros y Hinton presentaron Layer Normalization en 2016 para normalizar activaciones dentro de una muestra, con independencia del tamaño de mini-lote. Se usa de forma habitual en arquitecturas secuenciales y transformers.

## Referencia y alcance

[Material de estudio](https://arxiv.org/abs/1607.06450).

No mezcla las estadísticas entre muestras. ε evita división por cero; un vector constante queda en β. Con γj distintos la media de salidas no debe ser β ni la varianza uno. El efecto de cambiar escala común no es invariancia exacta por ε.

La fecha de creación del catálogo procede del archivo original; el año científico y la fecha de revisión tienen funciones diferentes.
