# Significado

La serie de Maclaurin es una serie de Taylor centrada en el origen. Su objetivo es representar o aproximar una función mediante un polinomio construido a partir de las derivadas de esa función en `0`:

`f(x)=∑ₙ₌₀∞ f⁽ⁿ⁾(0)xⁿ/n!`.

La idea intuitiva es que una función puede reconstruirse localmente si conocemos suficiente información en un punto: su valor, su pendiente, su curvatura, la variación de la curvatura y así sucesivamente. Cada derivada añade un nuevo nivel de detalle.

En el caso de `e^x`, todas las derivadas en `0` valen `1`, por lo que la serie queda especialmente limpia:

`eˣ=1+x+x²/2!+x³/3!+⋯`.

El simulador muestra cómo el polinomio de grado `N` se acerca cada vez más a la curva real. La mejora es más clara cerca de `0`, porque ese es el centro de expansión. Lejos del centro, un polinomio truncado puede desviarse aunque la serie infinita converja.

La interpretación práctica es: Maclaurin permite sustituir funciones complicadas por polinomios manejables, útiles para cálculo numérico, aproximaciones rápidas, modelos físicos y desarrollo de algoritmos.