# Aprendizaje

## Tres formas de aprender

**Red mínima · Explorar · Gradientes**

Red escalar con una neurona tanh y salida lineal: z=wx+b, h=tanh(z), ŷ=vh, L=(ŷ−y)²/2. Se calcula el gradiente exacto por regla de la cadena.

## Predice, prueba y justifica

1. **Predice antes de medir.** Red escalar con una neurona tanh y salida lineal: z=wx+b, h=tanh(z), ŷ=vh, L=(ŷ−y)²/2. Se calcula el gradiente exacto por regla de la cadena. Calcula derivada de l respecto de w con los datos iniciales.

2. **Construye el objetivo.** Ajusta objetivo y hasta obtener derivada de l respecto de w=0,3634 .

3. **Distingue el modelo.** ¿Qué interpretación es correcta?

4. **Comprueba una nueva predicción.** Ahora objetivo y=0 . Calcula derivada de l respecto de w y explica el cambio.

Los retos admiten pistas y reintentos. En exploración, mueve un control cada vez, anticipa el cambio y compara el resultado. Las vistas 3D admiten ratón, tacto y flechas del teclado.

## Una idea que debes poder explicar

Retropropagación aplica regla de la cadena; actualizar pesos es otra operación

Red educativa escalar y diferenciable; no pretende entrenar un gran modelo. Calcular gradientes y actualizar pesos son operaciones distintas. Tanh puede saturar y disminuir gradientes; el gradiente tiene unidad de pérdida por unidad del parámetro.
