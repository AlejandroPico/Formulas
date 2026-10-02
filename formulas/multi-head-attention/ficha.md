# Multi-Head Attention: atención multi-cabeza

Dos cabezas sobre tres claves: la primera usa q=(a,b), la segunda WQ q=(b,a). Valores escalares distintos se concatenan y proyectan con pesos w1,w2 declarados.

## Magnitudes y notación

| Símbolo | Interpretación |
| :-- | :-- |
| h | Salida de una cabeza, no constante física. |
| i | Índice de cabeza. |
| Q | Consultas originales. |
| K | Claves originales. |
| V | Valores originales. |
| W | Matriz de proyección; Q,K,V u O indican su función. |
| H | Número de cabezas. |
| O | Marca proyección final de salida. |
| Attention | Atención escalada con normalización por claves. |
| MultiHead | Resultado de concatenar y proyectar cabezas. |
| Concat | Concatenación de vectores, no suma. |
| … | Continúa la lista hasta la cabeza H. |

## Condiciones

Se muestran matrices reducidas fijas y no una red entrenada. La proyección final puede tener pesos negativos y no tiene por qué ser un promedio convexo. Dimensiones de cada proyección, concatenación y salida deben coincidir; no todas las cabezas necesariamente aprenden funciones diferentes.

## Unidades

Las coordenadas y parámetros usan escala numérica de referencia. Probabilidades, razones, fases en radianes y pesos de atención son adimensionales. Las dimensiones de matrices deben permitir todos los productos; el laboratorio declara cada vector reducido.
