# Usos

- Reconstruir un polinomio que pasa por datos conocidos.
- Estimar valores intermedios en una tabla.
- Introducir interpolación antes de métodos numéricos más avanzados.
- Entender la diferencia entre interpolación exacta y ajuste aproximado.
- Construir ejemplos en análisis numérico y computación científica.

## Uso didáctico

La fórmula muestra que cada dato aporta una función base. Cada base se enciende en su nodo y se apaga en los demás. Esta imagen ayuda a comprender por qué el polinomio final respeta todos los puntos.

## Limitaciones

Con muchos nodos o nodos mal distribuidos pueden aparecer oscilaciones fuertes. En la práctica se usan también splines, interpolación por tramos o formas más estables como la baricéntrica.

## Uso del simulador

El simulador usa tres puntos para generar una parábola. Al mover las alturas, se observa cómo la curva se adapta sin dejar de pasar exactamente por los nodos.
