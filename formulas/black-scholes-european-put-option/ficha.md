# Modelo Black-Scholes: valoración de opciones Put

Black–Scholes–Merton europeo con volatilidad, tipos y dividendo continuo constantes. Se tratan T=0 y σ=0 mediante límites correctos; no se afirma que el mercado real siga este modelo.

## Magnitudes y notación

| Símbolo | Interpretación |
| :-- | :-- |
| P | Precio de put europea. |
| S | Precio positivo del subyacente hoy. |
| K | Strike positivo. |
| r | Tipo de interés continuo anual en fracción. |
| q | Rendimiento de dividendo continuo anual en fracción. |
| T | Tiempo hasta vencimiento en años. |
| σ | Volatilidad anual del retorno logarítmico, en fracción por raíz de año. |
| N | Función de distribución acumulada de la normal estándar. |
| d | Argumento normal estandarizado d1 o d2, no diferencial en esas expresiones. |
| max | Selecciona el pago positivo en el vencimiento. |

## Condiciones

Opciones europeas, S,K positivos, σ constante no negativa, r,q constantes y T≥0; sin costes, restricciones ni saltos. El retorno esperado físico del activo no aparece como un parámetro de valoración. El gráfico no calcula opciones americanas. En el kink del límite determinista, la delta puede ser indefinida y se informa así; no se inventa una sensibilidad suave.

## Unidades

Precios en u.m.; T años; r,q fracciones anuales continuas y σ fracción por raíz de año. Controles de porcentajes se convierten a fracción. d1,d2 son adimensionales. Vega de lectura es cambio de precio por un punto porcentual de volatilidad, no por una unidad completa de σ.
