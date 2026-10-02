# Transformada de Fourier

La transformada distingue cuánto y con qué fase contribuye cada frecuencia. La definición continua integra sobre toda la recta; el simulador usa una DFT finita, cuyos bins dependen de la ventana y del muestreo.

## Magnitudes

| Símbolo | Significado |
| :-- | :-- |
| f | Función continua que se descompone en frecuencias. |
| ξ | Frecuencia en ciclos por unidad de x, no frecuencia angular. |
| x | Variable continua; x_j es la muestra j de una señal discreta. |
| i | Unidad imaginaria, i²=−1; no es aquí un índice de muestra. |
| X | Coeficiente complejo de la DFT sin normalizar. |
| N | Número de muestras de la ventana discreta; 64 en el laboratorio. |
| j | Índice de muestra, de 0 a N−1. |
| k | Índice del bin de frecuencia discreta. |
| π | Número pi, fija una vuelta completa de fase mediante 2π. |

## Alcance

La inversión continua exige condiciones de regularidad o interpretación en espacios funcionales. El experimento discreto limita los tonos a bins enteros de 1 a 12 Hz y 64 muestras/s; no representa una transformada impropia de cosenos como función ordinaria.

## Unidades

Con x en segundos, ξ usa Hz y f̂ tiene unidad de f por segundo. La DFT normalizada conserva la unidad de amplitud de la señal. La fase usa radianes y N,j,k son adimensionales.
