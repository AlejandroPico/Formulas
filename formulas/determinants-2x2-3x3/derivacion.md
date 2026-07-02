# Derivación

Para una matriz `2x2`:

`[[a,b],[c,d]]`,

el determinante se calcula como el producto de la diagonal principal menos el producto de la diagonal secundaria:

`det(A)=ad-bc`.

Esta resta refleja orientación. Si dos columnas son proporcionales, el paralelogramo queda aplastado y el determinante vale cero.

Para una matriz `3x3`:

`[[a,b,c],[d,e,f],[g,h,i]]`,

la regla de Sarrus suma los productos de las diagonales descendentes:

`aei+bfg+cdh`,

y resta los productos de las diagonales ascendentes:

`ceg+afh+bdi`.

Por tanto:

`det(A)=aei+bfg+cdh-ceg-afh-bdi`.

Esta regla puede justificarse como un caso particular de la fórmula general del determinante por permutaciones.
