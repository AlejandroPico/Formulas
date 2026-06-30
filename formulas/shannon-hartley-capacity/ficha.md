# Ficha

## Identificación

- **Nombre:** Capacidad de Shannon-Hartley
- **Autores asociados:** Claude Shannon y Ralph Hartley
- **Año:** 1948
- **Área:** teoría de la información y telecomunicaciones
- **Nivel:** universidad inicial
- **Tipo:** límite de capacidad de canal

## Variables

- `C`: capacidad máxima del canal.
- `B`: ancho de banda.
- `S`: potencia de señal.
- `N`: potencia de ruido.
- `SNR`: relación señal/ruido lineal.

## Lectura del simulador

El bloque horizontal representa el ancho de banda. El suelo rojo es ruido y la zona verde es señal útil sobre el ruido. La lectura convierte SNR en dB a escala lineal y calcula la capacidad.

## Nota de corrección

La fórmula está escrita sin `left` ni `right` dinámicos para evitar errores de MathJax con delimitadores no reconocidos.
