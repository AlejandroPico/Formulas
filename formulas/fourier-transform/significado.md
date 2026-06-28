# Significado

La transformada de Fourier expresa una idea central del análisis moderno: una señal puede estudiarse no solo por su forma en el tiempo o en el espacio, sino también por las frecuencias que la componen. Cuando se observa una onda sonora, una imagen, una vibración mecánica o una señal eléctrica, la gráfica original muestra cómo cambia la magnitud medida. La transformada responde a otra pregunta: qué oscilaciones puras habría que combinar para reconstruir esa magnitud.

En su forma continua, la transformada toma una función `f(x)` y produce otra función, normalmente escrita como `\hat f(\xi)`, que mide el peso de cada frecuencia `\xi`. Las exponenciales complejas actúan como una base oscilatoria. Multiplicar por una exponencial y sumar mediante una integral equivale a medir cuánto de esa frecuencia hay dentro de la señal. Si una frecuencia está muy presente, el valor transformado será grande; si apenas aparece, será pequeño.

La transformada inversa permite volver al dominio original. Esta reversibilidad es fundamental: no se trata de una pérdida de información, sino de un cambio de coordenadas. Del mismo modo que un vector puede describirse en una base u otra, una señal puede describirse por valores temporales o por contenido frecuencial. En ingeniería, física y matemáticas, esta dualidad permite elegir el dominio donde el problema sea más claro.

Una de las razones de su potencia es que muchos operadores diferenciales se simplifican al pasar a frecuencia. Derivar en el tiempo o en el espacio se convierte en multiplicar por una frecuencia. Por eso la transformada de Fourier aparece en ecuaciones diferenciales, óptica, difusión, mecánica cuántica, tratamiento de señales y análisis de imágenes.

También ofrece una lectura física inmediata: las bajas frecuencias describen tendencias lentas y estructura global; las altas frecuencias describen cambios rápidos, bordes, ruido o detalles finos. En audio, los graves corresponden a frecuencias bajas y los agudos a frecuencias altas. En imagen, las bajas frecuencias capturan formas generales y las altas recogen contornos y textura.
