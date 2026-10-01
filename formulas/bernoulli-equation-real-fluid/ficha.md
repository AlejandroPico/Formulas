# Ecuación de Bernoulli general: fluido real

El balance real añade máquinas y disipación a las cargas de presión, velocidad y altura.

## Magnitudes

| Símbolo | Lectura |
| :-- | :-- |
| p | Presión manométrica del fluido en la estación indicada. |
| ρ | Densidad del fluido, positiva y constante en este balance de energía. |
| v | Velocidad media en la sección indicada. |
| g | Gravedad positiva, 9,81 m/s² en el laboratorio. |
| z | Altura de la estación desde una misma referencia. |
| H | Carga total de energía mecánica por unidad de peso, medida en metros. |
| α | Factor de corrección cinética de un perfil de velocidad no uniforme; el laboratorio fija α=1. |
| h | Altura de carga añadida, extraída o perdida según su subíndice. |
| L | Subíndice L: pérdida irreversible de carga. |
| P | Subíndice P: bomba que aporta energía al fluido. |
| T | Subíndice T: turbina que extrae energía del fluido. |
| K | Coeficiente agregado adimensional de pérdida, referido aquí a la velocidad v₂. |

## Cuándo se aplica

Flujo estacionario e incompresible entre dos estaciones, sin acumulación de energía; pérdidas no negativas. El laboratorio supone α=1, sin turbina y con K fijo.

## Evita estos errores

Sumar hL a p en Pa; dar pérdidas negativas sin una fuente de energía; confundir K con f de Darcy; cambiar la referencia de altura solo en una estación.

## Laboratorio

**Bombas · Explorar · Balance de cargas**

Añade una pérdida K·v₂²/(2g) y una bomba. Observa qué presión queda disponible aguas abajo.

Todas las alturas de carga están en metros. La bomba aporta energía y la pérdida la resta; ninguna se suma directamente a una presión en pascales.
