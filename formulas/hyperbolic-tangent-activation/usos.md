# Usos

Visualizar una activación, separar gradiente respecto de entrada y preactivación y reconocer saturación. El laboratorio muestra una neurona escalar; no entrena una red ni demuestra el rendimiento de un modelo real.

## Antes de aplicar

Argumentos reales y adimensionales. Saturación no equivale a un corte discontinuo; para valores finitos la función matemática sigue dentro del intervalo abierto (−1,1), aunque el redondeo pueda dar ±1.

## Qué compara el laboratorio

Una neurona usa z=w·x+b y y=tanh z. La saturación limita la salida y reduce la derivada. Compara sensibilidad respecto de z y respecto de x.
