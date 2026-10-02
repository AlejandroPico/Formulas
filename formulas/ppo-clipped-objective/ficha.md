# PPO: función objetivo recortada

Un término de PPO con probabilidad antigua 0,5 y nueva 0,5r. La razón r cambia entre 0,2 y 1,8; ventaja firmada y ε positivo.

## Magnitudes y notación

| Símbolo | Interpretación |
| :-- | :-- |
| r | Razón entre probabilidad nueva y antigua. |
| t | Índice temporal de muestra. |
| θ | Parámetros de la política nueva. |
| π | Probabilidad de la acción bajo una política. |
| a | Acción observada. |
| s | Estado observado. |
| old | Marca parámetros de la política antigua. |
| L | Objetivo sustituto que se maximiza. |
| CLIP | Marca versión con recorte. |
| E | Promedio esperado de muestras. |
| A | Ventaja estimada y tratada fija. |
| ε | Anchura positiva del intervalo de recorte. |
| min | Menor de término original y recortado. |
| clip | Limita razón al intervalo [1−ε,1+ε]. |
| ˆ | Marca la ventaja estimada. |
| 𝔼 | Esperanza o promedio sobre muestras. |
| ∣ | Condicionado al estado: probabilidad de la acción observada en ese estado. |

## Condiciones

Se maximiza el promedio de términos. Ventaja se trata fija durante actualización; la política antigua asigna probabilidad positiva. Recortar el objetivo no impone una cota dura al KL ni a todas las razones. No incluye pérdidas de valor, bonus de entropía, rollout ni entrenamiento completo.

## Unidades

Las coordenadas y parámetros usan escala numérica de referencia. Probabilidades, razones, fases en radianes y pesos de atención son adimensionales. Las dimensiones de matrices deben permitir todos los productos; el laboratorio declara cada vector reducido.
