# Derivacion

Una derivacion clasica combina conservacion de energia con la ley de Fourier de conduccion. La ley de Fourier afirma que el flujo de calor es proporcional al gradiente negativo de temperatura: el calor fluye desde zonas calientes hacia zonas frias.

Si se toma un pequeno segmento de barra, el cambio de energia interna depende de la diferencia entre el calor que entra y el calor que sale. Ese balance se expresa como una divergencia del flujo.

Al sustituir la ley de Fourier en el balance de energia aparece una segunda derivada espacial de la temperatura. Tras agrupar constantes del material se obtiene la difusividad `alpha`.

El resultado es `u_t = alpha u_xx` en una dimension. En varias dimensiones, la segunda derivada espacial se sustituye por el laplaciano.
