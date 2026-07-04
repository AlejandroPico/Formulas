# Significado

La curvatura mide cuánto se dobla una curva en un punto. Si la curva cambia de dirección muy deprisa, la curvatura es grande; si se parece localmente a una recta, la curvatura es pequeña.

Para una gráfica `y=f(x)`, la curvatura se calcula con:

`κ=|f''(x)|/[1+(f'(x))²]^(3/2)`.

El radio de curvatura es `R=1/κ`. Ese radio pertenece al círculo osculador: el círculo que mejor se ajusta a la curva en ese punto.

El simulador usa una parábola suave. Al mover el punto de evaluación, se ve cómo cambia el círculo que toca la curva con la misma dirección local.