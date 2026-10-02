# Significado

Política Bernoulli π(1)=sigmoid(θ), retorno observado G y baseline independiente de la acción. Se calcula una muestra del estimador REINFORCE.

## Qué conserva y qué cambia

Derivar el logaritmo de una Bernoulli parametrizada por logit θ da a−p. Multiplica ese score por retorno menos baseline: una muestra del gradiente esperado. El baseline independiente de la acción se cancela en esperanza porque la suma de derivadas de probabilidades normalizadas es cero. La gráfica compara probabilidad y la vista de crédito separa score, ventaja y producto.

## Primera predicción

Política Bernoulli π(1)=sigmoid(θ), retorno observado G y baseline independiente de la acción. Se calcula una muestra del estimador REINFORCE. Calcula gradiente muestral con los datos iniciales. Gradiente muestral=1 . ∂logπ(a)/∂θ=a−π(1); estimador=(G−b)(a−π(1)).
