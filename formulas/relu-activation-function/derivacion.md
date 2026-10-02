# Derivación

Separar semiejes da salida nula para x negativo y salida idéntica para x positivo. En cero las derivadas laterales son cero y uno, por lo que no hay derivada clásica. La vista de pendientes deja este punto abierto; el resultado textual lo señala como indefinido.

## Hipótesis necesarias

No suaviza la esquina. Una implementación puede elegir subgradiente cero en cero, pero es una convención para optimización. Una unidad permanentemente negativa puede dejar de recibir gradiente; la región positiva no satura.

## Comprueba con números

ReLU(x)=max(0,x). El punto x=0 no tiene derivada clásica; elegir una subderivada en software es una convención distinta. Calcula salida relu con los datos iniciales. Salida ReLU=0 . x≤0 da salida cero; x>0 conserva x.
