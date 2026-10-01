# Regresor de mínimos cuadrados

El ajuste lineal busca la recta que minimiza todos los residuos al cuadrado, no una que necesariamente pase por todos los puntos. La pendiente requiere variación de x.

## Magnitudes

| Símbolo | Significado |
| :-- | :-- |
| y | Respuesta observada; sombrero: predicción, barra: promedio. |
| x | Entrada observada; barra: promedio de entradas. |
| β | Coeficiente del ajuste; β₀ ordenada y β₁ pendiente. |
| i | Índice de dato. |
| min | Minimiza la suma de cuadrados respecto de los dos coeficientes. |

## Alcance

Al menos dos abscisas distintas. El mínimo algebraico no exige normalidad; inferencia sobre coeficientes sí requiere hipótesis adicionales sobre errores, dependencia y modelo.

## Unidades

β₀ tiene unidad de y; β₁ unidad y/x. Residuo comparte unidad de y y pérdida usa su cuadrado. MSE se divide por n; una estimación de varianza residual con dos parámetros suele dividir por n−2, y es otro objetivo.
