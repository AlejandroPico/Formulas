# Aprendizaje

## Tres formas de aprender

**Lote · Explorar · Estadísticas**

Una característica en un lote de cuatro muestras. Entrenamiento usa media y varianza del lote con divisor N; inferencia usa aquí referencias fijas μ=0, varianza=1.

## Predice, prueba y justifica

1. **Predice antes de medir.** Una característica en un lote de cuatro muestras. Entrenamiento usa media y varianza del lote con divisor N; inferencia usa aquí referencias fijas μ=0, varianza=1. Calcula salida de primera muestra con los datos iniciales.

2. **Construye el objetivo.** Ajusta desplazamiento aprendido β hasta obtener salida de primera muestra=-0,3416 .

3. **Distingue el modelo.** ¿Qué interpretación es correcta?

4. **Comprueba una nueva predicción.** Ahora desplazamiento aprendido β=1 . Calcula salida de primera muestra y explica el cambio.

Los retos admiten pistas y reintentos. En exploración, mueve un control cada vez, anticipa el cambio y compara el resultado. Las vistas 3D admiten ratón, tacto y flechas del teclado.

## Una idea que debes poder explicar

La inferencia usa estadísticas almacenadas, no necesariamente las del lote actual

Entrenamiento e inferencia usan estadísticas distintas. Con ε>0 la varianza normalizada no es exactamente uno; si el lote es constante la salida es β. No se usa varianza muestral insesgada N−1. Los frameworks pueden guardar estimadores distintos para inferencia; este modelo declara los suyos.
