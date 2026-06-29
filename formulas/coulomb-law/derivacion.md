# Derivacion

Una forma de justificar la estructura de Coulomb parte de la simetria. Una carga puntual aislada no privilegia ninguna direccion del espacio, asi que su influencia debe distribuirse radialmente. A distancia `r`, esa influencia se reparte sobre una superficie esferica de area proporcional a `r^2`.

Si la cantidad total de flujo electrico asociada a una carga se conserva al atravesar cualquier esfera centrada en ella, la intensidad del campo debe decrecer como `1/r^2`. Al multiplicar ese campo por una segunda carga de prueba se obtiene la fuerza sobre ella.

La formulacion vectorial anade la direccion. El vector unitario radial indica hacia donde apunta la fuerza. El signo del producto `q1 q2` determina si la fuerza es repulsiva o atractiva.

En el simulador se usa una escala visual, no la constante fisica real completa, para que el cambio de fuerza sea perceptible en pantalla. La relacion cualitativa se conserva: mayor carga produce mayor fuerza y mayor distancia reduce la interaccion de forma cuadratica.
