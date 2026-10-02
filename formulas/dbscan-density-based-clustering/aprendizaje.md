# Aprendizaje

## Tres formas de aprender

**Vecindarios · Explorar · Núcleo y ruido**

DBSCAN sobre diez puntos. MinPts incluye al propio punto; los núcleos expanden grupos, los bordes no los expanden y el ruido puede cambiar al ajustar ε.

## Predice, prueba y justifica

1. **Predice antes de medir.** DBSCAN sobre diez puntos. MinPts incluye al propio punto; los núcleos expanden grupos, los bordes no los expanden y el ruido puede cambiar al ajustar ε. Calcula número de grupos con los datos iniciales.

2. **Construye el objetivo.** Ajusta radio ε hasta obtener número de grupos=2 .

3. **Distingue el modelo.** ¿Qué interpretación es correcta?

4. **Comprueba una nueva predicción.** Ahora radio ε=0.7 . Calcula número de grupos y explica el cambio.

Los retos admiten pistas y reintentos. En exploración, mueve un control cada vez, anticipa el cambio y compara el resultado. Las vistas 3D admiten ratón, tacto y flechas del teclado.

## Una idea que debes poder explicar

Un punto de borde pertenece a un grupo aunque no sea núcleo

Métrica, escala, ε y MinPts forman parte del modelo. Densidades distintas pueden ser difíciles con un único ε; un borde compartido depende del orden de expansión. Ruido es una etiqueta del resultado actual, no una propiedad universal del punto.
