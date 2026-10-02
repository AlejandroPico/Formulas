# Interpretación

Una muestra puede tener mucho ruido; no garantiza mejora. Retorno G y baseline deben usar la misma convención. El baseline no depende de la acción muestreada y se trata constante en el score. Este ejemplo no implementa una red ni una trayectoria completa.

Derivar el logaritmo de una Bernoulli parametrizada por logit θ da a−p. Multiplica ese score por retorno menos baseline: una muestra del gradiente esperado. El baseline independiente de la acción se cancela en esperanza porque la suma de derivadas de probabilidades normalizadas es cero. La gráfica compara probabilidad y la vista de crédito separa score, ventaja y producto.

Variables numéricas en unidades de referencia; los índices y probabilidades son adimensionales. Una distancia conserva la escala de las características; su cuadrado tiene escala cuadrática.
