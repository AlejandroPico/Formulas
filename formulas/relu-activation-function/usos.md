# Usos

Separar semiejes da salida nula para x negativo y salida idéntica para x positivo. En cero las derivadas laterales son cero y uno, por lo que no hay derivada clásica. La vista de pendientes deja este punto abierto; el resultado textual lo señala como indefinido. En el laboratorio contrasta una predicción, construye el objetivo y explica qué supuesto permite el resultado.

## Del experimento al contexto

ReLU(x)=max(0,x). El punto x=0 no tiene derivada clásica; elegir una subderivada en software es una convención distinta.

## Condiciones antes de aplicar

No suaviza la esquina. Una implementación puede elegir subgradiente cero en cero, pero es una convención para optimización. Una unidad permanentemente negativa puede dejar de recibir gradiente; la región positiva no satura.
