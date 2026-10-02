# Modelo SEIR: período de incubación

Población cerrada SEIR con latencia exponencial no infecciosa. Parámetros ficticios, mezcla homogénea y ausencia de nacimientos.

## Magnitudes y notación

| Símbolo | Interpretación |
| :-- | :-- |
| S | Número susceptible; el gráfico representa S/N. |
| E | Número expuesto latente y no infeccioso en SEIR. |
| I | Número infeccioso; el gráfico representa I/N. |
| R | Número recuperado o retirado de la transmisión. |
| N | Tamaño total constante de población. |
| β | Transmisión por tiempo bajo mezcla homogénea y fracciones normalizadas. |
| γ | Tasa de recuperación, inversa del tiempo medio infeccioso. |
| σ | Tasa de salida de latencia, inversa del tiempo medio latente. |

## Condiciones

Modelo determinista cerrado, latencia no infecciosa y exponencial, inmunidad durante el experimento, sin nacimientos ni muertes. No equiparar latencia no infecciosa con cualquier período de incubación clínico: síntomas e infecciosidad pueden tener tiempos diferentes. Parámetros ficticios y mezcla homogénea.

## Unidades

β,γ y σ cuando aparece tienen día⁻¹. S,E,I,R son personas en las ecuaciones, pero las curvas muestran fracciones divididas por N. R0 y Re son adimensionales. El reloj visual se convierte: 20 unidades corresponden a 100 días. Paso de integración 0,05 días.
