# Derivación

La regla de la cadena multiplica probabilidades condicionales del token observado en cada contexto. El logaritmo negativo por token promedia sorpresa de la secuencia. Exponenciar da el inverso de su media geométrica de probabilidades. En el ejemplo de cuatro tokens, se promedian cuatro logaritmos, aunque las cuatro probabilidades no sumen uno porque pertenecen a contextos distintos. Base dos y natural dan la misma PPL con conversión correcta.

## Hipótesis necesarias

Probabilidades condicionales positivas, mismo conjunto de evaluación y tokenización para comparar modelos. No equivale necesariamente a número de palabras posibles ni calidad semántica. Una probabilidad cero de un token observado da perplejidad infinita; controles positivos evitan esa singularidad. La cadena omite factores de inicio ya incorporados en cada contexto.

## Comprueba con números

Cuatro probabilidades condicionales del token que realmente apareció, una por posición. No son cuatro categorías que deban sumar uno; su producto es la probabilidad de la secuencia bajo el modelo. Calcula perplejidad con los datos iniciales. Perplejidad=2,8284 . PPL=exp(−(lnp1+lnp2+lnp3+lnp4)/4).
