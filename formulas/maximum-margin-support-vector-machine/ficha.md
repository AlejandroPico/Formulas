# Máquinas de vectores de soporte: margen máximo

Cuatro puntos etiquetados y un separador wx x+wy y+b. Se evalúa el objetivo soft-margin primal, con hinge; el laboratorio no afirma resolver todo conjunto SVM.

## Magnitudes y notación

| Símbolo | Interpretación |
| :-- | :-- |
| w | Vector normal de la frontera. |
| b | Sesgo de la frontera. |
| ξ | Holgura no negativa de cada muestra. |
| C | Peso positivo de penalización. |
| y | Etiqueta de clase, −1 o +1. |
| x | Vector de características. |
| i | Índice de muestra. |
| min | Minimización del objetivo. |
| max | Máximo que define la pérdida hinge. |

## Condiciones

Ancho no definido con w=0; se muestra ese caso explícitamente. Clasificar bien no implica cumplir margen uno. El laboratorio evalúa separadores y no sustituye un solver general; hard-margin requiere separabilidad y restringe holguras a cero.

## Unidades

Variables numéricas en unidades de referencia; los índices y probabilidades son adimensionales. Una distancia conserva la escala de las características; su cuadrado tiene escala cuadrática.
