# Aprendizaje

## Tres formas de aprender

**Mapa de similitud · Explorar · Perfil radial**

Kernel gaussiano exp(−γ||x−c||²), γ>0, con dos coordenadas y centro fijo ajustable. La escala de cada característica define la distancia.

## Predice, prueba y justifica

1. **Predice antes de medir.** Kernel gaussiano exp(−γ||x−c||²), γ>0, con dos coordenadas y centro fijo ajustable. La escala de cada característica define la distancia. Calcula similitud kernel con los datos iniciales.

2. **Construye el objetivo.** Ajusta coordenada x hasta obtener similitud kernel=0,0183 .

3. **Distingue el modelo.** ¿Qué interpretación es correcta?

4. **Comprueba una nueva predicción.** Ahora coordenada x=2 . Calcula similitud kernel y explica el cambio.

Los retos admiten pistas y reintentos. En exploración, mueve un control cada vez, anticipa el cambio y compara el resultado. Las vistas 3D admiten ratón, tacto y flechas del teclado.

## Una idea que debes poder explicar

El kernel es una similitud positiva, no una probabilidad de clase

γ tiene dimensión inversa al cuadrado de distancia. Características con unidades distintas deben escalarse de forma declarada; no se normalizan aquí automáticamente. K no es una densidad ni una probabilidad de pertenecer a una clase.
