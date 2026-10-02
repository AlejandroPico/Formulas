# Derivación

La transformada bilateral acumula una secuencia ponderada por potencias z⁻ⁿ. Para la señal causal aⁿu[n], solo se suma n≥0 y la serie geométrica converge si |a/z|<1. Sumar da 1/(1−a/z). El polo z=a limita la región exterior. Una secuencia anticausal puede producir el mismo cociente con otra ROC; por eso la región acompaña a la expresión racional.

## Hipótesis necesarias

Ejemplo causal con a real y |a|≤0,9. Los controles de evaluación pueden salir de |z|>|a|: entonces la pantalla identifica continuación racional y no afirma convergencia de la suma. El polo exacto es singular; los ángulos del control evitan evaluarlo directamente. a=0 produce impulso unitario, incluyendo x[0]=1.

## Comprueba con números

Secuencia causal x[n]=a^n u[n], X(z)=1/(1−a/z), con región |z|>|a|. El cociente racional fuera de la región es continuación algebraica, no la suma convergente. Calcula módulo |x(z)| con los datos iniciales. Módulo |X(z)|=1,1547 . X=z/(z−a); comprueba |z|>|a| antes de usar la suma.
