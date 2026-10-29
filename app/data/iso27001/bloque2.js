/* ISO/IEC 27001:2022 — Bloque 2 · Cláusula 6 (Planificación): riesgos con MAGERIT, SoA, plan de tratamiento y objetivos.
   Fuentes: Sesión 3 del curso (SoA · PTR · KPIs), MAGERIT v3 Libros I y II, MAGERIT Lab del profesor,
   UC del curso y el texto de la norma. Mismo formato que content.js. */
(function () {
const T = ATLAS.track('iso27001');

Object.assign(T.docs, {
  s3:    {s: 'Sesión 3', t: 'Sesión 3 · SoA, PTR, medidas ENS y KPIs'},
  mag:   {s: 'MAGERIT I', t: 'MAGERIT v3 · Libro I (método)'},
  mag2:  {s: 'MAGERIT II', t: 'MAGERIT v3 · Libro II (catálogo de elementos)'},
  maglab:{s: 'MAGERIT Lab', t: 'MAGERIT Lab del profesor (laboratorio interactivo)'},
  ucrev: {s: 'UC Revisar', t: 'UC · Analizar y revisar la ISO 27001'}
});

const m2 = T.modules.find(m => m.id === 'm2');
Object.assign(m2, {soon: false, s: 'Riesgos con MAGERIT, Declaración de Aplicabilidad, plan de tratamiento y objetivos', units: ['u9', 'u10', 'u11', 'u12']});


const U = (u) => { T.units[u.id] = u; };

/* ═════════════ Unidad 9 · 6.1.1 y criterios de 6.1.2 ═════════════ */
U({id: 'u9', n: 9, t: 'Pensar en riesgos', icon: 'scale', mins: 10, clauses: ['6.1.1', '6.1.2'],
 s: 'Cláusula 6.1.1 y los criterios de 6.1.2: por qué todo el SGSI gira alrededor del riesgo.',
 lesson: [
  {k: 'Cláusula 6', t: 'El corazón del SGSI es el riesgo', body: [
    'La ISO 27001 no te da una lista de cosas que hacer: te pide que **decidas qué proteger según tus riesgos**. Por eso la cláusula 6 es la más importante para el examen.',
    {ul: [['6.1.1', 'Riesgos y oportunidades en general.'], ['6.1.2', 'Cómo <b>evaluar</b> los riesgos de seguridad.'], ['6.1.3', 'Cómo <b>tratarlos</b>: controles, SoA y plan de tratamiento.'], ['6.2', 'Objetivos medibles.'], ['6.3', 'Planificar los cambios.']]}],
   plain: 'Sin análisis de riesgos, los controles serían una lista de la compra al azar. Con él, cada control tiene un «porqué».',
   refs: [['une', 9], ['ucrev', 10]]},
  {k: '6.1.1', t: 'Riesgos… y oportunidades', body: [
    'Al planificar el SGSI, la organización tiene en cuenta el **contexto (4.1)** y las **partes interesadas (4.2)** y determina los riesgos y oportunidades que hay que tratar para:',
    {ul: [['a', 'Que el SGSI consiga sus resultados.'], ['b', 'Prevenir o reducir efectos no deseados.'], ['c', 'Lograr la mejora continua.']]},
    'Y planifica las acciones, cómo integrarlas en sus procesos y **cómo evaluará si funcionan**.'],
   plain: 'Una oportunidad también cuenta: por ejemplo, que certificarse en ISO 27001 te ayude a ganar contratos privados.',
   case: 'Para Albatrel, una oportunidad clara: aprovechar el ENS para certificarse también en ISO 27001 y ganar más clínicas privadas.',
   refs: [['une', 9]]},
  {check: true, k: 'tf', q: 'La cláusula 6.1.1 solo habla de riesgos, nunca de oportunidades.', a: false, why: 'Habla de «riesgos y oportunidades».', ref: ['une', 9]},
  {k: '6.1.2 a-b', t: 'Primero, las reglas del juego', body: [
    'Antes de evaluar nada, la organización define un proceso con **criterios**:',
    {ul: [['1', '<b>Criterios de aceptación del riesgo</b>: a partir de qué nivel un riesgo se puede asumir.'], ['2', '<b>Criterios para hacer las evaluaciones</b>: escalas de impacto y probabilidad.']]},
    'Y el proceso debe dar resultados **consistentes, válidos y comparables** cada vez que se repite.'],
   plain: 'Es como fijar el reglamento antes del partido: si cambias las reglas cada vez, los resultados no se pueden comparar.',
   exam: 'Pregunta típica: si no hay criterios de aceptación de riesgos, el apartado incumplido es 6.1.2.',
   refs: [['une', 9]]},
  {k: 'Escalas', t: 'Las escalas del curso: de MB a MA', body: [
    'El laboratorio MAGERIT del profesor usa cinco niveles cualitativos para impacto y probabilidad:',
    '**MB** muy bajo · **B** bajo · **M** medio · **A** alto · **MA** muy alto',
    {dia: 'riskmatrix'}],
   plain: 'Cruzando impacto y probabilidad sale el nivel de riesgo: abajo a la izquierda, tranquilo; arriba a la derecha, alarma.',
   refs: [['maglab', 0], ['mag', 22]]},
  {k: 'Aceptar', t: 'Aceptar un riesgo es legítimo', body: [
    'MAGERIT lo dice claro: **la seguridad absoluta no existe**. Siempre queda algún riesgo que hay que aceptar, pero debe ser **conocido** y estar por debajo del umbral que fija la organización.',
    'Esa decisión no es técnica: la toma la **dirección** (en Albatrel, la Gerencia aprobará los criterios de aceptación).'],
   refs: [['mag', 10]]},
  {check: true, k: 'choice', q: 'Albatrel evalúa riesgos, pero nadie ha decidido a partir de qué nivel un riesgo se puede asumir. ¿Qué apartado incumple?', opts: ['6.1.2', '7.5', '9.2', '10.1'], a: 0, why: '6.1.2 a) exige establecer criterios de aceptación del riesgo.', ref: ['une', 9]}
 ],
 labs: [
  {id: 'u9l1', t: 'Riesgos y oportunidades', items: [
    {k: 'order', q: 'Ordena lo que hace 6.1.1.', items: ['Considerar el contexto (4.1) y las partes interesadas (4.2)', 'Determinar riesgos y oportunidades', 'Planificar las acciones', 'Evaluar la eficacia de las acciones'], ref: ['une', 9]},
    {k: 'classify', q: '¿Riesgo u oportunidad para Albatrel?', buckets: [{t: 'Riesgo', c: '#ff3b30'}, {t: 'Oportunidad', c: '#34c759'}], items: [['Ransomware en la sede electrónica', 0], ['Fuga de historias clínicas', 0], ['Fallo del hosting en la nube', 0], ['Ganar contratos privados con la ISO 27001', 1], ['Reutilizar la política para ENS e ISO a la vez', 1]], ref: ['une', 9]},
    {k: 'choice', q: 'El enfoque basado en riesgos de la ISO 27001 sirve sobre todo para…', opts: ['Prevenir o reducir los efectos de futuros incidentes de seguridad', 'Elegir proveedores más baratos', 'No tener que documentar'], a: 0, why: '6.1.1 b): prevenir o reducir efectos no deseados.', ref: ['une', 9]}
  ]},
  {id: 'u9l2', t: 'Criterios', items: [
    {k: 'match', q: 'Une cada pieza con lo que es.', pairs: [['Criterio de aceptación', 'Nivel a partir del cual un riesgo se puede asumir'], ['Criterio de evaluación', 'Escalas de impacto y probabilidad'], ['Resultados comparables', 'Repetir la evaluación da resultados coherentes']], ref: ['une', 9]},
    {k: 'tf', q: 'Según MAGERIT, si haces bien el análisis puedes llegar a riesgo cero.', a: false, why: 'La seguridad absoluta no existe: siempre se acepta algún riesgo conocido.', ref: ['mag', 10]},
    {k: 'choice', q: '¿Quién debe aprobar los criterios de aceptación del riesgo?', opts: ['La dirección', 'Un administrador de sistemas', 'El proveedor de nube'], a: 0, ref: ['mag', 10]},
    {k: 'choice', q: 'Albatrel no tiene definido cómo identifica y valora los riesgos de perder confidencialidad, integridad y disponibilidad. ¿Qué apartado incumple?', opts: ['6.1.2', '6.2', '7.4', '8.1'], a: 0, why: '6.1.2 exige definir y aplicar un proceso de evaluación de riesgos.', ref: ['une', 9]}
  ]}
 ],
 boss: [
  {k: 'choice', q: '¿Qué apartado trata la evaluación de los riesgos?', opts: ['6.1.2', '6.1.3', '6.2'], a: 0, ref: ['une', 9]},
  {k: 'tf', q: 'Al planificar el SGSI se tienen en cuenta 4.1 y 4.2.', a: true, ref: ['une', 9]},
  {k: 'choice', q: 'Los criterios que exige 6.1.2 a) son…', opts: ['De aceptación y para hacer las evaluaciones', 'De contratación y de compras', 'Solo económicos'], a: 0, ref: ['une', 9]},
  {k: 'tf', q: 'Las evaluaciones sucesivas deben dar resultados consistentes, válidos y comparables.', a: true, ref: ['une', 9]},
  {k: 'choice', q: 'En la escala del curso, «MA» significa…', opts: ['Muy alto', 'Medio-alto', 'Mínimo aceptable'], a: 0, ref: ['maglab', 0]},
  {k: 'tf', q: 'Aceptar un riesgo es una decisión de la dirección, no solo técnica.', a: true, ref: ['mag', 10]},
  {k: 'choice', q: 'Una oportunidad en 6.1.1 sería…', opts: ['Usar la certificación para ganar clientes', 'Un ataque de phishing', 'Un corte de luz'], a: 0, ref: ['une', 9]}
 ]
});

/* ═════════════ Unidad 10 · Evaluar con MAGERIT ═════════════ */
U({id: 'u10', n: 10, t: 'Evaluar riesgos con MAGERIT', icon: 'scan-search', mins: 13, clauses: ['6.1.2'],
 s: 'El método del curso paso a paso: activos, amenazas, impacto, probabilidad, salvaguardas y riesgo residual.',
 lesson: [
  {k: 'Método', t: 'MAGERIT: el método de la Administración española', body: [
    'La norma no impone un método. El curso usa **MAGERIT v3**, la metodología del Gobierno de España, con **PILAR** del CCN como herramienta real (y el laboratorio del profesor para aprender).',
    {dia: 'flow', items: ['1 Criterios', '2 Activos', '3 Amenazas', '4 R. inherente', '5 Salvaguardas', '6 R. residual', '7 Tratamiento']}],
   plain: 'Siete pasos: decides las escalas, haces la lista de lo que vale, piensas qué le puede pasar, calculas el riesgo, miras qué protecciones tienes y decides qué hacer.',
   refs: [['maglab', 0], ['mag', 22]]},
  {k: 'Paso 2', t: 'Activos: lo esencial y de lo que depende', body: [
    'En un sistema hay dos cosas **esenciales**: la **información** que maneja y los **servicios** que presta.',
    'De ellas dependen otros activos: datos, aplicaciones, equipos, soportes, equipamiento auxiliar, redes, instalaciones y **personas**.',
    'Los activos forman un **árbol de dependencias**: si cae un servidor (abajo), sufre el servicio que depende de él (arriba).'],
   case: 'En Albatrel. Esencial: los datos del padrón y el servicio de sede electrónica. Dependen de: la aplicación de padrón, el servidor, la red, la sala técnica de Zaragoza y el equipo de sistemas.',
   refs: [['mag', 22], ['mag', 23], ['mag2', 6]]},
  {check: true, k: 'classify', q: '¿Activo esencial o activo del que depende?', buckets: [{t: 'Esencial', c: '#5e5ce6'}, {t: 'Del que depende', c: '#8e8e93'}], items: [['Datos del padrón', 0], ['Servicio de sede electrónica', 0], ['Servidor de base de datos', 1], ['Equipo de operaciones TI', 1]], ref: ['mag', 22]},
  {k: 'Paso 3', t: 'Amenazas: cuatro orígenes', body: [
    {ul: [['N', '<b>Desastres naturales</b>: inundación, terremoto, incendio natural.'], ['I', '<b>De origen industrial</b>: corte eléctrico, avería de climatización, contaminación.'], ['E', '<b>Errores y fallos no intencionados</b>: un borrado por error, una mala configuración.'], ['A', '<b>Ataques intencionados</b>: ransomware, phishing, robo de credenciales.']]},
    'Para cada amenaza se estima la **degradación** (qué parte del valor se pierde, en cada dimensión) y la **probabilidad**.'],
   exam: 'Recuerda las letras del catálogo: [N] naturales, [I] industriales, [E] errores, [A] ataques.',
   refs: [['mag2', 25], ['mag2', 27], ['mag2', 33], ['mag2', 40], ['mag', 27]]},
  {k: 'Paso 4', t: 'Impacto y riesgo', body: [
    {ul: [['Im', '<b>Impacto</b> = el daño sobre el activo si la amenaza ocurre (valor del activo × degradación).'], ['R', '<b>Riesgo</b> = el impacto ponderado por la probabilidad de que ocurra.']]},
    'Primero se calcula el **riesgo potencial o inherente**: el teórico, **como si no hubiera ninguna salvaguarda**.'],
   plain: 'Riesgo inherente: «si no tuviéramos ninguna protección, ¿cómo de mal estaríamos?».',
   refs: [['mag', 22], ['maglab', 0]]},
  {k: 'Paso 5', t: 'Salvaguardas y su madurez', body: [
    'Luego se miran las **salvaguardas** (los controles) que ya existen y lo maduras que son. El laboratorio del profe usa esta escala:',
    {ul: [['L0', 'Inexistente · eficacia 0 %'], ['L1', 'Inicial / ad hoc · 10 %'], ['L2', 'Reproducible pero intuitivo · 30 %'], ['L3', 'Proceso definido · 50 %'], ['L4', 'Gestionado y medible · 70 %'], ['L5', 'Optimizado · 100 %']]}],
   plain: 'Tener MFA «en algunos usuarios, cuando se acuerdan» no es lo mismo que tenerlo en todos y medido: la madurez cuenta.',
   refs: [['maglab', 0], ['mag', 31]]},
  {k: 'Paso 6', t: 'Riesgo residual', body: [
    'Aplicando las salvaguardas sale el **riesgo residual**: el que queda de verdad.',
    'Ese riesgo residual se compara con los **criterios de aceptación**: si está por debajo, se acepta; si está por encima, hay que tratarlo (unidad siguiente).'],
   cls: 'Sesión 3: el riesgo R-03 «acceso no autorizado a la base de datos de nóminas» parte de probabilidad ALTA e impacto MUY ALTO. Con identidades, autenticación y MFA baja de ALTO a BAJO, y se acepta.',
   refs: [['s3', 5], ['mag', 35]]},
  {check: true, k: 'order', q: 'Ordena los pasos de MAGERIT.', items: ['Activos', 'Amenazas', 'Riesgo inherente', 'Salvaguardas', 'Riesgo residual'], ref: ['maglab', 0]},
  {k: '6.1.2 c-e', t: 'Lo que pide la norma', body: [
    {ul: [['c', '<b>Identificar</b> los riesgos de pérdida de confidencialidad, integridad y disponibilidad, y sus <b>dueños</b>.'], ['d', '<b>Analizar</b>: consecuencias, probabilidad realista y nivel de riesgo.'], ['e', '<b>Evaluar</b>: comparar con los criterios y <b>priorizar</b>.']]},
    'Y conservar **información documentada** del proceso.'],
   exam: 'Identificar → analizar → evaluar. El «dueño del riesgo» es una persona con autoridad para gestionarlo.',
   refs: [['une', 9], ['une', 10]]}
 ],
 labs: [
  {id: 'u10l1', t: 'Activos y amenazas', items: [
    {k: 'classify', q: 'Clasifica cada amenaza por su origen.', buckets: [{t: '[N] Natural', c: '#30b0c7'}, {t: '[I] Industrial', c: '#ff9f0a'}, {t: '[E] Error', c: '#8e8e93'}, {t: '[A] Ataque', c: '#ff3b30'}], items: [['Inundación del CPD', 0], ['Corte de suministro eléctrico', 1], ['Avería de la climatización', 1], ['Borrado accidental de una tabla', 2], ['Configuración errónea del cortafuegos', 2], ['Ransomware', 3], ['Phishing a un administrador', 3]], ref: ['mag2', 25]},
    {k: 'choice', q: 'Según MAGERIT, los dos activos esenciales de un sistema son…', opts: ['La información y los servicios', 'El hardware y el software', 'Las personas y las instalaciones'], a: 0, ref: ['mag', 22]},
    {k: 'tf', q: 'Si falla un activo inferior (como un servidor), el daño se propaga hacia los superiores que dependen de él.', a: true, ref: ['mag', 23]}
  ]},
  {id: 'u10l2', t: 'Del inherente al residual', items: [
    {k: 'match', q: 'Une cada concepto con su definición.', pairs: [['Impacto', 'Daño sobre el activo si la amenaza ocurre'], ['Riesgo', 'Impacto ponderado por la probabilidad'], ['Riesgo inherente', 'El teórico, sin salvaguardas'], ['Riesgo residual', 'El que queda con las salvaguardas']], ref: ['mag', 22]},
    {k: 'order', q: 'Ordena la madurez de una salvaguarda (de menos a más).', items: ['Inexistente', 'Inicial / ad hoc', 'Reproducible pero intuitivo', 'Proceso definido', 'Gestionado y medible', 'Optimizado'], ref: ['maglab', 0]},
    {k: 'choice', scenario: 'Riesgo con probabilidad ALTA e impacto MUY ALTO. Tras implantar identidades y MFA, baja a BAJO, por debajo del umbral.', q: '¿Qué se hace con ese riesgo residual?', opts: ['Se acepta y se documenta', 'Se ignora', 'Se excluye del análisis'], a: 0, why: 'Ejemplo R-03 de la Sesión 3.', ref: ['s3', 5]},
    {k: 'order', q: 'Ordena lo que pide 6.1.2 c) a e).', items: ['Identificar los riesgos y sus dueños', 'Analizar consecuencias y probabilidad', 'Evaluar y priorizar frente a los criterios'], ref: ['une', 9]}
  ]}
 ],
 boss: [
  {k: 'choice', q: '¿Qué metodología de análisis de riesgos usa el curso?', opts: ['MAGERIT v3', 'COBIT', 'ITIL'], a: 0, ref: ['mag', 22]},
  {k: 'tf', q: 'La ISO 27001 obliga a usar MAGERIT.', a: false, why: 'La norma no impone método; MAGERIT es la referencia en España.', ref: ['une', 9]},
  {k: 'choice', q: 'El riesgo calculado como si no hubiera salvaguardas es el…', opts: ['Inherente o potencial', 'Residual', 'Aceptado'], a: 0, ref: ['mag', 22]},
  {k: 'choice', q: 'Un administrador borra por error una tabla. En MAGERIT es una amenaza de tipo…', opts: ['[E] Errores y fallos no intencionados', '[A] Ataques intencionados', '[N] Desastres naturales'], a: 0, ref: ['mag2', 33]},
  {k: 'tf', q: '6.1.2 exige identificar a los dueños de los riesgos.', a: true, ref: ['une', 9]},
  {k: 'choice', q: 'Una salvaguarda «gestionada y medible» tiene un nivel de madurez…', opts: ['L4', 'L1', 'L0'], a: 0, ref: ['maglab', 0]},
  {k: 'choice', q: 'La herramienta del CCN para analizar riesgos con MAGERIT es…', opts: ['PILAR', 'LUCIA', 'CLARA'], a: 0, ref: ['s3', 11]},
  {k: 'tf', q: 'La evaluación de riesgos se compara con los criterios para priorizar el tratamiento.', a: true, ref: ['une', 10]}
 ]
});

/* ═════════════ Unidad 11 · Tratar el riesgo y la SoA ═════════════ */
U({id: 'u11', n: 11, t: 'Tratar riesgos y la Declaración de Aplicabilidad', icon: 'list-checks', mins: 12, clauses: ['6.1.3'],
 s: 'Cláusula 6.1.3: las cuatro opciones de tratamiento y la SoA, el documento sin el que no hay certificación.',
 lesson: [
  {k: '6.1.3', t: 'Cuatro formas de tratar un riesgo', body: [
    {ul: [['i:shield', '<b>Mitigar</b> (reducir): añadir o mejorar controles hasta un nivel aceptable.'], ['i:link', '<b>Transferir</b> (compartir): con otra organización, por ejemplo un seguro o un proveedor.'], ['i:x', '<b>Evitar</b>: dejar de hacer la actividad que genera el riesgo. La opción más drástica.'], ['i:check', '<b>Aceptar</b>: asumirlo de forma documentada por la dirección. Solo dentro del apetito de riesgo.']]}],
   plain: 'Conducir de noche con lluvia: vas más despacio (mitigar), contratas un seguro (transferir), no sales (evitar) o asumes que puede pasar algo (aceptar).',
   exam: 'Transferir el riesgo no transfiere la responsabilidad: si tu proveedor falla, el problema sigue siendo tuyo.',
   refs: [['maglab', 0], ['mag', 10]]},
  {check: true, k: 'choice', scenario: 'Albatrel contrata un ciberseguro que cubre los costes de un ransomware.', q: '¿Qué opción de tratamiento es?', opts: ['Transferir', 'Evitar', 'Aceptar', 'Mitigar'], a: 0, ref: ['mag', 10]},
  {k: '6.1.3 b-c', t: 'Elegir controles y compararlos con el Anexo A', body: [
    'Para la opción elegida se determinan **todos los controles necesarios**, que pueden salir de cualquier fuente.',
    'Después se **comparan con el Anexo A** para comprobar que no se ha olvidado ninguno necesario. El Anexo A no es exhaustivo: puedes necesitar controles adicionales.'],
   plain: 'El Anexo A es una lista para repasar «¿se me olvida algo?», no un menú cerrado.',
   refs: [['une', 10]]},
  {k: 'La SoA', t: 'Declaración de Aplicabilidad', body: [
    'Documento que recoge **todos los controles del Anexo A**, indica cuáles aplican y **justifica tanto las inclusiones como las exclusiones**. Según la norma (6.1.3 d) contiene:',
    {ul: [['1', 'Los controles necesarios.'], ['2', 'La justificación de su inclusión.'], ['3', 'Si están implementados o no.'], ['4', 'La justificación de las exclusiones de controles del Anexo A.']]}],
   exam: 'Sin SoA no hay certificación ISO 27001. Es el vínculo entre el análisis de riesgos y los controles.',
   refs: [['s3', 4], ['une', 10]]},
  {k: 'Ejemplo', t: 'Así es una fila de la SoA', body: [
    {ul: [['A.5.16', '<b>Gestión de identidades</b> · Aplicable: Sí · Justificación: riesgo R-03 (acceso no autorizado) · Estado: Implementado.'], ['A.5.7', '<b>Inteligencia de amenazas</b> · Aplicable: No · Justificación: no hay amenazas de inteligencia en el contexto actual · Estado: N/A.'], ['A.8.28', '<b>Codificación segura</b> · Aplicable: Sí · Justificación: riesgo R-11 (vulnerabilidades en código propio) · Estado: En curso.']]}],
   plain: 'Regla de oro del profesor: toda exclusión se justifica con el mismo rigor que una inclusión.',
   refs: [['s3', 4]]},
  {check: true, k: 'tf', q: 'La SoA es un simple checklist de controles.', a: false, why: '«SoA ≠ checklist»: es el resultado documentado del análisis de riesgos.', ref: ['s3', 24]},
  {k: 'Ejemplo de clase', t: 'Del riesgo a la fila de la SoA (Sesión 3)', body: [
    {ul: [['1', '<b>Riesgo</b>: R-03, acceso no autorizado a la base de datos de nóminas. Probabilidad ALTA, impacto MUY ALTO.'], ['2', '<b>Estrategia</b>: mitigar, porque supera el umbral.'], ['3', '<b>Controles</b>: A.5.15, A.5.16, A.5.17 y A.8.5.'], ['4', '<b>Fila en la SoA</b>: aplicable, justificado por R-03, implementado (AD + MFA + PAM).'], ['5', '<b>Residual</b>: de ALTO a BAJO. Se acepta.']]}],
   refs: [['s3', 5]]},
  {k: 'ENS', t: 'En el ENS también hay SoA', body: [
    'El ENS tiene su propia Declaración de Aplicabilidad con las medidas del Anexo II. Con la guía CCN-STIC 825 relacionas cada control ISO con su medida ENS, y una sola SoA bien hecha puede servir de base a las dos.'],
   case: 'En tu carpeta del curso tienes la plantilla «Declaración de Aplicabilidad (SoA) – Esquema Nacional de Seguridad» en Excel.',
   refs: [['s1', 10]]}
 ],
 labs: [
  {id: 'u11l1', t: 'Las cuatro opciones', items: [
    {k: 'match', q: 'Une cada opción con su ejemplo.', pairs: [['Mitigar', 'Desplegar MFA en todos los accesos'], ['Transferir', 'Contratar un ciberseguro'], ['Evitar', 'Dejar de ofrecer un servicio inseguro'], ['Aceptar', 'Asumir un riesgo bajo de forma documentada']], ref: ['mag', 10]},
    {k: 'tf', q: 'Si transfieres un riesgo a un proveedor, la responsabilidad deja de ser tuya.', a: false, why: 'La responsabilidad sigue siendo tuya; por eso existen los controles de proveedores (5.19-5.22).', ref: ['s3', 18]},
    {k: 'choice', q: '¿Cuál es la opción más drástica?', opts: ['Evitar', 'Mitigar', 'Aceptar'], a: 0, ref: ['maglab', 0]}
  ]},
  {id: 'u11l2', t: 'La SoA por dentro', items: [
    {k: 'classify', q: '¿Lo exige la norma en la SoA (6.1.3 d)?', buckets: [{t: 'Sí lo exige', c: '#5e5ce6'}, {t: 'No lo exige', c: '#8e8e93'}], items: [['Los controles necesarios', 0], ['La justificación de las inclusiones', 0], ['Si están implementados o no', 0], ['La justificación de las exclusiones', 0], ['El precio de cada control', 1], ['El nombre del auditor', 1]], ref: ['une', 10]},
    {k: 'order', q: 'Ordena el recorrido del riesgo a la SoA.', items: ['Identificar el riesgo', 'Elegir la estrategia de tratamiento', 'Seleccionar los controles', 'Escribir la fila en la SoA', 'Calcular el riesgo residual'], ref: ['s3', 5]},
    {k: 'tf', q: 'Los controles del Anexo A son exhaustivos: no puede hacer falta ninguno más.', a: false, why: 'La nota 3 de 6.1.3 dice que pueden ser necesarios controles adicionales.', ref: ['une', 10]},
    {k: 'choice', q: 'Una exclusión en la SoA debe justificarse…', opts: ['Con el mismo rigor que una inclusión', 'Solo si lo pide el auditor', 'Nunca'], a: 0, ref: ['s3', 4]}
  ]}
 ],
 boss: [
  {k: 'choice', q: '¿En qué apartado se elabora la Declaración de Aplicabilidad?', opts: ['6.1.3', '6.2', '9.3'], a: 0, ref: ['une', 10]},
  {k: 'tf', q: 'Sin SoA no hay certificación ISO 27001.', a: true, ref: ['s3', 4]},
  {k: 'choice', q: 'Asumir un riesgo de forma documentada por la dirección es…', opts: ['Aceptar', 'Evitar', 'Transferir'], a: 0, ref: ['maglab', 0]},
  {k: 'tf', q: 'Los controles se pueden identificar de cualquier fuente y luego se comparan con el Anexo A.', a: true, ref: ['une', 10]},
  {k: 'choice', q: 'La SoA debe indicar, para cada control necesario…', opts: ['Si está implementado o no', 'Quién lo inventó', 'Su coste'], a: 0, ref: ['une', 10]},
  {k: 'choice', q: 'Un ciberseguro es un ejemplo de…', opts: ['Transferir el riesgo', 'Evitar el riesgo', 'Riesgo inherente'], a: 0, ref: ['mag', 10]},
  {k: 'tf', q: 'La SoA es el vínculo entre el análisis de riesgos y los controles implementados.', a: true, ref: ['s3', 4]},
  {k: 'choice', q: 'El control A.5.7 se excluye en el ejemplo del curso porque…', opts: ['No hay amenazas de inteligencia en el contexto actual', 'Es caro', 'No existe en la norma'], a: 0, ref: ['s3', 4]}
 ]
});

/* ═════════════ Unidad 12 · PTR, objetivos y cambios ═════════════ */
U({id: 'u12', n: 12, t: 'Plan de tratamiento, objetivos y cambios', icon: 'target', mins: 11, clauses: ['6.1.3', '6.2', '6.3'],
 s: 'El plan de tratamiento (el «cómo»), los objetivos medibles de 6.2 y la planificación de cambios de 6.3.',
 lesson: [
  {k: '6.1.3 e-f', t: 'El plan de tratamiento (PTR)', body: [
    'La SoA dice **QUÉ** controles. El plan de tratamiento dice **CÓMO, CUÁNDO, QUIÉN y CUÁNTO**.',
    'La norma pide formular ese plan y obtener la **aprobación de los dueños de los riesgos**, que también aceptan los riesgos residuales.'],
   plain: '«Sin PTR, la SoA es un deseo, no un proyecto», como dice el profesor.',
   refs: [['s3', 6], ['s3', 24], ['une', 11]]},
  {k: 'Ejemplo', t: 'Filas del PTR de la Sesión 3', body: [
    {ul: [['R-03', 'A.5.16 · Gestión de identidades con revisión mensual · CISO · Q1 · <b>Hecho</b> · residual BAJO.'], ['R-03', 'A.8.5 · MFA en todos los accesos remotos · Sysadmin · Q1 · <b>En curso</b> · residual MEDIO.'], ['R-07', 'A.8.8 · Escaneo semanal de vulnerabilidades · SecOps · Q2 · <b>Planificado</b>.'], ['R-11', 'A.5.24 · Documentar y probar la respuesta a incidentes · CISO · Q2 · <b>Planificado</b>.']]},
    'El PTR es un **documento vivo**: se actualiza en cada revisión por la dirección (9.3).'],
   refs: [['s3', 6]]},
  {check: true, k: 'match', q: '¿Qué responde cada documento?', pairs: [['SoA', 'Qué controles y por qué'], ['PTR', 'Cómo, cuándo, quién y cuánto']], ref: ['s3', 6]},
  {k: '6.2', t: 'Objetivos medibles', body: [
    'Los objetivos de seguridad deben:',
    {ul: [['1', 'Ser coherentes con la <b>política</b>.'], ['2', 'Ser <b>medibles</b> (si es posible).'], ['3', 'Tener en cuenta los requisitos y los resultados del análisis de riesgos.'], ['4', 'Seguirse, comunicarse y actualizarse.']]},
    'Y para cada uno se planifica: **qué** se hará, **recursos**, **responsable**, **plazo** y **cómo se evaluará**.'],
   exam: 'La 6.2 es «lo más olvidado de la planificación» según el profesor: el puente entre la política y los KPI.',
   refs: [['s3', 12], ['une', 11]]},
  {k: 'SMART', t: 'Objetivos SMART: ejemplos de clase', body: [
    {ul: [['1', 'Reducir el parcheo de vulnerabilidades críticas de 30 a 7 días, medido cada mes.'], ['2', 'Llegar al 95 % de plantilla con la formación de concienciación completada.'], ['3', 'Mantener el 100 % de accesos VPN con MFA, verificado en el directorio.'], ['4', 'Cerrar las 8 no conformidades abiertas antes de la auditoría de certificación.']]},
    'No hay número mínimo: **5-8 objetivos bien elegidos** valen más que 20 vagos.'],
   plain: 'SMART: específico, medible, alcanzable, relevante y con fecha. «Mejorar la seguridad» no es un objetivo; «MFA en el 100 % de cuentas antes de junio», sí.',
   refs: [['s3', 12]]},
  {check: true, k: 'choice', q: '¿Cuál es un objetivo SMART?', opts: ['Mejorar la seguridad', 'Tener MFA en el 100 % de cuentas VPN antes del 30 de junio', 'Ser más seguros que la competencia'], a: 1, ref: ['s3', 12]},
  {k: 'KPI', t: 'Cómo se miden: KPI del SGSI', body: [
    {ul: [['MTTD', 'Tiempo medio de detección < 4 h.'], ['MTTR', 'Tiempo medio de respuesta < 24 h.'], ['Patch', 'Vulnerabilidades críticas parcheadas en 7 días > 95 %.'], ['MFA', 'Cuentas con MFA = 100 %.'], ['NC', 'No conformidades cerradas en plazo > 90 %.']]},
    'Se usan en la cláusula 9.1 (que verás en el bloque 5).'],
   plain: '«Sin medición no sabes si el SGSI mejora»: los KPI son la memoria del SGSI.',
   refs: [['s3', 13], ['s3', 24]]},
  {k: '6.3', t: 'Planificar los cambios (nuevo en 2022)', body: [
    'Cuando haya que cambiar el SGSI, los cambios se hacen **de forma planificada**. Es un apartado nuevo de la versión 2022.'],
   case: 'En Albatrel, cambiar el alcance (por ejemplo, añadir un servicio nuevo) se planificará: aprobación del Comité, análisis de riesgos del cambio y actualización de la SoA.',
   refs: [['une', 12]]}
 ],
 labs: [
  {id: 'u12l1', t: 'El plan de tratamiento', items: [
    {k: 'classify', q: '¿Va en la SoA o en el PTR?', buckets: [{t: 'SoA', c: '#5e5ce6'}, {t: 'PTR', c: '#ff9f0a'}], items: [['Si el control es aplicable', 0], ['Justificación de una exclusión', 0], ['Responsable de la acción', 1], ['Fecha objetivo', 1], ['Presupuesto de la acción', 1]], ref: ['s3', 6]},
    {k: 'tf', q: 'Los dueños de los riesgos deben aprobar el plan de tratamiento y aceptar el riesgo residual.', a: true, ref: ['une', 11]},
    {k: 'choice', q: 'El PTR se actualiza sobre todo en…', opts: ['Cada revisión por la dirección (9.3)', 'Solo al certificarse', 'Nunca, es fijo'], a: 0, ref: ['s3', 6]}
  ]},
  {id: 'u12l2', t: 'Objetivos y KPI', items: [
    {k: 'classify', q: '¿Es un objetivo medible?', buckets: [{t: 'Medible', c: '#34c759'}, {t: 'Vago', c: '#ff3b30'}], items: [['95 % de plantilla formada antes de marzo', 0], ['Clic en phishing simulado < 5 %', 0], ['Disponibilidad mensual ≥ 99,5 %', 0], ['Concienciar mejor al personal', 1], ['Reforzar la ciberseguridad', 1]], ref: ['pol', 1]},
    {k: 'match', q: 'Une cada KPI con su umbral del curso.', pairs: [['MTTD', '< 4 horas'], ['MTTR', '< 24 horas'], ['Cobertura MFA', '100 %'], ['Cierre de no conformidades', '> 90 %']], ref: ['s3', 13]},
    {k: 'order', q: 'Ordena lo que se planifica para cada objetivo (según 6.2).', items: ['Qué se hará', 'Qué recursos se necesitan', 'Quién es el responsable', 'Cuándo se finalizará', 'Cómo se evaluarán los resultados'], ref: ['une', 11]},
    {k: 'tf', q: '6.3 Planificación de los cambios es nuevo en la versión 2022.', a: true, ref: ['une', 12]}
  ]}
 ],
 boss: [
  {k: 'choice', q: 'La SoA dice qué controles; el PTR dice…', opts: ['Cómo, cuándo, quién y cuánto', 'Por qué existen las normas', 'Quién audita'], a: 0, ref: ['s3', 6]},
  {k: 'tf', q: 'Los objetivos de seguridad deben ser coherentes con la política.', a: true, ref: ['une', 11]},
  {k: 'choice', q: '¿Qué apartado trata los objetivos de seguridad?', opts: ['6.2', '6.1.2', '5.3'], a: 0, ref: ['une', 11]},
  {k: 'choice', q: 'MTTD significa…', opts: ['Tiempo medio de detección', 'Tiempo máximo de descarga', 'Método de tratamiento'], a: 0, ref: ['s3', 13]},
  {k: 'tf', q: 'La norma exige un mínimo de 20 objetivos.', a: false, why: 'No hay mínimo; 5-8 bien elegidos es lo recomendable.', ref: ['s3', 12]},
  {k: 'choice', q: '¿Quién aprueba el plan de tratamiento según 6.1.3?', opts: ['Los dueños de los riesgos', 'El proveedor', 'Cualquier empleado'], a: 0, ref: ['une', 11]},
  {k: 'tf', q: 'El PTR es un documento vivo.', a: true, ref: ['s3', 6]},
  {k: 'choice', q: 'La planificación de los cambios del SGSI está en…', opts: ['6.3', '10.2', '4.4'], a: 0, ref: ['une', 12]}
 ]
});

T.glossary.push(
  ['MAGERIT', 'Metodología de análisis y gestión de riesgos del Gobierno de España (v3). Herramienta real: PILAR del CCN.', ['mag', 22]],
  ['Riesgo inherente', 'El riesgo calculado como si no hubiera salvaguardas.', ['mag', 22]],
  ['Salvaguarda', 'Medida que reduce el riesgo (en MAGERIT, el equivalente a un control).', ['mag', 31]],
  ['Degradación', 'Parte del valor de un activo que se pierde si una amenaza ocurre.', ['mag', 28]],
  ['Dueño del riesgo', 'Persona con responsabilidad y autoridad para gestionar un riesgo (6.1.2 c).', ['une', 9]],
  ['Criterios de aceptación del riesgo', 'Nivel a partir del cual un riesgo se puede asumir; lo aprueba la dirección (6.1.2 a).', ['une', 9]],
  ['Mitigar / Transferir / Evitar / Aceptar', 'Las cuatro opciones de tratamiento del riesgo.', ['maglab', 0]],
  ['Plan de tratamiento del riesgo (PTR)', 'Cómo, cuándo, quién y cuánto para aplicar los controles de la SoA (6.1.3 e).', ['s3', 6]],
  ['Objetivo SMART', 'Específico, medible, alcanzable, relevante y con fecha (6.2).', ['s3', 12]],
  ['KPI', 'Indicador clave para medir el SGSI (por ejemplo MTTD, MTTR, cobertura de MFA).', ['s3', 13]]
);
})();
