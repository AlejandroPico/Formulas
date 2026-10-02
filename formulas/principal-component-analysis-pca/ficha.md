# PCA: análisis de componentes principales

Ocho puntos centrados en tres dimensiones. Gira la nube, proyecta sobre su primer eje principal y compara varianza retenida y error; la escala de variables importa.

## Magnitudes y notación

| Símbolo | Interpretación |
| :-- | :-- |
| X | Matriz de datos: observaciones en filas y variables en columnas. |
| c | Índice c: datos centrados por su media de columna. |
| x | Vector de medias de las variables cuando lleva barra. |
| C | Matriz de covarianzas muestrales, con divisor n−1. |
| n | Número de observaciones, ocho en el experimento. |
| w | Dirección principal unitaria; el índice j ordena componentes. |
| λ | Varianza muestral de la componente principal correspondiente. |
| j | Índice de componente principal ordenada por varianza descendente. |
| Z | Coordenadas de los datos centrados en la base principal. |
| W | Matriz cuyas columnas son las direcciones principales. |
| η | Fracción de varianza retenida por la componente indicada. |
| T | Marca de transposición de una matriz o vector. |
| Var | Varianza muestral de la proyección centrada. |

## Condiciones

Datos numéricos, centrados y con varianza total positiva. PCA por covarianza depende de unidades y escala; estandarizar produce otro problema. Varianza alta no implica información útil, causalidad ni independencia. Ejes de un autovalor repetido no son únicos.

## Unidades

Datos del laboratorio en unidades comunes arbitrarias; covarianzas y λ en unidades cuadradas; η adimensional, presentada como porcentaje. Se usa divisor 7 para ocho observaciones. Error de reconstrucción normalizado también divide entre 7.
