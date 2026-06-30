# Significado

La ecuación logística describe un crecimiento que empieza casi exponencial, pero se frena al acercarse a una capacidad de carga `K`.

El término `rN` impulsa el crecimiento proporcional a la población actual. El factor `1 - N/K` introduce la saturación: si `N` es pequeña, el factor está cerca de uno; si `N` se aproxima a `K`, el factor tiende a cero.

Así se obtiene una curva en forma de S, más realista que el crecimiento exponencial indefinido para poblaciones con recursos limitados.

El simulador muestra la evolución temporal de `N`. Los controles permiten modificar la tasa de crecimiento `r` y la capacidad de carga `K`.
