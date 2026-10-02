# Derivación

Independencia permite multiplicar probabilidades de las observaciones. Tomar logaritmos convierte el producto en suma sin cambiar el máximo. Para Bernoulli se agrupan k éxitos y n−k fallos. Derivar ℓ da k/p−(n−k)/(1−p); anularla produce p̂=k/n si 0<k<n. Para k=0 o n el máximo está en el borde. La curva relativa divide L por su máximo y no normaliza una posterior.

## Hipótesis necesarias

Datos Bernoulli independientes con parámetro común y n positivo. En el experimento k≤10≤n, incluyendo máximos en cero y uno. La expresión logarítmica usa límites para términos de conteo cero. Una probabilidad candidata no representa la distribución del parámetro; una inferencia bayesiana necesitaría prior y normalización.

## Comprueba con números

Ensayos Bernoulli independientes: k éxitos en n observaciones. El estimador maximiza la verosimilitud de los datos observados, sin tratar el parámetro como aleatorio. Calcula estimador p̂ con los datos iniciales. Estimador p̂=0,5 . p̂=k/n; L(p)∝p^k(1−p)^(n−k).
