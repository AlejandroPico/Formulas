# Ficha

## Identificación

- **Nombre:** Entropía de Boltzmann
- **Autor:** Ludwig Boltzmann
- **Año:** 1877
- **Área:** mecánica estadística
- **Nivel:** universidad inicial
- **Tipo:** relación entre entropía y microestados

## Variables

- `S`: entropía.
- `k_B`: constante de Boltzmann.
- `W`: número de microestados compatibles.
- `N`: número de partículas.
- `N_L`, `N_R`: partículas a izquierda y derecha.

## Lectura del simulador

El gas comienza ordenado en un lado. Al abrir la compuerta, se exploran configuraciones con más microestados compatibles. La lectura muestra izquierda/derecha, `ln W` y la entropía visual.

## Nota

El cálculo usa una caja simplificada de dos regiones y toma `k_B = 1` para lectura visual.
