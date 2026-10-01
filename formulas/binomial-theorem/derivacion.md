# Derivación

En el producto de n binomios, elige k posiciones para tomar b y las demás para tomar a. Todas esas elecciones producen aⁿ⁻ᵏbᵏ porque los factores conmutan.

Hay n! ordenaciones de n posiciones. Las k elegidas pueden permutarse entre sí de k! formas y las n−k restantes de (n−k)! formas sin crear una elección distinta. Dividir evita contarlas de nuevo.

Suma los casos k = 0,1,…,n. La recurrencia C(n,k) = C(n−1,k−1)+C(n−1,k) separa elecciones que contienen la última posición de las que no. Es la regla con que Pascal construye cada entrada desde las dos superiores.
