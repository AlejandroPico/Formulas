# Aprendizaje

## Predice, prueba y explica

La transformada distingue cuánto y con qué fase contribuye cada frecuencia. La definición continua integra sobre toda la recta; el simulador usa una DFT finita, cuyos bins dependen de la ventana y del muestreo.

Mezcla dos cosenos y separa sus frecuencias. Se muestran 64 muestras en una ventana de 1 s y su DFT; los bins usan Hz. No es la integral continua sobre toda la recta.

## Tres formas de aprender

**Mezclador · Señal · Espectro y fase**

Separar tonos, estudiar amplitud y fase, detectar frecuencia dominante y comprender reconstrucción. La DFT presupone extensión periódica de su ventana; señales no alineadas con bins pueden mostrar fuga espectral y el muestreo puede generar aliasing.

## Cuatro misiones

1. **Predice antes de probar.** Un coseno de amplitud 1 y frecuencia 1 Hz: ¿en qué bin está su pico?

2. **Construye tu solución.** Elimina el tono de 3 Hz, manteniendo el de 1 Hz.

3. **La decisión importa.** Cambiar la fase de un tono aislado altera…

4. **Predice antes de probar.** Con 64 muestras en 1 s, ¿cuál es la frecuencia de Nyquist en Hz?

Hay pistas, reintentos y comprobación. Después de cada acierto, explica por qué cambió el resultado. Los controles admiten teclado; las cámaras 3D giran con ratón, tacto o flechas. La inversión continua exige condiciones de regularidad o interpretación en espacios funcionales. El experimento discreto limita los tonos a bins enteros de 1 a 12 Hz y 64 muestras/s; no representa una transformada impropia de cosenos como función ordinaria.
