# Usos

Distinguir transporte de difusión y comprobar estabilidad de discretizaciones. La comparación exacta/numerérica usa una campana periódica, 80 celdas y tiempo continuo reconstruido con pasos internos, incluido un último paso parcial.

## Antes de aplicar

c constante, dominio periódico de longitud 10 m. Upwind se actualiza según el signo de c y CFL entre 0,1 y 1; no se presenta su ensanchamiento como difusión física.

## Qué compara el laboratorio

Dominio periódico de 10 m. La solución exacta desplaza una campana; upwind conservativo la difumina. La comparación usa 80 celdas y CFL≤1, con sentido de actualización según el signo de c.
