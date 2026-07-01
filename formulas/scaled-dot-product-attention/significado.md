# Significado

La atención escalada calcula cuánto debe atender un token a otros tokens comparando consultas `Q` con claves `K`.

El producto `QK^T` mide similitudes. Dividir por `sqrt(d_k)` evita que esos productos crezcan demasiado cuando la dimensión es alta.

Después se aplica softmax para convertir las similitudes en pesos que suman uno, y esos pesos se usan para combinar los valores `V`.

El simulador muestra tres tokens compitiendo por atención. Al activar el escalado, los pesos se distribuyen con más suavidad; sin escalado, softmax puede saturarse.
