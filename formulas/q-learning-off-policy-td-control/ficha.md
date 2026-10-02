# Q-Learning: control TD fuera de política

Una transición observada con dos valores siguientes. Se modifica una estimación Q; no se presenta una transición aislada como entrenamiento completo.

## Magnitudes y notación

| Símbolo | Interpretación |
| :-- | :-- |
| Q | Valor estimado de un par estado y acción. |
| s | Estado actual; s′ siguiente. |
| a | Acción actual; a′ siguiente en SARSA. |
| b | Acción candidata del máximo en Q-learning. |
| r | Recompensa observada. |
| γ | Descuento de continuación. |
| α | Tamaño de actualización entre cero y uno. |
| ′ | Prima: estado o acción siguientes. |
| ← | Asignación: reemplaza el valor anterior. |
| max | Selecciona el mayor valor de las acciones siguientes. |

## Condiciones

Es una sola transición educativa; no certifica convergencia. Una tarea terminal no hace bootstrap. Los resultados generales de convergencia exigen exploración, condiciones de pasos y otras hipótesis. En SARSA la política de comportamiento determina el objetivo; Q-learning es fuera de política.

## Unidades

Q y recompensas comparten unidad de retorno; α y γ son adimensionales. Un terminal aporta continuación cero.
