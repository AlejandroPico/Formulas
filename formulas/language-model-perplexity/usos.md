# Usos

Comparar predicciones con sus unidades, su base de logaritmo y el conjunto de datos de referencia. Los cuatro retos separan cálculo, ajuste, interpretación y comprobación; las tres vistas permiten identificar qué cambia y qué permanece.

## Del experimento al contexto

Cuatro probabilidades condicionales del token que realmente apareció, una por posición. No son cuatro categorías que deban sumar uno; su producto es la probabilidad de la secuencia bajo el modelo.

## Condiciones antes de aplicar

Probabilidades condicionales positivas, mismo conjunto de evaluación y tokenización para comparar modelos. No equivale necesariamente a número de palabras posibles ni calidad semántica. Una probabilidad cero de un token observado da perplejidad infinita; controles positivos evitan esa singularidad. La cadena omite factores de inicio ya incorporados en cada contexto.
