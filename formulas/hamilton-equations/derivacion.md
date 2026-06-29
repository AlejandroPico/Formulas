# Derivación

Las ecuaciones de Hamilton se obtienen a partir de la formulación lagrangiana mediante una transformada de Legendre. Se parte de un lagrangiano `L(q, qdot, t)` y se define el momento conjugado como la derivada parcial de `L` respecto a la velocidad generalizada.

Después se construye el hamiltoniano `H` como combinación de momentos, velocidades y lagrangiano. Cuando la transformación puede invertirse, las velocidades se expresan en función de coordenadas y momentos. Así el sistema deja de estar descrito por `q` y `qdot` y pasa a estar descrito por `q` y `p`.

Al variar la acción en estas nuevas variables aparecen dos ecuaciones de primer orden. Una indica cómo cambia la coordenada y otra cómo cambia el momento. En conjunto sustituyen a una ecuación de segundo orden por un sistema de primer orden en el espacio de fases.

Para el oscilador armónico, el hamiltoniano toma la forma de una suma de energía cinética y potencial. Las ecuaciones resultantes son `qdot=p/m` y `pdot=-kq`. El simulador usa exactamente ese caso porque muestra de forma limpia la conservación de energía y la órbita cerrada en el plano `q,p`.
