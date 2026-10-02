# Ecuaciones de Lotka-Volterra

Sistema ideal presa-depredador con interacción bilineal y sin capacidad de carga. Integra las ecuaciones y compara ciclos con sus nulclinas.

## Magnitudes y notación

| Símbolo | Interpretación |
| :-- | :-- |
| x | Población escalada de presas, no posición espacial. |
| y | Población escalada de depredadores. |
| a | Crecimiento per cápita de la presa en ausencia de depredador. |
| b | Coeficiente de pérdida de presa por encuentros. |
| c | Mortalidad per cápita del depredador. |
| d | Conversión de encuentros en crecimiento del depredador. |
| constante | Valor conservado del primer integral para una misma trayectoria. |

## Condiciones

Poblaciones continuas positivas, medio homogéneo, tasas constantes, sin recursos finitos, inmigración ni fluctuaciones. El primer integral solo se escribe para x,y>0. La integración RK4 usa paso 0,01 de tiempo reducido y no introduce amortiguación física. Los números son poblaciones escaladas, no una especie concreta.

## Unidades

a,c tienen tiempo⁻¹ y b,d tienen población⁻¹·tiempo⁻¹, con escalas compatibles para las dos poblaciones. El laboratorio usa unidades reducidas. Los logaritmos se entienden de poblaciones divididas por su escala de referencia; constantes añadidas no cambian el primer integral.
