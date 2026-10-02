# Función GELU: Gaussian Error Linear Unit

GELU exacta se define como xΦ(x) con Φ normal estándar. El cálculo numérico de Φ usa una aproximación de precisión cercana a 10⁻⁷, sin usar la variante tanh.

## Magnitudes y notación

| Símbolo | Interpretación |
| :-- | :-- |
| GELU | Activación gaussiana xΦ(x). |
| x | Entrada escalar real. |
| Φ | Función de distribución normal estándar. |
| t | Variable muda de integración. |
| d | Diferencial de la variable integrada. |
| ∫ | Integral desde menos infinito hasta x. |
| ∞ | Infinito: límite inferior no finito. |
| ′ | Derivada respecto de x. |

## Condiciones

Definición xΦ(x), diferente de la aproximación tanh y de ReLU. La salida puede ser negativa y no está restringida entre cero y uno. El valor y la derivada mostrados son evaluaciones numéricas; la derivada usa la expresión de la función ideal.

## Unidades

Las coordenadas y parámetros usan escala numérica de referencia. Probabilidades, razones, fases en radianes y pesos de atención son adimensionales. Las dimensiones de matrices deben permitir todos los productos; el laboratorio declara cada vector reducido.
