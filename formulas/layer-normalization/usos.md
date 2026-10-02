# Usos

LayerNorm calcula estadísticas entre características de una sola muestra. Otra muestra del mismo lote no afecta esos valores. La demostración utiliza tres características con una escala y desplazamiento comunes por simplicidad; la fórmula general permite γj y βj por característica. Se compara con otra muestra desplazada 50 unidades, que conserva el vector normalizado. En aplicaciones, verifica dimensión, máscara y procedencia de datos antes de trasladar el ejemplo a un modelo real.

## Del experimento al contexto

Tres características de una muestra se normalizan juntas. Otra muestra desplazada 50 unidades se procesa por separado; no se mezclan estadísticas entre muestras.

## Condiciones antes de aplicar

No mezcla las estadísticas entre muestras. ε evita división por cero; un vector constante queda en β. Con γj distintos la media de salidas no debe ser β ni la varianza uno. El efecto de cambiar escala común no es invariancia exacta por ε.
