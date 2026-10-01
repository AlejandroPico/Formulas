# Aprendizaje

## Primero predice

Una transformación de Fourier conserva energía si se usa la normalización correcta. Esta ficha distingue la DFT finita del caso continuo: el factor depende de la convención.

32 muestras periódicas de x=offset+A cos t+B sin 2t. La DFT directa no se normaliza; cada barra muestra |X[k]|²/N. Se cuentan también las frecuencias negativas.

## Tres formas de aprender

**Energía · Señal · Espectro**

Comparar energía en muestras y espectro; comprobar implementaciones de DFT. El laboratorio usa offset+A cos t+B sin2t y 32 muestras, incluyendo ambos lados de las frecuencias; no elimina la mitad negativa al contar energía.

## Cuatro misiones

1. **Predice el resultado.** 32 muestras de coseno de amplitud 1, sin offset. ¿Qué energía discreta tienen?

2. **Diseña una solución.** Ajusta la amplitud para que la energía discreta sea 64.

3. **Piensa antes de cambiar.** Si omites el factor 1/N en la DFT no normalizada…

4. **Un paso más.** Con amplitud 1 y offset=1, ¿qué energía hay en 32 muestras?

Hay pistas, comprobación y reintentos. Después de acertar, explica qué cambió y qué se mantuvo. Los controles tienen etiquetas y admiten teclado; las vistas 3D admiten giro con ratón, tacto o flechas. Secuencia finita para DFT; funciones de cuadrado integrable para la igualdad continua. Cambiar a frecuencia angular y núcleo e^(−iωt) introduce el correspondiente 1/(2π).
