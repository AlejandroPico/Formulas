# Aprendizaje

## Primero predice

tanh conserva el signo y limita su salida entre −1 y 1. Lejos de cero se satura y su derivada se vuelve pequeña, lo que puede atenuar gradientes.

Una neurona usa z=w·x+b y y=tanh z. La saturación limita la salida y reduce la derivada. Compara sensibilidad respecto de z y respecto de x.

## Tres formas de aprender

**Neuronas · Explorar · Gradientes**

Visualizar una activación, separar gradiente respecto de entrada y preactivación y reconocer saturación. El laboratorio muestra una neurona escalar; no entrena una red ni demuestra el rendimiento de un modelo real.

## Cuatro misiones

1. **Predice el resultado.** ¿Cuánto vale tanh(0)?

2. **Diseña una solución.** Lleva la entrada al punto donde la activación vale cero.

3. **Piensa antes de cambiar.** Cerca de |z| muy grande, la derivada de tanh…

4. **Un paso más.** ¿Cuánto vale d(tanh z)/dz en z=0?

Hay pistas, comprobación y reintentos. Después de acertar, explica qué cambió y qué se mantuvo. Los controles tienen etiquetas y admiten teclado; las vistas 3D admiten giro con ratón, tacto o flechas. Argumentos reales y adimensionales. Saturación no equivale a un corte discontinuo; para valores finitos la función matemática sigue dentro del intervalo abierto (−1,1), aunque el redondeo pueda dar ±1.
