# PageRank: autoridad de redes

Cuatro páginas con enlaces dirigidos; la página sin enlaces reparte uniformemente. Teleportación uniforme y d<1 producen un paseo aleatorio bien definido.

## Magnitudes y notación

| Símbolo | Interpretación |
| :-- | :-- |
| r | Vector normalizado de autoridad. |
| d | Probabilidad de seguir enlaces, menor que uno. |
| P | Matriz de transición por columnas. |
| N | Número de páginas. |
| i | Índice de página. |

## Condiciones

Se usa matriz columna-estocástica: r es columna. No confundir r con retorno de finanzas ni invertir dirección de enlaces. La importancia es relativa a esta red y este paseo, no una valoración objetiva de calidad o veracidad.

## Unidades

Variables numéricas en unidades de referencia; los índices y probabilidades son adimensionales. Una distancia conserva la escala de las características; su cuadrado tiene escala cuadrática.
