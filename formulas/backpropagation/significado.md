# Significado

La retropropagación calcula cómo debe cambiar cada peso de una red neuronal para reducir una pérdida. La idea central es aplicar la regla de la cadena desde la salida hacia las capas anteriores.

Primero se calcula el error en la salida. Después ese error se combina con derivadas locales de cada capa para obtener gradientes respecto a pesos internos.

El resultado no actualiza los pesos por sí solo: entrega los gradientes que luego usa un optimizador, como descenso del gradiente o Adam.

El simulador muestra una red de tres nodos. El flujo azul representa el pase hacia delante y el flujo rojo representa el gradiente que viaja hacia atrás. Al variar el error de salida cambian los gradientes calculados en cada conexión.
