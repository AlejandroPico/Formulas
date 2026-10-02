# Limitaciones

Etiquetas binarias y características definidas. Los pesos deben dar un predictor adimensional. El umbral entre 0 y 1 solo cambia la decisión; no altera la curva ni optimiza la pérdida. Probabilidad de 0,5 no es certeza de pertenencia.

Comprender clasificación binaria, efectos de peso y sesgo, umbrales y pérdida. Los datos del ejemplo no justifican calibración ni generalización a nuevas poblaciones; la gráfica permite estudiar el mecanismo matemático.

El modelo define las log-odds ln[p/(1−p)]=w·x+b. Despeja p=e^z/(1+e^z)=σ(z). La probabilidad de una etiqueta Bernoulli es p^y(1−p)^(1−y); su logaritmo negativo da ℓ. El laboratorio calcula la media sobre cinco observaciones ilustrativas con una expresión estable log(1+e^z)−yz, sin entrenar parámetros automáticamente.

p,σ,ℓ y z adimensionales. Si una característica tiene unidad física, el peso correspondiente tiene su inversa. Umbral del control en porcentaje se divide entre 100. Logaritmos naturales para la pérdida, no logaritmos de base diez.
