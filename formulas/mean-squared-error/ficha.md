# Error cuadrático medio

Elevar residuos al cuadrado evita cancelación de signos y da más peso a errores grandes. La raíz recupera la unidad de la respuesta; no recupera el signo de cada error.

## Magnitudes

| Símbolo | Significado |
| :-- | :-- |
| MSE | Error cuadrático medio: media de residuos al cuadrado. |
| RMSE | Raíz del error cuadrático medio, en unidades de la respuesta. |
| M | Parte del nombre MSE o RMSE: error cuadrático medio. |
| S | Parte del nombre MSE: indica cuadrado. |
| E | Parte del nombre MSE: indica error. |
| R | Parte del nombre RMSE: indica raíz. |
| y | Respuesta observada; con sombrero es respuesta predicha. |
| x | Entrada de una observación. |
| m | Pendiente de la recta de predicción. |
| b | Ordenada en el origen. |
| n | Número positivo de observaciones. |
| i | Índice de observación. |

## Alcance

n>0 y respuestas numéricas comparables. El MSE no es negativo; valores grandes pueden deberse a escala o a observaciones extremas, no solo a un peor algoritmo.

## Unidades

Si y tiene unidad u, residuo usa u, MSE u² y RMSE u. Reescalar y por a multiplica MSE por a². La gráfica de contribuciones muestra cuadrados de residuos, con alturas normalizadas para caber en pantalla.
