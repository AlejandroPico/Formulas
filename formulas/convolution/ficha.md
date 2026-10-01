# Convolución

La convolución acumula cuánto se solapan una señal y otra invertida y desplazada. Describe la salida de un sistema lineal invariante en el tiempo ante una entrada.

## Magnitudes

| Símbolo | Significado |
| :-- | :-- |
| f | Primera señal o función continua. |
| g | Segunda función: se invierte y desplaza dentro de la integral. |
| t | Instante donde se evalúa la convolución. |
| τ | Variable interna de integración. |
| x | Secuencia discreta de entrada. |
| h | Respuesta impulsional discreta. |
| y | Secuencia discreta de salida. |
| n | Índice de salida. |
| k | Índice interno de suma. |
| * | Convolución entre funciones o secuencias; no multiplicación punto a punto. |

## Alcance

Integral o suma convergente. Para interpretación como respuesta de un sistema se requiere linealidad e invariancia temporal; causalidad restringe soportes, pero no es parte de toda convolución abstracta.

## Unidades

Si f,g usan u y el tiempo segundos, la convolución continua usa u²·s. La discreta suma u²; una aproximación numérica de la integral requiere multiplicar por Δt. Omitir ese paso mezcla dos convenciones diferentes.
