# Aprendizaje

## Tres formas de aprender

**Tres pérdidas · Explorar · Pendientes**

Error e=predicción−objetivo. Se comparan e², |e| y Huber con umbral δ>0, sin confundir suma de muestras y pérdida de una muestra.

## Predice, prueba y justifica

1. **Predice antes de medir.** Error e=predicción−objetivo. Se comparan e², |e| y Huber con umbral δ>0, sin confundir suma de muestras y pérdida de una muestra. Calcula pérdida huber con los datos iniciales.

2. **Construye el objetivo.** Ajusta predicción hasta obtener pérdida huber=0,5 .

3. **Distingue el modelo.** ¿Qué interpretación es correcta?

4. **Comprueba una nueva predicción.** Ahora predicción=2 . Calcula pérdida huber y explica el cambio.

Los retos admiten pistas y reintentos. En exploración, mueve un control cada vez, anticipa el cambio y compara el resultado. Las vistas 3D admiten ratón, tacto y flechas del teclado.

## Una idea que debes poder explicar

Huber limita el crecimiento de la pendiente en errores grandes

δ>0 y misma escala que e. MSE usa e² sin medio; Huber sí usa medio. MAE no tiene derivada clásica en cero; minimizar una pérdida robusta no prueba ausencia de valores atípicos ni evita revisar datos.
