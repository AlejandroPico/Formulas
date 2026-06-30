# Derivación

En una red neuronal, la salida depende de activaciones intermedias, y esas activaciones dependen de pesos anteriores. Por tanto, una pérdida final depende indirectamente de todos los pesos.

Para un peso de una capa temprana, se descompone la derivada total como producto de derivadas locales. Esa es la regla de la cadena.

El error de salida se transforma en un término de error de la capa anterior multiplicando por pesos y por la derivada de la activación.

Repitiendo este proceso capa a capa se obtienen todos los gradientes necesarios para actualizar los parámetros.
