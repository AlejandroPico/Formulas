# Significado

El modelo de Black-Scholes estima el precio teórico de una opción europea de compra bajo un conjunto de hipótesis idealizadas.

La fórmula combina el precio actual del activo `S`, el precio de ejercicio `K`, el tiempo hasta vencimiento `T`, la tasa libre de riesgo `r` y la volatilidad `sigma`.

La volatilidad es decisiva: a mayor incertidumbre sobre el precio futuro del activo, mayor suele ser el valor temporal de la opción.

El simulador traza la curva del precio de una call frente al precio del subyacente. Los controles permiten modificar volatilidad, strike y vencimiento para observar cómo cambia la curvatura y el valor de la opción.
