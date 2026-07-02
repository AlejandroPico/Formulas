# Significado

Una progresión aritmética es una sucesión en la que cada término se obtiene sumando siempre la misma diferencia `d`. Si el primer término es `a_1`, la sucesión avanza como `a_1`, `a_1+d`, `a_1+2d`, `a_1+3d` y así sucesivamente. La fórmula de la suma permite calcular el total de los `n` primeros términos sin hacer una suma larga término a término.

La idea central es la simetría. En una progresión aritmética, el primer término y el último tienen la misma suma que el segundo y el penúltimo, el tercero y el antepenúltimo, etc. Por eso la suma completa equivale a multiplicar el número de términos por la media entre el primero y el último: `S_n = n(a_1+a_n)/2`.

También puede escribirse como `S_n = n(2a_1+(n-1)d)/2`, ya que `a_n = a_1+(n-1)d`. Esta forma es práctica cuando se conocen directamente el primer término, la diferencia común y el número de términos.

El simulador representa cada término como una barra. Si `d` es positivo, las barras crecen; si `d` es cero, todas tienen la misma altura; si `d` es negativo, decrecen y pueden cruzar el eje cero. La caja de lectura compara la suma directa con el valor dado por la fórmula.

Esta fórmula es una puerta de entrada a las series finitas: muestra cómo una estructura regular permite sustituir un cálculo repetitivo por una expresión cerrada.
