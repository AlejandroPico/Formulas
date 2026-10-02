# Significado

Consulta de un decodificador y tres claves y valores de una memoria externa. Mismo mecanismo de atención, con procedencias de Q y K,V distintas.

## Qué conserva y qué cambia

Cada fila de QKᵀ mide compatibilidades de una consulta con claves. Divide por √dk para moderar la escala; una máscara aditiva M pone −∞ en claves prohibidas. Softmax por fila asigna pesos normalizados; multiplicar por V mezcla valores. El ejemplo utiliza una consulta 2D, tres claves [(1,0),(0,1),(−1,0)] y valores escalares [2,−1,1]. Q procede de un decodificador y K,V de una memoria de codificador; no se cambia la ecuación, cambia la procedencia.

## Primera predicción

Consulta de un decodificador y tres claves y valores de una memoria externa. Mismo mecanismo de atención, con procedencias de Q y K,V distintas. Calcula valor mezclado de salida con los datos iniciales. Valor mezclado de salida=1,008 . scores=q·ki/√2; pesos=softmax(scores); salida=Σpeso·valor.
