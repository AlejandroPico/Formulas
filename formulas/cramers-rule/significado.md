# Significado

La regla de Cramer resuelve sistemas lineales cuadrados usando determinantes. Para un sistema `Ax=b`, cada incógnita se obtiene dividiendo dos determinantes: el determinante de una matriz modificada entre el determinante de la matriz de coeficientes.

En un sistema `2x2`, la matriz de coeficientes contiene los números que multiplican a `x` e `y`. El vector de términos independientes contiene los resultados de cada ecuación. Para hallar `x`, se sustituye la columna de `x` por ese vector; para hallar `y`, se sustituye la columna de `y`.

La condición esencial es `det(A) != 0`. Si el determinante principal es cero, el sistema no tiene una solución única. Puede ser incompatible o tener infinitas soluciones, pero Cramer no puede producir un único par ordenado.

El simulador muestra el caso `2x2`: calcula el determinante principal, el determinante de `x`, el determinante de `y` y los cocientes finales. También avisa cuando el sistema queda degenerado.
