# Usos

Comprender entrenamiento iterativo, sensibilidad al paso y efecto de curvaturas distintas. El laboratorio muestra una función conocida y convexa; redes neuronales y objetivos no convexos no heredan automáticamente garantía de mínimo global.

## Antes de aplicar

a,b>0, paso constante y gradiente exacto. La cota escrita es para esta cuadrática; en funciones generales exige condiciones adicionales. Los valores fuera de la ventana gráfica se conservan en el cálculo, no se recortan para fingir estabilidad.

## Qué explora el simulador

Minimiza J=(ax²+by²)/2 con iteraciones exactas de gradiente. La estabilidad requiere 0<η<2/max(a,b). Un paso excesivo puede oscilar o divergir; el gráfico avisa si la trayectoria sale de su ventana.
