# Significado

Descender por el gradiente propone un movimiento contrario a la mayor subida local. Un paso demasiado grande puede aumentar la función u oscilar, incluso en una cuadrática convexa sencilla.

## Del símbolo al fenómeno

Minimiza J=(ax²+by²)/2 con iteraciones exactas de gradiente. La estabilidad requiere 0<η<2/max(a,b). Un paso excesivo puede oscilar o divergir; el gráfico avisa si la trayectoria sale de su ventana.

## Un ejemplo comprobable

J=x²/2 y x=2. ¿Cuánto vale ∂J/∂x? El gradiente es x=2.
