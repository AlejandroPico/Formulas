# Interpretación

δ>0 y misma escala que e. MSE usa e² sin medio; Huber sí usa medio. MAE no tiene derivada clásica en cero; minimizar una pérdida robusta no prueba ausencia de valores atípicos ni evita revisar datos.

La pérdida cuadrática crece con el cuadrado del error; la absoluta crece linealmente. Huber une una zona e²/2 con una zona lineal, de modo que valor y pendiente coinciden en ±δ. Su derivada es e dentro y δ·sign(e) fuera. El gráfico compara pérdidas y pendientes; promediar sobre n muestras produce MSE, MAE o Huber media.

e,y,δ tienen unidad de respuesta; MSE y Huber tienen unidad cuadrática, MAE unidad de respuesta.
