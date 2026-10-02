# Batch Normalization

Una característica en un lote de cuatro muestras. Entrenamiento usa media y varianza del lote con divisor N; inferencia usa aquí referencias fijas μ=0, varianza=1.

## Magnitudes y notación

| Símbolo | Interpretación |
| :-- | :-- |
| μ | Media de la característica en el lote. |
| B | Identifica mini-lote de entrenamiento. |
| N | Número de muestras del lote. |
| x | Valor de entrada de una característica. |
| i | Índice de muestra. |
| σ | Desviación del lote; σ² es varianza con divisor N. |
| ε | Estabilizador positivo, 10⁻⁵ aquí. |
| y | Salida tras transformación afín. |
| γ | Escala aprendible. |
| β | Desplazamiento aprendible. |
| ˆ | Entrada centrada y normalizada. |

## Condiciones

Entrenamiento e inferencia usan estadísticas distintas. Con ε>0 la varianza normalizada no es exactamente uno; si el lote es constante la salida es β. No se usa varianza muestral insesgada N−1. Los frameworks pueden guardar estimadores distintos para inferencia; este modelo declara los suyos.

## Unidades

Las coordenadas y parámetros usan escala numérica de referencia. Probabilidades, razones, fases en radianes y pesos de atención son adimensionales. Las dimensiones de matrices deben permitir todos los productos; el laboratorio declara cada vector reducido.
