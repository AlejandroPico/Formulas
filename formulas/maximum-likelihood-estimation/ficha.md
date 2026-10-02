# Estimación por máxima verosimilitud

Ensayos Bernoulli independientes: k éxitos en n observaciones. El estimador maximiza la verosimilitud de los datos observados, sin tratar el parámetro como aleatorio.

## Magnitudes y notación

| Símbolo | Interpretación |
| :-- | :-- |
| θ | Parámetro o vector de parámetros del modelo. |
| L | Verosimilitud de los datos observados como función del parámetro. |
| x | Datos observados; xi es una observación. |
| i | Índice de observación. |
| n | Número de ensayos independientes. |
| p | Probabilidad Bernoulli; en la primera expresión p(xi∣θ) es ley del dato. |
| k | Número observado de éxitos. |
| ℓ | Log-verosimilitud sin constante combinatoria. |
| argmax | Conjunto o valor de parámetro que maximiza la función indicada. |
| ∏ | Producto sobre todas las observaciones independientes. |
| ∣ | Condicionado al parámetro indicado. |
| ˆ | Sombrero: estimador del parámetro construido con la muestra. |

## Condiciones

Datos Bernoulli independientes con parámetro común y n positivo. En el experimento k≤10≤n, incluyendo máximos en cero y uno. La expresión logarítmica usa límites para términos de conteo cero. Una probabilidad candidata no representa la distribución del parámetro; una inferencia bayesiana necesitaría prior y normalización.

## Unidades

k,n son conteos sin unidades; p es probabilidad adimensional. ℓ utiliza logaritmos naturales y se expresa sin el factor combinatorio constante respecto a p. Para densidades continuas, las unidades y referencias de la verosimilitud exigen cuidado al comparar modelos.
