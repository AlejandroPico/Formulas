# Interpretación

Métrica, escala, ε y MinPts forman parte del modelo. Densidades distintas pueden ser difíciles con un único ε; un borde compartido depende del orden de expansión. Ruido es una etiqueta del resultado actual, no una propiedad universal del punto.

Cuenta vecinos dentro de una bola cerrada de radio ε, incluido el punto central. Un núcleo inicia expansión mediante otros núcleos alcanzables. Un borde es vecino de núcleo pero no cumple MinPts; no expande. Los puntos no asignados son ruido. Los círculos de la vista de vecindarios muestran radios reales a escala igual; cambiar ε puede fusionar los dos grupos o absorber ruido.

Variables numéricas en unidades de referencia; los índices y probabilidades son adimensionales. Una distancia conserva la escala de las características; su cuadrado tiene escala cuadrática.
