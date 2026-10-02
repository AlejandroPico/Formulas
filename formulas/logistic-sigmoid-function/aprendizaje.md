# Aprendizaje

## Predice, prueba y explica

La sigmoide transforma una entrada real en una respuesta suave entre cero y uno. Sus propiedades son matemáticas; por sí sola no ha aprendido parámetros ni demuestra que su valor sea una probabilidad bien calibrada.

Estudia σ(x) como función matemática. La curva está entre cero y uno, es simétrica alrededor de (0,1/2) y su pendiente máxima es 1/4. No es por sí sola un modelo entrenado.

## Tres formas de aprender

**Activación · Explorar · Pendiente y simetría**

Funciones de activación, modelos suaves y visualización de saturación. La regresión logística añade un predictor wx+b y una interpretación probabilística; la ecuación logística describe una evolución temporal. Las tres comparten forma, pero no son la misma tarea.

## Cuatro misiones

1. **Predice antes de probar.** Calcula σ(0).

2. **Construye tu solución.** Vuelve al punto central de la curva.

3. **La decisión importa.** ¿Qué relación cumple σ(−x)?

4. **Predice antes de probar.** Calcula la pendiente σ′(0).

Hay pistas, reintentos y comprobación. Después de cada acierto, explica por qué cambió el resultado. Los controles admiten teclado; las cámaras 3D giran con ratón, tacto o flechas. x real finito; entrada adimensional. El cálculo usa una rama estable para x negativo evitando exp(−x) excesivamente grande. La saturación numérica en valores extremos no convierte los límites asintóticos en nuevos estados exactos de la función matemática.
