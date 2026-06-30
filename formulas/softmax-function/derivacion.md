# Derivación

Se parte de logits `z_i`, que pueden ser cualquier número real. Para convertirlos en cantidades positivas se aplica una exponencial.

Después se divide cada exponencial por la suma total de exponenciales. Esa normalización hace que todas las salidas sean positivas y sumen uno.

Para estabilidad numérica se suele restar una constante `c`, normalmente el máximo logit. Esta operación no cambia el resultado porque multiplica numerador y denominador por el mismo factor.

Softmax no decide por sí sola la clase correcta; produce una distribución que después puede compararse con etiquetas mediante entropía cruzada.
