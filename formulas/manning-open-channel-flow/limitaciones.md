# Limitaciones

Canal de superficie libre, flujo permanente uniforme y coeficiente calibrado. No calcula remanso, salto hidráulico, entrada ni flujo transitorio. Pendiente de energía no siempre coincide con fondo fuera de flujo uniforme.

Define radio hidráulico como área dividida por perímetro de contacto con el lecho y paredes. En sección rectangular A=bd y Pw=b+2d; la superficie libre no añade perímetro mojado. La correlación empírica Manning en SI da v=Rh^(2/3)√S/n. Multiplica por A para caudal. Al aumentar profundidad cambian simultáneamente A y Rh; usar solo d como radio pierde el efecto de anchura.

b,d,Rh m; A m², Pw m, v m/s, Q m³/s. n SI s/m^(1/3); S adimensional. La constante numérica para unidades inglesas no se incorpora al modelo SI.
