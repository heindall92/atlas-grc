/* ISO/IEC 27001:2022 — Bloque 5 · Cláusula 9 (Evaluación del desempeño).
   Contenido propio. Citas: texto de la norma (cláusula 9), unidades UC de evaluación y de auditoría,
   Sesión 3 (KPIs) y la clase de cláusulas 8-10. Ejemplos con el caso propio Albatrel. */
(function () {
const T = ATLAS.track('iso27001');

Object.assign(T.docs, {
  uceval: {s: 'UC Evaluación', t: 'UC · Evaluación del desempeño y mejora'},
  ucaud:  {s: 'UC Auditoría', t: 'UC · Planificar y preparar la auditoría del SGSI'}
});

const m5 = T.modules.find(m => m.id === 'm5');
Object.assign(m5, {soon: false, s: 'Medir el SGSI, auditarlo por dentro y revisarlo con la dirección', units: ['u21', 'u22', 'u23', 'u24']});

const U = (u) => { T.units[u.id] = u; };

/* ═════════════ Unidad 21 · 9.1 ═════════════ */
U({id: 'u21', n: 21, t: 'Medir lo que importa', icon: 'chart-column', mins: 10, clauses: ['9.1'],
 s: 'Cláusula 9.1: qué medir, cómo, cuándo y quién, para saber si el SGSI funciona.',
 lesson: [
  {k: 'Cláusula 9', t: '¿Cómo sé que mi SGSI funciona?', body: [
    'La cláusula 9 es la fase **Verificar** del PDCA. Tiene tres mecanismos obligatorios:',
    {ul: [['9.1', 'Seguimiento, medición, análisis y evaluación.'], ['9.2', 'Auditoría interna.'], ['9.3', 'Revisión por la dirección.']]}],
   plain: 'Medir (9.1), que alguien independiente lo compruebe (9.2) y que la dirección decida con esos datos (9.3).',
   refs: [['cl810', 6], ['uceval', 5]]},
  {k: '9.1', t: 'Seis preguntas antes de medir', body: [
    {ul: [['a', '<b>Qué</b> medir, incluidos procesos y controles.'], ['b', '<b>Con qué método</b>, para que los resultados sean válidos (comparables y reproducibles).'], ['c', '<b>Cuándo</b> medir.'], ['d', '<b>Quién</b> mide.'], ['e', '<b>Cuándo</b> se analizan y evalúan los resultados.'], ['f', '<b>Quién</b> los analiza y evalúa.']]}],
   exam: 'Medir y analizar son cosas distintas: la norma pide decidir cuándo y quién para cada una.',
   refs: [['une', 15]]},
  {check: true, k: 'tf', q: 'Según 9.1, los métodos de medición deberían dar resultados comparables y reproducibles.', a: true, ref: ['une', 15]},
  {k: 'Desempeño y eficacia', t: 'Dos cosas que evaluar', body: [
    {ul: [['D', '<b>Desempeño de la seguridad</b>: ¿cómo van los indicadores? (incidentes, parches, formación…).'], ['E', '<b>Eficacia del SGSI</b>: ¿el sistema consigue lo que se propuso? (objetivos de 6.2).']]},
    'Y hay que tener **información documentada como evidencia** de los resultados.'],
   refs: [['une', 15]]},
  {k: 'KPI', t: 'Un cuadro de mando sencillo', body: [
    {ul: [['MTTD', 'Tiempo medio de detección · mensual · umbral < 4 h.'], ['MTTR', 'Tiempo medio de respuesta · mensual · < 24 h.'], ['Parches', 'Críticas parcheadas en plazo · semanal · > 95 %.'], ['MFA', 'Cuentas con MFA · mensual · 100 %.'], ['Formación', 'Personal formado · trimestral · 100 %.']]}],
   plain: 'Pocos indicadores bien medidos valen más que muchos vagos. El curso recomienda unos 7.',
   refs: [['s3', 13], ['s3', 24]]},
  {k: 'Tu caso', t: 'Cómo mide Albatrel', body: [
    'Albatrel mide sus objetivos de OBJ-01: disponibilidad de la sede electrónica en periodo de pago, clics en simulacros de phishing, cuentas con MFA y restauraciones de prueba con éxito.',
    'El Responsable del Sistema recoge los datos cada mes, el Responsable de Seguridad los analiza y el Comité los evalúa cada trimestre.'],
   case: 'Así responde a las seis preguntas de 9.1: qué (los indicadores de OBJ-01), cómo (con informes de las herramientas), cuándo (mensual), quién mide (RSIS), cuándo se analiza (trimestral) y quién analiza (RSEG y Comité).'},
  {check: true, k: 'match', q: 'Une cada pregunta de 9.1 con la respuesta de Albatrel.', pairs: [['¿Qué se mide?', 'Los indicadores de OBJ-01'], ['¿Quién mide?', 'El Responsable del Sistema'], ['¿Cuándo se analiza?', 'Cada trimestre'], ['¿Quién analiza?', 'El Responsable de Seguridad y el Comité']], ref: ['une', 15]}
 ],
 labs: [
  {id: 'u21l1', t: 'Medición', items: [
    {k: 'order', q: 'Ordena las letras de 9.1 tal como las enumera la norma.', items: ['Qué medir', 'Métodos', 'Cuándo medir', 'Quién mide', 'Cuándo analizar', 'Quién analiza'], ref: ['une', 15]},
    {k: 'match', q: 'Une cada KPI con su umbral del curso.', pairs: [['MTTD', '< 4 horas'], ['MTTR', '< 24 horas'], ['Parches críticos en plazo', '> 95 %'], ['Cobertura de MFA', '100 %']], ref: ['s3', 13]},
    {k: 'classify', q: '¿Mide el desempeño de la seguridad o la eficacia del SGSI?', buckets: [{t: 'Desempeño', c: '#30b0c7'}, {t: 'Eficacia', c: '#5e5ce6'}], items: [['Número de incidentes al mes', 0], ['Tiempo medio de respuesta', 0], ['¿Se cumplieron los objetivos del año?', 1], ['¿El SGSI consigue lo que se propuso?', 1]], ref: ['une', 15]},
    {k: 'tf', q: 'Basta con medir: no hace falta conservar evidencia de los resultados.', a: false, ref: ['une', 15]}
  ]}
 ],
 boss: [
  {k: 'choice', q: '¿Qué apartado pide decidir qué medir y cómo?', opts: ['9.1', '9.2', '6.2'], a: 0, ref: ['une', 15]},
  {k: 'tf', q: 'La organización debe evaluar el desempeño de la seguridad y la eficacia del SGSI.', a: true, ref: ['une', 15]},
  {k: 'choice', q: 'MTTR significa…', opts: ['Tiempo medio de respuesta', 'Tiempo máximo de restauración', 'Mínimo tiempo de riesgo'], a: 0, ref: ['s3', 13]},
  {k: 'choice', q: 'La cláusula 9 corresponde a la fase…', opts: ['Verificar', 'Hacer', 'Actuar'], a: 0, ref: ['cl810', 7]},
  {k: 'tf', q: '9.1 pide decidir quién analiza y evalúa los resultados.', a: true, ref: ['une', 15]},
  {k: 'choice', q: '¿Qué es mejor según el curso?', opts: ['Pocos KPIs bien elegidos y medidos con constancia', 'Cuantos más KPIs, mejor', 'No medir hasta la auditoría'], a: 0, ref: ['s3', 24]}
 ]
});

/* ═════════════ Unidad 22 · 9.2 ═════════════ */
U({id: 'u22', n: 22, t: 'La auditoría interna', icon: 'scan-search', mins: 11, clauses: ['9.2'],
 s: 'Cláusula 9.2: auditar el propio SGSI con un programa, criterios y auditores imparciales.',
 lesson: [
  {k: '9.2.1', t: 'Para qué sirve la auditoría interna', body: [
    'Se hace **a intervalos planificados** para saber si el SGSI:',
    {ul: [['a1', 'Cumple los <b>requisitos propios</b> de la organización.'], ['a2', 'Cumple los <b>requisitos de la norma</b>.'], ['b', 'Está <b>implementado y mantenido de forma eficaz</b>.']]}],
   plain: 'Es un ensayo general antes del examen de verdad (la auditoría de certificación), y además una herramienta para mejorar.',
   refs: [['une', 15], ['uceval', 6]]},
  {k: '9.2.2', t: 'El programa de auditoría', body: [
    'La organización mantiene uno o varios **programas de auditoría** con:',
    {ul: [['1', 'Frecuencia.'], ['2', 'Métodos.'], ['3', 'Responsabilidades.'], ['4', 'Requisitos de planificación.'], ['5', 'Elaboración de informes.']]},
    'Y al diseñarlo tiene en cuenta **la importancia de los procesos** y **los resultados de auditorías anteriores**.'],
   exam: 'En la versión 2022, 9.2 se divide en 9.2.1 (generalidades) y 9.2.2 (programa de auditoría interna).',
   refs: [['une', 15], ['cl810', 6]]},
  {check: true, k: 'tf', q: 'Los resultados de auditorías anteriores se tienen en cuenta al establecer el programa de auditoría.', a: true, ref: ['une', 15]},
  {k: 'Cada auditoría', t: 'Criterios, alcance, auditores e informe', body: [
    {ul: [['a', 'Definir los <b>criterios</b> (contra qué se audita) y el <b>alcance</b> (qué se audita).'], ['b', 'Elegir auditores que aseguren la <b>objetividad e imparcialidad</b>.'], ['c', 'Informar de los resultados a la <b>dirección pertinente</b>.']]},
    'Y conservar evidencia del programa y de los resultados.'],
   plain: 'Regla de oro: nadie audita su propio trabajo.',
   refs: [['une', 16], ['uceval', 7]]},
  {check: true, k: 'choice', scenario: 'En Albatrel, el Responsable del Sistema se ofrece a auditar el proceso de copias de seguridad, que gestiona él mismo.', q: '¿Qué principio se rompe?', opts: ['La imparcialidad: nadie audita su propio trabajo', 'La confidencialidad', 'La disponibilidad'], a: 0, ref: ['uceval', 7]},
  {k: 'Tu caso', t: 'El programa de auditoría de Albatrel', body: [
    {ul: [['i:calendar', '<b>Frecuencia</b>: todo el SGSI en un año, en dos tandas.'], ['i:scan-search', '<b>Métodos</b>: entrevistas, revisión de documentos, observación y muestreo.'], ['i:users', '<b>Auditor</b>: una consultora externa, porque con 60 personas es difícil encontrar alguien interno independiente de todo.'], ['i:file-text', '<b>Informe</b>: a la Gerencia y al Comité.'], ['i:target', '<b>Prioridad</b>: copias, accesos e incidentes, los procesos con más riesgo.']]}],
   case: 'Una auditoría interna puede hacerla alguien de fuera contratado por la empresa: sigue siendo interna porque la encarga y la dirige la propia organización.'}
 ],
 labs: [
  {id: 'u22l1', t: 'Programa y principios', items: [
    {k: 'classify', q: '¿Lo debe incluir el programa de auditoría (9.2.2)?', buckets: [{t: 'Sí', c: '#5e5ce6'}, {t: 'No', c: '#8e8e93'}], items: [['Frecuencia', 0], ['Métodos', 0], ['Responsabilidades', 0], ['Elaboración de informes', 0], ['El sueldo del auditor', 1]], ref: ['une', 15]},
    {k: 'match', q: 'Une cada término con su significado.', pairs: [['Criterios de auditoría', 'Contra qué se compara (requisitos, políticas)'], ['Alcance de la auditoría', 'Qué se audita: ubicaciones, procesos, periodo'], ['Programa de auditoría', 'Conjunto de auditorías planificadas en un periodo']], ref: ['une', 16]},
    {k: 'tf', q: 'Los resultados de la auditoría interna deben comunicarse a la dirección pertinente.', a: true, ref: ['une', 16]},
    {k: 'choice', q: 'Al planificar el programa conviene dar prioridad a…', opts: ['Los procesos más importantes y lo que salió mal en auditorías anteriores', 'Los procesos más fáciles de auditar', 'Lo que menos le moleste a cada área'], a: 0, ref: ['une', 15]}
  ]}
 ],
 boss: [
  {k: 'choice', q: '¿Qué apartado exige el programa de auditoría interna?', opts: ['9.2.2', '9.3.2', '7.5'], a: 0, ref: ['une', 15]},
  {k: 'tf', q: 'Un auditor puede auditar su propio trabajo si es el que más sabe.', a: false, ref: ['uceval', 7]},
  {k: 'choice', q: 'La auditoría interna comprueba si el SGSI…', opts: ['Cumple los requisitos y está implementado y mantenido eficazmente', 'Es más barato que el de la competencia', 'Tiene muchos documentos'], a: 0, ref: ['une', 15]},
  {k: 'tf', q: 'Hay que conservar evidencia de la implementación del programa y de los resultados de auditoría.', a: true, ref: ['une', 16]},
  {k: 'choice', q: 'Una consultora externa contratada por Albatrel para revisar su SGSI hace una auditoría…', opts: ['Interna (la encarga la propia organización)', 'De certificación', 'De tercera parte obligatoria'], a: 0},
  {k: 'choice', q: 'Las auditorías internas se hacen…', opts: ['A intervalos planificados', 'Solo cuando hay un incidente', 'Una vez en la vida'], a: 0, ref: ['une', 15]}
 ]
});

/* ═════════════ Unidad 23 · Cómo se audita ═════════════ */
U({id: 'u23', n: 23, t: 'Cómo se hace una auditoría', icon: 'clipboard-check', mins: 12, clauses: ['9.2'],
 s: 'Lo básico de las auditorías (lo que desarrolla la ISO 19011): tipos, métodos, evidencias y hallazgos.',
 lesson: [
  {k: 'Tipos', t: 'Primera, segunda y tercera parte', body: [
    {ul: [['1ª', '<b>Primera parte</b>: la hace la propia organización (o alguien en su nombre). La auditoría interna.'], ['2ª', '<b>Segunda parte</b>: la hace alguien con interés en la organización, normalmente un cliente que audita a su proveedor.'], ['3ª', '<b>Tercera parte</b>: la hace una entidad independiente, como un organismo de certificación.']]}],
   case: 'La Diputación auditando a Albatrel como proveedor sería de segunda parte. La entidad que certifique su ISO 27001 hará una de tercera parte.',
   exam: 'Pregunta típica: «auditoría realizada por un organismo de certificación» → tercera parte.',
   refs: [['ucaud', 3]]},
  {check: true, k: 'classify', q: '¿De qué parte es cada auditoría?', buckets: [{t: '1ª parte', c: '#5e5ce6'}, {t: '2ª parte', c: '#ff9f0a'}, {t: '3ª parte', c: '#34c759'}], items: [['Auditoría interna de Albatrel', 0], ['La Diputación audita a Albatrel', 1], ['Una clínica revisa la seguridad de Albatrel', 1], ['Auditoría de certificación ISO 27001', 2]]},
  {k: 'Métodos', t: 'Cómo se consigue la evidencia', body: [
    {ul: [['i:messages-square', '<b>Entrevistas</b> a las personas que hacen el trabajo.'], ['i:file-text', '<b>Revisión de documentos y registros</b>.'], ['i:eye', '<b>Observación</b> del trabajo real.'], ['i:list-checks', '<b>Muestreo</b>: revisar una muestra representativa, no todo.']]},
    'Se pueden hacer **in situ** (en las instalaciones) o **a distancia**, por videollamada o revisando documentos compartidos.'],
   refs: [['ucaud', 11], ['ucaud', 12]]},
  {k: 'Vocabulario', t: 'Evidencia, criterio, hallazgo y conclusión', body: [
    {ul: [['1', '<b>Criterios</b>: lo que debería pasar (la norma, la política, un procedimiento).'], ['2', '<b>Evidencia objetiva</b>: hechos verificables (registros, declaraciones, observaciones).'], ['3', '<b>Hallazgo</b>: el resultado de comparar la evidencia con los criterios (conformidad, no conformidad u oportunidad de mejora).'], ['4', '<b>Conclusión</b>: el resultado de la auditoría tras considerar todos los hallazgos.']]}],
   plain: 'Criterio: «las copias se prueban cada mes». Evidencia: «solo hay 4 pruebas en 12 meses». Hallazgo: no conformidad. Conclusión: el proceso de copias no es eficaz.',
   refs: [['ucaud', 9]]},
  {check: true, k: 'order', q: 'Ordena cómo se llega a una conclusión de auditoría.', items: ['Criterios', 'Evidencia objetiva', 'Hallazgo', 'Conclusión'], ref: ['ucaud', 9]},
  {k: 'Hallazgos', t: 'No conformidad mayor, menor y observación', added: true, body: [
    {ul: [['NC+', '<b>No conformidad mayor</b>: falta un requisito entero o falla de forma sistemática (por ejemplo, no hay análisis de riesgos).'], ['NC−', '<b>No conformidad menor</b>: un fallo puntual que no pone en duda el sistema (una prueba de copias que faltó).'], ['OBS', '<b>Observación u oportunidad de mejora</b>: no incumple, pero se puede hacer mejor.']]}],
   exam: 'Esta clasificación la usan los organismos de certificación; con una no conformidad mayor abierta no se concede el certificado.',
   refs: [['cl810', 7]]},
  {k: 'El auditor', t: 'Cómo debe ser quien audita', body: [
    'Además de saber de la norma, un buen auditor es **ético, imparcial, perceptivo, diplomático y abierto de mente**, y basa sus conclusiones en evidencias, no en impresiones.',
    'En una auditoría externa, el **auditor jefe** organiza el equipo, representa a los auditores y prepara el informe final.'],
   refs: [['ucaud', 12], ['ucaud', 13]]},
  {check: true, k: 'tf', q: 'El muestreo consiste en revisar absolutamente todos los registros.', a: false, why: 'Se revisa una muestra representativa.', ref: ['ucaud', 11]}
 ],
 labs: [
  {id: 'u23l1', t: 'Tipos y métodos', items: [
    {k: 'match', q: 'Une cada tipo de auditoría con quién la hace.', pairs: [['Primera parte', 'La propia organización'], ['Segunda parte', 'Un cliente sobre su proveedor'], ['Tercera parte', 'Un organismo independiente de certificación']], ref: ['ucaud', 3]},
    {k: 'classify', q: '¿Es un método de auditoría?', buckets: [{t: 'Sí', c: '#34c759'}, {t: 'No', c: '#ff3b30'}], items: [['Entrevistar al Responsable del Sistema', 0], ['Revisar los registros de copias', 0], ['Observar cómo se da de alta un usuario', 0], ['Adivinar si se cumple', 1]], ref: ['ucaud', 11]},
    {k: 'tf', q: 'Una auditoría puede hacerse a distancia, por videollamada.', a: true, ref: ['ucaud', 12]}
  ]},
  {id: 'u23l2', t: 'Hallazgos', items: [
    {k: 'classify', q: 'Clasifica cada hallazgo en Albatrel.', buckets: [{t: 'NC mayor', c: '#ff3b30'}, {t: 'NC menor', c: '#ff9f0a'}, {t: 'Observación', c: '#8e8e93'}], items: [['No existe análisis de riesgos', 0], ['Nunca se ha hecho una revisión por la dirección', 0], ['Falta una prueba de restauración de un mes', 1], ['Un documento tiene la fecha de revisión vencida', 1], ['El plan de formación podría incluir más simulacros', 2]], ref: ['cl810', 7]},
    {k: 'choice', scenario: 'El criterio dice «los accesos se retiran el día de la baja». El auditor revisa 10 bajas y en 3 los accesos seguían activos una semana después.', q: '¿Qué ha obtenido el auditor con esas 10 bajas?', opts: ['Evidencia objetiva por muestreo', 'Una conclusión sin pruebas', 'Un criterio de auditoría'], a: 0, ref: ['ucaud', 11]},
    {k: 'match', q: 'Une cada término con su definición.', pairs: [['Criterios', 'Lo que debería cumplirse'], ['Evidencia objetiva', 'Hechos verificables'], ['Hallazgo', 'Comparar evidencia con criterios'], ['Conclusión', 'Resultado final de la auditoría']], ref: ['ucaud', 9]}
  ]}
 ],
 boss: [
  {k: 'choice', q: 'Una auditoría hecha por un organismo de certificación es de…', opts: ['Tercera parte', 'Primera parte', 'Segunda parte'], a: 0, ref: ['ucaud', 3]},
  {k: 'tf', q: 'Los hallazgos resultan de comparar la evidencia objetiva con los criterios de auditoría.', a: true, ref: ['ucaud', 9]},
  {k: 'choice', q: 'Revisar registros, entrevistar y observar son…', opts: ['Métodos para obtener evidencia de auditoría', 'Cualidades del auditor', 'Objetivos de la auditoría'], a: 0, ref: ['ucaud', 11]},
  {k: 'choice', q: 'No tener ningún análisis de riesgos sería probablemente una…', opts: ['No conformidad mayor', 'Observación', 'Buena práctica'], a: 0},
  {k: 'tf', q: 'Perceptivo, diplomático y abierto de mente son cualidades personales deseables en un auditor.', a: true, ref: ['ucaud', 13]},
  {k: 'choice', q: 'Un cliente que audita la seguridad de su proveedor hace una auditoría de…', opts: ['Segunda parte', 'Tercera parte', 'Primera parte'], a: 0, ref: ['ucaud', 3]},
  {k: 'tf', q: 'Las conclusiones de auditoría se basan en impresiones del auditor, aunque no haya evidencia.', a: false}
 ]
});

/* ═════════════ Unidad 24 · 9.3 ═════════════ */
U({id: 'u24', n: 24, t: 'La revisión por la dirección', icon: 'crown', mins: 10, clauses: ['9.3'],
 s: 'Cláusula 9.3: la dirección revisa el SGSI con datos y decide cambios y mejoras.',
 lesson: [
  {k: '9.3.1', t: 'Para qué revisa la dirección', body: [
    'La alta dirección revisa el SGSI **a intervalos planificados** para asegurarse de que sigue siendo **conveniente, adecuado y eficaz**.',
    'No es una reunión de cortesía: es donde la dirección demuestra su liderazgo (5.1) con decisiones.'],
   plain: 'Es la «reunión de consejo» del SGSI: se mira el cuadro de mando y se decide.',
   refs: [['une', 16], ['uceval', 8]]},
  {k: '9.3.2', t: 'Las entradas: lo que hay que llevar a la reunión', body: [
    {ul: [['a', 'Estado de las acciones de revisiones anteriores.'], ['b', 'Cambios en las cuestiones externas e internas.'], ['c', 'Cambios en las necesidades y expectativas de las <b>partes interesadas</b>.'], ['d', 'Comportamiento de la seguridad: no conformidades, mediciones, auditorías y objetivos.'], ['e', 'Comentarios de las partes interesadas.'], ['f', 'Resultados de la evaluación de riesgos y estado del plan de tratamiento.'], ['g', 'Oportunidades de mejora continua.']]}],
   exam: 'Si en la revisión falta la retroalimentación de las partes interesadas, el apartado incumplido es 9.3.2.',
   refs: [['une', 16]]},
  {check: true, k: 'classify', q: '¿Es una entrada obligatoria de la revisión por la dirección?', buckets: [{t: 'Sí (9.3.2)', c: '#5e5ce6'}, {t: 'No', c: '#8e8e93'}], items: [['Resultados de auditoría', 0], ['Estado del plan de tratamiento de riesgos', 0], ['Comentarios de las partes interesadas', 0], ['La cena de Navidad', 1]], ref: ['une', 16]},
  {k: '¡Ojo!', t: 'Una entrada nueva en 2022', added: true, body: [
    'La versión 2022 añadió la letra **c)**: cambios en las necesidades y expectativas de las partes interesadas.',
    'La unidad UC del curso usa la lista de la versión anterior y no la incluye. En el examen, cuenta con ella.'],
   refs: [['uceval', 9], ['une', 16]]},
  {k: '9.3.3', t: 'Las salidas: decisiones', body: [
    'Los resultados de la revisión incluyen las **decisiones sobre oportunidades de mejora** y sobre **cualquier necesidad de cambio** en el SGSI.',
    'Debe quedar **información documentada** como evidencia: normalmente un acta firmada.'],
   refs: [['une', 16], ['cl810', 6]]},
  {k: 'Tu caso', t: 'El acta de Albatrel', body: [
    {ul: [['i:calendar', '<b>Cuándo</b>: una vez al año, en noviembre, antes del presupuesto.'], ['i:users', '<b>Quién</b>: la Gerencia, con el Comité de Seguridad.'], ['i:chart-column', '<b>Qué se lleva</b>: indicadores de OBJ-01, informe de auditoría interna, estado de PTR-01, cambios en el contexto y quejas de clínicas y ayuntamientos.'], ['i:file-check', '<b>Qué sale</b>: presupuesto para el segundo climatizador, objetivos de 2028 y la decisión de revaluar riesgos por la migración a la nube.']]}],
   case: 'El acta, firmada por la Gerencia, es la evidencia que pedirá el auditor.'},
  {check: true, k: 'tf', q: 'Los resultados de la revisión por la dirección deben conservarse como información documentada.', a: true, ref: ['une', 16]}
 ],
 labs: [
  {id: 'u24l1', t: 'Entradas y salidas', items: [
    {k: 'match', q: 'Une cada letra de 9.3.2 con su entrada.', pairs: [['a', 'Acciones de revisiones anteriores'], ['b', 'Cambios en cuestiones externas e internas'], ['c', 'Cambios en necesidades de las partes interesadas'], ['f', 'Riesgos y plan de tratamiento'], ['g', 'Oportunidades de mejora']], ref: ['une', 16]},
    {k: 'classify', q: '¿Entrada (9.3.2) o salida (9.3.3)?', buckets: [{t: 'Entrada', c: '#30b0c7'}, {t: 'Salida', c: '#34c759'}], items: [['Informe de auditoría interna', 0], ['Indicadores del año', 0], ['Decisión de comprar un climatizador', 1], ['Nuevos objetivos para el año siguiente', 1]], ref: ['une', 16]},
    {k: 'choice', scenario: 'En la revisión anual de Albatrel nadie trae las quejas de las clínicas.', q: '¿Qué apartado echa en falta esa información?', opts: ['9.3.2', '4.1', '8.2'], a: 0, ref: ['une', 16]},
    {k: 'tf', q: 'La revisión por la dirección la puede hacer solo el técnico de sistemas.', a: false, why: 'La hace la alta dirección.', ref: ['une', 16]}
  ]}
 ],
 boss: [
  {k: 'choice', q: '¿Quién hace la revisión por la dirección?', opts: ['La alta dirección', 'El auditor externo', 'Los usuarios'], a: 0, ref: ['une', 16]},
  {k: 'tf', q: 'Los cambios en las necesidades de las partes interesadas son una entrada de 9.3.2 en la versión 2022.', a: true, ref: ['une', 16]},
  {k: 'choice', q: 'La revisión asegura que el SGSI sigue siendo…', opts: ['Conveniente, adecuado y eficaz', 'Barato, rápido y bonito', 'Secreto'], a: 0, ref: ['une', 16]},
  {k: 'choice', q: 'Las decisiones sobre mejoras y cambios son…', opts: ['Salidas de la revisión (9.3.3)', 'Entradas (9.3.2)', 'Criterios de auditoría'], a: 0, ref: ['une', 16]},
  {k: 'tf', q: 'La evidencia típica de la revisión por la dirección es un acta.', a: true, ref: ['cl810', 6]},
  {k: 'choice', q: 'El estado del plan de tratamiento de riesgos es una entrada de…', opts: ['9.3.2', '7.4', '5.3'], a: 0, ref: ['une', 16]}
 ]
});

T.glossary.push(
  ['Seguimiento y medición', 'Decidir qué, cómo, cuándo y quién mide y analiza (9.1).', ['une', 15]],
  ['Auditoría interna', 'Auditoría de primera parte para comprobar si el SGSI cumple y es eficaz (9.2).', ['une', 15]],
  ['Programa de auditoría', 'Conjunto de auditorías planificadas con frecuencia, métodos, responsables e informes (9.2.2).', ['une', 15]],
  ['Auditoría de tercera parte', 'La hace una entidad independiente, por ejemplo un organismo de certificación.', ['ucaud', 3]],
  ['Evidencia objetiva', 'Hechos verificables: registros, declaraciones u observaciones.', ['ucaud', 9]],
  ['Hallazgo de auditoría', 'Resultado de comparar la evidencia con los criterios.', ['ucaud', 9]],
  ['Revisión por la dirección', 'La alta dirección revisa el SGSI con unas entradas fijadas y decide mejoras (9.3).', ['une', 16]]
);
})();
