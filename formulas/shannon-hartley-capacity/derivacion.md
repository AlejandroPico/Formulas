# Derivación

La expresión combina dos factores: el número de grados de libertad por segundo que aporta el ancho de banda y la cantidad de información distinguible frente al ruido.

En un canal con ruido gaussiano, la relación señal/ruido determina cuántos niveles efectivos pueden separarse de forma fiable.

El término `log2(1+S/N)` mide bits por segundo y por hercio. Al multiplicarlo por `B`, se obtiene una tasa máxima en bits por segundo.

La presencia del `1+S/N` evita que la capacidad sea negativa y recoge el efecto conjunto de señal y ruido en la potencia total observable.
