# Usos

Cada cabeza aplica proyecciones propias y realiza una mezcla independiente. Concatenar conserva todas las salidas; WO proyecta a la dimensión final. Aquí cabeza 1 usa q=(a,b), cabeza 2 intercambia coordenadas WQ=[[0,1],[1,0]], ambas usan tres claves 2D. Sus valores son [2,−1,1] y [0,3,−2]. Se concatenan dos escalares y se proyectan con (w1,w2). Es un ejemplo explícito de la ecuación general, no copias idénticas promediadas. En aplicaciones, verifica dimensión, máscara y procedencia de datos antes de trasladar el ejemplo a un modelo real.

## Del experimento al contexto

Dos cabezas sobre tres claves: la primera usa q=(a,b), la segunda WQ q=(b,a). Valores escalares distintos se concatenan y proyectan con pesos w1,w2 declarados.

## Condiciones antes de aplicar

Se muestran matrices reducidas fijas y no una red entrenada. La proyección final puede tener pesos negativos y no tiene por qué ser un promedio convexo. Dimensiones de cada proyección, concatenación y salida deben coincidir; no todas las cabezas necesariamente aprenden funciones diferentes.
