# Significado

El error cuadrático medio mide cuánto se alejan, en promedio, las predicciones de un modelo respecto a los valores reales.

Cada residuo `y_i - y_hat_i` se eleva al cuadrado. Esto evita cancelaciones entre errores positivos y negativos, y penaliza con fuerza los errores grandes.

En regresión y aprendizaje automático, el MSE se usa como función de coste: el modelo se ajusta buscando parámetros que reduzcan esa cantidad.

El simulador muestra puntos observados, una recta de predicción y los residuos verticales. Al mover la pendiente, cambia la longitud de los residuos y el valor de MSE.
