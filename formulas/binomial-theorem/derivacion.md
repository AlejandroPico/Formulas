# Derivación

`(a+b)^n` significa multiplicar `n` factores iguales. En cada factor se elige `a` o `b`.

Si se elige `b` exactamente `k` veces, aparece el término `a^{n-k}b^k`. El número de formas de elegir esas `k` posiciones es `binom(n,k)`.

Sumando todos los casos desde `k=0` hasta `k=n` se obtiene la fórmula.
