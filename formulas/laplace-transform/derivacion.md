# Derivación

La definición parte de una idea sencilla: tomar la función temporal `f(t)` y calcular un área ponderada por una exponencial decreciente:

`F(s)=∫_0^∞ e^{-st}f(t)dt`.

El factor `e^{-st}` cumple dos funciones. Primero, atenúa la contribución de tiempos grandes. Segundo, introduce el parámetro `s`, que permite estudiar la señal bajo distintas escalas de decaimiento.

Para el caso del simulador se toma `f(t)=1`. Entonces:

`F(s)=∫_0^∞ e^{-st}dt`.

Si `s>0`, se integra directamente:

`∫ e^{-st}dt=−e^{-st}/s`.

Evaluando entre `0` e `∞`:

`F(s)=0−(−1/s)=1/s`.

La condición `s>0` no es un detalle menor: garantiza que `e^{-st}` tiende a cero cuando `t` tiende a infinito. Si el decaimiento no vence a la señal original, la integral puede divergir.

En problemas más generales, derivar una función en el tiempo produce términos algebraicos en `s`. Por eso la transformada de Laplace es tan útil para ecuaciones diferenciales lineales con condiciones iniciales.