# Derivación

La divergencia KL puede entenderse a partir de la longitud media de código. Si los datos siguen `P` pero se codifican como si siguieran `Q`, aparece un coste extra.

La sorpresa asociada a un evento bajo una distribución se expresa mediante un logaritmo de su probabilidad. Al comparar la sorpresa bajo `Q` con la sorpresa bajo `P`, queda un logaritmo del cociente `P/Q`.

Promediando ese cociente bajo la distribución verdadera `P` se obtiene `D_KL(P||Q)`.

El resultado es no negativo y se anula solo cuando las distribuciones coinciden en los puntos relevantes.
