# Aprendizaje

## Tres formas de aprender

**Separador · Explorar · Objetivo y holguras**

Cuatro puntos etiquetados y un separador wx x+wy y+b. Se evalúa el objetivo soft-margin primal, con hinge; el laboratorio no afirma resolver todo conjunto SVM.

## Predice, prueba y justifica

1. **Predice antes de medir.** Cuatro puntos etiquetados y un separador wx x+wy y+b. Se evalúa el objetivo soft-margin primal, con hinge; el laboratorio no afirma resolver todo conjunto SVM. Calcula objetivo primal con los datos iniciales.

2. **Construye el objetivo.** Ajusta peso horizontal hasta obtener objetivo primal=0,5 .

3. **Distingue el modelo.** ¿Qué interpretación es correcta?

4. **Comprueba una nueva predicción.** Ahora peso horizontal=1 . Calcula objetivo primal y explica el cambio.

Los retos admiten pistas y reintentos. En exploración, mueve un control cada vez, anticipa el cambio y compara el resultado. Las vistas 3D admiten ratón, tacto y flechas del teclado.

## Una idea que debes poder explicar

Clasificar bien y satisfacer margen funcional al menos uno son condiciones distintas

Ancho no definido con w=0; se muestra ese caso explícitamente. Clasificar bien no implica cumplir margen uno. El laboratorio evalúa separadores y no sustituye un solver general; hard-margin requiere separabilidad y restringe holguras a cero.
