# Derivación

La demostración clásica evita buscar una primitiva directa. Se define:

`I=∫₋∞∞ e^{-x²}dx`.

En lugar de calcular `I` directamente, se calcula `I²`:

`I²=(∫₋∞∞ e^{-x²}dx)(∫₋∞∞ e^{-y²}dy)`.

Como las variables `x` e `y` son independientes, esto se convierte en una integral doble sobre todo el plano:

`I²=∫∫ e^{-(x²+y²)}dxdy`.

La expresión `x²+y²` sugiere pasar a coordenadas polares, donde `x²+y²=r²` y el elemento de área se transforma como `dxdy=rdrdθ`. Entonces:

`I²=∫₀^{2π}∫₀∞ e^{-r²}rdrdθ`.

La integral radial se resuelve con `u=r²`, `du=2rdr`:

`∫₀∞ e^{-r²}rdr=1/2`.

La parte angular vale `2π`, por tanto:

`I²=2π·1/2=π`.

Como `I` es positiva, se concluye:

`I=√π`.

El simulador muestra una versión truncada `∫₋ᵇᵇ e^{-x²}dx`. Al crecer `b`, esa integral parcial se aproxima al valor total.