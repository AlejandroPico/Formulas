# Ficha

## Identificación

- Nombre: Regla de Cramer.
- Área: Álgebra lineal.
- Nivel recomendado: Bachillerato y universidad inicial.
- Tipo de fórmula: método exacto para sistemas lineales cuadrados.

## Fórmula principal

Para `Ax=b`:

`x_i=det(A_i)/det(A)`.

`A_i` es la matriz que se obtiene sustituyendo la columna `i` de `A` por el vector de términos independientes.

## Condición de uso

Debe cumplirse `det(A) != 0`. Si el determinante principal es cero, no hay solución única.

## Variables

- `A`: matriz de coeficientes.
- `b`: vector de términos independientes.
- `A_i`: matriz modificada para calcular la incógnita `i`.
- `det(A)`: determinante principal.

## Lectura del simulador

El simulador trabaja con un sistema `2x2`. Muestra las dos ecuaciones, calcula `D`, `Dx`, `Dy` y da `x` e `y` cuando existe solución única.

## Errores habituales

- Sustituir la fila en vez de la columna.
- Dividir por cero cuando `det(A)=0`.
- Intercambiar `Dx` y `Dy`.
- Olvidar conservar el orden de los coeficientes.
