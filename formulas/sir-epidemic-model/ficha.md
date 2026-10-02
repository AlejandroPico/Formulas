# Modelo SIR: dinámica de epidemias

Población cerrada SIR con mezcla homogénea. Parámetros ficticios y recuperación que confiere inmunidad durante el experimento.

## Magnitudes y notación

| Símbolo | Interpretación |
| :-- | :-- |
| S | Número susceptible; el gráfico representa S/N. |
| I | Número infeccioso; el gráfico representa I/N. |
| R | Número recuperado o retirado de la transmisión. |
| N | Tamaño total constante de población. |
| β | Transmisión por tiempo bajo mezcla homogénea y fracciones normalizadas. |
| γ | Tasa de recuperación, inversa del tiempo medio infeccioso. |

## Condiciones

Modelo determinista cerrado y homogéneo, sin latencia, nacimientos, mortalidad ni reinfecciones. R significa recuperado o retirado del proceso de transmisión en este ejemplo. Los parámetros son ficticios; no describen una enfermedad identificada ni proporcionan decisiones sanitarias.

## Unidades

β,γ y σ cuando aparece tienen día⁻¹. S,E,I,R son personas en las ecuaciones, pero las curvas muestran fracciones divididas por N. R0 y Re son adimensionales. El reloj visual se convierte: 20 unidades corresponden a 100 días. Paso de integración 0,05 días.
