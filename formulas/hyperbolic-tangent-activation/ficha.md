# Tangente hiperbólica (tanh)

tanh conserva el signo y limita su salida entre −1 y 1. Lejos de cero se satura y su derivada se vuelve pequeña, lo que puede atenuar gradientes.

## Magnitudes

| Símbolo | Significado |
| :-- | :-- |
| z | Preactivación, argumento de la tangente hiperbólica. |
| x | Entrada de la neurona. |
| w | Peso que escala la entrada. |
| b | Sesgo aditivo. |
| y | Salida de activación. |
| tanh | Tangente hiperbólica; función suave, impar y saturante. |

## Alcance

Argumentos reales y adimensionales. Saturación no equivale a un corte discontinuo; para valores finitos la función matemática sigue dentro del intervalo abierto (−1,1), aunque el redondeo pueda dar ±1.

## Unidades

z e y sin dimensión. Si x tiene una unidad u, w debe usar u⁻¹ y b ser adimensional. dy/dx tiene u⁻¹. No se confunde una derivada respecto de z con otra respecto de x cuando cambia w.
