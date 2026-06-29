# Ficha

## Identificacion

- **Nombre:** Leyes de Kirchhoff
- **Autor:** Gustav Kirchhoff
- **Año:** 1845
- **Area:** circuitos electricos
- **Nivel:** bachillerato y universidad inicial
- **Tipo:** leyes de conservacion para redes electricas

## Variables

- `I`: corriente electrica.
- `V`: tension electrica.
- `R1`, `R2`: resistencias de rama.
- `Itotal`: corriente que entra en el nodo.
- `I1`, `I2`: corrientes de salida por cada rama.

## Lectura del simulador

El circuito tiene dos ramas en paralelo. El nodo reparte la corriente total. Al reducir una resistencia, esa rama conduce mas corriente. La lectura muestra que `Itotal = I1 + I2` y que la tension de cada rama coincide con la fuente.

## Advertencia

El simulador usa un modelo ideal de corriente continua. En circuitos reales pueden aparecer resistencias internas, tolerancias, temperatura y efectos transitorios.
