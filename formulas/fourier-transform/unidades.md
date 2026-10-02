# Unidades

Con x en segundos, ξ usa Hz y f̂ tiene unidad de f por segundo. La DFT normalizada conserva la unidad de amplitud de la señal. La fase usa radianes y N,j,k son adimensionales.

## Sentido de las conversiones

La transformada distingue cuánto y con qué fase contribuye cada frecuencia. La definición continua integra sobre toda la recta; el simulador usa una DFT finita, cuyos bins dependen de la ventana y del muestreo.

La inversión continua exige condiciones de regularidad o interpretación en espacios funcionales. El experimento discreto limita los tonos a bins enteros de 1 a 12 Hz y 64 muestras/s; no representa una transformada impropia de cosenos como función ordinaria.

Convierte antes de calcular; las cifras y posiciones del dibujo son una representación y no cambian las unidades de la magnitud.
