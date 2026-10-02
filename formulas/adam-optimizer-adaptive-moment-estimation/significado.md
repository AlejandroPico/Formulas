# Significado

Optimización de F=(x²+κy²)/2, con gradientes exactos y memoria inicial cero. Los pasos son iteraciones reales del algoritmo seleccionado.

## Qué conserva y qué cambia

El laboratorio deriva F=(x²+κy²)/2 exactamente: g=(x,κy). Adam combina media exponencial de gradiente y cuadrado, corrige su sesgo por inicialización en cero y divide componente a componente. No es AdamW y no añade regularización. El recorrido contiene iteraciones reales, no una interpolación animada; las curvas muestran el paisaje y las barras el último gradiente y paso.

## Primera predicción

Optimización de F=(x²+κy²)/2, con gradientes exactos y memoria inicial cero. Los pasos son iteraciones reales del algoritmo seleccionado. Calcula pérdida tras los pasos con los datos iniciales. Pérdida tras los pasos=11,425 . m←β1m+(1−β1)g; v←β2v+(1−β2)g²; corrige sesgo con 1−β^t antes del paso.
