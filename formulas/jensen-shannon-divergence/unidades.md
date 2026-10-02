# Unidades

JS se informa en bits por base dos; las KL internas con log natural se dividen por ln2. La raíz tiene escala raíz de bit en esta convención, por lo que no debe rotularse como otra cantidad de divergencia en bits. Ambos resultados son adimensionales matemáticamente.

## Qué se convierte en el laboratorio

JS=[DKL(p||m)+DKL(q||m)]/(2ln2).

## Dominio y coherencia

Dos distribuciones normalizadas del mismo espacio, pesos iguales y base dos. Cambiar pesos o número de fuentes cambia la cota y la interpretación. El ejemplo binario evita singularidades de soporte con controles interiores, pero la mezcla permite en general probabilidades cero mediante límites correctos.

Jensen-Shannon con pesos iguales y logaritmos base dos. La mezcla m=(p+q)/2 garantiza soporte compatible; su raíz sí es una distancia.
