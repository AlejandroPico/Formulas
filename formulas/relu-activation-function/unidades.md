# Unidades

Variables numéricas en unidades de referencia; los índices y probabilidades son adimensionales. Una distancia conserva la escala de las características; su cuadrado tiene escala cuadrática.

## Qué se convierte en el laboratorio

x≤0 da salida cero; x>0 conserva x.

## Dominio y coherencia

No suaviza la esquina. Una implementación puede elegir subgradiente cero en cero, pero es una convención para optimización. Una unidad permanentemente negativa puede dejar de recibir gradiente; la región positiva no satura.

ReLU(x)=max(0,x). El punto x=0 no tiene derivada clásica; elegir una subderivada en software es una convención distinta.
