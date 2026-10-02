# Perplejidad de un modelo de lenguaje

Cuatro probabilidades condicionales del token que realmente apareció, una por posición. No son cuatro categorías que deban sumar uno; su producto es la probabilidad de la secuencia bajo el modelo.

## Magnitudes y notación

| Símbolo | Interpretación |
| :-- | :-- |
| P | Parte de PPL: perplejidad del modelo evaluado. |
| L | Parte de PPL: perplejidad de la secuencia. |
| N | Cantidad de tokens observados en evaluación. |
| t | Índice de posición del token. |
| p | Probabilidad condicional que el modelo asigna al token observado. |
| w | Token observado o contexto anterior según índice. |
| H | Entropía cruzada media del texto de prueba; H2 usa base dos. |
| ∣ | Condicionado al contexto anterior de tokens. |
| < | Tokens con posiciones anteriores a t. |

## Condiciones

Probabilidades condicionales positivas, mismo conjunto de evaluación y tokenización para comparar modelos. No equivale necesariamente a número de palabras posibles ni calidad semántica. Una probabilidad cero de un token observado da perplejidad infinita; controles positivos evitan esa singularidad. La cadena omite factores de inicio ya incorporados en cada contexto.

## Unidades

Probabilidades y perplejidad adimensionales. NLL media en nats/token; H2 en bits/token. PPL≥1 para probabilidades en (0,1], con igualdad si cada token observado tiene probabilidad uno. Se informa pérdida por token, no por carácter o palabra mezclados.
