# Ficha

## Identificación

- Nombre: Transformada Z.
- Área: señales discretas, sistemas digitales y control discreto.
- Fórmula central: `X(z)=Σ x[n]z^{-n}`.

## Variables

- `x[n]`: señal discreta.
- `z`: variable compleja del plano Z.
- `a`: posición del polo para el ejemplo `a^n u[n]`.
- ROC: región de convergencia.

## Lectura del simulador

El punto rojo marca el polo real `z=a`. El círculo punteado representa `|z|=1`. La zona coloreada representa la región de convergencia exterior `|z|>|a|`.

Si `a<1`, el círculo unitario queda dentro de la región de convergencia y el sistema causal es estable. Si `a>1`, el círculo unitario queda fuera y el sistema no es estable.

## Limitaciones

El simulador muestra un único polo real positivo. Sistemas reales pueden tener varios polos y ceros complejos, regiones de convergencia interiores, exteriores o anulares, y criterios adicionales según causalidad.
