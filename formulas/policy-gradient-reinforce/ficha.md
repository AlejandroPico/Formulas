# Gradiente de política: algoritmo REINFORCE

Política Bernoulli π(1)=sigmoid(θ), retorno observado G y baseline independiente de la acción. Se calcula una muestra del estimador REINFORCE.

## Magnitudes y notación

| Símbolo | Interpretación |
| :-- | :-- |
| g | Estimador muestral del gradiente. |
| G | Retorno observado de la trayectoria. |
| b | Baseline independiente de la acción. |
| θ | Parámetro logit. |
| π | Política: distribución de acciones. |
| a | Acción Bernoulli observada, cero o uno. |
| s | Estado condicionado. |
| ∇ | Gradiente respecto de los parámetros de política. |
| ˆ | Marca de estimador muestral. |
| log | Logaritmo natural en el score de la política. |
| ∣ | Condicionado a: la distribución usa el estado y la acción indicados. |

## Condiciones

Una muestra puede tener mucho ruido; no garantiza mejora. Retorno G y baseline deben usar la misma convención. El baseline no depende de la acción muestreada y se trata constante en el score. Este ejemplo no implementa una red ni una trayectoria completa.

## Unidades

Variables numéricas en unidades de referencia; los índices y probabilidades son adimensionales. Una distancia conserva la escala de las características; su cuadrado tiene escala cuadrática.
