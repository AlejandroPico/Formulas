# Significado

Cuatro probabilidades condicionales del token que realmente apareció, una por posición. No son cuatro categorías que deban sumar uno; su producto es la probabilidad de la secuencia bajo el modelo.

## Qué conserva y qué cambia

La regla de la cadena multiplica probabilidades condicionales del token observado en cada contexto. El logaritmo negativo por token promedia sorpresa de la secuencia. Exponenciar da el inverso de su media geométrica de probabilidades. En el ejemplo de cuatro tokens, se promedian cuatro logaritmos, aunque las cuatro probabilidades no sumen uno porque pertenecen a contextos distintos. Base dos y natural dan la misma PPL con conversión correcta.

## Primera predicción

Cuatro probabilidades condicionales del token que realmente apareció, una por posición. No son cuatro categorías que deban sumar uno; su producto es la probabilidad de la secuencia bajo el modelo. Calcula perplejidad con los datos iniciales. Perplejidad=2,8284 . PPL=exp(−(lnp1+lnp2+lnp3+lnp4)/4).
