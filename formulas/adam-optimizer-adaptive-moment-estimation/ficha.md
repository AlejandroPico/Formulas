# Adam Optimizer: estimación adaptativa de momentos

Optimización de F=(x²+κy²)/2, con gradientes exactos y memoria inicial cero. Los pasos son iteraciones reales del algoritmo seleccionado.

## Magnitudes y notación

| Símbolo | Interpretación |
| :-- | :-- |
| v | Media exponencial de gradientes cuadrados. |
| m | Media exponencial de gradientes. |
| g | Gradiente calculado en los parámetros anteriores. |
| θ | Vector de parámetros. |
| t | Número de iteración, comenzando en uno. |
| β | Coeficiente de memoria; sus índices distinguen primer y segundo momento. |
| η | Tamaño de paso. |
| ε | Estabilizador positivo del denominador. |
| ˆ | Corrección del sesgo inicial por memoria cero. |

## Condiciones

η>0, β y β2 menores que uno, ε=10⁻⁸; operaciones componente a componente. La escala del paso y memoria afectan estabilidad y no garantizan descenso en cada iteración. Parámetros, gradientes y pérdida usan unidades reducidas; en RMSProp el control β de primera memoria no interviene.

## Unidades

Variables numéricas en unidades de referencia; los índices y probabilidades son adimensionales. Una distancia conserva la escala de las características; su cuadrado tiene escala cuadrática.
