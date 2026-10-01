# Teorema de Parseval

Una transformación de Fourier conserva energía si se usa la normalización correcta. Esta ficha distingue la DFT finita del caso continuo: el factor depende de la convención.

## Magnitudes

| Símbolo | Significado |
| :-- | :-- |
| X | Coeficiente de la DFT directa no normalizada. |
| x | Muestra temporal de la secuencia finita. |
| N | Número de muestras, 32 en el laboratorio. |
| n | Índice de muestra temporal. |
| k | Índice de frecuencia de la DFT. |
| i | Unidad imaginaria en el núcleo exponencial, i²=−1. |
| f | Señal continua; sombrero identifica su transformada con núcleo e^(−2πitξ). |
| t | Variable temporal de la señal continua. |
| ξ | Frecuencia en ciclos por unidad de tiempo. |

## Alcance

Secuencia finita para DFT; funciones de cuadrado integrable para la igualdad continua. Cambiar a frecuencia angular y núcleo e^(−iωt) introduce el correspondiente 1/(2π).

## Unidades

La suma discreta usa unidades de señal al cuadrado, u². Para energía integrada en tiempo aparece además tiempo; una energía física necesita factores del sistema, por ejemplo resistencia eléctrica. Cada barra es |X_k|²/N, no la amplitud del armónico.
