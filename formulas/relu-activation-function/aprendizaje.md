# Aprendizaje

## Tres formas de aprender

**Activación · Explorar · Derivada**

ReLU(x)=max(0,x). El punto x=0 no tiene derivada clásica; elegir una subderivada en software es una convención distinta.

## Predice, prueba y justifica

1. **Predice antes de medir.** ReLU(x)=max(0,x). El punto x=0 no tiene derivada clásica; elegir una subderivada en software es una convención distinta. Calcula salida relu con los datos iniciales.

2. **Construye el objetivo.** Ajusta entrada x hasta obtener salida relu=2 .

3. **Distingue el modelo.** ¿Qué interpretación es correcta?

4. **Comprueba una nueva predicción.** Ahora entrada x=2 . Calcula salida relu y explica el cambio.

Los retos admiten pistas y reintentos. En exploración, mueve un control cada vez, anticipa el cambio y compara el resultado. Las vistas 3D admiten ratón, tacto y flechas del teclado.

## Una idea que debes poder explicar

La derivada clásica en cero no existe aunque el software elija un valor

No suaviza la esquina. Una implementación puede elegir subgradiente cero en cero, pero es una convención para optimización. Una unidad permanentemente negativa puede dejar de recibir gradiente; la región positiva no satura.
