# Derivación

La transformada Z se define como una serie de potencias generalizada:

`X(z)=Σ x[n]z^{-n}`.

Para la señal causal `x[n]=a^n u[n]`, solo hay términos desde `n=0`:

`X(z)=Σ_{n=0}^∞ a^n z^{-n}`.

Esto puede reescribirse como una serie geométrica:

`X(z)=Σ_{n=0}^∞ (az^{-1})^n`.

La suma geométrica converge si `|az^{-1}|<1`, es decir, si `|z|>|a|`. Bajo esa condición:

`X(z)=1/(1-az^{-1})`.

El denominador se anula en `z=a`, por lo que aparece un polo en esa posición. La región de convergencia queda fuera del círculo de radio `|a|`. Si ese exterior contiene el círculo unitario, entonces la respuesta impulsional es absolutamente sumable y el sistema es estable.