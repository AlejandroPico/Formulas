# Ficha

## Identificación

- Nombre: Fórmulas de Viète.
- Área: Álgebra.
- Nivel recomendado: Bachillerato.
- Tipo de fórmula: relación estructural entre raíces y coeficientes.

## Fórmulas principales

Para `ax^2+bx+c=0`, con `a` distinto de cero:

`x_1+x_2=-b/a`

`x_1x_2=c/a`

Para el caso mónico `x^2+bx+c=0`:

`x_1+x_2=-b`

`x_1x_2=c`.

## Variables

- `a`: coeficiente cuadrático o coeficiente principal.
- `b`: coeficiente lineal.
- `c`: término independiente.
- `x_1`, `x_2`: raíces o soluciones de la ecuación.

## Interpretación

Viète permite leer información sobre las soluciones sin resolver completamente la ecuación. La suma de las raíces depende del coeficiente lineal y el producto depende del término independiente. Esta relación nace de la factorización del polinomio en factores lineales.

## Lectura del simulador

El simulador coloca dos raíces en una recta numérica. Al moverlas, se actualizan su suma, su producto y los coeficientes que tendría el polinomio mónico asociado. La visualización ayuda a conectar raíces como puntos con coeficientes como datos algebraicos.

## Validez

Las fórmulas se aplican a polinomios cuadráticos con `a` distinto de cero. Las raíces pueden ser reales o complejas, aunque el simulador se centra en raíces reales para facilitar la interpretación visual.

## Limitaciones

Si las raíces son complejas, no pueden representarse en una recta real simple. En ese caso se necesita el plano complejo. Para grados mayores, las relaciones se generalizan, pero aparecen más combinaciones simétricas.

## Errores habituales

- Olvidar el signo negativo en `x_1+x_2=-b/a`.
- Usar `b` y `c` sin dividir entre `a` cuando la ecuación no es mónica.
- Confundir suma de raíces con producto de raíces.
- Intentar aplicar la regla a expresiones que no son polinomios cuadráticos.

## Recomendación didáctica

Conviene trabajar primero con polinomios mónicos, después pasar a cuadráticas generales y finalmente usar Viète para reconstruir polinomios desde raíces dadas.
