# Aprendizaje

## Primero predice

La advección pura mueve un perfil sin cambiar su forma. Un método numérico puede conservar masa y aun así deformarlo: esas son propiedades distintas.

Dominio periódico de 10 m. La solución exacta desplaza una campana; upwind conservativo la difumina. La comparación usa 80 celdas y CFL≤1, con sentido de actualización según el signo de c.

## Tres formas de aprender

**Transporte · Explorar · Exacta y numérica**

Distinguir transporte de difusión y comprobar estabilidad de discretizaciones. La comparación exacta/numerérica usa una campana periódica, 80 celdas y tiempo continuo reconstruido con pasos internos, incluido un último paso parcial.

## Cuatro misiones

1. **Predice el resultado.** Un perfil viaja a 2 m/s durante 3 s. ¿Cuánto se desplaza?

2. **Diseña una solución.** Detén el transporte con velocidad nula.

3. **Piensa antes de cambiar.** ¿La ecuación exacta difunde la campana?

4. **Un paso más.** Dominio periódico 10 m: el centro parte de x=3 y viaja a 1 m/s durante 9 s. ¿Dónde queda?

Hay pistas, comprobación y reintentos. Después de acertar, explica qué cambió y qué se mantuvo. Los controles tienen etiquetas y admiten teclado; las vistas 3D admiten giro con ratón, tacto o flechas. c constante, dominio periódico de longitud 10 m. Upwind se actualiza según el signo de c y CFL entre 0,1 y 1; no se presenta su ensanchamiento como difusión física.
