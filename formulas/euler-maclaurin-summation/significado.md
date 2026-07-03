# Significado

La fórmula de sumación de Euler-Maclaurin conecta dos mundos: las sumas discretas y las integrales continuas. Una suma como `∑f(k)` puede verse como una acumulación de barras; una integral como `∫f(x)dx` puede verse como un área suave bajo una curva. Euler-Maclaurin explica cómo pasar de una a otra añadiendo correcciones.

La aproximación básica por integral suele capturar la tendencia global, pero no siempre reproduce bien los extremos. Por eso aparece el término `[f(a)+f(b)]/2`, que corrige el borde inicial y final. Después aparecen términos con derivadas y números de Bernoulli: estos refinan la aproximación teniendo en cuenta la pendiente, la curvatura y la variación local en los extremos.

La fórmula es especialmente valiosa cuando la suma tiene muchos términos o cuando interesa una expansión asintótica. En lugar de sumar término a término, se aproxima el comportamiento global mediante una integral y se corrige el error de discretización.

En el simulador, las barras representan la suma real y la curva representa la función continua. La diferencia visual entre barras y área es precisamente el tipo de diferencia que Euler-Maclaurin intenta controlar.