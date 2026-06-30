# Derivación

La sorpresa de observar un evento al que el modelo asigna probabilidad `q` se mide como `-log(q)`.

Si la distribución real asigna probabilidades `p_i` a varias clases, la sorpresa media bajo las probabilidades predichas `q_i` es la suma ponderada `-sum p_i log q_i`.

En clasificación one-hot, solo la clase verdadera tiene peso uno. Por eso la pérdida queda `-log` de la probabilidad asignada a esa clase.

El mínimo se alcanza cuando la distribución predicha coincide con la distribución objetivo.
