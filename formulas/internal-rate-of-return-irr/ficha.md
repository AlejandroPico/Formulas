# Tasa Interna de Retorno: TIR / IRR

Proyecto hipotético con inversión inicial y cobros anuales iguales. VAN usa tasa anual efectiva; TIR es una raíz de VAN, no un rendimiento garantizado.

## Magnitudes y notación

| Símbolo | Interpretación |
| :-- | :-- |
| VAN | Valor actual neto de todos los flujos, incluida inversión inicial. |
| C | Parte de CF: flujo de caja firmado. |
| F | Parte de CF: flujo de caja de la fecha indicada. |
| t | Fecha en períodos anuales desde inversión inicial. |
| T | Número total de períodos del proyecto. |
| r | Tasa efectiva anual de descuento, en fracción. |
| o | Indica alternativa: el mismo flujo admite las dos tasas. |
| ⇒ | Implica: resolver la cuadrática da ambas raíces. |
| 0.1 | Tasa efectiva 0,1: 10% en el ejemplo con dos raíces. |
| 0.2 | Tasa efectiva 0,2: 20% en el ejemplo con dos raíces. |

## Condiciones

No toda secuencia admite una TIR ni tiene raíz única. La bisección de controles se aplica al flujo convencional indicado y no se reutiliza como detector general de todas las raíces. Una TIR aislada no resuelve comparación de proyectos de distintas escalas, plazos o supuestos de reinversión. El ejemplo de raíces múltiples tiene otro flujo de caja.

## Unidades

TIR se informa como porcentaje anual efectivo; internamente r es fracción y período anual. VAN residual está en u.m. Los pagos negativos futuros pueden alterar monotonicidad. El dominio excluye r=−1 porque los denominadores se anulan.
