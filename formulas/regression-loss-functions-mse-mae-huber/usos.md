# Usos

La pérdida cuadrática crece con el cuadrado del error; la absoluta crece linealmente. Huber une una zona e²/2 con una zona lineal, de modo que valor y pendiente coinciden en ±δ. Su derivada es e dentro y δ·sign(e) fuera. El gráfico compara pérdidas y pendientes; promediar sobre n muestras produce MSE, MAE o Huber media. En el laboratorio contrasta una predicción, construye el objetivo y explica qué supuesto permite el resultado.

## Del experimento al contexto

Error e=predicción−objetivo. Se comparan e², |e| y Huber con umbral δ>0, sin confundir suma de muestras y pérdida de una muestra.

## Condiciones antes de aplicar

δ>0 y misma escala que e. MSE usa e² sin medio; Huber sí usa medio. MAE no tiene derivada clásica en cero; minimizar una pérdida robusta no prueba ausencia de valores atípicos ni evita revisar datos.
