# Divergencia de Kullback-Leibler

Divergencia KL entre dos Bernoulli, en nats. Penaliza usar q para una fuente p; no es una distancia simétrica.

## Magnitudes y notación

| Símbolo | Interpretación |
| :-- | :-- |
| D | Divergencia dirigida de fuente p respecto a propuesta q. |
| K | Parte de KL: Kullback. |
| L | Parte de KL: Leibler. |
| p | Distribución fuente que pondera términos. |
| q | Distribución propuesta cuyo coste se compara. |
| i | Índice de categoría. |
| ‖ | Separa distribuciones en KL dirigida. |
| en | La desigualdad de órdenes no se afirma para cada par: es en general. |
| general | Señala que hay pares particulares con valores coincidentes. |

## Condiciones

Mismo soporte de categorías y q positiva donde p es positiva. Un pi=0 aporta cero por límite; qi=0 con pi>0 produce infinito. Los controles de q son interiores, pero la comparación inversa puede ser infinita cuando p llega al borde. Igualdad o simetría en un ejemplo particular no altera el carácter dirigido de KL.

## Unidades

Logaritmos naturales: divergencia en nats, adimensional. Dividir por ln2 convierte a bits. En el ejemplo Bernoulli, las probabilidades son p,1−p y q,1−q, de modo que ambas distribuciones están normalizadas; no se suman pesos arbitrarios.
