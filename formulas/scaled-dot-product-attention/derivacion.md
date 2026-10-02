# Derivación

Cada fila de QKᵀ mide compatibilidades de una consulta con claves. Divide por √dk para moderar la escala; una máscara aditiva M pone −∞ en claves prohibidas. Softmax por fila asigna pesos normalizados; multiplicar por V mezcla valores. El ejemplo utiliza una consulta 2D, tres claves [(1,0),(0,1),(−1,0)] y valores escalares [2,−1,1]. La visualización separa vector de consulta, claves, scores y pesos.

## Hipótesis necesarias

Debe quedar al menos una clave permitida por fila. Q y K comparten dk; V puede tener otra dimensión. Una máscara no se añade después de softmax. Atención no es selección dura y sus pesos no equivalen por sí solos a explicación causal de una predicción.

## Comprueba con números

Una consulta 2D y tres claves fijas, valores escalares. Atención escalada por √2; una máscara opcional excluye la tercera clave antes de normalizar. Calcula valor mezclado de salida con los datos iniciales. Valor mezclado de salida=1,008 . scores=q·ki/√2; pesos=softmax(scores); salida=Σpeso·valor.
