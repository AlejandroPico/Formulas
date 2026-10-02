# Aprendizaje

## Tres formas de aprender

**Tokens · Explorar · Media geométrica**

Cuatro probabilidades condicionales del token que realmente apareció, una por posición. No son cuatro categorías que deban sumar uno; su producto es la probabilidad de la secuencia bajo el modelo.

## Predice, prueba y justifica

1. **Predice antes de medir.** Cuatro probabilidades condicionales del token que realmente apareció, una por posición. No son cuatro categorías que deban sumar uno; su producto es la probabilidad de la secuencia bajo el modelo. Calcula perplejidad con los datos iniciales.

2. **Construye el objetivo.** Ajusta probabilidad del token 2 hasta obtener perplejidad=2,3784 .

3. **Distingue el modelo.** ¿Qué interpretación es correcta?

4. **Comprueba una nueva predicción.** Ahora probabilidad del token 2=0.5 . Calcula perplejidad y explica el cambio.

Los retos admiten pistas y reintentos. En exploración, mueve un control cada vez, anticipa el cambio y compara el resultado. Las vistas 3D admiten ratón, tacto y flechas del teclado.

## Una idea que debes poder explicar

Perplejidades solo se comparan con evaluación y tokenización compatibles

Probabilidades condicionales positivas, mismo conjunto de evaluación y tokenización para comparar modelos. No equivale necesariamente a número de palabras posibles ni calidad semántica. Una probabilidad cero de un token observado da perplejidad infinita; controles positivos evitan esa singularidad. La cadena omite factores de inicio ya incorporados en cada contexto.
