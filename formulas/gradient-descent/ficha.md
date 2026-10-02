# Descenso del gradiente

Descender por el gradiente propone un movimiento contrario a la mayor subida local. Un paso demasiado grande puede aumentar la función u oscilar, incluso en una cuadrática convexa sencilla.

## Magnitudes

| Símbolo | Significado |
| :-- | :-- |
| w | Vector de parámetros optimizados; el subíndice indica número de iteración. |
| k | Índice entero de iteración, no tiempo físico. |
| η | Tamaño de paso positivo del algoritmo. |
| J | Función objetivo diferenciable; cuadrática convexa en el laboratorio. |
| x | Primera coordenada optimizada. |
| y | Segunda coordenada optimizada. |
| a | Curvatura positiva de la función en la dirección x. |
| b | Curvatura positiva en la dirección y. |
| max | El mayor de los argumentos, que controla la dirección más rígida. |

## Alcance

a,b>0, paso constante y gradiente exacto. La cota escrita es para esta cuadrática; en funciones generales exige condiciones adicionales. Los valores fuera de la ventana gráfica se conservan en el cálculo, no se recortan para fingir estabilidad.

## Unidades

El experimento usa coordenadas y función adimensionales. En general η debe convertir la unidad del gradiente en la unidad del parámetro. k cuenta pasos; no se etiqueta una iteración como segundo físico. Altura de superficie dibujada J/6, explícitamente escalada.
