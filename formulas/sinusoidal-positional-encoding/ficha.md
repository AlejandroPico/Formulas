# Codificación posicional sinusoidal

Vector posicional de dimensión cuatro, con frecuencias 1 y 0,01 radianes por posición. No son probabilidades ni posiciones aprendidas.

## Magnitudes y notación

| Símbolo | Interpretación |
| :-- | :-- |
| 10000 | Base que distribuye las escalas de frecuencia. |
| PE | Componente de codificación posicional. |
| p | Posición de token. |
| i | Índice de par de frecuencias desde cero. |
| d | Dimensión total del vector, cuatro aquí. |
| sin | Seno con fase en radianes. |
| cos | Coseno con fase en radianes. |

## Condiciones

d debe ser par para pares completos; índices i empiezan en cero. Fases en radianes. El vector se añade normalmente al embedding en la arquitectura original, pero aquí se estudia solo la codificación. No se afirma crecimiento monótono ni unicidad global de la posición para todo real.

## Unidades

Las coordenadas y parámetros usan escala numérica de referencia. Probabilidades, razones, fases en radianes y pesos de atención son adimensionales. Las dimensiones de matrices deben permitir todos los productos; el laboratorio declara cada vector reducido.
