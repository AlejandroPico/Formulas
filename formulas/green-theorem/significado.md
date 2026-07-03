# Significado

El teorema de Green establece una equivalencia entre una integral de línea alrededor de una curva cerrada `C` y una integral doble sobre la región `D` encerrada por esa curva.

La integral de línea mide circulación: cuánto acompaña el campo vectorial al recorrido por la frontera. La integral doble mide rotación interna acumulada: cuánto giro local hay repartido por toda la región.

La forma habitual es:

`∮(Pdx+Qdy)=∬(∂Q/∂x−∂P/∂y)dA`.

En el simulador se usa el campo `F=(-y,x)`. Ese campo gira alrededor del origen y tiene rotacional constante igual a `2`. Por eso, para un disco de radio `R`, la circulación de la frontera coincide con `2` multiplicado por el área interior.

La idea profunda es que el comportamiento global de una frontera puede reconstruirse sumando el comportamiento local del interior.