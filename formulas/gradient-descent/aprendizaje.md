# Aprendizaje

## Predice, prueba y explica

Descender por el gradiente propone un movimiento contrario a la mayor subida local. Un paso demasiado grande puede aumentar la función u oscilar, incluso en una cuadrática convexa sencilla.

Minimiza J=(ax²+by²)/2 con iteraciones exactas de gradiente. La estabilidad requiere 0<η<2/max(a,b). Un paso excesivo puede oscilar o divergir; el gráfico avisa si la trayectoria sale de su ventana.

## Tres formas de aprender

**Optimiza · Contornos · Superficie 3D**

Comprender entrenamiento iterativo, sensibilidad al paso y efecto de curvaturas distintas. El laboratorio muestra una función conocida y convexa; redes neuronales y objetivos no convexos no heredan automáticamente garantía de mínimo global.

## Cuatro misiones

1. **Predice antes de probar.** J=x²/2 y x=2. ¿Cuánto vale ∂J/∂x?

2. **Construye tu solución.** En la cuadrática circular a=b=1, llega al origen en un paso.

3. **La decisión importa.** Un paso por encima de 2/max(a,b)…

4. **Predice antes de probar.** x0=2, a=1 y η=0,25. Calcula x después de un paso.

Hay pistas, reintentos y comprobación. Después de cada acierto, explica por qué cambió el resultado. Los controles admiten teclado; las cámaras 3D giran con ratón, tacto o flechas. a,b>0, paso constante y gradiente exacto. La cota escrita es para esta cuadrática; en funciones generales exige condiciones adicionales. Los valores fuera de la ventana gráfica se conservan en el cálculo, no se recortan para fingir estabilidad.
