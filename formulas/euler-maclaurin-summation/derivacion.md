# Derivación

La idea de partida es comparar una suma discreta con el área bajo una curva. Para una función suave `f`, la suma

`∑ₖ₌ₐᵇ f(k)`

puede imaginarse como una colección de barras centradas en valores enteros. La integral

`∫ₐᵇ f(x)dx`

mide el área continua bajo la curva. Si la función cambia lentamente, ambas cantidades se parecen; si cambia rápido o si los extremos pesan mucho, aparece error.

La primera corrección corresponde a los extremos:

`[f(a)+f(b)]/2`.

Este término recuerda a la regla del trapecio: no basta con integrar la curva, hay que ajustar cómo empieza y cómo termina la suma discreta.

Después aparecen correcciones basadas en números de Bernoulli. La primera de ellas usa `B₂=1/6` y depende de la diferencia entre derivadas en los extremos:

`B₂/2! · [f′(b)−f′(a)]`.

La expansión completa continúa con derivadas de orden impar más alto:

`f'''`, `f⁽⁵⁾`, `f⁽⁷⁾`, etc.

En la práctica se suele truncar la fórmula. El simulador usa una versión reducida: integral, corrección de extremos y primera corrección de derivadas. Esta forma ya muestra la idea esencial: una suma discreta puede entenderse como una integral corregida por información local de los bordes.