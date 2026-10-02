# Unidades

Las coordenadas y parámetros usan escala numérica de referencia. Probabilidades, razones, fases en radianes y pesos de atención son adimensionales. Las dimensiones de matrices deben permitir todos los productos; el laboratorio declara cada vector reducido.

## Qué se convierte en el laboratorio

L=min(rA,clip(r,1−ε,1+ε)A); se maximiza su promedio.

## Dominio y coherencia

Se maximiza el promedio de términos. Ventaja se trata fija durante actualización; la política antigua asigna probabilidad positiva. Recortar el objetivo no impone una cota dura al KL ni a todas las razones. No incluye pérdidas de valor, bonus de entropía, rollout ni entrenamiento completo.

Un término de PPO con probabilidad antigua 0,5 y nueva 0,5r. La razón r cambia entre 0,2 y 1,8; ventaja firmada y ε positivo.
