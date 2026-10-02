# Layer Normalization: normalización por capa

Tres características de una muestra se normalizan juntas. Otra muestra desplazada 50 unidades se procesa por separado; no se mezclan estadísticas entre muestras.

## Magnitudes y notación

| Símbolo | Interpretación |
| :-- | :-- |
| μ | Media entre características de una muestra. |
| d | Número de características normalizadas. |
| j | Índice de característica. |
| x | Característica de entrada. |
| σ | Desviación entre características; σ² es varianza. |
| y | Característica de salida. |
| γ | Escala afín aprendible por característica. |
| β | Desplazamiento aprendido por característica. |
| ε | Estabilizador positivo, 10⁻⁵ aquí. |

## Condiciones

No mezcla las estadísticas entre muestras. ε evita división por cero; un vector constante queda en β. Con γj distintos la media de salidas no debe ser β ni la varianza uno. El efecto de cambiar escala común no es invariancia exacta por ε.

## Unidades

Las coordenadas y parámetros usan escala numérica de referencia. Probabilidades, razones, fases en radianes y pesos de atención son adimensionales. Las dimensiones de matrices deben permitir todos los productos; el laboratorio declara cada vector reducido.
