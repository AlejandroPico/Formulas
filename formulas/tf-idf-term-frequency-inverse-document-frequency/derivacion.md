# Derivación

TF cuenta apariciones del término t en un documento d. DF cuenta cuántos documentos del corpus contienen el término al menos una vez. La razón N/DF mide rareza documental y su logaritmo da IDF. Multiplicar por TF aumenta peso por repetición local; si el término aparece en todos los documentos, IDF=0. La definición concreta aquí no usa suavizado, normalización por longitud ni TF logarítmica.

## Hipótesis necesarias

Corpus finito con N≥df≥1 y TF≥0. Para términos ausentes de todo el corpus, df=0 exige otra convención y no se divide por cero. Cambiar corpus cambia pesos. TF-IDF no es probabilidad semántica ni garantiza relevancia contextual; los buscadores pueden usar otras funciones como BM25.

## Comprueba con números

TF-IDF clásico con TF como conteo bruto e IDF=ln(N/df). Un mismo término repetido en pocos documentos recibe un peso mayor; no se aplica suavizado ni normalización de longitud. Calcula peso tf-idf con los datos iniciales. Peso TF-IDF=6,9078 . w=tf·ln(N/df); df≤N; si df=N, idf=0.
