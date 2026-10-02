# Agrupamiento K-means: K-medias

Lloyd sobre seis puntos, asignación al centro más próximo y actualización por media. Los empates se resuelven por orden de centro y un centro vacío se conserva.

## Magnitudes y notación

| Símbolo | Interpretación |
| :-- | :-- |
| J | Suma de distancias euclídeas al cuadrado. |
| n | Número de puntos. |
| x | Punto o vector de características. |
| μ | Centroide del grupo. |
| c | Índice del centro asignado. |
| i | Índice de punto. |
| j | Índice de centro. |
| C | Conjunto de puntos asignados a un centro. |
| argmin | Índice que minimiza la distancia. |
| ∣ | Cardinalidad del conjunto C en el denominador, no norma de vector. |

## Condiciones

K debe elegirse y la solución depende de los centros iniciales. Un grupo vacío conserva su centro en esta demostración. Empates se resuelven por índice; no se promete óptimo global ni detección de formas no convexas.

## Unidades

Variables numéricas en unidades de referencia; los índices y probabilidades son adimensionales. Una distancia conserva la escala de las características; su cuadrado tiene escala cuadrática.
