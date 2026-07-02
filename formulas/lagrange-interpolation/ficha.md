# Ficha

## Identificación

- Nombre: Interpolación de Lagrange.
- Área: Análisis numérico.
- Nivel recomendado: Universidad inicial.
- Tipo de fórmula: interpolación polinómica exacta.

## Fórmula principal

`P(x)=sum y_i L_i(x)`.

`L_i(x)=prod_{j!=i}(x-x_j)/(x_i-x_j)`.

## Variables

- `x_i`: abscisas de los nodos.
- `y_i`: valores conocidos de la función o de los datos.
- `L_i`: polinomio base de Lagrange.
- `P(x)`: polinomio interpolador.

## Condición

Los valores `x_i` deben ser distintos. Si dos nodos tienen la misma abscisa, aparece división por cero y no hay interpolación polinómica ordinaria bien definida.

## Lectura del simulador

El simulador fija tres nodos en el eje `x` y permite modificar sus valores `y`. La curva resultante es el polinomio de grado como máximo dos que pasa por los tres puntos.

## Errores habituales

- Confundir interpolación con regresión.
- Usar nodos repetidos.
- Pensar que más puntos siempre producen mejor comportamiento global.
- Olvidar que el polinomio puede oscilar fuera del intervalo de datos.
