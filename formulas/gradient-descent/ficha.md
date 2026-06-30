# Ficha

## Identificación

- **Nombre:** Descenso del gradiente
- **Autor asociado:** Augustin-Louis Cauchy
- **Año:** 1847
- **Área:** optimización y aprendizaje automático
- **Nivel:** universidad inicial
- **Tipo:** algoritmo iterativo de minimización

## Variables

- `w`: parámetro o peso.
- `theta`: vector de parámetros.
- `eta`: tasa de aprendizaje.
- `L`, `J`: función de pérdida o coste.
- `nabla L`: gradiente de la pérdida.

## Lectura del simulador

La curva es `L(w)=w²`. El punto rojo es el peso actual. Los puntos azules muestran pasos anteriores. Si `eta` es razonable, converge al mínimo; si es excesiva, puede divergir.

## Nota

La simulación usa una función convexa muy simple. Las funciones reales de aprendizaje profundo pueden tener valles, mesetas, ruido estocástico y geometría de alta dimensión.
