# Significado

El teorema de Parseval afirma que la energía total de una señal no depende del dominio en el que se mida. Puede calcularse sumando la energía de sus muestras en el tiempo o integrando la energía de su representación en frecuencia.

Para señales discretas, una forma habitual es:

`Σ |x[n]|² = (1/2π)∫ |X(e^{jω})|² dω`.

La igualdad no dice que la señal temporal y el espectro tengan la misma forma. Dice que la cantidad global de energía se conserva al transformar la señal. El dominio temporal muestra dónde está la energía; el dominio frecuencial muestra en qué oscilaciones se reparte.

En el simulador, el pulso rectangular tiene energía temporal fácil de calcular. A la derecha se muestra la densidad espectral asociada. Al mover la amplitud, ambas energías cambian de forma coherente porque dependen de `A²`.