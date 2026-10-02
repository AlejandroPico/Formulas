# Derivación

El coste esperado de codificar una fuente p con probabilidades q es la media de −lnqi ponderada por pi. Añadir y restar −Σpi lnpi separa la incertidumbre de la fuente H(p) y el exceso KL. Para Bernoulli la derivada respecto a q se anula en q=p. Un objetivo probabilístico no necesita tener entropía cero, de modo que la pérdida mínima puede ser positiva.

## Hipótesis necesarias

Distribuciones normalizadas en el mismo soporte, con q positiva donde p es positiva. Los controles limitan q a [0,01,0,99]; p puede ser determinista. La expresión es pérdida media de distribución, no una suma sin dividir por el número de ejemplos. Aquí se usan logaritmos naturales.

## Comprueba con números

Entropía cruzada de distribuciones Bernoulli p y q con logaritmos naturales. Se distingue frecuencia objetivo p de probabilidad predicha q. Calcula entropía cruzada con los datos iniciales en nats. Entropía cruzada=0,5919 nats. H(p,q)=−p lnq−(1−p)ln(1−q)=H(p)+DKL(p||q).
