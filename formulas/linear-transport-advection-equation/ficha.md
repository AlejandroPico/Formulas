# Ecuación de transporte lineal: advección pura

La advección pura mueve un perfil sin cambiar su forma. Un método numérico puede conservar masa y aun así deformarlo: esas son propiedades distintas.

## Magnitudes

| Símbolo | Significado |
| :-- | :-- |
| φ | Perfil transportado sin difusión en la ecuación exacta. |
| c | Velocidad de transporte constante, positiva o negativa. |
| x | Posición espacial. |
| t | Tiempo de evolución. |
| j | Índice de celda de la malla. |
| n | Índice de paso temporal, no potencia. |
| λ | Número de Courant con signo; el esquema escrito es para c≥0. |

## Alcance

c constante, dominio periódico de longitud 10 m. Upwind se actualiza según el signo de c y CFL entre 0,1 y 1; no se presenta su ensanchamiento como difusión física.

## Unidades

c m/s, x m, t s y Δx m. CFL es adimensional. Si φ es densidad lineal, la suma de φ_jΔx representa masa. El módulo de posición conserva la longitud periódica: salir por el borde derecho implica volver por el izquierdo.
