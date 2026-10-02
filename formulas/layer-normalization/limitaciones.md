# Limitaciones

No mezcla las estadísticas entre muestras. ε evita división por cero; un vector constante queda en β. Con γj distintos la media de salidas no debe ser β ni la varianza uno. El efecto de cambiar escala común no es invariancia exacta por ε.

LayerNorm calcula estadísticas entre características de una sola muestra. Otra muestra del mismo lote no afecta esos valores. La demostración utiliza tres características con una escala y desplazamiento comunes por simplicidad; la fórmula general permite γj y βj por característica. Se compara con otra muestra desplazada 50 unidades, que conserva el vector normalizado.

Las coordenadas y parámetros usan escala numérica de referencia. Probabilidades, razones, fases en radianes y pesos de atención son adimensionales. Las dimensiones de matrices deben permitir todos los productos; el laboratorio declara cada vector reducido.
