# Derivación

Sea `f(z)=u(x,y)+iv(x,y)` con `z=x+iy`. Para que exista la derivada compleja en un punto, el cociente incremental debe dar el mismo resultado sin importar la dirección de aproximación.

Si el incremento es real, `h`, entonces se calcula:

`(f(z+h)-f(z))/h`.

Al separar partes real e imaginaria aparece `u_x+iv_x`.

Si el incremento es puramente imaginario, `ih`, entonces se calcula:

`(f(z+ih)-f(z))/(ih)`.

Al separar partes y dividir por `i`, el resultado equivalente es `v_y-iu_y`.

Para que ambas aproximaciones representen la misma derivada compleja, deben coincidir las partes reales e imaginarias. De ahí salen las dos condiciones:

- `u_x=v_y`
- `u_y=-v_x`

Estas condiciones son necesarias. Si además las derivadas parciales existen y son continuas en un entorno del punto, también son suficientes para garantizar diferenciabilidad compleja. En ese caso la derivada puede escribirse como `f'(z)=u_x+iv_x=v_y-iu_y`.

La derivación muestra por qué el análisis complejo no es simplemente cálculo de dos variables: la multiplicación por `i` impone una estructura geométrica que liga las direcciones horizontal y vertical.
