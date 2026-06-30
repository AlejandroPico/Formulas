# Ficha

## Identificación

- **Nombre:** Softmax
- **Área:** aprendizaje automático
- **Nivel:** universidad inicial
- **Tipo:** función de activación multiclase

## Variables

- `z_i`: logit de la clase `i`.
- `sigma(z)_i`: probabilidad asignada a la clase `i`.
- `e`: base exponencial.
- `c`: constante de estabilización numérica.

## Lectura del simulador

Cada control modifica un logit. Las barras muestran la probabilidad softmax resultante. Aunque los logits pueden subir o bajar libremente, las probabilidades finales siempre suman uno.

## Nota

En implementación real se resta el máximo logit antes de exponentiar para evitar overflow numérico.
