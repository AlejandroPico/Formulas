# Significado

La entropía cruzada mide lo mala que es una distribución predicha cuando se compara con una distribución objetivo.

En clasificación con una única clase correcta, la fórmula se reduce a `-log(y_hat_correcta)`. Si el modelo asigna mucha probabilidad a la clase correcta, la pérdida es pequeña. Si le asigna poca, la pérdida crece muy rápido.

Por eso es una función de pérdida natural para clasificadores probabilísticos. Obliga al modelo no solo a acertar la clase, sino a calibrar la confianza.

El simulador muestra la curva `-ln(y_hat)` para la clase correcta. Al mover la confianza predicha, se observa cómo la pérdida cae cerca de uno y se dispara cerca de cero.
