# Divergencia de Jensen-Shannon

Jensen-Shannon con pesos iguales y logaritmos base dos. La mezcla m=(p+q)/2 garantiza soporte compatible; su raíz sí es una distancia.

## Magnitudes y notación

| Símbolo | Interpretación |
| :-- | :-- |
| J | Parte de JS: Jensen. |
| S | Parte de JS: Shannon. |
| p | Primera distribución normalizada. |
| q | Segunda distribución normalizada. |
| m | Mezcla media de p y q, con pesos iguales. |
| D | KL a la mezcla; índice 2 fija base de logaritmo. |
| K | Parte de KL: Kullback. |
| L | Parte de KL: Leibler. |
| d | Distancia raíz de la divergencia JS. |

## Condiciones

Dos distribuciones normalizadas del mismo espacio, pesos iguales y base dos. Cambiar pesos o número de fuentes cambia la cota y la interpretación. El ejemplo binario evita singularidades de soporte con controles interiores, pero la mezcla permite en general probabilidades cero mediante límites correctos.

## Unidades

JS se informa en bits por base dos; las KL internas con log natural se dividen por ln2. La raíz tiene escala raíz de bit en esta convención, por lo que no debe rotularse como otra cantidad de divergencia en bits. Ambos resultados son adimensionales matemáticamente.
