# Derivación

Cada token produce una consulta, una clave y un valor. La consulta pregunta qué información busca; la clave describe cuándo un token es relevante; el valor contiene la información que se va a mezclar.

Las similitudes se calculan con productos escalares entre consultas y claves. Esos valores se dividen por `sqrt(d_k)` para controlar su escala.

Softmax transforma las similitudes escaladas en pesos positivos que suman uno.

Multiplicando esos pesos por `V`, cada token obtiene una combinación ponderada de información procedente de otros tokens.
