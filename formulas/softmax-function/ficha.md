# Softmax

Tres logits y temperatura positiva. Se resta el máximo antes de exponenciar para estabilidad; sumar la misma constante a todos no cambia probabilidades.

## Magnitudes y notación

| Símbolo | Interpretación |
| :-- | :-- |
| p | Probabilidad normalizada de una clase. |
| z | Logit: puntuación real sin normalizar. |
| T | Temperatura positiva. |
| K | Número de clases. |
| i | Clase consultada. |
| j | Índice de clase sumada. |

## Condiciones

Logits no son probabilidades ni evidencias calibradas. T debe ser positiva. La salida normalizada no garantiza buena calibración, ni elimina incertidumbre o sesgo de datos. El límite de temperatura cero necesita tratar empates.

## Unidades

Variables numéricas en unidades de referencia; los índices y probabilidades son adimensionales. Una distancia conserva la escala de las características; su cuadrado tiene escala cuadrática.
