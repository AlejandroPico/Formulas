# Usos

Normalizar exponenciales positivas da probabilidades que suman uno. Para estabilidad se resta el máximo logit antes de exponenciar: el factor común se cancela. Si T disminuye, aumentan contrastes; si los logits empatan, mantienen igual probabilidad. El laboratorio grafica las tres curvas frente a temperatura y admite logits negativos. En el laboratorio contrasta una predicción, construye el objetivo y explica qué supuesto permite el resultado.

## Del experimento al contexto

Tres logits y temperatura positiva. Se resta el máximo antes de exponenciar para estabilidad; sumar la misma constante a todos no cambia probabilidades.

## Condiciones antes de aplicar

Logits no son probabilidades ni evidencias calibradas. T debe ser positiva. La salida normalizada no garantiza buena calibración, ni elimina incertidumbre o sesgo de datos. El límite de temperatura cero necesita tratar empates.
