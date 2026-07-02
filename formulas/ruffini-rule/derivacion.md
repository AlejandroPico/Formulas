# Derivación

Tomemos un polinomio cúbico:

`P(x)=Ax^3+Bx^2+Cx+D`.

Queremos dividirlo por `x-r`. El cociente será un polinomio cuadrático:

`Q(x)=qx^2+sx+t`.

La identidad de división dice:

`P(x)=(x-r)Q(x)+R`.

Ruffini permite obtener `q`, `s`, `t` y `R` usando solo coeficientes. Se baja el primer coeficiente `A`. Luego se multiplica por `r` y se suma al siguiente coeficiente. El proceso se repite hasta llegar al resto.

Para coeficientes `[A,B,C,D]`:

- Primer coeficiente del cociente: `A`.
- Segundo: `B+rA`.
- Tercero: `C+r(B+rA)`.
- Resto: `D+r(C+r(B+rA))`.

Ese resto coincide con `P(r)`. Si vale cero, la división es exacta y `x-r` es factor del polinomio.
