# Aprendizaje

## Tres formas de aprender

**Distribuciones · Explorar · Asimetría**

Divergencia KL entre dos Bernoulli, en nats. Penaliza usar q para una fuente p; no es una distancia simétrica.

## Predice, prueba y justifica

1. **Predice antes de medir.** Divergencia KL entre dos Bernoulli, en nats. Penaliza usar q para una fuente p; no es una distancia simétrica. Calcula divergencia kl con los datos iniciales en nats.

2. **Construye el objetivo.** Ajusta distribución propuesta q hasta obtener divergencia kl=0 nats.

3. **Distingue el modelo.** ¿Qué interpretación es correcta?

4. **Comprueba una nueva predicción.** Ahora distribución propuesta q=0.8 . Calcula divergencia kl en nats y explica el cambio.

Los retos admiten pistas y reintentos. En exploración, mueve un control cada vez, anticipa el cambio y compara el resultado. Las vistas 3D admiten ratón, tacto y flechas del teclado.

## Una idea que debes poder explicar

KL no es simétrica ni satisface en general desigualdad triangular

Mismo soporte de categorías y q positiva donde p es positiva. Un pi=0 aporta cero por límite; qi=0 con pi>0 produce infinito. Los controles de q son interiores, pero la comparación inversa puede ser infinita cuando p llega al borde. Igualdad o simetría en un ejemplo particular no altera el carácter dirigido de KL.
