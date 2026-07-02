# Significado

El producto vectorial toma dos vectores de `R3` y produce un tercer vector perpendicular a ambos. Su direccion se determina con la regla de la mano derecha y su modulo coincide con el area del paralelogramo formado por los dos vectores.

En el caso visual del simulador se trabaja con vectores contenidos en el plano `xy`. Entonces el resultado apunta en el eje `z`, y su componente principal es `u1 v2 - u2 v1`. El signo indica orientacion y el valor absoluto indica area.

La idea central es que el producto vectorial mide perpendicularidad orientada. Si los vectores son paralelos, el area es cero. Si forman un angulo grande y tienen buena longitud, el area aumenta.
