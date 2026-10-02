# Aprendizaje

## Tres formas de aprender

**Objetivo sustituto · Explorar · Ventaja firmada**

Un término de PPO con probabilidad antigua 0,5 y nueva 0,5r. La razón r cambia entre 0,2 y 1,8; ventaja firmada y ε positivo.

## Predice, prueba y justifica

1. **Predice antes de medir.** Un término de PPO con probabilidad antigua 0,5 y nueva 0,5r. La razón r cambia entre 0,2 y 1,8; ventaja firmada y ε positivo. Calcula término del objetivo ppo con los datos iniciales.

2. **Construye el objetivo.** Ajusta razón nueva / antigua hasta obtener término del objetivo ppo=1,6 .

3. **Distingue el modelo.** ¿Qué interpretación es correcta?

4. **Comprueba una nueva predicción.** Ahora razón nueva / antigua=0.8 . Calcula término del objetivo ppo y explica el cambio.

Los retos admiten pistas y reintentos. En exploración, mueve un control cada vez, anticipa el cambio y compara el resultado. Las vistas 3D admiten ratón, tacto y flechas del teclado.

## Una idea que debes poder explicar

El mínimo y el signo de la ventaja determinan qué lado se aplana

Se maximiza el promedio de términos. Ventaja se trata fija durante actualización; la política antigua asigna probabilidad positiva. Recortar el objetivo no impone una cota dura al KL ni a todas las razones. No incluye pérdidas de valor, bonus de entropía, rollout ni entrenamiento completo.
