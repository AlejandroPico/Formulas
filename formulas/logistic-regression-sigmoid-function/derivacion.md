# Derivación

El modelo define las log-odds ln[p/(1−p)]=w·x+b. Despeja p=e^z/(1+e^z)=σ(z). La probabilidad de una etiqueta Bernoulli es p^y(1−p)^(1−y); su logaritmo negativo da ℓ. El laboratorio calcula la media sobre cinco observaciones ilustrativas con una expresión estable log(1+e^z)−yz, sin entrenar parámetros automáticamente.

## Comprueba el resultado

w=1, b=0, x=0. Calcula la probabilidad de clase 1. z=0, por tanto σ(z)=0,5.

## Condiciones necesarias

Etiquetas binarias y características definidas. Los pesos deben dar un predictor adimensional. El umbral entre 0 y 1 solo cambia la decisión; no altera la curva ni optimiza la pérdida. Probabilidad de 0,5 no es certeza de pertenencia.
