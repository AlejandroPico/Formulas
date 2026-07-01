# Ficha

## Identificación

- **Nombre:** Atención escalada
- **Autores asociados:** Vaswani et al.
- **Año:** 2017
- **Área:** aprendizaje automático y transformers
- **Nivel:** universidad
- **Tipo:** mecanismo de atención

## Variables

- `Q`: matriz de consultas.
- `K`: matriz de claves.
- `V`: matriz de valores.
- `d_k`: dimensión de las claves.
- `A`: matriz de pesos de atención.

## Lectura del simulador

Las barras representan pesos de atención sobre tres tokens. El control modifica la similitud cruda del token principal. La casilla activa o desactiva el escalado por raíz de `d_k`.

## Nota

Sin escalado, softmax puede volverse excesivamente concentrado y producir gradientes pobres para tokens no dominantes.
