# Unidades

Variables numéricas en unidades de referencia; los índices y probabilidades son adimensionales. Una distancia conserva la escala de las características; su cuadrado tiene escala cuadrática.

## Qué se convierte en el laboratorio

∂L/∂w=(ŷ−y)v(1−h²)x; no divide por x.

## Dominio y coherencia

Red educativa escalar y diferenciable; no pretende entrenar un gran modelo. Calcular gradientes y actualizar pesos son operaciones distintas. Tanh puede saturar y disminuir gradientes; el gradiente tiene unidad de pérdida por unidad del parámetro.

Red escalar con una neurona tanh y salida lineal: z=wx+b, h=tanh(z), ŷ=vh, L=(ŷ−y)²/2. Se calcula el gradiente exacto por regla de la cadena.
