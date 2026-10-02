# Significado

ReLU(x)=max(0,x). El punto x=0 no tiene derivada clásica; elegir una subderivada en software es una convención distinta.

## Qué conserva y qué cambia

Separar semiejes da salida nula para x negativo y salida idéntica para x positivo. En cero las derivadas laterales son cero y uno, por lo que no hay derivada clásica. La vista de pendientes deja este punto abierto; el resultado textual lo señala como indefinido.

## Primera predicción

ReLU(x)=max(0,x). El punto x=0 no tiene derivada clásica; elegir una subderivada en software es una convención distinta. Calcula salida relu con los datos iniciales. Salida ReLU=0 . x≤0 da salida cero; x>0 conserva x.
