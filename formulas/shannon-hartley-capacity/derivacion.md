# Derivación

La capacidad del canal gaussiano de banda limitada depende del ancho B y de la razón lineal entre potencias de señal y ruido. Su eficiencia espectral es log2(1+S/N). Convertir una razón de potencia en dB exige S/N=10^(GdB/10), no introducir el número de dB como potencia. Con razón S/N fija, duplicar B duplica C; con potencia señal fija y densidad de ruido fija, S/N cambia al cambiar B.

## Hipótesis necesarias

Canal ideal AWGN, banda y potencias totales definidas de forma compatible. La capacidad es un límite asintótico con codificación adecuada, no rendimiento de un dispositivo concreto. Los controles mantienen la razón S/N al variar banda; no afirman que el ruido total permanezca fijo con una densidad espectral fija.

## Comprueba con números

Canal ideal de banda limitada con ruido gaussiano blanco aditivo y razón señal/ruido total S/N. El resultado es una capacidad teórica, no una velocidad garantizada de un módem. Calcula capacidad con los datos iniciales en Mbit/s. Capacidad=3,4594 Mbit/s. C=B log2(1+S/N), S/N=10^(dB/10).
