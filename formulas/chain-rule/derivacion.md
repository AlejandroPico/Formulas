# Derivación

Escribe u = g(x). Por derivabilidad, el incremento interior satisface Δu = g′(x)h + o(h). Para la función exterior, Δy = f′(u)Δu + o(Δu).

Sustituye Δu y usa que Δu es de orden h: Δy = f′(g(x))g′(x)h + o(h). Divide entre h y toma el límite: (f∘g)′(x) = f′(g(x))g′(x).

Esta demostración no divide entre g′ ni requiere que Δu sea siempre distinto de cero. Por eso sigue funcionando en x = 0 para g(x) = x²+1, donde la sensibilidad interior se anula.
