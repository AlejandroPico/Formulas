# Aprendizaje

## Tres formas de aprender

**Probabilidades · Explorar · Temperatura**

Tres logits y temperatura positiva. Se resta el máximo antes de exponenciar para estabilidad; sumar la misma constante a todos no cambia probabilidades.

## Predice, prueba y justifica

1. **Predice antes de medir.** Tres logits y temperatura positiva. Se resta el máximo antes de exponenciar para estabilidad; sumar la misma constante a todos no cambia probabilidades. Calcula probabilidad de a en porcentaje con los datos iniciales.

2. **Construye el objetivo.** Ajusta logit a hasta obtener probabilidad de a en porcentaje=84,3795 .

3. **Distingue el modelo.** ¿Qué interpretación es correcta?

4. **Comprueba una nueva predicción.** Ahora logit a=2 . Calcula probabilidad de a en porcentaje y explica el cambio.

Los retos admiten pistas y reintentos. En exploración, mueve un control cada vez, anticipa el cambio y compara el resultado. Las vistas 3D admiten ratón, tacto y flechas del teclado.

## Una idea que debes poder explicar

Menor temperatura concentra probabilidades sin convertirlas en certezas calibradas

Logits no son probabilidades ni evidencias calibradas. T debe ser positiva. La salida normalizada no garantiza buena calibración, ni elimina incertidumbre o sesgo de datos. El límite de temperatura cero necesita tratar empates.
