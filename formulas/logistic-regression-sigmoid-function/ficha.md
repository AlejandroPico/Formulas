# Regresión logística: función sigmoide

La regresión logística añade un modelo y datos a la función sigmoide. Una probabilidad y una decisión son diferentes: el umbral decide la clase, mientras peso y sesgo determinan la probabilidad.

## Magnitudes

| Símbolo | Significado |
| :-- | :-- |
| p | Probabilidad modelada de clase 1 condicionada a las características. |
| y | Etiqueta binaria observada, cero o uno. |
| x | Vector de características; el ejemplo usa una característica escalar. |
| w | Vector de pesos que define el predictor lineal. |
| b | Sesgo u ordenada del predictor. |
| z | Puntuación lineal adimensional antes de aplicar la sigmoide. |
| σ | Función sigmoide logística, que convierte puntuación en probabilidad. |
| ℓ | Pérdida logarítmica para una observación Bernoulli. |
| e | Base de la exponencial natural. |

## Alcance

Etiquetas binarias y características definidas. Los pesos deben dar un predictor adimensional. El umbral entre 0 y 1 solo cambia la decisión; no altera la curva ni optimiza la pérdida. Probabilidad de 0,5 no es certeza de pertenencia.

## Unidades

p,σ,ℓ y z adimensionales. Si una característica tiene unidad física, el peso correspondiente tiene su inversa. Umbral del control en porcentaje se divide entre 100. Logaritmos naturales para la pérdida, no logaritmos de base diez.
