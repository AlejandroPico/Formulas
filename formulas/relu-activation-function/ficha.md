# Función ReLU: Rectified Linear Unit

ReLU(x)=max(0,x). El punto x=0 no tiene derivada clásica; elegir una subderivada en software es una convención distinta.

## Magnitudes y notación

| Símbolo | Interpretación |
| :-- | :-- |
| ReLU | Rectificador: máximo entre cero y entrada. |
| x | Entrada escalar real. |
| max | Selecciona el mayor valor. |
| ′ | Prima: derivada respecto de x. |

## Condiciones

No suaviza la esquina. Una implementación puede elegir subgradiente cero en cero, pero es una convención para optimización. Una unidad permanentemente negativa puede dejar de recibir gradiente; la región positiva no satura.

## Unidades

Variables numéricas en unidades de referencia; los índices y probabilidades son adimensionales. Una distancia conserva la escala de las características; su cuadrado tiene escala cuadrática.
