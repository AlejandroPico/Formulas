# Ficha

## Identificación

- Nombre: Suma de progresión aritmética.
- Área: Aritmética y álgebra.
- Nivel recomendado: ESO y repaso de Bachillerato.
- Tipo de fórmula: suma finita de una sucesión lineal discreta.

## Fórmulas principales

`a_n = a_1+(n-1)d`

`S_n = n(a_1+a_n)/2`

`S_n = n(2a_1+(n-1)d)/2`

## Variables

- `a_1`: primer término de la progresión.
- `a_n`: último término considerado.
- `d`: diferencia común entre dos términos consecutivos.
- `n`: número de términos que se suman.
- `S_n`: suma de los `n` primeros términos.

## Lectura conceptual

La fórmula dice que una progresión aritmética puede sumarse como si todos sus términos fueran iguales a la media entre el primero y el último. Esa media es `(a_1+a_n)/2`; al multiplicarla por el número de términos `n`, obtenemos el total.

## Lectura del simulador

Cada barra del canvas representa un término. Los controles modifican el primer término, la diferencia y el número de términos. La visualización permite observar si la progresión crece, decrece o se mantiene constante. La lectura inferior muestra la secuencia generada, la suma por fórmula y la suma directa.

## Validez

La fórmula es exacta para cualquier progresión aritmética finita. La diferencia `d` puede ser positiva, cero o negativa. También puede aplicarse a valores decimales o expresiones algebraicas siempre que la diferencia entre términos sea constante.

## Errores habituales

- Usar el último término como si fuera el número de términos.
- Olvidar dividir entre dos.
- Aplicar la fórmula a una sucesión que no tiene diferencia constante.
- Calcular mal `a_n` usando `n` saltos en vez de `n-1` saltos.

## Recomendación didáctica

Conviene empezar con ejemplos visuales, después emparejar términos extremos y finalmente pasar a la fórmula general. El simulador debe usarse para comprobar que la suma directa y la fórmula coinciden incluso cuando la diferencia cambia.
