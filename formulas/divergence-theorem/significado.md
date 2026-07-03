# Significado

El teorema de la divergencia, también llamado teorema de Gauss-Ostrogradsky, relaciona el flujo que atraviesa una superficie cerrada con la suma de las fuentes y sumideros dentro del volumen encerrado.

La forma general es:

`∯ F·n dS = ∭ div(F)dV`.

La izquierda mide lo que sale por la frontera. La derecha mide lo que nace o desaparece dentro. Si la divergencia es positiva, el campo actúa como fuente; si es negativa, como sumidero; si es cero, el flujo neto que entra y sale se compensa.

En el simulador se usa un campo radial `F=(kx,ky)`, cuyo flujo sale hacia fuera. Al aumentar `k`, aumenta la intensidad de la fuente y por tanto el flujo total a través de la frontera.

La idea conceptual es muy potente: para saber el balance global que atraviesa una superficie cerrada, basta sumar la divergencia local de todo el interior.