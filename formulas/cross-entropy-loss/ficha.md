# Entropía cruzada

Entropía cruzada de distribuciones Bernoulli p y q con logaritmos naturales. Se distingue frecuencia objetivo p de probabilidad predicha q.

## Magnitudes y notación

| Símbolo | Interpretación |
| :-- | :-- |
| H | Entropía o entropía cruzada, según lleve uno o dos argumentos. |
| p | Distribución objetivo; pi pesa los costes de cada categoría. |
| q | Distribución propuesta o probabilidad predicha. |
| i | Índice de categoría. |
| D | Divergencia KL, exceso de entropía cruzada. |
| K | Parte de KL: Kullback. |
| L | Parte de KL: Leibler. |
| ‖ | Separa distribuciones en una divergencia dirigida, no norma de vector. |

## Condiciones

Distribuciones normalizadas en el mismo soporte, con q positiva donde p es positiva. Los controles limitan q a [0,01,0,99]; p puede ser determinista. La expresión es pérdida media de distribución, no una suma sin dividir por el número de ejemplos. Aquí se usan logaritmos naturales.

## Unidades

Probabilidades y pérdida son adimensionales. La base natural produce nats por observación; dividir por ln2 produce bits. p representa frecuencia objetivo y q probabilidad predicha, con funciones diferentes. No se confunde con una métrica simétrica de semejanza.
