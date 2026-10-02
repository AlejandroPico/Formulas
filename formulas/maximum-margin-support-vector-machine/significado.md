# Significado

Cuatro puntos etiquetados y un separador wx x+wy y+b. Se evalúa el objetivo soft-margin primal, con hinge; el laboratorio no afirma resolver todo conjunto SVM.

## Qué conserva y qué cambia

Normalizar el margen funcional a uno da planos w·x+b=±1 separados por 2/||w||. Minimizar norma aumenta ancho; con errores permitidos, las holguras y C penalizan incumplimientos. El simulador evalúa el objetivo soft-margin en cuatro puntos simétricos; w=(0,5,0) y b=0 satisface margen uno. Las barras separan norma y penalizaciones.

## Primera predicción

Cuatro puntos etiquetados y un separador wx x+wy y+b. Se evalúa el objetivo soft-margin primal, con hinge; el laboratorio no afirma resolver todo conjunto SVM. Calcula objetivo primal con los datos iniciales. Objetivo primal=0,125 . J=||w||²/2+CΣmax(0,1−yi(w·xi+b)); ancho entre márgenes 2/||w||.
