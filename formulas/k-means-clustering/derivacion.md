# Derivación

Con centros fijos, asignar cada punto al centro más cercano minimiza su término cuadrático. Con asignaciones fijas, derivar la suma respecto al centro da la media del grupo. Alternar estos dos pasos no aumenta J. El laboratorio parte de dos centros a la izquierda, muestra asignaciones y desplaza las medias; la curva de coste conserva todos los barridos, incluido el inicial.

## Hipótesis necesarias

K debe elegirse y la solución depende de los centros iniciales. Un grupo vacío conserva su centro en esta demostración. Empates se resuelven por índice; no se promete óptimo global ni detección de formas no convexas.

## Comprueba con números

Lloyd sobre seis puntos, asignación al centro más próximo y actualización por media. Los empates se resuelven por orden de centro y un centro vacío se conserva. Calcula suma de distancias cuadradas con los datos iniciales. Suma de distancias cuadradas=52 . SSE=Σ||xi−centro asignado||²; alterna asignación y media.
