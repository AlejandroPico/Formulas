# Derivación

La versión continua sustituye la suma de masas por una integral de densidad, con una coordenada de referencia fijada. Para una normal, integrar el logaritmo de su densidad usa E[(X−μ)²]=σ² y produce log2(σ√(2πe)). Si Y=aX, la densidad incluye el jacobiano 1/|a|; al integrar aparece log2|a|. Por ello la magnitud depende de escala y puede ser negativa.

## Hipótesis necesarias

Densidad normal con σ positiva, y referencia de coordenada explícita. No se toma el logaritmo de una densidad dimensional sin reconocer esa referencia. La entropía diferencial no es la entropía de un registro cuantizado: fijar resolución añade información sobre discretización. Una traslación de media no cambia h.

## Comprueba con números

Entropía diferencial de una normal con desviación σ en una coordenada de referencia. Puede ser negativa y cambia bajo reescala; no equivale a bits de un símbolo discreto. Calcula entropía diferencial con los datos iniciales en bits. Entropía diferencial=2,0471 bits. h(N)=log2(σ√(2πe)); h(aX)=h(X)+log2|a|.
