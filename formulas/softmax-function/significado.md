# Significado

Tres logits y temperatura positiva. Se resta el máximo antes de exponenciar para estabilidad; sumar la misma constante a todos no cambia probabilidades.

## Qué conserva y qué cambia

Normalizar exponenciales positivas da probabilidades que suman uno. Para estabilidad se resta el máximo logit antes de exponenciar: el factor común se cancela. Si T disminuye, aumentan contrastes; si los logits empatan, mantienen igual probabilidad. El laboratorio grafica las tres curvas frente a temperatura y admite logits negativos.

## Primera predicción

Tres logits y temperatura positiva. Se resta el máximo antes de exponenciar para estabilidad; sumar la misma constante a todos no cambia probabilidades. Calcula probabilidad de a en porcentaje con los datos iniciales. Probabilidad de A en porcentaje=66,5241 . pi=exp(zi/T)/Σexp(zj/T); T>0.
