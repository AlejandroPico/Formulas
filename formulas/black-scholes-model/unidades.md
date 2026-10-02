# Unidades

Precios en u.m.; T años; r,q fracciones anuales continuas y σ fracción por raíz de año. Controles de porcentajes se convierten a fracción. d1,d2 son adimensionales. Vega de lectura es cambio de precio por un punto porcentual de volatilidad, no por una unidad completa de σ.

## Qué se convierte en el laboratorio

d1=[ln(S/K)+(r−q+σ²/2)T]/(σ√T), d2=d1−σ√T; descuentos continuos.

## Dominio y coherencia

Opciones europeas, S,K positivos, σ constante no negativa, r,q constantes y T≥0; sin costes, restricciones ni saltos. El retorno esperado físico del activo no aparece como un parámetro de valoración. El gráfico no calcula opciones americanas. En el kink del límite determinista, la delta puede ser indefinida y se informa así; no se inventa una sensibilidad suave.

Black–Scholes–Merton europeo con volatilidad, tipos y dividendo continuo constantes. Se tratan T=0 y σ=0 mediante límites correctos; no se afirma que el mercado real siga este modelo.
