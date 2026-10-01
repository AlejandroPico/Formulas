# Interpolación de Lagrange

Una combinación de bases cardinales atraviesa cada dato exactamente. Interpolar no es ajustar por mínimos cuadrados ni garantizar precisión lejos de los nodos.

## Magnitudes

| Símbolo | Significado |
| :-- | :-- |
| P | Polinomio interpolador de grado como máximo n. |
| x | Variable de evaluación; x_i son abscisas de datos distintas. |
| y | Ordenada del dato i. |
| L | Base cardinal de Lagrange asociada al nodo i. |
| i | Índice del nodo cuya base se construye. |
| j | Índice de los demás nodos. |
| n | Grado máximo: con n+1 nodos distintos. |
| δ | Delta de Kronecker: vale uno si i=j y cero si son diferentes. |

## Alcance

Abscisas distintas; datos de una función. Nodos repetidos requieren otra formulación, como interpolación de Hermite con información de derivadas.

## Unidades

La base L_i es adimensional porque divide diferencias de x con la misma unidad. P conserva la unidad de y. Un resultado fuera del intervalo de nodos es extrapolación y su exactitud en los tres datos no limita el error allí.
