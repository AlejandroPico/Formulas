# Usos

Derivar el logaritmo de una Bernoulli parametrizada por logit θ da a−p. Multiplica ese score por retorno menos baseline: una muestra del gradiente esperado. El baseline independiente de la acción se cancela en esperanza porque la suma de derivadas de probabilidades normalizadas es cero. La gráfica compara probabilidad y la vista de crédito separa score, ventaja y producto. En el laboratorio contrasta una predicción, construye el objetivo y explica qué supuesto permite el resultado.

## Del experimento al contexto

Política Bernoulli π(1)=sigmoid(θ), retorno observado G y baseline independiente de la acción. Se calcula una muestra del estimador REINFORCE.

## Condiciones antes de aplicar

Una muestra puede tener mucho ruido; no garantiza mejora. Retorno G y baseline deben usar la misma convención. El baseline no depende de la acción muestreada y se trata constante en el score. Este ejemplo no implementa una red ni una trayectoria completa.
