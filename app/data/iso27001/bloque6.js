/* ISO/IEC 27001:2022 — Bloque 6 · Cláusula 10 (Mejora).
   Contenido propio. Citas: texto de la norma (cláusula 10), UC de evaluación del desempeño y mejora
   y la clase de cláusulas 8-10. Ejemplos con el caso propio Albatrel. */
(function () {
const T = ATLAS.track('iso27001');

const m6 = T.modules.find(m => m.id === 'm6');
Object.assign(m6, {soon: false, s: 'Mejorar siempre: no conformidades, causa raíz y acciones correctivas', units: ['u25', 'u26', 'u27', 'u28']});

const U = (u) => { T.units[u.id] = u; };

/* ═════════════ Unidad 25 · 10.1 ═════════════ */
U({id: 'u25', n: 25, t: 'Mejorar siempre', icon: 'trending-up', mins: 9, clauses: ['10.1'],
 s: 'Cláusula 10.1: el SGSI tiene que ser cada vez más idóneo, adecuado y eficaz.',
 lesson: [
  {k: 'Cláusula 10', t: 'La «A» del PDCA', body: [
    'La cláusula 10 es la fase **Actuar**: con lo que has medido, auditado y revisado (cláusula 9), decides qué cambiar y vuelves a planificar.',
    {dia: 'pdca'}],
   plain: 'Una no conformidad no es un fracaso: es el motor del sistema.',
   refs: [['cl810', 7], ['uceval', 13]]},
  {k: '10.1', t: 'Mejora continua', body: [
    'La organización debe mejorar **de forma continua** tres cualidades del SGSI:',
    {ul: [['I', '<b>Idoneidad</b>: ¿sigue encajando con la organización y su contexto?'], ['A', '<b>Adecuación</b>: ¿cubre lo que tiene que cubrir?'], ['E', '<b>Eficacia</b>: ¿consigue los resultados previstos?']]}],
   exam: 'Idoneidad, adecuación y eficacia: las mismas tres palabras aparecen en la revisión por la dirección (9.3).',
   refs: [['une', 17], ['uceval', 12]]},
  {check: true, k: 'tf', q: 'La mejora continua solo se exige si la auditoría encuentra no conformidades.', a: false, why: 'Se exige siempre: mejorar de forma continua es un requisito en sí mismo (10.1).', ref: ['une', 17]},
  {k: '¿De dónde salen las mejoras?', t: 'Las fuentes de la mejora', body: [
    {ul: [['i:chart-column', 'Los <b>resultados de la medición</b> (9.1): un indicador que empeora.'], ['i:scan-search', 'Las <b>auditorías</b> (9.2): no conformidades y oportunidades de mejora.'], ['i:crown', 'Las <b>salidas de la revisión por la dirección</b> (9.3).'], ['i:swords', 'Los <b>incidentes</b> y lo aprendido de ellos.'], ['i:users', 'Las <b>quejas y sugerencias</b> de clientes y personal.']]}],
   plain: 'El material del curso insiste en usar las salidas del análisis, la evaluación y la revisión por la dirección para decidir qué mejorar.',
   refs: [['uceval', 12]]},
  {k: '¡Ojo con la numeración!', t: '10.1 y 10.2 cambiaron de orden', added: true, body: [
    {table: {head: ['Apartado', 'ISO 27001:2013', 'ISO 27001:2022'], rows: [['10.1', 'No conformidad y acción correctiva', 'Mejora continua'], ['10.2', 'Mejora continua', 'No conformidad y acción correctiva']]}}],
   exam: 'Algunos apuntes (por ejemplo, la UC de evaluación del curso) usan aún la numeración de 2013. En el examen de la versión 2022: **10.1 = mejora continua** y **10.2 = no conformidad y acción correctiva**.',
   refs: [['une', 17], ['uceval', 10]]},
  {check: true, k: 'choice', q: 'En la ISO/IEC 27001:2022, ¿qué apartado es «No conformidad y acción correctiva»?', opts: ['10.2', '10.1', '9.3'], a: 0, ref: ['une', 17]},
  {k: 'Tu caso', t: 'El registro de mejoras de Albatrel', body: [
    {ul: [['i:lightbulb', '<b>MJ-01</b>: automatizar el aviso de la prueba mensual de restauración (sale de la auditoría interna).'], ['i:lightbulb', '<b>MJ-02</b>: un segundo canal de alertas para la sede electrónica en periodo de pago (sale de un indicador).'], ['i:lightbulb', '<b>MJ-03</b>: guía rápida de phishing para las clínicas (sale de una sugerencia).']]}],
   case: 'No todo es una no conformidad: estas mejoras no corrigen un incumplimiento, pero hacen el SGSI más eficaz. El Comité las prioriza cada trimestre.'}
 ],
 labs: [
  {id: 'u25l1', t: 'Mejora continua', items: [
    {k: 'match', q: 'Une cada cualidad con su pregunta.', pairs: [['Idoneidad', '¿Encaja con la organización y su contexto?'], ['Adecuación', '¿Cubre lo que tiene que cubrir?'], ['Eficacia', '¿Consigue los resultados previstos?']], ref: ['une', 17]},
    {k: 'classify', q: '¿Fuente de mejora o no?', buckets: [{t: 'Fuente de mejora', c: '#34c759'}, {t: 'No lo es', c: '#8e8e93'}], items: [['Un indicador que empeora', 0], ['Una oportunidad de mejora de auditoría', 0], ['Una queja de una clínica', 0], ['El color corporativo de la web', 1]], ref: ['uceval', 12]},
    {k: 'choice', q: 'La cláusula 10 corresponde a la fase…', opts: ['Actuar', 'Verificar', 'Planificar'], a: 0, ref: ['cl810', 7]},
    {k: 'tf', q: 'Las salidas de la revisión por la dirección sirven para decidir mejoras.', a: true, ref: ['uceval', 12]}
  ]}
 ],
 boss: [
  {k: 'choice', q: '¿Qué tres cualidades del SGSI hay que mejorar de forma continua?', opts: ['Idoneidad, adecuación y eficacia', 'Coste, rapidez y tamaño', 'Confidencialidad, integridad y disponibilidad'], a: 0, ref: ['une', 17]},
  {k: 'choice', q: 'En la versión 2022, «Mejora continua» es el apartado…', opts: ['10.1', '10.2', '9.1'], a: 0, ref: ['une', 17]},
  {k: 'tf', q: 'Una oportunidad de mejora es lo mismo que una no conformidad.', a: false, why: 'Una oportunidad de mejora no incumple ningún requisito; una no conformidad sí.', ref: ['uceval', 11]},
  {k: 'choice', q: '¿Qué fase del PDCA cubre la cláusula 10?', opts: ['Actuar', 'Hacer', 'Verificar'], a: 0, ref: ['cl810', 7]},
  {k: 'tf', q: 'Los incidentes y lo aprendido de ellos son una fuente de mejora.', a: true, ref: ['uceval', 12]},
  {k: 'choice', q: 'Según la clase, una no conformidad es…', opts: ['El motor del sistema', 'Un fracaso que hay que ocultar', 'Un motivo para retirar el certificado'], a: 0, ref: ['cl810', 7]}
 ]
});

/* ═════════════ Unidad 26 · 10.2 (reaccionar) ═════════════ */
U({id: 'u26', n: 26, t: 'Cuando algo falla', icon: 'triangle-alert', mins: 10, clauses: ['10.2'],
 s: 'Cláusula 10.2: qué es una no conformidad y cómo reaccionar antes de buscar la causa.',
 lesson: [
  {k: 'Definición', t: '¿Qué es una no conformidad?', body: [
    'Una **no conformidad (NC)** es el **incumplimiento de un requisito**: de la norma, de la propia organización (su política, un procedimiento), de la ley o de un contrato.'],
   plain: 'Si la normativa dice «las copias se prueban cada mes» y en marzo no se probaron, eso es una no conformidad.',
   refs: [['uceval', 11], ['une', 17]]},
  {k: 'Origen', t: 'De dónde salen las NC', body: [
    {ul: [['i:scan-search', 'Auditorías internas y externas.'], ['i:chart-column', 'Seguimiento y medición: un control que no se ejecuta.'], ['i:swords', 'Incidentes que revelan que algo no se cumplía.'], ['i:users', 'Quejas de clientes o partes interesadas.'], ['i:crown', 'La revisión por la dirección.']]}],
   exam: 'El material del curso recuerda que también las **quejas** pueden originar no conformidades.',
   refs: [['uceval', 11]]},
  {check: true, k: 'tf', q: 'Una queja de un cliente puede dar lugar a una no conformidad.', a: true, ref: ['uceval', 11]},
  {k: '10.2 a)', t: 'Primero, reaccionar', body: [
    'Cuando aparece una NC, la organización debe reaccionar y, según proceda:',
    {ul: [['1', '<b>Controlarla y corregirla</b>: que deje de causar daño ya.'], ['2', '<b>Hacer frente a las consecuencias</b>: lo que ya ha provocado.']]}],
   plain: 'Es apagar el fuego. Todavía no hemos preguntado por qué empezó.',
   refs: [['une', 17], ['cl810', 7]]},
  {k: 'Vocabulario', t: 'Corrección no es acción correctiva', body: [
    {ul: [['C', '<b>Corrección</b>: arregla el efecto. Ejemplo: hacer hoy la prueba de restauración que faltó.'], ['AC', '<b>Acción correctiva</b>: elimina la <b>causa</b> para que no se repita. Ejemplo: que la prueba tenga responsable, calendario y aviso automático.']]}],
   exam: 'La acción correctiva es la acción para **eliminar la causa** de una no conformidad y evitar que vuelva a ocurrir.',
   refs: [['uceval', 11]]},
  {check: true, k: 'classify', q: '¿Corrección o acción correctiva?', buckets: [{t: 'Corrección', c: '#ff9f0a'}, {t: 'Acción correctiva', c: '#34c759'}], items: [['Restaurar hoy la copia que no se probó', 0], ['Dar de baja ahora la cuenta olvidada de un exempleado', 0], ['Que RR. HH. avise a sistemas de cada salida con una lista de comprobación', 1], ['Programar un aviso automático para la prueba mensual', 1]], ref: ['uceval', 11]},
  {k: 'Preventiva', t: '¿Y las acciones preventivas?', added: true, body: [
    'La versión 2022 no tiene un apartado de «acciones preventivas». Prevenir ya está dentro del sistema: es lo que hacen la **gestión de riesgos** (6.1 y 8.2-8.3) y la revisión de si **existen o podrían ocurrir NC similares** (10.2 b).'],
   refs: [['une', 17]]},
  {k: 'Tu caso', t: 'NC-2026-03 en Albatrel', body: [
    'En la auditoría interna, el auditor encuentra que en marzo y abril **no se hizo la prueba de restauración** que exige NOR-02.',
    {ul: [['i:siren', '<b>Reacción</b>: el Responsable del Sistema restaura ese mismo día una muestra de las copias del padrón y de las historias clínicas.'], ['i:check', '<b>Consecuencias</b>: las restauraciones salen bien; no hubo datos perdidos.']]}],
   case: 'Esto es la corrección. La NC sigue abierta: falta saber por qué pasó (unidad 27).'}
 ],
 labs: [
  {id: 'u26l1', t: 'Reaccionar', items: [
    {k: 'choice', q: 'Una no conformidad es…', opts: ['El incumplimiento de un requisito', 'Cualquier incidente', 'Una sugerencia de mejora'], a: 0, ref: ['uceval', 11]},
    {k: 'order', q: 'Ordena la reacción ante una NC.', items: ['Detectar la no conformidad', 'Controlarla y corregirla', 'Hacer frente a las consecuencias', 'Analizar la causa'], ref: ['une', 17]},
    {k: 'classify', q: '¿Es una no conformidad?', buckets: [{t: 'Sí', c: '#ff3b30'}, {t: 'No', c: '#8e8e93'}], items: [['No se revisan los accesos como dice NOR-01', 0], ['El acta de la revisión por la dirección no existe', 0], ['Sería útil una guía de phishing para clínicas', 1], ['Un procedimiento cumple, pero se podría simplificar', 1]], ref: ['uceval', 11]},
    {k: 'tf', q: 'Corregir el efecto de una NC basta para cerrarla.', a: false, why: 'Además hay que evaluar la causa y, si procede, tomar una acción correctiva.', ref: ['une', 17]}
  ]}
 ],
 boss: [
  {k: 'choice', q: 'La acción tomada para eliminar la causa de una no conformidad es la…', opts: ['Acción correctiva', 'Corrección', 'Observación'], a: 0, ref: ['uceval', 11]},
  {k: 'tf', q: 'Ante una NC lo primero es reaccionar: controlarla, corregirla y atender sus consecuencias.', a: true, ref: ['une', 17]},
  {k: 'choice', q: 'Restaurar hoy la copia que no se probó es una…', opts: ['Corrección', 'Acción correctiva', 'Mejora continua'], a: 0, ref: ['uceval', 11]},
  {k: 'tf', q: 'La ISO 27001:2022 tiene un apartado propio de acciones preventivas.', a: false, why: 'Prevenir se hace con la gestión de riesgos y revisando si pueden aparecer NC similares.', ref: ['une', 17]},
  {k: 'choice', q: '¿Cuál NO es una fuente habitual de no conformidades?', opts: ['El horóscopo del mes', 'Una auditoría interna', 'Una queja de un cliente'], a: 0, ref: ['uceval', 11]},
  {k: 'choice', q: 'Una NC puede incumplir un requisito…', opts: ['De la norma, de la organización, legal o contractual', 'Solo de la norma', 'Solo legal'], a: 0, ref: ['uceval', 11]}
 ]
});

/* ═════════════ Unidad 27 · 10.2 (causa raíz) ═════════════ */
U({id: 'u27', n: 27, t: 'La causa raíz', icon: 'search', mins: 11, clauses: ['10.2'],
 s: 'Cláusula 10.2 b): revisar la NC, encontrar su causa y ver si hay otras parecidas.',
 lesson: [
  {k: '10.2 b)', t: '¿Hace falta actuar sobre la causa?', body: [
    'La organización debe **evaluar la necesidad** de acciones para eliminar las causas, para que la NC no se repita ni ocurra en otra parte. Para ello:',
    {ul: [['1', '<b>Revisar y analizar</b> la no conformidad.'], ['2', '<b>Determinar sus causas</b>.'], ['3', 'Ver si <b>existen NC similares</b> o si <b>podrían ocurrir</b>.']]}],
   plain: 'No te quedes en el síntoma. Pregunta por qué, y mira si el mismo fallo está escondido en otro sitio.',
   refs: [['une', 17], ['cl810', 7]]},
  {check: true, k: 'tf', q: '10.2 pide comprobar si existen o podrían ocurrir no conformidades similares.', a: true, ref: ['une', 17]},
  {k: 'Herramienta', t: 'Los 5 porqués', web: {src: 'ASQ · Five whys', url: 'https://asq.org/quality-resources/five-whys'}, body: [
    'Se pregunta «¿por qué?» varias veces (unas cinco) hasta llegar a algo que, si se cambia, evita que se repita.',
    {ul: [['1', '¿Por qué no se probó la copia? <i>Porque nadie la hizo en marzo y abril.</i>'], ['2', '¿Por qué nadie? <i>Porque la persona que la hacía estaba de baja.</i>'], ['3', '¿Por qué nadie la sustituyó? <i>Porque la tarea no tenía suplente asignado.</i>'], ['4', '¿Por qué no lo tenía? <i>Porque NOR-02 dice «se prueba cada mes», pero no quién ni cómo se avisa.</i>'], ['5', 'Causa raíz: <b>la tarea depende de una persona y no tiene responsable, suplente ni aviso</b>.']]}],
   refs: []},
  {check: true, k: 'order', q: 'Ordena los porqués de Albatrel, del síntoma a la causa raíz.', items: ['No se probó la copia en marzo y abril', 'La persona responsable estaba de baja', 'La tarea no tenía suplente', 'NOR-02 no fija responsable ni aviso'], ref: ['une', 17]},
  {k: 'Herramienta', t: 'El diagrama de espina de pescado', web: {src: 'ASQ · Fishbone diagram', url: 'https://asq.org/quality-resources/fishbone'}, body: [
    'También llamado **diagrama de Ishikawa**. Agrupa las posibles causas por familias para no olvidar ninguna. Adaptado a un SGSI:',
    {ul: [['i:users', '<b>Personas</b>: formación, carga, suplencias.'], ['i:list-ordered', '<b>Procesos</b>: procedimientos poco claros.'], ['i:server', '<b>Tecnología</b>: herramientas, automatización.'], ['i:building-2', '<b>Proveedores</b>: contratos, servicios externos.'], ['i:chart-column', '<b>Medición</b>: nadie lo vigilaba.'], ['i:globe', '<b>Entorno</b>: cambios externos, temporadas.']]}],
   refs: []},
  {check: true, k: 'classify', q: 'Clasifica cada causa en su espina.', buckets: [{t: 'Personas', c: '#5e5ce6'}, {t: 'Procesos', c: '#ff9f0a'}, {t: 'Tecnología', c: '#30b0c7'}], items: [['Nadie sabía que tenía que sustituirle', 0], ['La normativa no dice quién hace la prueba', 1], ['No hay aviso automático en el calendario', 2], ['El técnico nuevo no conocía NOR-02', 0]]},
  {k: 'Tu caso', t: '¿Hay NC parecidas en Albatrel?', body: [
    'El Responsable de Seguridad revisa otras tareas periódicas que dependen de una sola persona:',
    {ul: [['i:lock', '<b>Revisión trimestral de accesos</b> (NOR-01): también sin suplente.'], ['i:server', '<b>Revisión de registros del cortafuegos</b>: hecha, pero sin evidencia guardada.']]}],
   case: 'Así cumple 10.2 b): no se queda en las copias; amplía la acción a todas las tareas periódicas del SGSI.'}
 ],
 labs: [
  {id: 'u27l1', t: 'Buscar la causa', items: [
    {k: 'order', q: 'Ordena lo que pide 10.2 b).', items: ['Revisar y analizar la NC', 'Determinar sus causas', 'Ver si hay o puede haber NC similares'], ref: ['une', 17]},
    {k: 'choice', scenario: 'Un portátil sin cifrar se pierde. El técnico lo cifró mal porque la guía tenía un paso equivocado.', q: '¿Cuál es la causa raíz?', opts: ['La guía de cifrado tenía un error', 'Se perdió un portátil', 'El usuario es despistado'], a: 0},
    {k: 'match', q: 'Une cada herramienta con su idea.', pairs: [['5 porqués', 'Preguntar por qué hasta llegar a la causa'], ['Espina de pescado', 'Agrupar causas por familias'], ['Revisar NC similares', 'Buscar el mismo fallo en otras partes']], ref: ['une', 17]},
    {k: 'tf', q: 'Si la causa raíz es «error humano», ya no hay nada más que analizar.', a: false, why: 'Casi siempre hay algo detrás: falta de formación, de suplente, de automatización o un procedimiento confuso.'}
  ]}
 ],
 boss: [
  {k: 'choice', q: '10.2 pide evaluar la necesidad de acciones para…', opts: ['Eliminar las causas de la NC', 'Ocultar la NC al auditor', 'Cambiar de auditor'], a: 0, ref: ['une', 17]},
  {k: 'tf', q: 'Determinar las causas de la no conformidad forma parte de 10.2.', a: true, ref: ['une', 17]},
  {k: 'choice', q: 'El diagrama de Ishikawa también se llama…', opts: ['Espina de pescado', 'Matriz de riesgos', 'Diagrama de Gantt'], a: 0},
  {k: 'choice', q: 'Buscar si el mismo fallo se da en otros procesos responde a…', opts: ['Ver si existen o podrían ocurrir NC similares', 'La mejora continua de 10.1', 'La revisión por la dirección'], a: 0, ref: ['une', 17]},
  {k: 'tf', q: 'Los 5 porqués consisten en preguntar «¿por qué?» varias veces hasta llegar a la causa.', a: true},
  {k: 'choice', q: 'La causa raíz de la NC de copias de Albatrel era…', opts: ['La tarea no tenía responsable, suplente ni aviso', 'Falta de disco', 'Un ataque de ransomware'], a: 0}
 ]
});

/* ═════════════ Unidad 28 · 10.2 (cerrar el ciclo) ═════════════ */
U({id: 'u28', n: 28, t: 'Cerrar el círculo', icon: 'refresh-cw', mins: 11, clauses: ['10.2'],
 s: 'Cláusula 10.2 c) a g): implantar, comprobar la eficacia, ajustar el SGSI y guardar la evidencia.',
 lesson: [
  {k: '10.2 · el proceso completo', t: 'Seis pasos para cerrar una NC', body: [
    {dia: 'flow', items: ['Reaccionar', 'Causa raíz', 'Implantar', 'Eficacia', 'Cambiar el SGSI', 'Registrar']},
    {ul: [['1', 'Reaccionar y contener.'], ['2', 'Evaluar la necesidad de eliminar la causa raíz.'], ['3', 'Implantar las acciones necesarias.'], ['4', 'Revisar la eficacia de las acciones tomadas.'], ['5', 'Actualizar los riesgos y el SGSI si hace falta.'], ['6', 'Conservar la información documentada.']]}],
   refs: [['cl810', 7], ['une', 17]]},
  {k: 'Eficacia', t: '¿Funcionó de verdad?', body: [
    'No basta con hacer la acción: hay que **revisar su eficacia**. Se deja pasar un tiempo razonable y se comprueba con evidencias que la NC no se ha repetido.'],
   plain: 'Cerrar una NC el mismo día que se abre suele ser mala señal: aún no puedes saber si la acción funciona.',
   refs: [['une', 17]]},
  {check: true, k: 'tf', q: 'Una acción correctiva se puede dar por eficaz en cuanto se implanta, sin comprobar nada más.', a: false, why: '10.2 pide revisar la eficacia de las acciones tomadas.', ref: ['une', 17]},
  {k: 'Proporción', t: 'Acciones a la medida del problema', body: [
    'Las acciones correctivas deben ser **adecuadas a los efectos** de la NC. Un documento con la fecha vencida no necesita un comité extraordinario; una caída de la sede electrónica, sí.',
    'Y si hace falta, se **cambia el SGSI**: los riesgos, un procedimiento, la formación…'],
   refs: [['une', 17], ['uceval', 11]]},
  {k: '10.2 · evidencia', t: 'Qué hay que guardar', body: [
    {ul: [['f', 'La <b>naturaleza</b> de la NC y las <b>acciones</b> tomadas después.'], ['g', 'Los <b>resultados</b> de cualquier acción correctiva.']]},
    'En la práctica, un **registro de no conformidades** con una ficha por NC.'],
   exam: 'Es información documentada obligatoria: el auditor pedirá ver el registro de NC y acciones correctivas.',
   refs: [['une', 17]]},
  {check: true, k: 'choice', q: '¿Qué información documentada pide 10.2?', opts: ['La naturaleza de la NC, las acciones y sus resultados', 'Solo el nombre del auditor', 'Nada, basta con hablarlo'], a: 0, ref: ['une', 17]},
  {k: 'Tu caso', t: 'La ficha NC-2026-03 de Albatrel', body: [
    {table: {head: ['Campo', 'Contenido'], rows: [
      ['Origen', 'Auditoría interna, mayo 2026'],
      ['Descripción', 'No hay pruebas de restauración de marzo ni abril (NOR-02)'],
      ['Corrección', 'Prueba de restauración el mismo día: correcta'],
      ['Causa raíz', 'Tarea sin responsable, suplente ni aviso'],
      ['Acción correctiva', 'NOR-02 fija responsable y suplente; aviso automático mensual; misma regla para todas las tareas periódicas'],
      ['Responsable y plazo', 'Responsable del Sistema · junio 2026'],
      ['Eficacia', 'Revisada en septiembre: 3 pruebas seguidas hechas a tiempo. Cerrada']]}}],
   case: 'Todo esto se gestiona con PRO-03, el procedimiento de no conformidades de Albatrel. Puedes construirlo en el caso.'},
  {k: 'Y vuelta a empezar', t: 'El PDCA nunca termina', body: [
    'Las acciones correctivas y las mejoras entran en el siguiente ciclo: nuevos riesgos, objetivos y controles (Planificar), y otra vez Hacer, Verificar y Actuar.',
    {dia: 'flow', items: ['Planificar', 'Hacer', 'Verificar', 'Actuar', 'Planificar…']}],
   plain: 'La mejora continua se demuestra con ciclos PDCA sucesivos.',
   refs: [['cl810', 7], ['uceval', 13]]}
 ],
 labs: [
  {id: 'u28l1', t: 'Cerrar la NC', items: [
    {k: 'order', q: 'Ordena el proceso de 10.2 tal como lo resume la clase.', items: ['Reaccionar y contener', 'Evaluar la causa raíz', 'Implantar las acciones', 'Revisar su eficacia', 'Actualizar riesgos y SGSI', 'Conservar la información documentada'], ref: ['cl810', 7]},
    {k: 'match', q: 'Une cada campo de la ficha NC-2026-03 con su contenido.', pairs: [['Corrección', 'Prueba de restauración el mismo día'], ['Causa raíz', 'Tarea sin responsable ni suplente'], ['Acción correctiva', 'Responsable, suplente y aviso automático'], ['Eficacia', '3 pruebas seguidas a tiempo']]},
    {k: 'choice', scenario: 'Albatrel cierra una NC el mismo día en que implanta la acción correctiva.', q: '¿Qué le falta?', opts: ['Revisar la eficacia con el tiempo', 'Comprar un software nuevo', 'Avisar a la prensa'], a: 0, ref: ['une', 17]},
    {k: 'tf', q: 'Las acciones correctivas deben ser adecuadas a los efectos de la no conformidad.', a: true, ref: ['une', 17]}
  ]},
  {id: 'u28l2', t: 'Repaso del bloque', items: [
    {k: 'classify', q: '¿10.1 o 10.2 (versión 2022)?', buckets: [{t: '10.1 Mejora continua', c: '#34c759'}, {t: '10.2 NC y acción correctiva', c: '#ff9f0a'}], items: [['Mejorar idoneidad, adecuación y eficacia', 0], ['Determinar la causa de la NC', 1], ['Revisar la eficacia de las acciones', 1], ['Mejorar aunque no haya fallos', 0]], ref: ['une', 17]},
    {k: 'classify', q: 'Corrección, acción correctiva o mejora.', buckets: [{t: 'Corrección', c: '#ff9f0a'}, {t: 'Acción correctiva', c: '#34c759'}, {t: 'Mejora', c: '#5e5ce6'}], items: [['Restaurar hoy la copia', 0], ['Asignar responsable y suplente a la tarea', 1], ['Guía de phishing para clínicas (sin incumplimiento)', 2]]},
    {k: 'tf', q: 'Si una NC muestra un riesgo nuevo, puede que haya que actualizar el análisis de riesgos.', a: true, ref: ['cl810', 7]}
  ]}
 ],
 boss: [
  {k: 'choice', q: '¿Qué hay que hacer después de implantar una acción correctiva?', opts: ['Revisar su eficacia', 'Nada más', 'Borrar el registro'], a: 0, ref: ['une', 17]},
  {k: 'tf', q: 'Si hace falta, 10.2 pide hacer cambios en el SGSI.', a: true, ref: ['une', 17]},
  {k: 'choice', q: 'El registro de no conformidades guarda…', opts: ['La NC, las acciones tomadas y sus resultados', 'Solo las NC mayores', 'Las contraseñas de los auditores'], a: 0, ref: ['une', 17]},
  {k: 'choice', q: 'Cerrar una NC el mismo día que se abre suele indicar que…', opts: ['Aún no se ha podido comprobar la eficacia', 'Se ha hecho todo perfecto', 'La NC era una observación'], a: 0, ref: ['une', 17]},
  {k: 'tf', q: 'La mejora continua se demuestra con ciclos PDCA sucesivos.', a: true, ref: ['cl810', 7]},
  {k: 'choice', q: 'Tras la fase Actuar, el PDCA…', opts: ['Vuelve a Planificar', 'Termina para siempre', 'Pasa a la certificación y se detiene'], a: 0, ref: ['cl810', 7]}
 ]
});

T.glossary.push(
  ['Mejora continua', 'Mejorar de forma continua la idoneidad, adecuación y eficacia del SGSI (10.1).', ['une', 17]],
  ['Corrección', 'Acción para eliminar el efecto de una no conformidad detectada.', ['uceval', 11]],
  ['Acción correctiva', 'Acción para eliminar la causa de una no conformidad y evitar que se repita (10.2).', ['uceval', 11]],
  ['Causa raíz', 'El origen de una no conformidad: lo que, si se cambia, evita que vuelva a ocurrir.', ['cl810', 7]],
  ['Eficacia de una acción', 'Comprobar con evidencias, pasado un tiempo, que la NC no se ha repetido.', ['une', 17]]
);
})();
