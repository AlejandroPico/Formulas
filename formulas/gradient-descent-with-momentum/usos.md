# Usos

El laboratorio deriva F=(x²+κy²)/2 exactamente: g=(x,κy). La memoria acumula gradientes con v=βv+g; es la convención no normalizada de velocidad, y el paso resta ηv. El recorrido contiene iteraciones reales, no una interpolación animada; las curvas muestran el paisaje y las barras el último gradiente y paso. En el laboratorio contrasta una predicción, construye el objetivo y explica qué supuesto permite el resultado.

## Del experimento al contexto

Optimización de F=(x²+κy²)/2, con gradientes exactos y memoria inicial cero. Los pasos son iteraciones reales del algoritmo seleccionado.

## Condiciones antes de aplicar

η>0, β y β2 menores que uno, ε=10⁻⁸; operaciones componente a componente. La escala del paso y memoria afectan estabilidad y no garantizan descenso en cada iteración. Parámetros, gradientes y pérdida usan unidades reducidas; en RMSProp el control β de primera memoria no interviene.
