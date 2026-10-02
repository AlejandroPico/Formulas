# Significado

Tres características de una muestra se normalizan juntas. Otra muestra desplazada 50 unidades se procesa por separado; no se mezclan estadísticas entre muestras.

## Qué conserva y qué cambia

LayerNorm calcula estadísticas entre características de una sola muestra. Otra muestra del mismo lote no afecta esos valores. La demostración utiliza tres características con una escala y desplazamiento comunes por simplicidad; la fórmula general permite γj y βj por característica. Se compara con otra muestra desplazada 50 unidades, que conserva el vector normalizado.

## Primera predicción

Tres características de una muestra se normalizan juntas. Otra muestra desplazada 50 unidades se procesa por separado; no se mezclan estadísticas entre muestras. Calcula salida de primera característica con los datos iniciales. Salida de primera característica=-1,2247 . μ y var se calculan entre características de una muestra; ε=10⁻⁵.
