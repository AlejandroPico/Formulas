# Aprendizaje

## Tres formas de aprender

**Características · Explorar · Invariancias**

Tres características de una muestra se normalizan juntas. Otra muestra desplazada 50 unidades se procesa por separado; no se mezclan estadísticas entre muestras.

## Predice, prueba y justifica

1. **Predice antes de medir.** Tres características de una muestra se normalizan juntas. Otra muestra desplazada 50 unidades se procesa por separado; no se mezclan estadísticas entre muestras. Calcula salida de primera característica con los datos iniciales.

2. **Construye el objetivo.** Ajusta característica a hasta obtener salida de primera característica=-0,7071 .

3. **Distingue el modelo.** ¿Qué interpretación es correcta?

4. **Comprueba una nueva predicción.** Ahora característica a=2 . Calcula salida de primera característica y explica el cambio.

Los retos admiten pistas y reintentos. En exploración, mueve un control cada vez, anticipa el cambio y compara el resultado. Las vistas 3D admiten ratón, tacto y flechas del teclado.

## Una idea que debes poder explicar

LayerNorm no depende del tamaño del lote para calcular estas estadísticas

No mezcla las estadísticas entre muestras. ε evita división por cero; un vector constante queda en β. Con γj distintos la media de salidas no debe ser β ni la varianza uno. El efecto de cambiar escala común no es invariancia exacta por ε.
