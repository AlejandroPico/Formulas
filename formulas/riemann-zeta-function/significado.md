# Significado

La función zeta de Riemann empieza como una serie aparentemente sencilla: se suman los inversos de las potencias `n^s`. Para valores reales de `s` mayores que 1, esa suma converge y produce un número. La profundidad aparece cuando `s` se considera una variable compleja y la función se prolonga más allá de la región donde la serie original converge.

Su importancia se debe a que une dos mundos que, a primera vista, parecen distintos: el análisis complejo y los números primos. La fórmula de Euler expresa la zeta como un producto sobre todos los primos. Eso significa que la estructura multiplicativa de los enteros queda codificada en una función analítica.

Los ceros de la zeta son esenciales. Los ceros llamados triviales aparecen en enteros negativos pares. Los ceros no triviales viven en la franja crítica, entre parte real 0 y parte real 1. La famosa hipótesis de Riemann afirma que todos esos ceros no triviales tienen parte real igual a 1/2.

El simulador recorre la línea crítica `s=1/2+it`. Al variar `t`, se representa el valor complejo aproximado de `zeta(s)` como un punto en el plano. Cerca del primer cero no trivial, alrededor de `t=14.13`, la trayectoria se aproxima al origen. La visualización no es una demostración, pero sí permite entender por qué los ceros son puntos donde la función compleja se anula.
