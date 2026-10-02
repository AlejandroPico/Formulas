# Unidades

Variables numéricas en unidades de referencia; los índices y probabilidades son adimensionales. Una distancia conserva la escala de las características; su cuadrado tiene escala cuadrática.

## Qué se convierte en el laboratorio

pi=exp(zi/T)/Σexp(zj/T); T>0.

## Dominio y coherencia

Logits no son probabilidades ni evidencias calibradas. T debe ser positiva. La salida normalizada no garantiza buena calibración, ni elimina incertidumbre o sesgo de datos. El límite de temperatura cero necesita tratar empates.

Tres logits y temperatura positiva. Se resta el máximo antes de exponenciar para estabilidad; sumar la misma constante a todos no cambia probabilidades.
