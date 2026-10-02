# Limitaciones

NMOS ideal de canal largo con VDS≥0, umbral positivo y β positiva. Se omiten efecto de cuerpo, subumbral, modulación de longitud, temperatura y velocidad saturada. Saturación del MOSFET no es el régimen de saturación de un BJT. Un modelo para tensiones negativas requiere otras condiciones y no se obtiene extrapolando estas ramas.

Una puerta por encima del umbral crea sobrevoltaje Vov=VGS−VT. Con VDS<Vov, integrar la carga del canal ideal da ID=β(VovVDS−VDS²/2). En VDS=Vov la expresión llega a βVov²/2, que se mantiene constante en la saturación ideal sin modulación. Con Vov≤0 se fija corte antes de evaluar otras ramas. Las leyes se unen continuamente en los bordes.

Voltajes en V e ID en mA. β se expresa mA/V²; representa μnCoxW/L. VT es umbral de puerta, no voltaje térmico del diodo. Movilidad, capacitancia por área y razón geométrica deben usar unidades compatibles si se calcula β desde propiedades físicas.
