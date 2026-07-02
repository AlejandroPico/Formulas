# Significado

El teorema de Cayley-Hamilton afirma que toda matriz cuadrada satisface su propio polinomio característico. Si calculamos `p_A(λ)=det(λI-A)` y después sustituimos formalmente `λ` por la matriz `A`, el resultado es la matriz nula.

En dimensión `2`, esto se escribe de forma especialmente clara: `A^2-tr(A)A+det(A)I=0`. La traza resume la suma de la diagonal principal y el determinante resume el cambio de área y la invertibilidad. La fórmula combina esos dos invariantes para producir una identidad matricial exacta.

La idea importante es que una matriz no es solo una tabla de números: representa una transformación lineal. Su polinomio característico codifica información estructural sobre esa transformación, y Cayley-Hamilton dice que esa información vuelve a aparecer cuando operamos con la propia matriz.

El simulador usa matrices `2x2` porque permiten verificar el teorema con una expresión manejable. Al modificar las entradas, se recalculan traza, determinante, `A^2`, el término `-tr(A)A` y el término `det(A)I`; la suma final debe dar la matriz nula.
