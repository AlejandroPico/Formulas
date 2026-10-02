# Limitaciones

Corpus finito con N≥df≥1 y TF≥0. Para términos ausentes de todo el corpus, df=0 exige otra convención y no se divide por cero. Cambiar corpus cambia pesos. TF-IDF no es probabilidad semántica ni garantiza relevancia contextual; los buscadores pueden usar otras funciones como BM25.

TF cuenta apariciones del término t en un documento d. DF cuenta cuántos documentos del corpus contienen el término al menos una vez. La razón N/DF mide rareza documental y su logaritmo da IDF. Multiplicar por TF aumenta peso por repetición local; si el término aparece en todos los documentos, IDF=0. La definición concreta aquí no usa suavizado, normalización por longitud ni TF logarítmica.

TF,df,N son conteos; IDF y peso son adimensionales. Se fija logaritmo natural, que cambia escala frente a otras bases. df cuenta documentos y TF apariciones, con denominadores y papeles diferentes. No se usa una fórmula de librería cuyo suavizado quede implícito.
