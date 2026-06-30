# Ficha

## Identificación

- **Nombre:** Entropía cruzada
- **Área:** teoría de la información y aprendizaje automático
- **Nivel:** universidad inicial
- **Tipo:** función de pérdida probabilística

## Variables

- `p_i`: probabilidad objetivo.
- `q_i`: probabilidad predicha.
- `y_i`: etiqueta real.
- `y_hat_i`: probabilidad estimada.
- `L`: pérdida.

## Lectura del simulador

La curva roja representa `-ln(y_hat)` para la clase correcta. El punto móvil marca la predicción actual. Cuanto más cerca de cero esté la confianza correcta, mayor será la pérdida.

## Nota

En redes neuronales multiclase suele combinarse con softmax. En la práctica se implementa de forma numéricamente estable usando logits.
