# Significado

La capacidad de Shannon-Hartley expresa la tasa máxima teórica a la que puede transmitirse información por un canal con ruido sin que los errores sean inevitables.

`B` es el ancho de banda disponible. `S/N` es la relación señal/ruido en escala lineal. Si el canal tiene más ancho de banda, puede transportar más símbolos por segundo. Si la señal domina mejor al ruido, cada símbolo puede codificar más información fiable.

La fórmula muestra una idea importante: aumentar el ancho de banda ayuda de forma lineal, mientras que mejorar la SNR ayuda de forma logarítmica.

El simulador muestra el espectro del canal, separando ruido y señal útil. Los controles modifican el ancho de banda y la SNR en decibelios, y la lectura convierte la SNR a escala lineal para calcular la capacidad.
