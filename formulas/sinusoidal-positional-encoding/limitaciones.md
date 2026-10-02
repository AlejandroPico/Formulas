# Limitaciones

d debe ser par para pares completos; índices i empiezan en cero. Fases en radianes. El vector se añade normalmente al embedding en la arquitectura original, pero aquí se estudia solo la codificación. No se afirma crecimiento monótono ni unicidad global de la posición para todo real.

Asocia un par seno/coseno a cada frecuencia. Para d=4 los pares tienen frecuencia 1 y 0,01, pues 10000^(2/4)=100. Cada par tiene norma uno y desplazar p añade fase. Las cuatro curvas se trazan con las mismas posiciones; la vista circular compara fases sin confundirlas con probabilidades.

Las coordenadas y parámetros usan escala numérica de referencia. Probabilidades, razones, fases en radianes y pesos de atención son adimensionales. Las dimensiones de matrices deben permitir todos los productos; el laboratorio declara cada vector reducido.
