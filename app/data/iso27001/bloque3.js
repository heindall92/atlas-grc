/* ISO/IEC 27001:2022 — Bloque 3 · Cláusula 7 (Soporte): recursos, competencia, concienciación,
   comunicación e información documentada.
   Fuentes: texto de la norma (págs. 12-14 del PDF), UC del curso, Sesión 3, plantillas del curso
   (POL-SI-01 y PRO-SI-03) Ejemplos aplicados al caso PROPIO Albatrel. */
(function () {
const T = ATLAS.track('iso27001');

Object.assign(T.docs, {
  pro3: {s: 'Ejemplo PRO-SI-03 del curso', t: 'PRO-SI-03 · Ejemplo de procedimiento del cuerpo normativo (curso)'}
});

const m3 = T.modules.find(m => m.id === 'm3');
Object.assign(m3, {soon: false, s: 'Recursos, competencia, concienciación, comunicación e información documentada', units: ['u13', 'u14', 'u15', 'u16']});

const U = (u) => { T.units[u.id] = u; };

/* ═════════════ Unidad 13 · 7.1 y 7.2 ═════════════ */
U({id: 'u13', n: 13, t: 'Recursos y competencia', icon: 'graduation-cap', mins: 9, clauses: ['7.1', '7.2'],
 s: 'Cláusulas 7.1 y 7.2: poner los medios y asegurarse de que quien hace tareas de seguridad sabe hacerlas.',
 lesson: [
  {k: 'Cláusula 7', t: 'Soporte: lo que hace falta para que todo funcione', body: [
    'La cláusula 7 pertenece a la fase **Hacer** del PDCA. Son los cimientos sobre los que se apoya el SGSI:',
    {ul: [['7.1', 'Recursos.'], ['7.2', 'Competencia.'], ['7.3', 'Concienciación.'], ['7.4', 'Comunicación.'], ['7.5', 'Información documentada.']]}],
   plain: 'Puedes tener la mejor política del mundo, pero sin gente preparada, sin presupuesto y sin papeles en orden, no funciona.',
   refs: [['une', 12], ['ucrev', 10]]},
  {k: '7.1', t: 'Recursos', body: [
    'La organización debe **determinar y proporcionar** los recursos necesarios para establecer, implementar, mantener y mejorar el SGSI.',
    'Recursos son personas, tiempo, presupuesto, herramientas e instalaciones. Enlaza con 5.1 c): la alta dirección asegura que estén disponibles.'],
   case: 'Albatrel reservará en su presupuesto anual horas de su Responsable de Seguridad, una herramienta de copias con pruebas de restauración y la formación del equipo.',
   refs: [['une', 12], ['une', 7]]},
  {k: '7.2', t: 'Competencia: saber hacer', body: [
    {ul: [['a', '<b>Determinar</b> la competencia que necesita quien hace trabajos que afectan a la seguridad.'], ['b', '<b>Asegurar</b> que esas personas son competentes (por educación, formación o experiencia).'], ['c', 'Si falta, <b>actuar</b> (formar, tutorizar, reasignar o contratar) y <b>evaluar si funcionó</b>.'], ['d', '<b>Conservar evidencia</b> documentada de la competencia.']]}],
   exam: 'Ojo al punto c): no basta con dar un curso; hay que evaluar la eficacia de la formación.',
   refs: [['une', 12]]},
  {check: true, k: 'order', q: 'Ordena lo que pide 7.2.', items: ['Determinar la competencia necesaria', 'Asegurar que las personas son competentes', 'Actuar si falta y evaluar la eficacia', 'Conservar la evidencia'], ref: ['une', 12]},
  {k: 'Evidencia', t: 'Cómo se demuestra la competencia', body: [
    'Ante un auditor, la competencia se demuestra con **registros**: títulos, certificados, actas de formación, evaluaciones, CV, planes de carrera.',
    'Como dice el profesor: un control sin evidencia es un **control invisible** para el auditor.'],
   case: 'Albatrel guardará en una carpeta controlada el certificado de su Responsable de Seguridad (por ejemplo, el ISO 27001 Foundation que tú estás preparando) y las actas de formación técnica.',
   refs: [['s3', 24]]},
  {check: true, k: 'tf', q: 'Contratar a una persona ya formada es una acción válida para adquirir competencia.', a: true, why: 'La nota de 7.2 cita formación, tutoría, reasignación o contratación.', ref: ['une', 12]},
  {k: 'Ejemplo', t: 'Cómo lo organiza una política real', cls: 'En la plantilla de política del curso, el Responsable de Seguridad y RR. HH. identifican la competencia de cada rol, dan la formación, evalúan su eficacia y conservan evidencias; los roles técnicos reciben formación especializada al menos una vez al año.', body: [
    'Fíjate en que la plantilla repite los cuatro verbos de 7.2: identificar, formar, evaluar y conservar.'],
   refs: [['pol', 1]]}
 ],
 labs: [
  {id: 'u13l1', t: 'Recursos y competencia', items: [
    {k: 'match', q: 'Une cada letra de 7.2 con lo que pide.', pairs: [['a', 'Determinar la competencia necesaria'], ['b', 'Asegurar que las personas son competentes'], ['c', 'Actuar y evaluar la eficacia'], ['d', 'Conservar la evidencia']], ref: ['une', 12]},
    {k: 'classify', q: '¿Sirve como evidencia de competencia?', buckets: [{t: 'Sí, es evidencia', c: '#34c759'}, {t: 'No sirve', c: '#ff3b30'}], items: [['Certificado de un curso de seguridad', 0], ['Acta de formación firmada', 0], ['Evaluación tras la formación', 0], ['«Me lo dijo de palabra»', 1], ['Un correo de bienvenida sin contenido', 1]], ref: ['une', 12]},
    {k: 'choice', q: 'Tras formar al equipo en copias de seguridad, ¿qué más pide 7.2 c)?', opts: ['Evaluar la eficacia de la formación', 'Nada más', 'Repetirla cada semana'], a: 0, ref: ['une', 12]},
    {k: 'choice', q: '¿En qué fase del PDCA está la cláusula 7?', opts: ['Hacer', 'Planificar', 'Verificar'], a: 0, ref: ['ucimp', 7]}
  ]}
 ],
 boss: [
  {k: 'choice', q: 'La cláusula 7.1 trata de…', opts: ['Recursos', 'Competencia', 'Comunicación'], a: 0, ref: ['une', 12]},
  {k: 'tf', q: 'La competencia se puede basar en educación, formación o experiencia.', a: true, ref: ['une', 12]},
  {k: 'choice', q: '¿Qué debe conservarse según 7.2 d)?', opts: ['Evidencia documentada de la competencia', 'El sueldo de cada persona', 'Las contraseñas'], a: 0, ref: ['une', 12]},
  {k: 'tf', q: 'Basta con dar formación; no hace falta evaluar si funcionó.', a: false, ref: ['une', 12]},
  {k: 'choice', q: 'Reasignar a una persona a otro puesto para cubrir una competencia es…', opts: ['Una acción válida según la nota de 7.2', 'Una no conformidad', 'Algo prohibido'], a: 0, ref: ['une', 12]},
  {k: 'tf', q: 'Un control sin evidencia es invisible para el auditor.', a: true, ref: ['s3', 24]}
 ]
});

/* ═════════════ Unidad 14 · 7.3 ═════════════ */
U({id: 'u14', n: 14, t: 'Concienciación', icon: 'lightbulb', mins: 9, clauses: ['7.3'],
 s: 'Cláusula 7.3: que todo el personal sepa qué dice la política, cómo contribuye y qué pasa si no cumple.',
 lesson: [
  {k: '7.3', t: 'Tres cosas que todos deben saber', body: [
    'Las personas que trabajan bajo el control de la organización deben ser conscientes de:',
    {ul: [['a', 'La <b>política</b> de seguridad.'], ['b', 'Su <b>contribución</b> a la eficacia del SGSI y los beneficios de mejorar.'], ['c', 'Las <b>implicaciones de no cumplir</b>.']]}],
   plain: 'Política, «para qué sirvo yo aquí» y «qué pasa si me lo salto». Esas tres.',
   refs: [['une', 12]]},
  {k: 'Diferencia', t: 'Competencia no es lo mismo que concienciación', body: [
    {ul: [['7.2', '<b>Competencia</b>: para quien hace <b>tareas de seguridad</b>. Saber hacer (por ejemplo, configurar un cortafuegos).'], ['7.3', '<b>Concienciación</b>: para <b>todo el personal</b>. Saber por qué importa y qué se espera de mí (por ejemplo, no abrir un adjunto sospechoso).']]}],
   exam: 'Si la pregunta habla de «todo el personal» y de «conocer la política», es 7.3. Si habla de «formación técnica de un rol», es 7.2.',
   refs: [['une', 12]]},
  {check: true, k: 'classify', q: '¿Competencia (7.2) o concienciación (7.3)?', buckets: [{t: '7.2 Competencia', c: '#5e5ce6'}, {t: '7.3 Concienciación', c: '#ff9f0a'}], items: [['Curso de administración segura de servidores', 0], ['Certificación del Responsable de Seguridad', 0], ['Charla a toda la plantilla sobre la política', 1], ['Simulacro de phishing para todos', 1]], ref: ['une', 12]},
  {k: 'Anexo A', t: 'Los controles que lo apoyan', body: [
    {ul: [['6.3', '<b>Concienciación, educación y formación</b>: el personal y las partes interesadas reciben formación adecuada y actualizada.'], ['6.4', '<b>Proceso disciplinario</b>: lo que pasa si no se cumple (la letra c de 7.3).'], ['6.8', '<b>Notificación de eventos</b>: un canal fácil para avisar de algo raro.']]}],
   plain: 'La cláusula 7.3 dice «que lo sepan». Los controles 6.3, 6.4 y 6.8 dicen cómo hacerlo en la práctica.',
   refs: [['une', 22]]},
  {k: 'Tu caso', t: 'El plan de concienciación de Albatrel', body: [
    {ul: [['i:users', 'Sesión de bienvenida sobre la política antes de dar acceso a los sistemas.'], ['i:refresh-cw', 'Refresco anual para toda la plantilla.'], ['i:target', 'Simulacros de phishing cada trimestre, con meta de menos del 5 % de clics.'], ['i:heart', 'Sesión específica para quien atiende a las clínicas: qué son los datos de salud y cómo se tratan.']]}],
   case: 'El indicador «personal con formación anual completada» se medirá en la cláusula 9.1. El curso propone un umbral del 100 %.',
   refs: [['s3', 13]]},
  {check: true, k: 'tf', q: 'La concienciación de 7.3 solo es obligatoria para el departamento de sistemas.', a: false, why: 'Es para todas las personas que trabajan bajo el control de la organización.', ref: ['une', 12]},
  {k: 'Ejemplo', t: 'Cómo lo hace una política real', cls: 'En la plantilla de política del curso: todo el personal recibe formación al incorporarse (antes de acceder a los sistemas) y al menos una vez al año, participa en campañas y simulaciones de phishing, y debe conocer la política, su contribución y las consecuencias de no cumplir.', body: [
    'Fíjate en que la última frase de la plantilla copia casi literalmente las letras a), b) y c) de 7.3.'],
   refs: [['pol', 1]]}
 ],
 labs: [
  {id: 'u14l1', t: 'Concienciar', items: [
    {k: 'match', q: 'Une cada letra de 7.3 con lo que deben conocer las personas.', pairs: [['a', 'La política de seguridad'], ['b', 'Su contribución a la eficacia del SGSI'], ['c', 'Las implicaciones de no cumplir']], ref: ['une', 12]},
    {k: 'choice', scenario: 'Un empleado de Albatrel no sabe que existe una política de seguridad.', q: '¿Qué apartado se incumple?', opts: ['7.3 Concienciación', '7.1 Recursos', '9.2 Auditoría interna'], a: 0, ref: ['une', 12]},
    {k: 'match', q: 'Une cada control del Anexo A con su papel.', pairs: [['6.3', 'Formación y concienciación'], ['6.4', 'Proceso disciplinario'], ['6.8', 'Canal para notificar eventos']], ref: ['une', 22]},
    {k: 'tf', q: 'Un simulacro de phishing es una herramienta típica de concienciación.', a: true, ref: ['pol', 1]}
  ]}
 ],
 boss: [
  {k: 'choice', q: '¿Qué apartado pide que el personal conozca la política?', opts: ['7.3', '7.4', '5.3'], a: 0, ref: ['une', 12]},
  {k: 'tf', q: 'Las personas deben conocer las implicaciones de no cumplir los requisitos del SGSI.', a: true, ref: ['une', 12]},
  {k: 'choice', q: 'La concienciación va dirigida a…', opts: ['Todas las personas bajo el control de la organización', 'Solo a la dirección', 'Solo a los auditores'], a: 0, ref: ['une', 12]},
  {k: 'choice', q: 'El control del Anexo A sobre formación y concienciación es el…', opts: ['6.3', '8.3', '5.3'], a: 0, ref: ['une', 22]},
  {k: 'tf', q: 'Competencia y concienciación son exactamente lo mismo.', a: false, ref: ['une', 12]},
  {k: 'choice', q: 'Un curso técnico para el administrador de cortafuegos corresponde sobre todo a…', opts: ['7.2 Competencia', '7.3 Concienciación', '7.4 Comunicación'], a: 0, ref: ['une', 12]}
 ]
});

/* ═════════════ Unidad 15 · 7.4 ═════════════ */
U({id: 'u15', n: 15, t: 'Comunicación', icon: 'messages-square', mins: 8, clauses: ['7.4'],
 s: 'Cláusula 7.4: decidir qué se comunica, cuándo, con quién y cómo, dentro y fuera de la organización.',
 lesson: [
  {k: '7.4', t: 'Cuatro preguntas', body: [
    'La organización determina la necesidad de comunicaciones **internas y externas** sobre el SGSI, incluyendo:',
    {ul: [['a', '<b>Qué</b> comunicar (el contenido).'], ['b', '<b>Cuándo</b> comunicar.'], ['c', '<b>Con quién</b> comunicar.'], ['d', '<b>Cómo</b> comunicar.']]}],
   plain: 'Qué, cuándo, con quién y cómo. Como planificar los mensajes de un grupo de trabajo antes de que haya un problema.',
   refs: [['une', 12], ['une', 13]]},
  {check: true, k: 'choice', q: 'Albatrel prepara su plan de comunicación. ¿Qué debe decidir según 7.4?', opts: ['Qué comunicar', 'Cuándo comunicar', 'Con quién y cómo', 'Todo lo anterior'], a: 3, why: 'Qué, cuándo, con quién y cómo.', ref: ['une', 13]},
  {k: '¡Ojo, trampa!', t: 'La versión 2013 tenía más preguntas', added: true, body: [
    'En la versión 2013, 7.4 también pedía **quién** debe comunicar y **los procesos** para hacerlo. En la versión 2022 ese texto se quitó: quedan **qué, cuándo, con quién y cómo**.',
    'Muchas organizaciones (y algún material) siguen indicando «quién comunica», y no está mal hacerlo; simplemente ya no es un requisito literal.'],
   exam: 'Si en un material o en un examen ves «quién comunica», es herencia de la versión 2013.',
   refs: [['une', 13]]},
  {k: 'Interna y externa', t: 'Hacia dentro y hacia fuera', body: [
    {ul: [['Int', '<b>Interna</b>: política, cambios en normativas, resultados de auditorías, campañas de concienciación.'], ['Ext', '<b>Externa</b>: clientes, proveedores, autoridades (por ejemplo, notificar una brecha a la AEPD en 72 horas según el RGPD).']]}],
   refs: [['une', 12]]},
  {k: 'Tu caso', t: 'El plan de comunicación de Albatrel', body: [
    {ul: [['i:landmark', '<b>Incidente grave que afecta al padrón</b> → a la Diputación y al ayuntamiento · en cuanto se confirme · el Responsable de Seguridad · por teléfono y después por escrito.'], ['i:heart', '<b>Brecha con datos de salud</b> → a la clínica (responsable del tratamiento) · sin dilación · el DPD · por escrito.'], ['i:users', '<b>Nueva normativa interna</b> → a toda la plantilla · al aprobarse · RR. HH. · por la intranet con acuse de recibo.']]}],
   case: 'Albatrel guarda el plan como una tabla con cuatro columnas: qué, cuándo, con quién y cómo. Añade una quinta, «quién comunica», porque le resulta útil.'},
  {check: true, k: 'tf', q: '7.4 solo trata de la comunicación interna.', a: false, why: 'Habla de comunicaciones internas y externas.', ref: ['une', 12]}
 ],
 labs: [
  {id: 'u15l1', t: 'Plan de comunicación', items: [
    {k: 'match', q: 'Une cada letra de 7.4 con su pregunta.', pairs: [['a', '¿Qué comunico?'], ['b', '¿Cuándo?'], ['c', '¿Con quién?'], ['d', '¿Cómo?']], ref: ['une', 13]},
    {k: 'classify', q: '¿Comunicación interna o externa?', buckets: [{t: 'Interna', c: '#5e5ce6'}, {t: 'Externa', c: '#ff9f0a'}], items: [['Publicar la política en la intranet', 0], ['Informar a la plantilla del resultado de una auditoría', 0], ['Notificar una brecha a la AEPD', 1], ['Avisar a la Diputación de una caída de la sede electrónica', 1], ['Pedir al proveedor de hosting su informe de seguridad', 1]], ref: ['une', 12]},
    {k: 'tf', q: 'En la ISO 27001:2022, «quién debe comunicar» es un requisito literal de 7.4.', a: false, why: 'Estaba en 2013; en 2022 quedan qué, cuándo, con quién y cómo.', ref: ['une', 13]},
    {k: 'choice', q: 'Según el RGPD, una brecha de datos personales se notifica a la AEPD en…', opts: ['72 horas', '30 días', '1 año'], a: 0}
  ]}
 ],
 boss: [
  {k: 'choice', q: '¿Qué apartado trata la comunicación?', opts: ['7.4', '7.3', '9.3'], a: 0, ref: ['une', 12]},
  {k: 'choice', q: 'Al planificar la comunicación hay que decidir…', opts: ['Qué, cuándo, con quién y cómo', 'Solo el canal', 'Solo el presupuesto'], a: 0, ref: ['une', 13]},
  {k: 'tf', q: 'La comunicación del SGSI puede ser interna y externa.', a: true, ref: ['une', 12]},
  {k: 'choice', q: 'Avisar a un cliente de un incidente que le afecta es comunicación…', opts: ['Externa', 'Interna', 'No es comunicación del SGSI'], a: 0, ref: ['une', 12]},
  {k: 'tf', q: 'En la versión 2022 se eliminó de 7.4 el requisito literal de «quién comunica».', a: true, ref: ['une', 13]}
 ]
});

/* ═════════════ Unidad 16 · 7.5 ═════════════ */
U({id: 'u16', n: 16, t: 'Información documentada', icon: 'file-text', mins: 13, clauses: ['7.5'],
 s: 'Cláusula 7.5: qué hay que documentar, cómo se crea y actualiza, y cómo se controla.',
 lesson: [
  {k: '7.5.1', t: 'Qué hay que documentar', body: [
    'El SGSI debe incluir:',
    {ul: [['a', 'La información documentada que <b>exige la norma</b>.'], ['b', 'La que <b>la propia organización</b> decida que necesita para que el SGSI sea eficaz.']]},
    'Su volumen cambia de una organización a otra según su **tamaño**, la **complejidad** de sus procesos y la **competencia** de su gente.'],
   plain: 'No hay un número fijo de documentos. Una empresa de 10 personas no necesita lo mismo que una de 10.000.',
   refs: [['une', 13], ['uc01', 7]]},
  {k: 'Vocabulario', t: '«Mantener» y «conservar»', body: [
    {ul: [['M', '<b>Mantener</b> información documentada: documentos vivos que se actualizan (política, alcance, procedimientos).'], ['C', '<b>Conservar</b> información documentada: evidencias de que algo se hizo (registros: resultados de auditoría, actas, evaluaciones).']]}],
   exam: 'Antes se decía «documentos» y «registros». La 2022 dice «información documentada» para todo, y distingue con los verbos mantener y conservar.',
   added: true, refs: [['une', 13]]},
  {k: 'La lista', t: 'Lo que la norma pide documentar', body: [
    {ul: [['4.3', 'Alcance del SGSI.'], ['5.2', 'Política de seguridad.'], ['6.1.2', 'Proceso de evaluación de riesgos.'], ['6.1.3', 'Proceso de tratamiento, SoA y plan de tratamiento.'], ['6.2', 'Objetivos de seguridad.'], ['7.2', 'Evidencia de competencia.'], ['8.1-8.3', 'Planificación operacional y resultados de evaluación y tratamiento de riesgos.'], ['9.1-9.3', 'Resultados de medición, programa y resultados de auditoría, resultados de la revisión por la dirección.'], ['10.2', 'No conformidades y acciones correctivas.']]}],
   plain: 'Es la lista que todo auditor lleva en el bolsillo. En el Mapa de la norma tienes marcadas estas cláusulas con un icono de documento.',
   added: true, refs: [['une', 7], ['une', 8], ['une', 9], ['une', 11], ['une', 12]]},
  {check: true, k: 'classify', q: '¿Lo exige la norma como información documentada?', buckets: [{t: 'Sí, obligatorio', c: '#5e5ce6'}, {t: 'No lo exige', c: '#8e8e93'}], items: [['El alcance del SGSI', 0], ['La Declaración de Aplicabilidad', 0], ['Los resultados de la auditoría interna', 0], ['El organigrama completo de la empresa', 1], ['El menú del comedor', 1]], ref: ['une', 13]},
  {k: '7.5.2', t: 'Crear y actualizar', body: [
    'Al crear o actualizar información documentada, la organización asegura:',
    {ul: [['a', '<b>Identificación y descripción</b>: título, fecha, autor, código.'], ['b', '<b>Formato y soporte</b>: idioma, versión del programa, papel o electrónico.'], ['c', '<b>Revisión y aprobación</b> de que es adecuada.']]}],
   case: 'Cada documento de Albatrel llevará una portada con código (POL-01, NOR-03…), versión, fecha, autor, quién lo aprueba y clasificación.',
   refs: [['une', 13]]},
  {k: '7.5.3', t: 'Controlar la información documentada', body: [
    'Debe estar **disponible** donde y cuando se necesite, y **protegida** (contra pérdida de confidencialidad, mal uso o pérdida de integridad). Para eso se gestiona:',
    {ul: [['c', 'Distribución, acceso, recuperación y uso.'], ['d', 'Almacenamiento y preservación (también que siga siendo legible).'], ['e', 'Control de cambios (versiones).'], ['f', 'Conservación y disposición (cuánto tiempo se guarda y cómo se elimina).']]},
    'Y los documentos de **origen externo** necesarios (normas, contratos, guías) también se identifican y controlan.'],
   plain: 'Que esté a mano, que no lo toque quien no debe, que se sepa cuál es la última versión y que no se pierda.',
   refs: [['une', 13], ['une', 14]]},
  {check: true, k: 'order', q: 'Ordena las actividades de control de 7.5.3 (letras c a f).', items: ['Distribución, acceso, recuperación y uso', 'Almacenamiento y preservación', 'Control de cambios', 'Conservación y disposición'], ref: ['une', 14]},
  {k: 'Curiosidad', t: 'Una errata en la UNE', added: true, body: [
    'En el texto de la UNE-ISO/IEC 27001:2023, el párrafo de documentos externos de 7.5.3 dice «sistema de gestión de **la calidad**». Es una errata de traducción heredada de la ISO 9001: debería decir «de la seguridad de la información».'],
   plain: 'Si lo ves en la norma, no te líes: se refiere al SGSI.',
   refs: [['une', 14]]},
  {k: 'Pirámide', t: 'El cuerpo normativo', body: [
    {ul: [['1', '<b>Política</b>: el qué y el porqué. La aprueba la dirección.'], ['2', '<b>Normativas</b>: obligaciones por ámbito (accesos, copias, proveedores…).'], ['3', '<b>Procedimientos e instrucciones técnicas</b>: cómo se hace cada tarea.'], ['4', '<b>Registros</b>: la evidencia de que se hizo.']]}],
   cls: 'La plantilla PRO-SI-03 del curso describe el ciclo de vida de un documento en 11 fases: desde el inicio y el análisis de brechas hasta la aprobación, la publicación, la comunicación con acuse de recibo y la formación. También fija la revisión anual y la retirada de versiones obsoletas.',
   refs: [['pro3', 1]]}
 ],
 labs: [
  {id: 'u16l1', t: 'Qué documentar', items: [
    {k: 'classify', q: '¿Se «mantiene» (documento vivo) o se «conserva» (evidencia)?', buckets: [{t: 'Mantener', c: '#5e5ce6'}, {t: 'Conservar', c: '#ff9f0a'}], items: [['Política de seguridad', 0], ['Alcance del SGSI', 0], ['Procedimiento de copias de seguridad', 0], ['Informe de la auditoría interna', 1], ['Acta de la revisión por la dirección', 1], ['Certificado de formación', 1]], ref: ['une', 13]},
    {k: 'match', q: 'Une cada documento con la cláusula que lo exige.', pairs: [['Alcance', '4.3'], ['Política', '5.2'], ['Declaración de Aplicabilidad', '6.1.3'], ['Objetivos', '6.2'], ['No conformidades', '10.2']], ref: ['une', 7]},
    {k: 'tf', q: 'Todas las organizaciones deben tener la misma cantidad de información documentada.', a: false, why: 'Depende del tamaño, la complejidad y la competencia (nota de 7.5.1).', ref: ['une', 13]}
  ]},
  {id: 'u16l2', t: 'Crear y controlar', items: [
    {k: 'match', q: 'Une cada letra de 7.5.2 con un ejemplo.', pairs: [['a Identificación', 'Código POL-01, versión 1.2, fecha y autor'], ['b Formato y soporte', 'PDF en la intranet, en español'], ['c Revisión y aprobación', 'Firma de la Gerencia tras revisarlo']], ref: ['une', 13]},
    {k: 'choice', scenario: 'En Albatrel conviven dos versiones distintas del procedimiento de copias y nadie sabe cuál es la buena.', q: '¿Qué actividad de 7.5.3 falla?', opts: ['Control de cambios (versiones)', 'Competencia', 'Comunicación externa'], a: 0, ref: ['une', 14]},
    {k: 'choice', q: 'El contrato con el proveedor de hosting, necesario para el SGSI, es información documentada de…', opts: ['Origen externo, que también hay que controlar', 'Nadie, no cuenta', 'Origen interno'], a: 0, ref: ['une', 14]},
    {k: 'tf', q: '7.5.3 pide proteger la información documentada contra la pérdida de confidencialidad e integridad.', a: true, ref: ['une', 13]}
  ]}
 ],
 boss: [
  {k: 'choice', q: '¿Qué apartado trata la información documentada?', opts: ['7.5', '7.4', '8.1'], a: 0, ref: ['une', 13]},
  {k: 'tf', q: 'El SGSI incluye la información documentada que exige la norma y la que la organización decida.', a: true, ref: ['une', 13]},
  {k: 'choice', q: 'Título, fecha, autor y código corresponden a…', opts: ['Identificación y descripción (7.5.2 a)', 'Comunicación (7.4)', 'Recursos (7.1)'], a: 0, ref: ['une', 13]},
  {k: 'choice', q: '¿Cuál NO es una actividad de control de 7.5.3?', opts: ['Control de cambios', 'Conservación y disposición', 'Distribución y acceso', 'Elegir el color corporativo'], a: 3, ref: ['une', 14]},
  {k: 'tf', q: 'Los documentos de origen externo necesarios para el SGSI no hay que controlarlos.', a: false, ref: ['une', 14]},
  {k: 'choice', q: 'Los resultados de la auditoría interna son información documentada que se…', opts: ['Conserva (evidencia)', 'Mantiene y actualiza cada día', 'Destruye tras leerla'], a: 0, ref: ['une', 15]},
  {k: 'tf', q: 'Si no está documentado, para el auditor no existe.', a: true, ref: ['s1', 14]},
  {k: 'choice', q: 'En el cuerpo normativo, «cómo se hace cada tarea» va en…', opts: ['Procedimientos e instrucciones técnicas', 'La política', 'Los registros'], a: 0, ref: ['pro3', 1]}
 ]
});

T.glossary.push(
  ['Competencia', 'Capacidad de aplicar conocimientos y habilidades; se demuestra con educación, formación o experiencia (7.2).', ['une', 12]],
  ['Concienciación', 'Que todo el personal conozca la política, su contribución y las consecuencias de no cumplir (7.3).', ['une', 12]],
  ['Plan de comunicación', 'Qué, cuándo, con quién y cómo se comunica sobre el SGSI (7.4).', ['une', 13]],
  ['Información documentada', 'Información que hay que controlar y mantener o conservar, y el medio que la contiene (7.5).', ['une', 13]],
  ['Mantener / conservar', 'Mantener: documentos vivos. Conservar: evidencias o registros.', ['une', 13]],
  ['Control de versiones', 'Saber cuál es la versión vigente y retirar las obsoletas (7.5.3 e).', ['une', 14]],
  ['Documento de origen externo', 'Norma, guía o contrato de fuera que el SGSI necesita; también se controla (7.5.3).', ['une', 14]]
);
})();
