# Usos

Descompón el retorno en recompensa inmediata y retorno futuro descontado. Para cada acción, suma por estados siguientes con sus probabilidades; elige la acción de mayor valor. El operador es una contracción para γ<1 en un MDP finito acotado. El laboratorio aplica barridos simultáneos y conserva historial, con la meta terminal fijada en cero y recompensa al entrar. En el laboratorio contrasta una predicción, construye el objetivo y explica qué supuesto permite el resultado.

## Del experimento al contexto

Cadena de tres estados y una meta terminal. Quedarse cuesta 0,5; intentar avanzar cuesta 1 y llegar a meta recompensa 5. Avance probabilístico y descuento γ<1.

## Condiciones antes de aplicar

Supone estados y transiciones markovianos y recompensas acotadas; γ<1 en esta versión continua de tareas. No mezcla actualización de todos los valores con aprendizaje de una muestra. El intento fallido conserva estado pero paga su coste.
