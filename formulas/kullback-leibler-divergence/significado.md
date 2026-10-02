# Significado

Divergencia KL entre dos Bernoulli, en nats. Penaliza usar q para una fuente p; no es una distancia simétrica.

## Qué conserva y qué cambia

Añadir y restar la entropía de p al coste de usar q deja el exceso medio Σpi ln(pi/qi). La desigualdad de Gibbs garantiza no negatividad y igualdad para distribuciones idénticas. El orden importa: p pondera los términos y q aparece como propuesta. Intercambiar ambos cambia los costes en general; no se satisface una desigualdad triangular como la de una distancia métrica.

## Primera predicción

Divergencia KL entre dos Bernoulli, en nats. Penaliza usar q para una fuente p; no es una distancia simétrica. Calcula divergencia kl con los datos iniciales en nats. Divergencia KL=0,1927 nats. DKL=p ln(p/q)+(1−p)ln[(1−p)/(1−q)].
