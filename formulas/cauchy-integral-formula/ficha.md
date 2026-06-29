# Ficha

## Identificación

- **Nombre:** Fórmula Integral de Cauchy
- **Autor:** Augustin-Louis Cauchy
- **Área:** análisis complejo
- **Nivel:** universidad
- **Tipo:** fórmula integral de reconstrucción

## Elementos

- `gamma`: contorno cerrado orientado.
- `z0`: punto de evaluación.
- `f(z)`: función holomorfa en la región considerada.
- `i`: unidad imaginaria.

## Interpretación

Si `z0` está dentro del contorno, la integral normalizada devuelve `f(z0)`. Si `z0` está fuera, no hay polo encerrado y la contribución asociada a ese punto es cero.

## Lectura del simulador

El usuario arrastra el punto `z0`. El contorno circular indica la frontera de integración. El panel inferior indica si el punto está dentro o fuera y muestra el valor que devuelve la integral normalizada.

## Consecuencia

La fórmula implica que las funciones holomorfas son extremadamente rígidas: los valores de frontera determinan los valores interiores y también las derivadas.
