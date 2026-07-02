# Significado

La interpolación de Lagrange construye un polinomio que pasa exactamente por una colección de puntos dados. Si conocemos nodos `(x_i,y_i)` con abscisas distintas, existe un único polinomio de grado menor o igual que `n` que atraviesa todos esos puntos.

La fórmula escribe ese polinomio como suma de funciones base `L_i(x)`. Cada base vale `1` en su propio nodo y `0` en los demás. Por eso, al evaluar el polinomio en `x_i`, solo sobrevive el término asociado a `y_i`.

La potencia de la fórmula está en que no hay que resolver un sistema lineal para obtener los coeficientes. Se construye directamente una combinación de piezas diseñadas para activar un nodo y anular el resto.

El simulador fija tres valores de `x` y permite mover las alturas `y`. La curva cambia en tiempo real, pero siempre pasa por los tres puntos marcados. Así se ve la diferencia entre interpolar y aproximar: aquí el polinomio atraviesa exactamente los datos.
