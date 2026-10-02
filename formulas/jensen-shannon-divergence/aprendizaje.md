# Aprendizaje

## Tres formas de aprender

**Dos fuentes · Explorar · Mezcla y distancia**

Jensen-Shannon con pesos iguales y logaritmos base dos. La mezcla m=(p+q)/2 garantiza soporte compatible; su raíz sí es una distancia.

## Predice, prueba y justifica

1. **Predice antes de medir.** Jensen-Shannon con pesos iguales y logaritmos base dos. La mezcla m=(p+q)/2 garantiza soporte compatible; su raíz sí es una distancia. Calcula divergencia js con los datos iniciales en bits.

2. **Construye el objetivo.** Ajusta fuente q hasta obtener divergencia js=0 bits.

3. **Distingue el modelo.** ¿Qué interpretación es correcta?

4. **Comprueba una nueva predicción.** Ahora fuente q=0.2 . Calcula divergencia js en bits y explica el cambio.

Los retos admiten pistas y reintentos. En exploración, mueve un control cada vez, anticipa el cambio y compara el resultado. Las vistas 3D admiten ratón, tacto y flechas del teclado.

## Una idea que debes poder explicar

JS en bits está entre cero y uno; la raíz es una métrica

Dos distribuciones normalizadas del mismo espacio, pesos iguales y base dos. Cambiar pesos o número de fuentes cambia la cota y la interpretación. El ejemplo binario evita singularidades de soporte con controles interiores, pero la mezcla permite en general probabilidades cero mediante límites correctos.
