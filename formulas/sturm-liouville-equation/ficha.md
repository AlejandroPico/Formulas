# Ficha

## Identificación

- Nombre: Ecuación de Sturm-Liouville.
- Área: ecuaciones diferenciales, análisis espectral y problemas de contorno.
- Idea central: ciertos operadores diferenciales solo admiten soluciones no triviales para valores especiales de `λ`.

## Variables

- `p(x)`: coeficiente principal del operador.
- `q(x)`: potencial o término de orden cero.
- `w(x)`: peso.
- `λ`: autovalor.
- `y(x)`: autofunción.

## Lectura del simulador

El control selecciona el modo `n`. La curva representa `sin(nπx)` con extremos fijos. Al aumentar `n`, aparecen más nodos internos y el autovalor `λ_n=n²π²` crece.

## Limitaciones

El simulador muestra el caso más simple con `p=1`, `q=0`, `w=1` y condiciones de Dirichlet. Problemas generales pueden tener pesos variables, intervalos distintos y condiciones de contorno mixtas.
