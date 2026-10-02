# Aprendizaje

## Predice, prueba y explica

La regresión logística añade un modelo y datos a la función sigmoide. Una probabilidad y una decisión son diferentes: el umbral decide la clase, mientras peso y sesgo determinan la probabilidad.

p(y=1|x)=σ(wx+b). Cinco observaciones ilustrativas permiten medir la pérdida logarítmica. El umbral solo cambia la decisión, no la probabilidad ni los parámetros.

## Tres formas de aprender

**Clasificador · Explorar · Pérdida y decisión**

Comprender clasificación binaria, efectos de peso y sesgo, umbrales y pérdida. Los datos del ejemplo no justifican calibración ni generalización a nuevas poblaciones; la gráfica permite estudiar el mecanismo matemático.

## Cuatro misiones

1. **Predice antes de probar.** w=1, b=0, x=0. Calcula la probabilidad de clase 1.

2. **Construye tu solución.** Haz equiprobables ambas clases para x=0.

3. **La decisión importa.** Cambiar el umbral de 50 % a 70 %…

4. **Predice antes de probar.** p=0,5 y observación y=1. Calcula la pérdida −ln(p).

Hay pistas, reintentos y comprobación. Después de cada acierto, explica por qué cambió el resultado. Los controles admiten teclado; las cámaras 3D giran con ratón, tacto o flechas. Etiquetas binarias y características definidas. Los pesos deben dar un predictor adimensional. El umbral entre 0 y 1 solo cambia la decisión; no altera la curva ni optimiza la pérdida. Probabilidad de 0,5 no es certeza de pertenencia.
