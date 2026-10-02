# Limitaciones

Entrenamiento e inferencia usan estadísticas distintas. Con ε>0 la varianza normalizada no es exactamente uno; si el lote es constante la salida es β. No se usa varianza muestral insesgada N−1. Los frameworks pueden guardar estimadores distintos para inferencia; este modelo declara los suyos.

Para una característica, calcula media y varianza del mini-lote con divisor N; centra y divide por raíz estabilizada. La escala γ y desplazamiento β son parámetros aprendibles que pueden restaurar una representación útil. El laboratorio procesa cuatro muestras de una característica. Inferencia usa media cero y varianza uno fijas como ejemplo de estadísticas almacenadas, no como entrenamiento simulado.

Las coordenadas y parámetros usan escala numérica de referencia. Probabilidades, razones, fases en radianes y pesos de atención son adimensionales. Las dimensiones de matrices deben permitir todos los productos; el laboratorio declara cada vector reducido.
