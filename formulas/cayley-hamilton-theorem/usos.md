# Usos

- Reducir potencias altas de una matriz a combinaciones de potencias menores.
- Calcular expresiones matriciales sin multiplicar matrices repetidamente.
- Estudiar el polinomio mínimo y la diagonalización.
- Analizar sistemas dinámicos lineales, donde aparecen sucesiones de potencias de una matriz.
- Simplificar cálculos en álgebra lineal computacional.

## Ejemplo de uso

Si una matriz `2x2` cumple `A^2-tr(A)A+det(A)I=0`, entonces `A^2=tr(A)A-det(A)I`. A partir de ahí, cualquier potencia `A^3`, `A^4` o superior puede reducirse usando esa relación.

## Uso didáctico

La fórmula es excelente para conectar determinantes, traza, polinomio característico y operaciones con matrices. También permite discutir por qué los invariantes de una matriz no son adornos: gobiernan relaciones algebraicas reales.

## Uso del simulador

El simulador permite introducir una matriz `2x2` y observar la cancelación completa. Es recomendable probar matrices diagonales, triangulares, singulares y con entradas negativas para comprobar que el resultado no depende de un caso especial.
