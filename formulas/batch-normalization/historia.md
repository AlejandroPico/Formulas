# Historia

Ioffe y Szegedy introdujeron Batch Normalization en 2015. La explicación original invocó cambio de distribución interna; trabajos posteriores discutieron mecanismos como suavidad de optimización, por lo que no se presenta una única explicación causal como hecho universal.

## Referencia y alcance

[Material de estudio](https://arxiv.org/abs/1502.03167).

Entrenamiento e inferencia usan estadísticas distintas. Con ε>0 la varianza normalizada no es exactamente uno; si el lote es constante la salida es β. No se usa varianza muestral insesgada N−1. Los frameworks pueden guardar estimadores distintos para inferencia; este modelo declara los suyos.

La fecha de creación del catálogo procede del archivo original; el año científico y la fecha de revisión tienen funciones diferentes.
