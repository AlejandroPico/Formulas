# Derivación

La derivación parte de modelar el precio del activo como un movimiento geométrico browniano.

Mediante una cartera replicante formada por activo y bono libre de riesgo se elimina el componente aleatorio instantáneo. Esa cobertura conduce a una ecuación diferencial parcial para el precio de la opción.

La ecuación se transforma en una forma equivalente a la ecuación del calor y se resuelve para la condición terminal de una call europea.

El resultado final introduce `d1` y `d2`, que se evalúan con la distribución normal acumulada `N`.
