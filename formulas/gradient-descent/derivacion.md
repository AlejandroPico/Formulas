# Derivación

Cerca de un punto actual, una función puede aproximarse linealmente usando su gradiente. El gradiente apunta en la dirección de mayor aumento local.

Para reducir la función, se avanza en la dirección contraria al gradiente. La magnitud del paso se regula con la tasa de aprendizaje.

En una dimensión, si `L(w)=w²`, el gradiente es `2w`. La actualización queda `w_next = w - eta · 2w`.

El proceso se repite hasta que el gradiente es pequeño, la mejora se estabiliza o se alcanza algún criterio de parada.
