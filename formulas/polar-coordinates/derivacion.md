# Derivación

Un punto polar `(r,θ)` forma un triángulo rectángulo con el eje horizontal.

La hipotenusa del triángulo mide `r`. Por definición trigonométrica:

`cos(θ)=x/r` y `sin(θ)=y/r`.

Despejando:

`x=r cos(θ)`

`y=r sin(θ)`.

La conversión inversa usa el teorema de Pitágoras para el radio:

`r=sqrt(x²+y²)`.

El ángulo se obtiene con una función de tipo `atan2`, que tiene en cuenta el cuadrante del punto.