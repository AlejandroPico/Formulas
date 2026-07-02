# Derivación

Empezamos con el caso mónico, que es el más claro:

`x^2+bx+c=0`.

Si las raíces son `x_1` y `x_2`, entonces el polinomio debe anularse cuando `x=x_1` y cuando `x=x_2`. Por tanto, puede escribirse como producto de factores lineales:

`(x-x_1)(x-x_2)=0`.

Expandimos el producto:

`(x-x_1)(x-x_2)=x^2-x_2x-x_1x+x_1x_2`.

Agrupando los términos lineales:

`x^2-(x_1+x_2)x+x_1x_2`.

Ahora comparamos esta expresión con la forma general mónica:

`x^2+bx+c`.

El coeficiente de `x` debe coincidir, y el término independiente también. Por tanto:

`b=-(x_1+x_2)`

`c=x_1x_2`.

Reordenando la primera igualdad obtenemos:

`x_1+x_2=-b`

`x_1x_2=c`.

Para una cuadrática no mónica `ax^2+bx+c=0`, se divide toda la ecuación entre `a`, siempre que `a` no sea cero:

`x^2+(b/a)x+(c/a)=0`.

Aplicando el resultado anterior:

`x_1+x_2=-b/a`

`x_1x_2=c/a`.

La derivación muestra que las fórmulas de Viète no son una técnica independiente de la factorización: salen directamente de expandir el producto formado por las raíces.
