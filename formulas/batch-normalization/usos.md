# Usos

Para una característica, calcula media y varianza del mini-lote con divisor N; centra y divide por raíz estabilizada. La escala γ y desplazamiento β son parámetros aprendibles que pueden restaurar una representación útil. El laboratorio procesa cuatro muestras de una característica. Inferencia usa media cero y varianza uno fijas como ejemplo de estadísticas almacenadas, no como entrenamiento simulado. En aplicaciones, verifica dimensión, máscara y procedencia de datos antes de trasladar el ejemplo a un modelo real.

## Del experimento al contexto

Una característica en un lote de cuatro muestras. Entrenamiento usa media y varianza del lote con divisor N; inferencia usa aquí referencias fijas μ=0, varianza=1.

## Condiciones antes de aplicar

Entrenamiento e inferencia usan estadísticas distintas. Con ε>0 la varianza normalizada no es exactamente uno; si el lote es constante la salida es β. No se usa varianza muestral insesgada N−1. Los frameworks pueden guardar estimadores distintos para inferencia; este modelo declara los suyos.
