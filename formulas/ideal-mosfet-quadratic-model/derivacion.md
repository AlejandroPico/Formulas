# Derivación

Una puerta por encima del umbral crea sobrevoltaje Vov=VGS−VT. Con VDS<Vov, integrar la carga del canal ideal da ID=β(VovVDS−VDS²/2). En VDS=Vov la expresión llega a βVov²/2, que se mantiene constante en la saturación ideal sin modulación. Con Vov≤0 se fija corte antes de evaluar otras ramas. Las leyes se unen continuamente en los bordes.

## Hipótesis necesarias

NMOS ideal de canal largo con VDS≥0, umbral positivo y β positiva. Se omiten efecto de cuerpo, subumbral, modulación de longitud, temperatura y velocidad saturada. Saturación del MOSFET no es el régimen de saturación de un BJT. Un modelo para tensiones negativas requiere otras condiciones y no se obtiene extrapolando estas ramas.

## Comprueba con números

NMOS ideal de canal largo, sin modulación de longitud ni efecto de cuerpo. La ley se aplica por regiones usando sobrevoltaje VGS−VT y VDS no negativo. Calcula corriente de drenador con los datos iniciales en mA. Corriente de drenador=2 mA. Corte si VGS≤VT; triodo si VDS<VGS−VT; saturación ID=β(VGS−VT)²/2.
