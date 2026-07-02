# Derivación

Sea una progresión aritmética con `n` términos:

`S_n = a_1 + a_2 + a_3 + ... + a_{n-1} + a_n`.

Como la diferencia entre términos consecutivos es constante, podemos escribir los extremos de forma simétrica. El primer término es `a_1`; el último es `a_n`. El segundo término es `a_1+d`; el penúltimo es `a_n-d`. Al sumarlos:

`a_1+a_n = (a_1+d)+(a_n-d)`.

La misma cancelación ocurre con todos los pares simétricos. Por eso escribimos la suma dos veces, una en orden directo y otra en orden inverso:

`S_n = a_1 + a_2 + ... + a_{n-1} + a_n`

`S_n = a_n + a_{n-1} + ... + a_2 + a_1`.

Al sumar columna a columna, cada pareja vale `a_1+a_n`, y hay `n` columnas:

`2S_n = n(a_1+a_n)`.

Dividiendo entre dos se obtiene:

`S_n = n(a_1+a_n)/2`.

Si no conocemos `a_n`, usamos la fórmula del término general:

`a_n = a_1+(n-1)d`.

Sustituyendo:

`S_n = n(2a_1+(n-1)d)/2`.

La derivación muestra por qué la fórmula no depende de sumar manualmente todos los términos: depende de que la sucesión tenga diferencia constante.
