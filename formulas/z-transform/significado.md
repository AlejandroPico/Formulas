# Significado

La transformada Z es la herramienta natural para estudiar senales discretas. Toma una sucesion `x[n]` y la convierte en una funcion compleja `X(z)` definida sobre el plano Z:

`X(z)=Sigma x[n] z^{-n}`.

El papel de `z` es doble. Su modulo mide crecimiento o decaimiento geometrico; su argumento representa oscilacion. Por eso una senal discreta puede analizarse observando polos, ceros y regiones de convergencia en el plano complejo.

Para la senal causal `x[n]=a^n u[n]`, la transformada es `X(z)=1/(1-az^{-1})`. El polo esta en `z=a` y la region de convergencia es `|z|>|a|`. Si el circulo unitario queda dentro de esa region, el sistema asociado es estable en el sentido BIBO.

El simulador muestra justamente esa lectura: al mover el polo, cambia la region de convergencia exterior y se observa si el circulo unitario queda incluido o excluido.