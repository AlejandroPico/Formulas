# Cross-Attention: atención cruzada

Consulta de un decodificador y tres claves y valores de una memoria externa. Mismo mecanismo de atención, con procedencias de Q y K,V distintas.

## Magnitudes y notación

| Símbolo | Interpretación |
| :-- | :-- |
| Attention | Mezcla de valores con compatibilidades normalizadas. |
| Q | Matriz de consultas. |
| K | Matriz de claves. |
| V | Matriz de valores a mezclar. |
| d | Dimensión de consulta y clave. |
| k | Índice que distingue dimensión de claves. |
| M | Máscara aditiva: cero permitido, −∞ prohibido. |
| softmax | Normalización exponencial por fila de claves. |
| ⊤ | Transposición: intercambia filas y columnas de K. |

## Condiciones

Debe quedar al menos una clave permitida por fila. Q y K comparten dk; V puede tener otra dimensión. Una máscara no se añade después de softmax. Atención no es selección dura y sus pesos no equivalen por sí solos a explicación causal de una predicción.

## Unidades

Las coordenadas y parámetros usan escala numérica de referencia. Probabilidades, razones, fases en radianes y pesos de atención son adimensionales. Las dimensiones de matrices deben permitir todos los productos; el laboratorio declara cada vector reducido.
