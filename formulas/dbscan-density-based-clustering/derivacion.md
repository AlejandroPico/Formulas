# Derivación

Cuenta vecinos dentro de una bola cerrada de radio ε, incluido el punto central. Un núcleo inicia expansión mediante otros núcleos alcanzables. Un borde es vecino de núcleo pero no cumple MinPts; no expande. Los puntos no asignados son ruido. Los círculos de la vista de vecindarios muestran radios reales a escala igual; cambiar ε puede fusionar los dos grupos o absorber ruido.

## Hipótesis necesarias

Métrica, escala, ε y MinPts forman parte del modelo. Densidades distintas pueden ser difíciles con un único ε; un borde compartido depende del orden de expansión. Ruido es una etiqueta del resultado actual, no una propiedad universal del punto.

## Comprueba con números

DBSCAN sobre diez puntos. MinPts incluye al propio punto; los núcleos expanden grupos, los bordes no los expanden y el ruido puede cambiar al ajustar ε. Calcula número de grupos con los datos iniciales. Número de grupos=0 . Un núcleo tiene al menos MinPts puntos a distancia ≤ε.
