# Usos

Comparar predicciones con sus unidades, su base de logaritmo y el conjunto de datos de referencia. Los cuatro retos separan cálculo, ajuste, interpretación y comprobación; las tres vistas permiten identificar qué cambia y qué permanece.

## Del experimento al contexto

TF-IDF clásico con TF como conteo bruto e IDF=ln(N/df). Un mismo término repetido en pocos documentos recibe un peso mayor; no se aplica suavizado ni normalización de longitud.

## Condiciones antes de aplicar

Corpus finito con N≥df≥1 y TF≥0. Para términos ausentes de todo el corpus, df=0 exige otra convención y no se divide por cero. Cambiar corpus cambia pesos. TF-IDF no es probabilidad semántica ni garantiza relevancia contextual; los buscadores pueden usar otras funciones como BM25.
