# Derivación

El precio de un bono es la suma de sus flujos descontados: P=Σ CF_t/(1+y)^t. La duración de Macaulay es el promedio temporal ponderado por el valor presente de cada flujo: D_Mac=Σ t·PV(CF_t)/P. La duración modificada ajusta esa medida por el rendimiento: D_mod=D_Mac/(1+y/m). Como aproximación de primer orden, Delta P / P ≈ -D_mod·Delta y. Para movimientos grandes se añade convexidad: Delta P / P ≈ -D_mod·Delta y + 0.5·C·(Delta y)^2.
