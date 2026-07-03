# Derivación

La derivación se entiende mejor desde la idea de ortogonalidad. En una base ortonormal, la suma de los cuadrados de las coordenadas de un vector es igual al cuadrado de su longitud total.

Para señales discretas, la transformada de Fourier escribe la señal como una combinación continua de exponenciales complejas `e^{jωn}`. Estas exponenciales actúan como modos ortogonales de frecuencia.

Si la transformación está normalizada como:

`X(e^{jω})=Σ x[n]e^{-jωn}`,

entonces la energía temporal es:

`Σ |x[n]|²`.

La energía espectral debe dividirse por `2π` por la convención de normalización de la transformada inversa:

`(1/2π)∫_{-π}^{π}|X(e^{jω})|²dω`.

La igualdad final expresa que cambiar de representación no crea ni destruye energía; solo la redistribuye entre componentes de frecuencia.