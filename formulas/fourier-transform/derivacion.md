# Derivación

La idea parte de las series de Fourier. Una función periódica puede representarse como suma de senos y cosenos, o de forma equivalente como suma de exponenciales complejas. En una serie periódica, las frecuencias permitidas son discretas: aparecen múltiplos enteros de una frecuencia fundamental.

Si el periodo se hace cada vez mayor, la separación entre frecuencias se vuelve cada vez más pequeña. En el límite de periodo infinito, la suma discreta se transforma en una integral continua. Ese paso conceptual lleva desde la serie de Fourier hasta la transformada de Fourier.

La fórmula directa calcula el coeficiente asociado a cada frecuencia. Para ello se multiplica la señal por una oscilación compleja conjugada y se integra en todo el dominio. Si la señal contiene una componente alineada con esa frecuencia, la integral acumula contribución; si no la contiene, las oscilaciones se cancelan.

La transformada inversa reconstruye la señal sumando todas las frecuencias posibles con sus pesos. La integral inversa es la recombinación continua de esas ondas elementales.

Una propiedad clave es la identidad de Plancherel: bajo las condiciones adecuadas, la energía total calculada en el dominio original coincide con la energía calculada en el dominio frecuencial. Esto justifica interpretar el espectro como una redistribución de la misma información, no como una aproximación arbitraria.

En aplicaciones discretas, la señal se muestrea en un número finito de puntos. La transformada discreta de Fourier reemplaza la integral por una suma finita y produce un conjunto finito de frecuencias. La transformada rápida de Fourier no cambia la matemática de fondo; lo que hace es reorganizar los cálculos para obtener el mismo resultado con mucha menos complejidad computacional.
