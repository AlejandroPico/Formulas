# Significado

Optimización de F=(x²+κy²)/2, con gradientes exactos y memoria inicial cero. Los pasos son iteraciones reales del algoritmo seleccionado.

## Qué conserva y qué cambia

El laboratorio deriva F=(x²+κy²)/2 exactamente: g=(x,κy). La memoria acumula gradientes con v=βv+g; es la convención no normalizada de velocidad, y el paso resta ηv. El recorrido contiene iteraciones reales, no una interpolación animada; las curvas muestran el paisaje y las barras el último gradiente y paso.

## Primera predicción

Optimización de F=(x²+κy²)/2, con gradientes exactos y memoria inicial cero. Los pasos son iteraciones reales del algoritmo seleccionado. Calcula pérdida tras los pasos con los datos iniciales. Pérdida tras los pasos=6,525 . v←βv+g; θ←θ−ηv.
