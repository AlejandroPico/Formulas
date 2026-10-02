# Derivación

Propaga hacia delante z, h, ŷ y L. Hacia atrás multiplica ∂L/∂ŷ=ŷ−y, ∂ŷ/∂h=v, ∂h/∂z=1−h² y ∂z/∂w=x. Para b la última derivada es uno; para v es h. Los tres gradientes se contrastan con diferencias centrales. La entrada cero anula dw pero no obliga a anular db.

## Hipótesis necesarias

Red educativa escalar y diferenciable; no pretende entrenar un gran modelo. Calcular gradientes y actualizar pesos son operaciones distintas. Tanh puede saturar y disminuir gradientes; el gradiente tiene unidad de pérdida por unidad del parámetro.

## Comprueba con números

Red escalar con una neurona tanh y salida lineal: z=wx+b, h=tanh(z), ŷ=vh, L=(ŷ−y)²/2. Se calcula el gradiente exacto por regla de la cadena. Calcula derivada de l respecto de w con los datos iniciales. Derivada de L respecto de w=-0,423 . ∂L/∂w=(ŷ−y)v(1−h²)x; no divide por x.
