# Modelo de Lotka-Volterra competitivo

Dos especies con crecimiento logístico y competencia cruzada, escaladas por sus capacidades propias. Las nulclinas muestran cuándo el equilibrio interior es físicamente admisible.

## Magnitudes y notación

| Símbolo | Interpretación |
| :-- | :-- |
| x | Población de especie 1 dividida por su capacidad K1. |
| y | Población de especie 2 dividida por su capacidad K2. |
| r | Tasa intrínseca de crecimiento de la especie indicada. |
| α | Efecto normalizado de especie 2 sobre especie 1. |
| β | Efecto normalizado de especie 1 sobre especie 2. |

## Condiciones

Dos especies y competencia no negativa, sin depredación ni mutación. αβ=1 exige analizar nulclinas paralelas o coincidentes, sin dividir por cero. Poblaciones normalizadas por capacidades diferentes; una intersección negativa es algebraica y no una población realizable. Integración RK4 de condiciones iniciales x0=0,4 e y0=0,6.

## Unidades

x,y,α,β son adimensionales después de escalar por K1,K2. r1,r2 tienen tiempo⁻¹. Los coeficientes originales de competencia cambian al normalizar las capacidades; los controles corresponden a la forma escrita, no a parámetros dimensionales mezclados.
