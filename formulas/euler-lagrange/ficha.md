# Ficha

## Identificación

- **Nombre:** Ecuación de Euler-Lagrange
- **Autoría histórica:** Euler y Lagrange
- **Área:** mecánica analítica, cálculo de variaciones
- **Nivel:** universidad
- **Tipo:** ecuación variacional de movimiento

## Variables

- `L`: lagrangiano del sistema.
- `q`: coordenada generalizada.
- `qdot`: velocidad generalizada.
- `t`: tiempo.
- `S`: acción.
- `T`: energía cinética.
- `V`: energía potencial.

## Forma habitual

`d/dt(∂L/∂qdot)-∂L/∂q=0`

Si `L=T-V`, la ecuación produce la dinámica del sistema. Para un péndulo simple se obtiene una ecuación angular no lineal: `theta''+(g/l)sin(theta)=0`.

## Lectura del simulador

El simulador representa un péndulo y permite modificar longitud, gravedad y amortiguamiento. Se muestra cómo una misma estructura lagrangiana genera una ecuación de movimiento concreta. También se visualiza la energía cinética, potencial y total para entender el papel de `L=T-V`.

## Advertencias

La ecuación no es un algoritmo numérico por sí sola. Primero se formula el lagrangiano correcto, después se calculan las derivadas y finalmente se obtiene una ecuación diferencial que puede requerir integración numérica.
