# Derivación

La sigmoide logística puede verse como una normalización suave de una razón exponencial.

Su forma `1/(1+e^{-x})` hace que la salida sea positiva, acotada y creciente.

Al derivarla se obtiene una expresión especialmente simple: `sigma'(x)=sigma(x)(1-sigma(x))`.

Esa derivada fue útil en redes neuronales clásicas, aunque puede hacerse muy pequeña en los extremos, produciendo saturación.
