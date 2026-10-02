# Ecuación de Bellman

Cadena de tres estados y una meta terminal. Quedarse cuesta 0,5; intentar avanzar cuesta 1 y llegar a meta recompensa 5. Avance probabilístico y descuento γ<1.

## Magnitudes y notación

| Símbolo | Interpretación |
| :-- | :-- |
| V | Valor esperado de retorno descontado desde un estado. |
| s | Estado actual; s′ es el siguiente. |
| a | Acción candidata. |
| P | Probabilidad de transición condicionada. |
| r | Recompensa inmediata de una transición. |
| γ | Factor de descuento entre cero y uno. |
| ∗ | Indica valor óptimo, no producto. |
| ′ | Prima: estado siguiente. |
| max | Máximo entre acciones disponibles. |
| ∣ | Condicionado a: la distribución usa el estado y la acción indicados. |

## Condiciones

Supone estados y transiciones markovianos y recompensas acotadas; γ<1 en esta versión continua de tareas. No mezcla actualización de todos los valores con aprendizaje de una muestra. El intento fallido conserva estado pero paga su coste.

## Unidades

Variables numéricas en unidades de referencia; los índices y probabilidades son adimensionales. Una distancia conserva la escala de las características; su cuadrado tiene escala cuadrática.
