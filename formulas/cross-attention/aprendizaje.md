# Aprendizaje

## Tres formas de aprender

**Consulta y memoria · Explorar · Scores y pesos**

Consulta de un decodificador y tres claves y valores de una memoria externa. Mismo mecanismo de atención, con procedencias de Q y K,V distintas.

## Predice, prueba y justifica

1. **Predice antes de medir.** Consulta de un decodificador y tres claves y valores de una memoria externa. Mismo mecanismo de atención, con procedencias de Q y K,V distintas. Calcula valor mezclado de salida con los datos iniciales.

2. **Construye el objetivo.** Ajusta consulta horizontal hasta obtener valor mezclado de salida=1,3945 .

3. **Distingue el modelo.** ¿Qué interpretación es correcta?

4. **Comprueba una nueva predicción.** Ahora consulta horizontal=2 . Calcula valor mezclado de salida y explica el cambio.

Los retos admiten pistas y reintentos. En exploración, mueve un control cada vez, anticipa el cambio y compara el resultado. Las vistas 3D admiten ratón, tacto y flechas del teclado.

## Una idea que debes poder explicar

Pesos suman uno sobre claves permitidas y la salida mezcla valores

Debe quedar al menos una clave permitida por fila. Q y K comparten dk; V puede tener otra dimensión. Una máscara no se añade después de softmax. Atención no es selección dura y sus pesos no equivalen por sí solos a explicación causal de una predicción.
