# Limitaciones

Es un único par educativo; en un embedding real varios pares usan distintas frecuencias. RoPE rota consultas y claves antes de compatibilidad, no añade un vector a todos. Una propiedad relativa algebraica no garantiza extrapolación ilimitada de contexto.

Una rotación por par 2D preserva norma. Usar ángulos mθ y nθ en consulta y clave da R(mθ)ᵀR(nθ)=R((n−m)θ); por eso el producto depende de la distancia relativa. El laboratorio usa q=(1,0), k=(0,6,0,8), ambos unitarios, y muestra coordenadas y producto. Trasladar ambas posiciones igual conserva la compatibilidad aunque los vectores roten.

Las coordenadas y parámetros usan escala numérica de referencia. Probabilidades, razones, fases en radianes y pesos de atención son adimensionales. Las dimensiones de matrices deben permitir todos los productos; el laboratorio declara cada vector reducido.
