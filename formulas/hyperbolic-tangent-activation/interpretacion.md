# Interpretación

Argumentos reales y adimensionales. Saturación no equivale a un corte discontinuo; para valores finitos la función matemática sigue dentro del intervalo abierto (−1,1), aunque el redondeo pueda dar ±1.

Visualizar una activación, separar gradiente respecto de entrada y preactivación y reconocer saturación. El laboratorio muestra una neurona escalar; no entrena una red ni demuestra el rendimiento de un modelo real.

Una neurona usa z=w·x+b y y=tanh z. La saturación limita la salida y reduce la derivada. Compara sensibilidad respecto de z y respecto de x.

z e y sin dimensión. Si x tiene una unidad u, w debe usar u⁻¹ y b ser adimensional. dy/dx tiene u⁻¹. No se confunde una derivada respecto de z con otra respecto de x cuando cambia w.
