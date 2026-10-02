# Unidades

Probabilidades y perplejidad adimensionales. NLL media en nats/token; H2 en bits/token. PPL≥1 para probabilidades en (0,1], con igualdad si cada token observado tiene probabilidad uno. Se informa pérdida por token, no por carácter o palabra mezclados.

## Qué se convierte en el laboratorio

PPL=exp(−(lnp1+lnp2+lnp3+lnp4)/4).

## Dominio y coherencia

Probabilidades condicionales positivas, mismo conjunto de evaluación y tokenización para comparar modelos. No equivale necesariamente a número de palabras posibles ni calidad semántica. Una probabilidad cero de un token observado da perplejidad infinita; controles positivos evitan esa singularidad. La cadena omite factores de inicio ya incorporados en cada contexto.

Cuatro probabilidades condicionales del token que realmente apareció, una por posición. No son cuatro categorías que deban sumar uno; su producto es la probabilidad de la secuencia bajo el modelo.
