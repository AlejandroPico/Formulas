# Derivación

Se parte de una colección de pares observados y predichos. Para cada caso se calcula el residuo: diferencia entre el valor real y el valor estimado.

Al elevar cada residuo al cuadrado, todos los errores se vuelven no negativos y los errores grandes pesan más.

La suma de errores cuadrados se divide entre el número de observaciones para obtener un promedio.

Cuando se usa como coste de un modelo, minimizar el MSE equivale a buscar parámetros que acerquen la curva de predicción a los datos en sentido cuadrático.
