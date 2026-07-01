# Ficha

## Identificación

- **Nombre:** Ecuación de Bellman
- **Autor:** Richard Bellman
- **Año:** 1957
- **Área:** aprendizaje por refuerzo y programación dinámica
- **Nivel:** universidad
- **Tipo:** ecuación recursiva de valor

## Variables

- `V(s)`: valor del estado.
- `R(s)`: recompensa inmediata.
- `gamma`: factor de descuento.
- `P(s'|s,a)`: probabilidad de transición.
- `Q(s,a)`: valor de acción.

## Lectura del simulador

La meta tiene recompensa 100. Los estados anteriores reciben ese valor descontado por `gamma`. A mayor `gamma`, más se propaga la recompensa futura.

## Nota de corrección

La fórmula está escrita sin `left` ni `right` dinámicos para evitar errores de MathJax con delimitadores no reconocidos.
