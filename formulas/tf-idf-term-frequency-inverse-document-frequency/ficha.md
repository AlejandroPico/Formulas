# TF-IDF: Frecuencia de término e inversa de documento

TF-IDF clásico con TF como conteo bruto e IDF=ln(N/df). Un mismo término repetido en pocos documentos recibe un peso mayor; no se aplica suavizado ni normalización de longitud.

## Magnitudes y notación

| Símbolo | Interpretación |
| :-- | :-- |
| w | Peso del término t en documento d. |
| t | Índice de término en el corpus. |
| d | Índice de documento. |
| f | Parte de tf o df: frecuencia. |
| i | Parte de idf: inversa de frecuencia documental. |
| N | Cantidad total de documentos del corpus. |

## Condiciones

Corpus finito con N≥df≥1 y TF≥0. Para términos ausentes de todo el corpus, df=0 exige otra convención y no se divide por cero. Cambiar corpus cambia pesos. TF-IDF no es probabilidad semántica ni garantiza relevancia contextual; los buscadores pueden usar otras funciones como BM25.

## Unidades

TF,df,N son conteos; IDF y peso son adimensionales. Se fija logaritmo natural, que cambia escala frente a otras bases. df cuenta documentos y TF apariciones, con denominadores y papeles diferentes. No se usa una fórmula de librería cuyo suavizado quede implícito.
