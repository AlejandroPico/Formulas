# Transistor MOSFET ideal: modelo cuadrático

NMOS ideal de canal largo, sin modulación de longitud ni efecto de cuerpo. La ley se aplica por regiones usando sobrevoltaje VGS−VT y VDS no negativo.

## Magnitudes y notación

| Símbolo | Interpretación |
| :-- | :-- |
| I | Corriente de drenador, positiva para el NMOS del experimento. |
| D | Índice D: drenador. |
| V | Voltaje entre terminales indicadas. |
| G | Índice G: puerta. |
| S | Índice S: fuente. |
| T | Índice T: voltaje umbral, distinto del voltaje térmico del diodo. |
| β | Parámetro de conducción μnCoxW/L. |
| μ | Movilidad electrónica. |
| n | Índice n: portadores electrónicos. |
| C | Capacitancia por área del óxido. |
| o | Parte de ox: óxido. |
| x | Parte de ox: óxido. |
| W | Anchura efectiva de canal. |
| L | Longitud efectiva de canal. |
| [ | Agrupa contribuciones de la ley de triodo. |
| ] | Cierra la ley de triodo. |
| ⎧⎩⎨⎪⎪ | Llave de función por tramos: elige corte, triodo o saturación según las condiciones escritas. |

## Condiciones

NMOS ideal de canal largo con VDS≥0, umbral positivo y β positiva. Se omiten efecto de cuerpo, subumbral, modulación de longitud, temperatura y velocidad saturada. Saturación del MOSFET no es el régimen de saturación de un BJT. Un modelo para tensiones negativas requiere otras condiciones y no se obtiene extrapolando estas ramas.

## Unidades

Voltajes en V e ID en mA. β se expresa mA/V²; representa μnCoxW/L. VT es umbral de puerta, no voltaje térmico del diodo. Movilidad, capacitancia por área y razón geométrica deben usar unidades compatibles si se calcula β desde propiedades físicas.
