# Ecuación del replicador: teoría de juegos evolutiva

Juego simétrico de dos estrategias en población bien mezclada. Las frecuencias evolucionan según pago relativo; no se añaden mutaciones ni ruido.

## Magnitudes y notación

| Símbolo | Interpretación |
| :-- | :-- |
| x | Vector de frecuencias en la primera expresión; frecuencia de estrategia 1 en la segunda. |
| i | Índice de estrategia. |
| A | Matriz de pagos del juego simétrico. |
| T | Transposición del vector x. |
| f | Pago esperado de la estrategia indicada. |
| a | Pago de estrategia 1 contra estrategia 1. |
| b | Pago de estrategia 1 contra estrategia 2. |
| c | Pago de estrategia 2 contra estrategia 1. |
| d | Pago de estrategia 2 contra estrategia 2. |
| [ | Agrupa pago propio menos pago medio. |
| ] | Cierra diferencia de pagos. |

## Condiciones

Juego simétrico de dos estrategias, población homogénea determinista y pagos constantes, sin mutación ni deriva. x∈[0,1] y segunda frecuencia 1−x. Un pago positivo aislado no basta para crecer: importa la ventaja relativa. El superíndice T en la primera expresión es transposición de un vector, no temperatura.

## Unidades

Frecuencias y pagos escalados son adimensionales. El tiempo es reducido; multiplicar todos los pagos por un factor positivo acelera el reloj sin cambiar órbitas. En una aplicación concreta la escala del pago debe enlazarse con tasa de reproducción antes de interpretar tiempo físico.
