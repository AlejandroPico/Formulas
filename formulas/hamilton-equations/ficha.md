# Ficha

## Identificación

- **Nombre:** Ecuaciones de Hamilton
- **Autor:** William Rowan Hamilton
- **Año:** 1834
- **Área:** mecánica analítica y sistemas dinámicos
- **Nivel:** universidad
- **Tipo:** sistema de ecuaciones diferenciales de primer orden

## Variables

- `q_i`: coordenada generalizada.
- `p_i`: momento conjugado.
- `H`: hamiltoniano.
- `L`: lagrangiano.
- `m`: masa del oscilador.
- `k`: constante del muelle.

## Caso del oscilador

Para un oscilador masa-muelle, el hamiltoniano suma energía cinética y energía potencial. El resultado son dos ecuaciones: una para la posición y otra para el momento.

## Lectura del simulador

La vista izquierda muestra el sistema masa-muelle. La vista derecha muestra la trayectoria en el plano formado por posición y momento. Si el sistema es conservativo, la curva se mantiene cerrada y la energía total se conserva aproximadamente.

## Advertencia numérica

Una integración simple puede introducir una pequeña deriva de energía. Para cálculos científicos exigentes se usan integradores simplécticos.
