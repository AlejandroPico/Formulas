# Serie de Taylor

Un polinomio de Taylor imita las derivadas de una función en un centro; el resto mide lo que falta.

## Magnitudes

| Símbolo | Lectura |
| :-- | :-- |
| P | Polinomio construido con las derivadas de f en el centro. |
| N | Grado máximo no negativo del polinomio truncado. |
| n | Índice entero del término, desde cero hasta el grado. |
| f | Función que se aproxima; la marca (n) indica su derivada de orden n. |
| x | Punto donde se evalúan función y polinomio. |
| a | Centro de expansión de Taylor. |
| R | Resto firmado: f(x)−P_N(x). |
| ξ | Punto intermedio entre el centro a y x, que aparece en el resto de Lagrange. |

## Cuándo se aplica

Para el polinomio, derivadas hasta orden N en el centro. Para el resto de Lagrange, suficiente regularidad hasta orden N+1 en el intervalo. Para la serie infinita, convergencia a la función. ln(1+x) requiere x>−1.

## Evita estos errores

Confundir grado y número de términos; olvidar el factorial; presentar P_N=f sin resto; creer que toda función suave es analítica; evaluar logaritmos fuera de su dominio.

## Laboratorio

**Aproximaciones · Explorar · Error**

Cambia el centro y el grado. El polinomio comparte derivadas con la función en a; eso no garantiza precisión lejos de a.

Compara el error firmado y una cota de Lagrange. En ln(1+x), la singularidad x=−1 limita el intervalo abierto de convergencia.
