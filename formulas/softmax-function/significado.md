# Significado

Softmax convierte una lista de puntuaciones reales, llamadas logits, en probabilidades que suman uno.

Cada logit se exponentia, de modo que diferencias pequeñas entre puntuaciones pueden amplificarse. Después se divide por la suma de todas las exponenciales para normalizar.

El resultado puede interpretarse como una distribución de probabilidad sobre clases: gato, perro, ave u otras categorías.

El simulador permite mover tres logits. Las barras muestran cómo cambia la probabilidad asignada a cada clase y cómo la suma permanece siempre en el 100%.
