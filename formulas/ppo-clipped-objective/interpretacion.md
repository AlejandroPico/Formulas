# Interpretación

Se maximiza el promedio de términos. Ventaja se trata fija durante actualización; la política antigua asigna probabilidad positiva. Recortar el objetivo no impone una cota dura al KL ni a todas las razones. No incluye pérdidas de valor, bonus de entropía, rollout ni entrenamiento completo.

La razón compara probabilidad nueva y antigua de la misma acción. Multiplica por ventaja y compara con la razón recortada; el mínimo penaliza mejora excesiva del objetivo sustituto. Para ventaja positiva se aplana arriba; para negativa se aplana abajo. El laboratorio evalúa un término muestral, con probabilidad antigua 0,5 y nueva 0,5r, ambas válidas en el rango.

Las coordenadas y parámetros usan escala numérica de referencia. Probabilidades, razones, fases en radianes y pesos de atención son adimensionales. Las dimensiones de matrices deben permitir todos los productos; el laboratorio declara cada vector reducido.
