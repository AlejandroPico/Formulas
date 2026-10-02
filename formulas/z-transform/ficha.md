# Transformada Z

Secuencia causal x[n]=a^n u[n], X(z)=1/(1−a/z), con región |z|>|a|. El cociente racional fuera de la región es continuación algebraica, no la suma convergente.

## Magnitudes y notación

| Símbolo | Interpretación |
| :-- | :-- |
| X | Transformada Z de la secuencia x. |
| x | Amplitud de la secuencia discreta en la muestra n. |
| n | Índice entero de muestra, no tiempo continuo. |
| z | Variable compleja de transformada. |
| a | Coeficiente real y polo de la secuencia geométrica. |
| u | Escalón unitario discreto: uno para n≥0 y cero para n<0. |
| ∞ | Límite infinito de la suma bilateral. |
| [ | Abre el índice de una muestra discreta. |
| ] | Cierra el índice de muestra. |
| ∣ | Módulo del número complejo z o del coeficiente a. |

## Condiciones

Ejemplo causal con a real y |a|≤0,9. Los controles de evaluación pueden salir de |z|>|a|: entonces la pantalla identifica continuación racional y no afirma convergencia de la suma. El polo exacto es singular; los ángulos del control evitan evaluarlo directamente. a=0 produce impulso unitario, incluyendo x[0]=1.

## Unidades

n cuenta muestras discretas; z y a son adimensionales. X tiene la unidad de amplitud de x, fijada a uno en este experimento. El ángulo z se introduce en grados y se convierte a radianes. El círculo unidad permite relacionar la transformada con frecuencia discreta cuando pertenece a ROC.
