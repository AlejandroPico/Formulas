# Aprendizaje

## Tres formas de aprender

**Ruta y valores · Explorar · Iteración**

Cadena de tres estados y una meta terminal. Quedarse cuesta 0,5; intentar avanzar cuesta 1 y llegar a meta recompensa 5. Avance probabilístico y descuento γ<1.

## Predice, prueba y justifica

1. **Predice antes de medir.** Cadena de tres estados y una meta terminal. Quedarse cuesta 0,5; intentar avanzar cuesta 1 y llegar a meta recompensa 5. Avance probabilístico y descuento γ<1. Calcula valor del estado inicial con los datos iniciales.

2. **Construye el objetivo.** Ajusta barridos de valor hasta obtener valor del estado inicial=1,34 .

3. **Distingue el modelo.** ¿Qué interpretación es correcta?

4. **Comprueba una nueva predicción.** Ahora barridos de valor=8 . Calcula valor del estado inicial y explica el cambio.

Los retos admiten pistas y reintentos. En exploración, mueve un control cada vez, anticipa el cambio y compara el resultado. Las vistas 3D admiten ratón, tacto y flechas del teclado.

## Una idea que debes poder explicar

El valor óptimo incluye recompensa futura descontada y probabilidad de transición

Supone estados y transiciones markovianos y recompensas acotadas; γ<1 en esta versión continua de tareas. No mezcla actualización de todos los valores con aprendizaje de una muestra. El intento fallido conserva estado pero paga su coste.
