# Aprendizaje

## Primero predice

Varias hipótesis compiten por explicar una misma evidencia. Todas se normalizan con un único denominador: la probabilidad total de observarla.

Tres máquinas producen piezas. Normaliza pesos previos, multiplica por la probabilidad de una marca y vuelve a normalizar. Las máquinas son clases excluyentes y exhaustivas.

## Tres formas de aprender

**Clasificador · Explorar · Antes y después**

Clasificar por origen; actualizar varias explicaciones; comparar previa, peso conjunto y posterior. No es Naive Bayes: el ejemplo tiene una evidencia y no hace una hipótesis de independencia entre múltiples características.

## Cuatro misiones

1. **Predice el resultado.** Los pesos previos 1,1,2 se normalizan. ¿Qué porcentaje previo tiene C?

2. **Diseña una solución.** Haz imposible la marca en A para que su posterior sea cero.

3. **Piensa antes de cambiar.** ¿Deben sumar uno las probabilidades posteriores?

4. **Un paso más.** Con los valores iniciales, ¿qué porcentaje posterior tiene C?

Hay pistas, comprobación y reintentos. Después de acertar, explica qué cambió y qué se mantuvo. Los controles tienen etiquetas y admiten teclado; las vistas 3D admiten giro con ratón, tacto o flechas. Clases mutuamente excluyentes y exhaustivas, previas normalizadas y evidencia positiva. Pesos previos todos cero o verosimilitudes todos cero hacen el cálculo indefinido.
