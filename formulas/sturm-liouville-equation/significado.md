# Significado

Un problema de Sturm-Liouville es un problema de autovalores para una ecuación diferencial. En vez de buscar un único número, se buscan valores especiales `λ` para los que existe una función no trivial `y(x)` que satisface la ecuación y las condiciones de contorno.

La forma general es:

`d/dx[p(x)y′]+q(x)y+λw(x)y=0`.

Los valores permitidos de `λ` son autovalores, y las soluciones asociadas son autofunciones. En el caso clásico de una cuerda fija en ambos extremos, las autofunciones son senos y los autovalores determinan los modos de vibración.

El simulador muestra el caso `-y''=λy` con condiciones `y(0)=y(1)=0`. Cada modo `n` tiene `n-1` nodos internos y autovalor `λ_n=n²π²`.

La idea fundamental es que muchas funciones pueden descomponerse como combinación de modos propios, del mismo modo que un vector se descompone en direcciones propias.