# Retropropagación

Red escalar con una neurona tanh y salida lineal: z=wx+b, h=tanh(z), ŷ=vh, L=(ŷ−y)²/2. Se calcula el gradiente exacto por regla de la cadena.

## Magnitudes y notación

| Símbolo | Interpretación |
| :-- | :-- |
| z | Preactivación de la neurona. |
| w | Peso de entrada. |
| x | Entrada de la red. |
| b | Sesgo de la neurona. |
| h | Activación tanh, no constante de Planck. |
| v | Peso de salida. |
| y | Objetivo; ŷ es salida calculada. |
| L | Mitad del error cuadrático. |
| tanh | Tangente hiperbólica. |
| ˆ | Marca la predicción. |

## Condiciones

Red educativa escalar y diferenciable; no pretende entrenar un gran modelo. Calcular gradientes y actualizar pesos son operaciones distintas. Tanh puede saturar y disminuir gradientes; el gradiente tiene unidad de pérdida por unidad del parámetro.

## Unidades

Variables numéricas en unidades de referencia; los índices y probabilidades son adimensionales. Una distancia conserva la escala de las características; su cuadrado tiene escala cuadrática.
