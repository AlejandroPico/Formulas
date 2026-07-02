# Derivación

Buscamos un polinomio `P(x)` que cumpla `P(x_i)=y_i` para todos los nodos. La estrategia de Lagrange consiste en construir funciones base `L_i(x)` con dos propiedades:

- `L_i(x_i)=1`.
- `L_i(x_j)=0` si `j` es distinto de `i`.

Para lograrlo, se toma el producto:

`L_i(x)=prod_{j!=i}(x-x_j)/(x_i-x_j)`.

Cuando `x=x_j` con `j!=i`, uno de los factores del numerador se anula. Cuando `x=x_i`, cada factor queda dividido por sí mismo y el producto vale `1`.

Entonces el polinomio interpolador es:

`P(x)=sum y_i L_i(x)`.

Al evaluar en un nodo concreto, todos los términos se anulan salvo uno, y queda exactamente el valor `y_i`. Esta construcción demuestra directamente que el polinomio pasa por todos los puntos dados.
