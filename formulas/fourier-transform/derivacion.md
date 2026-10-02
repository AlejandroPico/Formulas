# Derivación

Multiplica f por una exponencial compleja y acumula: las oscilaciones de frecuencia distinta se cancelan por ortogonalidad. En la ventana periódica de N muestras, reemplaza la integral por la suma indicada. Un coseno de amplitud a tiene coeficientes a/2 en los bins positivo y negativo; la gráfica unilateral duplica los bins interiores y divide por N. DC y Nyquist no se duplican.

## Comprueba el resultado

Un coseno de amplitud 1 y frecuencia 1 Hz: ¿en qué bin está su pico? En la ventana de 1 s, el bin k=1 corresponde a 1 Hz.

## Condiciones necesarias

La inversión continua exige condiciones de regularidad o interpretación en espacios funcionales. El experimento discreto limita los tonos a bins enteros de 1 a 12 Hz y 64 muestras/s; no representa una transformada impropia de cosenos como función ordinaria.
