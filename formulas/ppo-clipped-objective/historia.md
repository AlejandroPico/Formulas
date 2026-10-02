# Historia

Schulman y colaboradores propusieron PPO en 2017 para realizar varias actualizaciones con un objetivo sustituto controlado. La variante recortada ofrece una alternativa práctica a restricciones más costosas, sin convertir recorte en una garantía universal de estabilidad.

## Referencia y alcance

[Material de estudio](https://arxiv.org/abs/1707.06347).

Se maximiza el promedio de términos. Ventaja se trata fija durante actualización; la política antigua asigna probabilidad positiva. Recortar el objetivo no impone una cota dura al KL ni a todas las razones. No incluye pérdidas de valor, bonus de entropía, rollout ni entrenamiento completo.

La fecha de creación del catálogo procede del archivo original; el año científico y la fecha de revisión tienen funciones diferentes.
