# Aprendizaje

## Tres formas de aprender

**Término y corpus · Explorar · Peso**

TF-IDF clásico con TF como conteo bruto e IDF=ln(N/df). Un mismo término repetido en pocos documentos recibe un peso mayor; no se aplica suavizado ni normalización de longitud.

## Predice, prueba y justifica

1. **Predice antes de medir.** TF-IDF clásico con TF como conteo bruto e IDF=ln(N/df). Un mismo término repetido en pocos documentos recibe un peso mayor; no se aplica suavizado ni normalización de longitud. Calcula peso tf-idf con los datos iniciales.

2. **Construye el objetivo.** Ajusta documentos con el término hasta obtener peso tf-idf=2,0794 .

3. **Distingue el modelo.** ¿Qué interpretación es correcta?

4. **Comprueba una nueva predicción.** Ahora documentos con el término=50 . Calcula peso tf-idf y explica el cambio.

Los retos admiten pistas y reintentos. En exploración, mueve un control cada vez, anticipa el cambio y compara el resultado. Las vistas 3D admiten ratón, tacto y flechas del teclado.

## Una idea que debes poder explicar

TF-IDF tiene variantes; deben fijarse conteo, base y suavizado

Corpus finito con N≥df≥1 y TF≥0. Para términos ausentes de todo el corpus, df=0 exige otra convención y no se divide por cero. Cambiar corpus cambia pesos. TF-IDF no es probabilidad semántica ni garantiza relevancia contextual; los buscadores pueden usar otras funciones como BM25.
