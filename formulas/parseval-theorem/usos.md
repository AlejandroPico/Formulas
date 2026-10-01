# Usos

Comparar energía en muestras y espectro; comprobar implementaciones de DFT. El laboratorio usa offset+A cos t+B sin2t y 32 muestras, incluyendo ambos lados de las frecuencias; no elimina la mitad negativa al contar energía.

## Antes de aplicar

Secuencia finita para DFT; funciones de cuadrado integrable para la igualdad continua. Cambiar a frecuencia angular y núcleo e^(−iωt) introduce el correspondiente 1/(2π).

## Qué compara el laboratorio

32 muestras periódicas de x=offset+A cos t+B sin 2t. La DFT directa no se normaliza; cada barra muestra |X[k]|²/N. Se cuentan también las frecuencias negativas.
