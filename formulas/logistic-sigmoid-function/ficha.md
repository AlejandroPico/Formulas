# Función sigmoide logística

La sigmoide transforma una entrada real en una respuesta suave entre cero y uno. Sus propiedades son matemáticas; por sí sola no ha aprendido parámetros ni demuestra que su valor sea una probabilidad bien calibrada.

## Magnitudes

| Símbolo | Significado |
| :-- | :-- |
| σ | Función sigmoide logística; aquí no representa tensión mecánica ni desviación típica. |
| x | Entrada real adimensional de la función. |
| e | Base de la exponencial y del logaritmo natural. |

## Alcance

x real finito; entrada adimensional. El cálculo usa una rama estable para x negativo evitando exp(−x) excesivamente grande. La saturación numérica en valores extremos no convierte los límites asintóticos en nuevos estados exactos de la función matemática.

## Unidades

Entrada, salida y derivada respecto a x sin dimensión. Si x es el resultado de una combinación física, sus coeficientes deben hacer el argumento adimensional. El logit inverso ln(p/(1−p)) exige 0<p<1.
