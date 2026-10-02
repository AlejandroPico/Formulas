# Derivación

Para una característica, calcula media y varianza del mini-lote con divisor N; centra y divide por raíz estabilizada. La escala γ y desplazamiento β son parámetros aprendibles que pueden restaurar una representación útil. El laboratorio procesa cuatro muestras de una característica. Inferencia usa media cero y varianza uno fijas como ejemplo de estadísticas almacenadas, no como entrenamiento simulado.

## Hipótesis necesarias

Entrenamiento e inferencia usan estadísticas distintas. Con ε>0 la varianza normalizada no es exactamente uno; si el lote es constante la salida es β. No se usa varianza muestral insesgada N−1. Los frameworks pueden guardar estimadores distintos para inferencia; este modelo declara los suyos.

## Comprueba con números

Una característica en un lote de cuatro muestras. Entrenamiento usa media y varianza del lote con divisor N; inferencia usa aquí referencias fijas μ=0, varianza=1. Calcula salida de primera muestra con los datos iniciales. Salida de primera muestra=-1,3416 . y=γ(x−μ)/√(var+ε)+β, ε=10⁻⁵.
