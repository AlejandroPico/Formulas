# Derivación

A lo largo de x=x₀+ct, la regla de la cadena da dφ/dt=φ_t+cφ_x=0. Por tanto el valor inicial viaja con la característica. Para c≥0, upwind usa la celda anterior; para c<0 usa la siguiente. Con |c|Δt/Δx≤1 los nuevos valores son combinaciones convexas. Al sumar en un dominio periódico, las diferencias se cancelan y la masa discreta se conserva.

## Comprueba el resultado

Un perfil viaja a 2 m/s durante 3 s. ¿Cuánto se desplaza? Características: x=x₀+ct, con ct=6 m.

c constante, dominio periódico de longitud 10 m. Upwind se actualiza según el signo de c y CFL entre 0,1 y 1; no se presenta su ensanchamiento como difusión física.
