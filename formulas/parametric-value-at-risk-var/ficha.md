# VaR paramétrico: Value at Risk normal

VaR de una cartera hipotética con retorno simple normal en un único horizonte. La pérdida monetaria es −V·R; se muestran cuantil VaR y media de la cola ES bajo esa misma hipótesis.

## Magnitudes y notación

| Símbolo | Interpretación |
| :-- | :-- |
| R | Retorno simple del horizonte; en VaR forma parte de la abreviatura riesgo. |
| N | Familia de distribución normal. |
| μ | Media del retorno simple. |
| σ | Desviación del retorno del mismo horizonte. |
| L | Pérdida monetaria, positiva al perder. |
| V | Valor inicial positivo de cartera; en VaR forma parte de valor en riesgo. |
| a | Parte de VaR: abreviatura Value at Risk. |
| E | Parte de ES: expected shortfall. |
| S | Parte de ES: expected shortfall. |
| α | Nivel de confianza del cuantil de pérdida. |
| z | Cuantil normal estándar al nivel α. |
| φ | Densidad de normal estándar evaluada en zα. |
| ∼ | Distribuido según la ley normal indicada. |

## Condiciones

Un único horizonte, retorno normal simple, posición lineal y parámetros hipotéticos fijos. No aplicar mecánicamente a opciones, retornos con colas pesadas o posiciones no lineales. VaR no es pérdida máxima ni limita la pérdida condicional. No se usa una anualización √tiempo sin justificar dependencia y horizonte.

## Unidades

μ y σ se introducen en porcentajes del mismo horizonte y se convierten a fracciones. V,L,VaR y ES en u.m. α es probabilidad de confianza, zα cuantil normal y φ densidad estándar adimensional. El eje de pérdida tiene signo positivo para pérdidas y negativo para ganancias.
