# Ficha

## Identificación

- Nombre: Teorema de Parseval.
- Área: análisis armónico, Fourier y procesamiento de señales.
- Idea central: la energía de una señal se conserva al pasar del dominio temporal al dominio frecuencial.

## Variables

- `x[n]`: señal discreta.
- `X(e^{jω})`: transformada de Fourier discreta en frecuencia continua.
- `ω`: frecuencia angular normalizada.
- `A`: amplitud del pulso usado en el simulador.

## Lectura del simulador

La mitad izquierda muestra la energía de las muestras temporales `|x[n]|²`. La mitad derecha muestra una densidad espectral proporcional a `|X(e^{jω})|²`. Al cambiar la amplitud, la energía crece como `A²` en ambos dominios.

## Limitaciones

El ejemplo usa un pulso corto de tres muestras. Señales largas, complejas o no absolutamente sumables requieren más cuidado en la interpretación de energía, potencia y convergencia.
