# Unidades

e,y,δ tienen unidad de respuesta; MSE y Huber tienen unidad cuadrática, MAE unidad de respuesta.

## Qué se convierte en el laboratorio

Huber=e²/2 si |e|≤δ; si no δ(|e|−δ/2).

## Dominio y coherencia

δ>0 y misma escala que e. MSE usa e² sin medio; Huber sí usa medio. MAE no tiene derivada clásica en cero; minimizar una pérdida robusta no prueba ausencia de valores atípicos ni evita revisar datos.

Error e=predicción−objetivo. Se comparan e², |e| y Huber con umbral δ>0, sin confundir suma de muestras y pérdida de una muestra.
