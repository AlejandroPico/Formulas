# Unidades

Las coordenadas y parámetros usan escala numérica de referencia. Probabilidades, razones, fases en radianes y pesos de atención son adimensionales. Las dimensiones de matrices deben permitir todos los productos; el laboratorio declara cada vector reducido.

## Qué se convierte en el laboratorio

y=γ(x−μ)/√(var+ε)+β, ε=10⁻⁵.

## Dominio y coherencia

Entrenamiento e inferencia usan estadísticas distintas. Con ε>0 la varianza normalizada no es exactamente uno; si el lote es constante la salida es β. No se usa varianza muestral insesgada N−1. Los frameworks pueden guardar estimadores distintos para inferencia; este modelo declara los suyos.

Una característica en un lote de cuatro muestras. Entrenamiento usa media y varianza del lote con divisor N; inferencia usa aquí referencias fijas μ=0, varianza=1.
