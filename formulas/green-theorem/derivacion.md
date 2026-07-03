# Derivación

La demostración puede entenderse dividiendo la región `D` en muchas celdas pequeñas. En cada celda, la circulación alrededor de su frontera depende del rotacional local:

`∂Q/∂x−∂P/∂y`.

Cuando se suman todas las celdas, las contribuciones de los bordes interiores se cancelan: cada borde compartido se recorre una vez en un sentido y otra vez en el sentido contrario.

Después de esa cancelación telescópica, solo queda la frontera exterior `C`. Por eso la suma de circulaciones locales del interior equivale a la circulación global por el contorno.

Para el campo del simulador `F=(-y,x)`, se tiene `P=-y` y `Q=x`. Entonces:

`∂Q/∂x=1` y `∂P/∂y=-1`.

Por tanto:

`∂Q/∂x−∂P/∂y=2`.

Si `D` es un disco de radio `R`, la integral doble vale `2πR²`, que coincide con la circulación sobre la circunferencia.