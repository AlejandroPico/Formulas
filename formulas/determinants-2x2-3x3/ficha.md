# Ficha

## Identificación

- Nombre: Determinantes 2x2 y 3x3.
- Área: Álgebra lineal.
- Nivel recomendado: Bachillerato.
- Tipo de fórmula: cálculo de determinantes pequeños.

## Fórmulas principales

`det([[a,b],[c,d]])=ad-bc`.

`det([[a,b,c],[d,e,f],[g,h,i]])=aei+bfg+cdh-ceg-afh-bdi`.

## Variables

Las letras representan las entradas de la matriz. El determinante solo está definido para matrices cuadradas.

## Lectura del simulador

El simulador tiene dos modos: matriz `2x2` y matriz `3x3`. En `2x2` compara dos productos cruzados. En `3x3` usa la regla de Sarrus y separa productos positivos y negativos.

## Validez

La fórmula `2x2` es general para toda matriz de ese tamaño. La regla de Sarrus solo vale para `3x3`; no debe extenderse mecánicamente a matrices mayores.

## Errores habituales

- Cambiar el orden de la resta en `2x2`.
- Aplicar Sarrus a matrices que no son `3x3`.
- Olvidar signos negativos.
- Confundir filas con columnas al copiar los datos.
