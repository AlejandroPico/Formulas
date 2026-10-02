# Pérdidas de regresión: MSE, MAE y Huber

Error e=predicción−objetivo. Se comparan e², |e| y Huber con umbral δ>0, sin confundir suma de muestras y pérdida de una muestra.

## Magnitudes y notación

| Símbolo | Interpretación |
| :-- | :-- |
| e | Error firmado: predicción menos objetivo. |
| y | Objetivo observado; ŷ es predicción. |
| L | Pérdida de una muestra; índice distingue familia. |
| δ | Umbral positivo, en unidades del error. |
| ˆ | Marca la predicción, no el objetivo. |
| ∣ | Valor absoluto del error. |

## Condiciones

δ>0 y misma escala que e. MSE usa e² sin medio; Huber sí usa medio. MAE no tiene derivada clásica en cero; minimizar una pérdida robusta no prueba ausencia de valores atípicos ni evita revisar datos.

## Unidades

e,y,δ tienen unidad de respuesta; MSE y Huber tienen unidad cuadrática, MAE unidad de respuesta.
