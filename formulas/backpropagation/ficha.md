# Ficha

## Identificación

- **Nombre:** Retropropagación
- **Autores asociados:** Rumelhart, Hinton y Williams
- **Año:** 1986
- **Área:** aprendizaje automático
- **Nivel:** universidad
- **Tipo:** algoritmo de cálculo de gradientes

## Variables

- `L`: función de pérdida.
- `w`: peso entrenable.
- `y_hat`: predicción.
- `h`: activación oculta.
- `delta`: término de error propagado.
- `W`: matriz de pesos.

## Lectura del simulador

Los nodos representan entrada, capa oculta y salida. Las líneas muestran conexiones. El pulso rojo se mueve hacia atrás para representar el flujo de gradiente. La lectura calcula gradientes por regla de la cadena.

## Nota

La animación es conceptual y usa derivadas locales fijas para simplificar. En redes reales los gradientes dependen de datos, pesos, activaciones y función de pérdida.
