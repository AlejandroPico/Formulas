# Ficha

## Identificación

- Nombre: Producto vectorial.
- Área: Álgebra vectorial, geometría 3D y física.
- Nivel recomendado: Bachillerato y universidad inicial.
- Tipo de fórmula: operación vectorial orientada.

## Fórmula principal

Para `u=(u₁,u₂,u₃)` y `v=(v₁,v₂,v₃)`:

`u×v=(u₂v₃-u₃v₂, u₃v₁-u₁v₃, u₁v₂-u₂v₁)`.

La magnitud cumple:

`||u×v||=||u||||v||sin(θ)`.

## Interpretación geométrica

El resultado no es un número: es un vector perpendicular al plano generado por `u` y `v`. Su longitud mide el área del paralelogramo formado por ambos vectores. Si los vectores son paralelos, el área es cero y el producto vectorial se anula.

## Orientación

El sentido del vector se decide con la regla de la mano derecha. Cambiar el orden cambia el signo:

`u×v=-(v×u)`.

Por eso el producto vectorial no es conmutativo.

## Variables

- `u`, `v`: vectores de entrada.
- `θ`: ángulo entre los vectores.
- `||u×v||`: área del paralelogramo.
- `u×v`: vector normal orientado.

## Lectura del simulador

El simulador representa dos vectores en el plano y sombrea el paralelogramo que generan. La lectura inferior muestra la componente `z` del producto vectorial y el área asociada.

## Errores habituales

- Confundir producto vectorial con producto escalar.
- Olvidar que el resultado es un vector, no un número.
- Cambiar el orden sin cambiar el signo.
- Aplicarlo como si tuviera la misma forma en cualquier dimensión.
