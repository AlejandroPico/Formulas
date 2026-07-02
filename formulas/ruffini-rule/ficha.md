# Ficha

## Identificación

- Nombre: Regla de Ruffini.
- Área: Álgebra y polinomios.
- Nivel recomendado: Bachillerato.
- Tipo de fórmula: división sintética y teorema del resto.

## Fórmula principal

`P(x)=(x-r)Q(x)+P(r)`.

Si `P(r)=0`, entonces `x-r` es factor de `P(x)`.

## Variables

- `P(x)`: polinomio original.
- `r`: valor asociado al divisor `x-r`.
- `Q(x)`: cociente de la división.
- `P(r)`: resto de la división.

## Lectura del simulador

El simulador muestra los coeficientes de un polinomio cúbico, las multiplicaciones sucesivas por `r`, el cociente cuadrático y el resto.

## Errores habituales

- Usar `r` con el signo cambiado. Si el divisor es `x-3`, entonces `r=3`; si es `x+3`, entonces `r=-3`.
- Olvidar coeficientes nulos en grados intermedios.
- Confundir el resto con el último coeficiente del cociente.
- Aplicar Ruffini a divisores que no son lineales de la forma `x-r`.
