# DBSCAN: agrupamiento espacial basado en densidad

DBSCAN sobre diez puntos. MinPts incluye al propio punto; los núcleos expanden grupos, los bordes no los expanden y el ruido puede cambiar al ajustar ε.

## Magnitudes y notación

| Símbolo | Interpretación |
| :-- | :-- |
| N | Vecindario cerrado de radio ε. |
| ε | Radio máximo de vecindad. |
| x | Punto central. |
| y | Punto candidato a vecino. |
| MinPts | Mínimo de puntos, incluido el propio, para ser núcleo. |
| ∣ | Cardinalidad: número de puntos del vecindario. |
| { | Abre el conjunto de vecinos. |
| } | Cierra el conjunto de vecinos. |
| ⟹ | La condición implica que x es núcleo. |

## Condiciones

Métrica, escala, ε y MinPts forman parte del modelo. Densidades distintas pueden ser difíciles con un único ε; un borde compartido depende del orden de expansión. Ruido es una etiqueta del resultado actual, no una propiedad universal del punto.

## Unidades

Variables numéricas en unidades de referencia; los índices y probabilidades son adimensionales. Una distancia conserva la escala de las características; su cuadrado tiene escala cuadrática.
