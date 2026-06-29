# Derivación

La convolución se obtiene al describir un sistema lineal mediante su respuesta elemental. Una señal complicada puede verse como una suma de contribuciones simples desplazadas. Cada contribución genera una copia desplazada de la respuesta del sistema.

Al sumar todas esas copias desplazadas aparece la integral de convolución. El parámetro de integración recorre todas las posiciones posibles de solapamiento entre las dos funciones.

En versión discreta, la integral se sustituye por una suma. Para cada posición, se multiplican valores de una señal por valores desplazados de la otra y se acumula el resultado.

La interpretación geométrica es directa: el valor de la convolución es grande cuando las dos formas se solapan mucho y pequeño cuando apenas coinciden.
