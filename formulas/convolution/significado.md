# Significado

La convolución mide cómo se solapan dos funciones cuando una de ellas se desplaza. La expresión continua `f*g` se interpreta como una integral de productos: para cada valor de `t`, se toma una copia desplazada de una función y se mide cuánto coincide con la otra.

Esta operación aparece cuando un sistema responde a una entrada. Si `f` representa una señal de entrada y `g` representa la respuesta del sistema a un impulso, la convolución produce la salida. Por eso es una herramienta fundamental en teoría de señales, electrónica, acústica, óptica, probabilidad y ecuaciones diferenciales.

Visualmente, la convolución tiene tres pasos: invertir o desplazar una función, multiplicarla punto a punto por la otra y sumar el área de solapamiento. Cuando el solapamiento es grande, el valor de la convolución es alto; cuando apenas coinciden, el valor es pequeño o nulo.

El simulador muestra una señal rectangular fija y una señal triangular móvil. El área verde representa el producto común que se integra. La curva inferior muestra cómo cambia el resultado de la convolución al desplazar la señal móvil.
