# Ficha

## Identificación

- **Nombre:** Ecuaciones de Cauchy-Riemann
- **Autoría histórica:** Augustin-Louis Cauchy y Bernhard Riemann
- **Área:** análisis complejo
- **Nivel:** universidad
- **Tipo:** condiciones diferenciales locales

## Variables

- `z=x+iy`: número complejo escrito en coordenadas reales.
- `f(z)=u(x,y)+iv(x,y)`: función compleja descompuesta en parte real e imaginaria.
- `u(x,y)`: parte real.
- `v(x,y)`: parte imaginaria.
- `u_x`, `u_y`, `v_x`, `v_y`: derivadas parciales.

## Condiciones

- `u_x=v_y`
- `u_y=-v_x`

Si las derivadas parciales son continuas y las condiciones se cumplen en un entorno, la función es holomorfa en ese entorno.

## Lectura del simulador

El simulador compara una función analítica, como `f(z)=z²`, con una función que no cumple la estructura compleja. El usuario mueve el punto por el plano y observa los valores de las derivadas parciales. El resultado muestra de forma inmediata si las dos condiciones se cumplen.

## Ideas clave

- No basta con derivabilidad real de `u` y `v`.
- La derivada compleja exige independencia de dirección.
- Las funciones holomorfas preservan ángulos localmente salvo puntos críticos.
- Las partes real e imaginaria están ligadas: no se eligen de forma independiente.
