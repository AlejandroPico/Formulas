# Significado

Red escalar con una neurona tanh y salida lineal: z=wx+b, h=tanh(z), ŷ=vh, L=(ŷ−y)²/2. Se calcula el gradiente exacto por regla de la cadena.

## Qué conserva y qué cambia

Propaga hacia delante z, h, ŷ y L. Hacia atrás multiplica ∂L/∂ŷ=ŷ−y, ∂ŷ/∂h=v, ∂h/∂z=1−h² y ∂z/∂w=x. Para b la última derivada es uno; para v es h. Los tres gradientes se contrastan con diferencias centrales. La entrada cero anula dw pero no obliga a anular db.

## Primera predicción

Red escalar con una neurona tanh y salida lineal: z=wx+b, h=tanh(z), ŷ=vh, L=(ŷ−y)²/2. Se calcula el gradiente exacto por regla de la cadena. Calcula derivada de l respecto de w con los datos iniciales. Derivada de L respecto de w=-0,423 . ∂L/∂w=(ŷ−y)v(1−h²)x; no divide por x.
