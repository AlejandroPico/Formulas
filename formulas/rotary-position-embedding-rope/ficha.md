# RoPE: Rotary Position Embedding

RoPE reducido a un par 2D: q=(1,0), k=(0,6,0,8), posiciones m,n y frecuencia θ. Las rotaciones conservan norma y el producto depende de n−m.

## Magnitudes y notación

| Símbolo | Interpretación |
| :-- | :-- |
| R | Matriz ortogonal de rotación plana. |
| φ | Ángulo de una rotación. |
| θ | Frecuencia angular por posición. |
| q | Consulta antes de rotar; qm tras posición m. |
| k | Clave antes de rotar; kn tras posición n. |
| m | Posición de consulta. |
| n | Posición de clave. |
| sin | Seno del ángulo en radianes. |
| cos | Coseno del ángulo en radianes. |

## Condiciones

Es un único par educativo; en un embedding real varios pares usan distintas frecuencias. RoPE rota consultas y claves antes de compatibilidad, no añade un vector a todos. Una propiedad relativa algebraica no garantiza extrapolación ilimitada de contexto.

## Unidades

Las coordenadas y parámetros usan escala numérica de referencia. Probabilidades, razones, fases en radianes y pesos de atención son adimensionales. Las dimensiones de matrices deben permitir todos los productos; el laboratorio declara cada vector reducido.
