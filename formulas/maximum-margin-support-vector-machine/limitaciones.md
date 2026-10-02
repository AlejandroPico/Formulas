# Limitaciones

Ancho no definido con w=0; se muestra ese caso explícitamente. Clasificar bien no implica cumplir margen uno. El laboratorio evalúa separadores y no sustituye un solver general; hard-margin requiere separabilidad y restringe holguras a cero.

Normalizar el margen funcional a uno da planos w·x+b=±1 separados por 2/||w||. Minimizar norma aumenta ancho; con errores permitidos, las holguras y C penalizan incumplimientos. El simulador evalúa el objetivo soft-margin en cuatro puntos simétricos; w=(0,5,0) y b=0 satisface margen uno. Las barras separan norma y penalizaciones.

Variables numéricas en unidades de referencia; los índices y probabilidades son adimensionales. Una distancia conserva la escala de las características; su cuadrado tiene escala cuadrática.
