# Ficha

## Identificación

- **Nombre:** Transformada de Fourier
- **Autoría histórica:** Joseph Fourier
- **Año de referencia:** 1822
- **Área:** análisis armónico, ecuaciones diferenciales, procesamiento de señales
- **Nivel:** universidad
- **Tipo:** transformación integral lineal

## Variables

- `f(x)`: señal, función o campo original.
- `\hat f(\xi)`: transformada de Fourier, o contenido frecuencial.
- `x`: variable original; puede representar tiempo, posición o una coordenada espacial.
- `\xi`: frecuencia asociada a `x`.
- `i`: unidad imaginaria.
- `e^{-2\pi i x\xi}`: núcleo oscilatorio usado para medir la contribución de la frecuencia `\xi`.

## Propiedades clave

- Es lineal: la transformada de una suma es la suma de las transformadas.
- Convierte derivadas en multiplicaciones por frecuencia.
- Convierte convoluciones en productos.
- Conserva energía bajo la identidad de Plancherel en espacios adecuados.
- Permite pasar del dominio temporal o espacial al dominio frecuencial.
- Tiene una versión discreta y computable mediante algoritmos FFT.

## Interpretación visual

En el simulador, la gráfica izquierda muestra una señal temporal formada por la suma de varias ondas. La gráfica derecha muestra el espectro: cada pico indica una frecuencia presente en la señal. Al cambiar amplitudes o frecuencias, el usuario observa cómo una modificación temporal se traduce inmediatamente en una redistribución de picos espectrales.

## Advertencias

La normalización de la transformada puede variar entre disciplinas. Algunas convenciones usan `2\pi` en la transformada directa, otras lo distribuyen entre la directa y la inversa, y otras trabajan con frecuencia angular `\omega`. La idea estructural es la misma, pero los factores constantes cambian.
