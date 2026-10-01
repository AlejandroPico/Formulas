# Fórmula de sumación de Euler-Maclaurin

Una suma discreta se relaciona con una integral, los extremos, derivadas de borde y un resto.

## Magnitudes

| Símbolo | Lectura |
| :-- | :-- |
| f | Función cuyos valores en enteros se suman. |
| k | Índice entero de los sumandos desde a hasta b, incluidos. |
| a | Primer entero de la suma y extremo inferior de la integral. |
| b | Último entero de la suma y extremo superior de la integral. |
| x | Variable continua de integración. |
| j | Índice de corrección derivada, desde 1 hasta p. |
| p | Número finito de correcciones con números de Bernoulli. |
| B | Número de Bernoulli del índice par indicado. |
| R | Resto de la fórmula tras las correcciones incluidas. |

## Cuándo se aplica

a y b enteros ordenados, función suficientemente regular para las correcciones y el resto. Para ln x, intervalo positivo. La versión finita mantiene R_p.

## Evita estos errores

Omitir el último sumando; olvidar extremos; usar f(b)−f(a) en lugar de derivadas; suponer convergencia de una expansión asintótica; perder el signo de B₄.

## Laboratorio

**Correcciones · Explorar · Residuos**

Compara una suma discreta con su integral, los extremos y las correcciones B₂ y B₄.

Las correcciones usan derivadas en los extremos. El residuo tiene signo; más términos no garantizan una mejor aproximación para cualquier función e intervalo.
