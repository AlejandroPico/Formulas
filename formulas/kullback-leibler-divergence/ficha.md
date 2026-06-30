# Ficha

## Identificación

- **Nombre:** Divergencia de Kullback-Leibler
- **Autores:** Solomon Kullback y Richard Leibler
- **Año:** 1951
- **Área:** teoría de la información y estadística
- **Nivel:** universidad
- **Tipo:** divergencia entre distribuciones

## Variables

- `P`: distribución objetivo o verdadera.
- `Q`: distribución aproximada.
- `p(x)`, `q(x)`: densidades o probabilidades.
- `D_KL`: divergencia de Kullback-Leibler.

## Lectura del simulador

La curva azul es `P`. La roja es `Q`. Al desplazar `Q`, el valor de KL aumenta. Si coinciden, la divergencia se aproxima a cero.

## Nota

No es simétrica: `D_KL(P||Q)` no tiene por qué coincidir con `D_KL(Q||P)`.
