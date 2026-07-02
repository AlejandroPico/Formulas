# Ficha

## Identificación

- Nombre: Teorema de Cayley-Hamilton.
- Área: Álgebra lineal.
- Nivel recomendado: Universidad inicial.
- Tipo de resultado: identidad matricial asociada al polinomio característico.

## Fórmula principal

`p_A(λ)=det(λI-A)`

`p_A(A)=0`.

Para matrices `2x2`:

`A^2-tr(A)A+det(A)I=0`.

## Variables

- `A`: matriz cuadrada.
- `I`: matriz identidad del mismo tamaño.
- `tr(A)`: suma de los elementos de la diagonal principal.
- `det(A)`: determinante de la matriz.
- `p_A`: polinomio característico.

## Lectura del simulador

El simulador calcula el caso `2x2`. Muestra la traza, el determinante, la matriz `A^2`, el término `-tr(A)A`, el término `det(A)I` y la suma final.

## Validez

El teorema vale para toda matriz cuadrada sobre cuerpos habituales como reales o complejos. La versión visual se limita a `2x2` para que la comprobación sea transparente.

## Errores habituales

- Confundir el polinomio característico con el determinante de la matriz.
- Sustituir `λ` por un número en vez de por la propia matriz.
- Olvidar que `det(A)I` es un múltiplo de la identidad, no un número suelto.
