# Derivación

Para una matriz `2x2`

`A=[[a,b],[c,d]]`,

la traza es `tr(A)=a+d` y el determinante es `det(A)=ad-bc`. El polinomio característico se obtiene calculando `det(λI-A)`:

`det([[λ-a,-b],[-c,λ-d]])=(λ-a)(λ-d)-bc`.

Al expandir:

`λ^2-(a+d)λ+(ad-bc)`.

Por tanto:

`p_A(λ)=λ^2-tr(A)λ+det(A)`.

El teorema dice que podemos sustituir `λ` por `A` y obtener la matriz nula:

`p_A(A)=A^2-tr(A)A+det(A)I=0`.

La comprobación directa consiste en calcular `A^2`, restar `tr(A)A` y sumar `det(A)I`. En las entradas fuera de la diagonal se cancelan los términos con `b` y `c`; en la diagonal se cancelan los productos restantes. El simulador reproduce precisamente esa suma matricial componente a componente.
