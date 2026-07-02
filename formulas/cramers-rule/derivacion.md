# Derivación

Consideremos el sistema:

`a1 x + b1 y = c1`

`a2 x + b2 y = c2`.

La matriz de coeficientes es `A=[[a1,b1],[a2,b2]]`. Su determinante es:

`D=a1 b2-b1 a2`.

Para obtener `x`, sustituimos la primera columna por los términos independientes:

`Dx=det([[c1,b1],[c2,b2]])=c1 b2-b1 c2`.

Para obtener `y`, sustituimos la segunda columna:

`Dy=det([[a1,c1],[a2,c2]])=a1 c2-c1 a2`.

Si `D` no es cero, la solución única es:

`x=Dx/D`, `y=Dy/D`.

La idea puede justificarse desde la inversa de una matriz `2x2` o desde la eliminación algebraica. En ambos casos aparece el mismo denominador: el determinante principal. Por eso el determinante decide si el sistema tiene solución única.
