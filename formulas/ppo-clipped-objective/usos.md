# Usos

La razón compara probabilidad nueva y antigua de la misma acción. Multiplica por ventaja y compara con la razón recortada; el mínimo penaliza mejora excesiva del objetivo sustituto. Para ventaja positiva se aplana arriba; para negativa se aplana abajo. El laboratorio evalúa un término muestral, con probabilidad antigua 0,5 y nueva 0,5r, ambas válidas en el rango. En aplicaciones, verifica dimensión, máscara y procedencia de datos antes de trasladar el ejemplo a un modelo real.

## Del experimento al contexto

Un término de PPO con probabilidad antigua 0,5 y nueva 0,5r. La razón r cambia entre 0,2 y 1,8; ventaja firmada y ε positivo.

## Condiciones antes de aplicar

Se maximiza el promedio de términos. Ventaja se trata fija durante actualización; la política antigua asigna probabilidad positiva. Recortar el objetivo no impone una cota dura al KL ni a todas las razones. No incluye pérdidas de valor, bonus de entropía, rollout ni entrenamiento completo.
