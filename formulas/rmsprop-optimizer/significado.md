# Significado

Optimización de F=(x²+κy²)/2, con gradientes exactos y memoria inicial cero. Los pasos son iteraciones reales del algoritmo seleccionado.

## Qué conserva y qué cambia

El laboratorio deriva F=(x²+κy²)/2 exactamente: g=(x,κy). RMSProp acumula media exponencial de gradientes cuadrados y divide cada componente por su raíz más ε. No aplica corrección de sesgo en esta variante. El recorrido contiene iteraciones reales, no una interpolación animada; las curvas muestran el paisaje y las barras el último gradiente y paso.

## Primera predicción

Optimización de F=(x²+κy²)/2, con gradientes exactos y memoria inicial cero. Los pasos son iteraciones reales del algoritmo seleccionado. Calcula pérdida tras los pasos con los datos iniciales. Pérdida tras los pasos=9,2715 . v←β2v+(1−β2)g²; θ←θ−ηg/(√v+ε).
