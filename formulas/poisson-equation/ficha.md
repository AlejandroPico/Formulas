# Ficha

## Identificación

- **Nombre:** Ecuación de Poisson
- **Autor:** Siméon Denis Poisson
- **Año:** 1813
- **Área:** ecuaciones diferenciales parciales y teoría del potencial
- **Nivel:** universidad
- **Tipo:** ecuación elíptica de segundo orden

## Elementos

- `phi`: potencial.
- `rho`: densidad de carga o fuente.
- `epsilon0`: permitividad del vacío en electrostática.
- `nabla²`: operador laplaciano.
- `f`: término fuente general.

## Lectura del simulador

La fuente central controla la curvatura del potencial. Las líneas dibujadas representan equipotenciales. La densidad positiva y negativa se distinguen por color y dirección del campo. Si la densidad vale cero, la lectura pasa al caso de Laplace.

## Advertencia

La visualización usa una analogía radial bidimensional. Una resolución precisa de Poisson en geometrías arbitrarias requiere métodos numéricos y condiciones de frontera explícitas.
