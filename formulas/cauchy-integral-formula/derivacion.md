# Derivación

La derivación parte del teorema integral de Cauchy. Si una función es holomorfa en una región, su integral sobre un contorno cerrado se anula. Para recuperar el valor en un punto `z0`, se estudia el integrando `f(z)/(z-z0)`.

Ese integrando tiene un polo simple en `z0`. Si el punto está dentro del contorno, se separa `f(z)` como `f(z0)` más una diferencia que se anula al acercarse a `z0`. La parte constante produce exactamente el factor `2 pi i`, y el resto queda controlado por holomorfía.

Al despejar, aparece la fórmula que expresa `f(z0)` como una integral sobre el contorno. La versión para derivadas se obtiene aplicando la misma idea a potencias superiores del denominador.

La consecuencia es fuerte: una función holomorfa no solo es diferenciable una vez, sino infinitamente diferenciable, y todas sus derivadas pueden recuperarse mediante integrales de frontera.
