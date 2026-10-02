# Limitaciones

Se muestran matrices reducidas fijas y no una red entrenada. La proyección final puede tener pesos negativos y no tiene por qué ser un promedio convexo. Dimensiones de cada proyección, concatenación y salida deben coincidir; no todas las cabezas necesariamente aprenden funciones diferentes.

Cada cabeza aplica proyecciones propias y realiza una mezcla independiente. Concatenar conserva todas las salidas; WO proyecta a la dimensión final. Aquí cabeza 1 usa q=(a,b), cabeza 2 intercambia coordenadas WQ=[[0,1],[1,0]], ambas usan tres claves 2D. Sus valores son [2,−1,1] y [0,3,−2]. Se concatenan dos escalares y se proyectan con (w1,w2). Es un ejemplo explícito de la ecuación general, no copias idénticas promediadas.

Las coordenadas y parámetros usan escala numérica de referencia. Probabilidades, razones, fases en radianes y pesos de atención son adimensionales. Las dimensiones de matrices deben permitir todos los productos; el laboratorio declara cada vector reducido.
