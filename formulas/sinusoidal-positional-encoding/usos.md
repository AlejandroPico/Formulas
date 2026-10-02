# Usos

Asocia un par seno/coseno a cada frecuencia. Para d=4 los pares tienen frecuencia 1 y 0,01, pues 10000^(2/4)=100. Cada par tiene norma uno y desplazar p añade fase. Las cuatro curvas se trazan con las mismas posiciones; la vista circular compara fases sin confundirlas con probabilidades. En aplicaciones, verifica dimensión, máscara y procedencia de datos antes de trasladar el ejemplo a un modelo real.

## Del experimento al contexto

Vector posicional de dimensión cuatro, con frecuencias 1 y 0,01 radianes por posición. No son probabilidades ni posiciones aprendidas.

## Condiciones antes de aplicar

d debe ser par para pares completos; índices i empiezan en cero. Fases en radianes. El vector se añade normalmente al embedding en la arquitectura original, pero aquí se estudia solo la codificación. No se afirma crecimiento monótono ni unicidad global de la posición para todo real.
