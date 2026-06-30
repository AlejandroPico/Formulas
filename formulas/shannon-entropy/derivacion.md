# Derivación

Shannon buscó una función que midiera incertidumbre y cumpliera propiedades razonables: continuidad, crecimiento con el número de resultados equiprobables y aditividad para fuentes independientes.

Estas condiciones conducen a una forma logarítmica. Para una distribución discreta, la incertidumbre media se obtiene ponderando la sorpresa de cada resultado por su probabilidad.

La sorpresa de un evento de probabilidad `p` se toma como `-log2(p)`. Al promediar sobre todos los eventos aparece `H = -sum p log2 p`.

En el caso binario, solo hay dos probabilidades: `p` y `1-p`.
