# Usos

Normalizar el margen funcional a uno da planos w·x+b=±1 separados por 2/||w||. Minimizar norma aumenta ancho; con errores permitidos, las holguras y C penalizan incumplimientos. El simulador evalúa el objetivo soft-margin en cuatro puntos simétricos; w=(0,5,0) y b=0 satisface margen uno. Las barras separan norma y penalizaciones. En el laboratorio contrasta una predicción, construye el objetivo y explica qué supuesto permite el resultado.

## Del experimento al contexto

Cuatro puntos etiquetados y un separador wx x+wy y+b. Se evalúa el objetivo soft-margin primal, con hinge; el laboratorio no afirma resolver todo conjunto SVM.

## Condiciones antes de aplicar

Ancho no definido con w=0; se muestra ese caso explícitamente. Clasificar bien no implica cumplir margen uno. El laboratorio evalúa separadores y no sustituye un solver general; hard-margin requiere separabilidad y restringe holguras a cero.
