# Derivación

La intuición de la demostración se obtiene dividiendo un volumen en muchas celdas pequeñas. En cada celda, la divergencia mide el flujo neto que sale de esa celda por unidad de volumen.

Cuando se suman todas las celdas, los flujos a través de caras internas se cancelan: lo que sale de una celda entra en la vecina. Tras esa cancelación, solo queda el flujo a través de la frontera exterior.

Por eso:

`flujo exterior total = suma de fuentes internas`.

En el ejemplo del simulador, el campo es `F=(kx,ky)`. Su divergencia es:

`∂(kx)/∂x + ∂(ky)/∂y = k+k=2k`.

Como la divergencia es constante, la integral sobre la región se reduce a multiplicar `2k` por el área o volumen considerado. El flujo que cruza la frontera crece en la misma proporción.

La versión tridimensional usa una superficie cerrada real y un volumen; el simulador representa una sección bidimensional para facilitar la lectura visual.