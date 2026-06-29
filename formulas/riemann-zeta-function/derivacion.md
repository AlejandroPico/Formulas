# Derivación

La definición inicial es una serie de Dirichlet. Para parte real de `s` mayor que 1, la suma `1/n^s` converge absolutamente. En esa región, la factorización única de los enteros permite reescribir la suma como un producto sobre primos. Esa igualdad es el producto de Euler.

El paso profundo consiste en prolongar la función más allá de su región original de convergencia. La serie no sirve en todo el plano, pero existen expresiones equivalentes que permiten definir la zeta en casi todos los valores complejos, salvo un polo simple en `s=1`.

Una vía numérica útil es la función eta de Dirichlet, una serie alternada relacionada con zeta. La alternancia mejora el comportamiento de la suma y permite aproximar valores en zonas donde la serie original no converge directamente. El simulador usa esta idea para dibujar la trayectoria en la línea crítica.

La ecuación funcional relaciona `zeta(s)` con `zeta(1-s)` y revela una simetría profunda respecto a la línea crítica. Esa simetría es una de las razones por las que la recta de parte real `1/2` ocupa un papel central.
