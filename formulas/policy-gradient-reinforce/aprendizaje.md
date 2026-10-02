# Aprendizaje

## Tres formas de aprender

**Política · Explorar · Gradiente**

Política Bernoulli π(1)=sigmoid(θ), retorno observado G y baseline independiente de la acción. Se calcula una muestra del estimador REINFORCE.

## Predice, prueba y justifica

1. **Predice antes de medir.** Política Bernoulli π(1)=sigmoid(θ), retorno observado G y baseline independiente de la acción. Se calcula una muestra del estimador REINFORCE. Calcula gradiente muestral con los datos iniciales.

2. **Construye el objetivo.** Ajusta retorno g hasta obtener gradiente muestral=2 .

3. **Distingue el modelo.** ¿Qué interpretación es correcta?

4. **Comprueba una nueva predicción.** Ahora retorno g=4 . Calcula gradiente muestral y explica el cambio.

Los retos admiten pistas y reintentos. En exploración, mueve un control cada vez, anticipa el cambio y compara el resultado. Las vistas 3D admiten ratón, tacto y flechas del teclado.

## Una idea que debes poder explicar

Un baseline independiente de la acción reduce varianza sin cambiar la esperanza

Una muestra puede tener mucho ruido; no garantiza mejora. Retorno G y baseline deben usar la misma convención. El baseline no depende de la acción muestreada y se trata constante en el score. Este ejemplo no implementa una red ni una trayectoria completa.
