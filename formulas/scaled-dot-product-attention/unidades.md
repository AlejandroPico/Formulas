# Unidades

Las coordenadas y parámetros usan escala numérica de referencia. Probabilidades, razones, fases en radianes y pesos de atención son adimensionales. Las dimensiones de matrices deben permitir todos los productos; el laboratorio declara cada vector reducido.

## Qué se convierte en el laboratorio

scores=q·ki/√2; pesos=softmax(scores); salida=Σpeso·valor.

## Dominio y coherencia

Debe quedar al menos una clave permitida por fila. Q y K comparten dk; V puede tener otra dimensión. Una máscara no se añade después de softmax. Atención no es selección dura y sus pesos no equivalen por sí solos a explicación causal de una predicción.

Una consulta 2D y tres claves fijas, valores escalares. Atención escalada por √2; una máscara opcional excluye la tercera clave antes de normalizar.
