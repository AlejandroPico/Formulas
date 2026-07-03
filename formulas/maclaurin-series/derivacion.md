# Derivación

Se busca un polinomio que imite a la función cerca del origen:

`P(x)=c₀+c₁x+c₂x²+c₃x³+⋯`.

Para que ese polinomio represente bien a `f`, se impone que sus derivadas en `0` coincidan con las de la función original.

Primero, evaluando en `0`:

`P(0)=c₀=f(0)`.

Derivando una vez:

`P′(x)=c₁+2c₂x+3c₃x²+⋯`, luego `P′(0)=c₁=f′(0)`.

Derivando dos veces:

`P″(0)=2!c₂=f″(0)`, de modo que `c₂=f″(0)/2!`.

En general, al derivar `n` veces y evaluar en `0`, queda:

`P⁽ⁿ⁾(0)=n!cₙ`.

Por tanto:

`cₙ=f⁽ⁿ⁾(0)/n!`.

Sustituyendo todos los coeficientes aparece la serie:

`f(x)=∑ₙ₌₀∞ f⁽ⁿ⁾(0)xⁿ/n!`.

Para `e^x`, como todas sus derivadas son `e^x` y `e^0=1`, todos los coeficientes son `1/n!`. Por eso:

`eˣ=1+x+x²/2!+x³/3!+⋯`.