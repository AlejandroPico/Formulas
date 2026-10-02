# Derivación

Resta las medias de cada variable. Para una dirección unitaria w, la varianza proyectada es wᵀCw. Optimizar con la restricción wᵀw=1 mediante un multiplicador de Lagrange produce Cw=λw; el máximo corresponde al mayor λ. La simetría de C permite ejes ortogonales. Proyectar y reconstruir con el primer eje deja un error cuadrático total normalizado por n−1 igual a λ2+λ3. La nube tiene ocho combinaciones de signos de tres escalas y una rotación; su covarianza se calcula de los puntos, no se dibujan ejes predeterminados.

## Hipótesis necesarias

Datos numéricos, centrados y con varianza total positiva. PCA por covarianza depende de unidades y escala; estandarizar produce otro problema. Varianza alta no implica información útil, causalidad ni independencia. Ejes de un autovalor repetido no son únicos.

## Comprueba con números

Ocho puntos centrados en tres dimensiones. Gira la nube, proyecta sobre su primer eje principal y compara varianza retenida y error; la escala de variables importa. Calcula varianza retenida con los datos iniciales, en %. Varianza retenida=76,1905 %. Centra los datos y divide el autovalor mayor entre la suma de los tres.
