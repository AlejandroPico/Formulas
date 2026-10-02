# Derivación

Ambos criterios combinan ajuste resumido por −2lnL̂ con una penalización por k parámetros estimados. AIC usa 2k y BIC klnn, de modo que sus costes de complejidad difieren con tamaño muestral. La L debe evaluarse en el máximo de cada modelo. Mantener fija log-verosimilitud mientras aumenta k permite aislar la penalización, aunque en un ajuste real ambos pueden cambiar conjuntamente.

## Hipótesis necesarias

Comparación de modelos sobre mismos datos y variable respuesta, con convenciones completas y compatibles de verosimilitud. Se cumplen los supuestos de sus aproximaciones; AICc y situaciones singulares requieren otro tratamiento. No comparar valores de distintos datos como si fueran una puntuación universal, ni interpretar menor criterio como prueba de verdad.

## Comprueba con números

Criterios calculados sobre log-verosimilitud máxima, cantidad de parámetros y tamaño muestral. Comparar modelos exige los mismos datos, respuesta y convenciones de verosimilitud. Calcula bic con los datos iniciales. BIC=53,8155 . AIC=2k−2ln L̂; BIC=k lnn−2ln L̂.
