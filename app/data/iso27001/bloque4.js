/* ISO/IEC 27001:2022 — Bloque 4 · Cláusula 8 (Operación).
   Contenido propio. Citas: texto de la norma (cláusula 8) y diapositivas del curso sobre las cláusulas 8-10.
   Ejemplos con el caso propio Albatrel. */
(function () {
const T = ATLAS.track('iso27001');

Object.assign(T.docs, {
  cl810: {s: 'Clase · Cláusulas 8-10', t: 'Clase del curso · Cláusulas 8-10 y Anexo A'}
});

const m4 = T.modules.find(m => m.id === 'm4');
Object.assign(m4, {soon: false, s: 'Control operacional, cambios, proveedores, y evaluar y tratar los riesgos en el día a día', units: ['u17', 'u18', 'u19', 'u20']});

const U = (u) => { T.units[u.id] = u; };

/* ═════════════ Unidad 17 · 8.1 ═════════════ */
U({id: 'u17', n: 17, t: 'Del plan a la acción', icon: 'play', mins: 10, clauses: ['8.1'],
 s: 'Cláusula 8.1: ejecutar y controlar lo que se planificó en la cláusula 6.',
 lesson: [
  {k: 'Cláusula 8', t: 'El SGSI deja de ser un plan', body: [
    'En las cláusulas 4 a 6 se **piensa y se decide**. En la 8 se **hace**: se ponen en marcha los procesos y los controles que salieron del análisis de riesgos.',
    {ul: [['8.1', 'Planificación y control operacional.'], ['8.2', 'Evaluación de los riesgos (de forma periódica).'], ['8.3', 'Tratamiento de los riesgos (aplicar el plan).']]}],
   plain: 'La cláusula 6 es la receta; la 8 es cocinar, y vigilar que no se queme nada.',
   refs: [['cl810', 5], ['une', 14]]},
  {k: '8.1', t: 'Criterios y controles en cada proceso', body: [
    'La organización planifica, implementa y controla los procesos necesarios para cumplir los requisitos y para aplicar las acciones de la cláusula 6:',
    {ul: [['1', '<b>Estableciendo criterios</b> para los procesos (cómo debe hacerse y qué es «bien hecho»).'], ['2', '<b>Implementando controles</b> en los procesos según esos criterios.']]},
    'Y guarda la **información documentada** necesaria para tener confianza en que los procesos se hicieron según lo planificado.'],
   case: 'En Albatrel, el proceso de copias tiene un criterio («copia diaria y prueba de restauración mensual con éxito») y un registro de cada prueba (NOR-02). Eso es 8.1 en la práctica.',
   refs: [['une', 14]]},
  {check: true, k: 'tf', q: 'Según 8.1, hay que conservar información documentada que dé confianza de que los procesos se hicieron como estaba previsto.', a: true, ref: ['une', 14]},
  {k: 'Cambios', t: 'Cambios planificados y no previstos', body: [
    {ul: [['P', '<b>Cambios planificados</b>: se controlan (se analizan, aprueban y prueban antes de hacerlos).'], ['N', '<b>Cambios no previstos</b>: se revisan sus consecuencias y, si hace falta, se toman acciones para mitigar los efectos negativos.']]}],
   plain: 'Si actualizas el servidor, lo planificas. Si el proveedor cambia algo sin avisar, revisas qué ha pasado y lo arreglas.',
   case: 'Planificado: Albatrel publica una nueva versión de la app de clínicas siguiendo su proceso de cambios. No previsto: el proveedor de hosting migra el servidor de centro de datos sin avisar; Albatrel revisa el impacto y actualiza su análisis.',
   refs: [['une', 14]]},
  {k: 'Externos', t: 'Lo externalizado también se controla', body: [
    'La organización debe garantizar que los **procesos, productos o servicios proporcionados externamente** que afectan al SGSI estén **controlados**.',
    'Externalizar un servicio no externaliza la responsabilidad: hay que exigir, vigilar y revisar.'],
   case: 'El hosting de la app de clínicas y el correo en la nube son servicios externos. Albatrel los controla con cláusulas de contrato, informes del proveedor y revisión anual (R-05 en su registro de riesgos).',
   refs: [['une', 14]]},
  {check: true, k: 'choice', q: 'El proveedor de hosting cambia de centro de datos sin avisar. Según 8.1, Albatrel debe…', opts: ['Revisar las consecuencias y mitigar los efectos adversos', 'Ignorarlo, es cosa del proveedor', 'Excluir el servicio del SGSI'], a: 0, ref: ['une', 14]},
  {k: 'ENS', t: 'Su equivalente en el ENS', body: [
    'Según la clase del curso, 8.1 se corresponde en el ENS con las medidas de **planificación [op.pl]** y de **explotación [op.exp]** del marco operacional.'],
   refs: [['cl810', 5]]}
 ],
 labs: [
  {id: 'u17l1', t: 'Control operacional', items: [
    {k: 'order', q: 'Ordena lo que pide 8.1 para cada proceso.', items: ['Establecer criterios', 'Implementar controles según los criterios', 'Conservar evidencia de que se hizo según lo planificado'], ref: ['une', 14]},
    {k: 'classify', q: '¿Cambio planificado o no previsto?', buckets: [{t: 'Planificado', c: '#5e5ce6'}, {t: 'No previsto', c: '#ff9f0a'}], items: [['Nueva versión de la app de clínicas', 0], ['Migración programada del correo', 0], ['El proveedor cambia de centro de datos sin avisar', 1], ['Una actualización automática rompe un servicio', 1]], ref: ['une', 14]},
    {k: 'tf', q: 'Si un servicio está externalizado, deja de formar parte de la responsabilidad del SGSI.', a: false, why: '8.1 exige que lo proporcionado externamente esté controlado.', ref: ['une', 14]},
    {k: 'choice', q: '¿En qué fase del PDCA está la cláusula 8?', opts: ['Hacer', 'Verificar', 'Actuar'], a: 0, ref: ['ucimp', 7]}
  ]}
 ],
 boss: [
  {k: 'choice', q: 'La cláusula 8.1 trata de…', opts: ['Planificación y control operacional', 'Auditoría interna', 'Política'], a: 0, ref: ['une', 14]},
  {k: 'tf', q: 'Los cambios planificados deben controlarse.', a: true, ref: ['une', 14]},
  {k: 'choice', q: 'Ante un cambio no previsto, la organización debe…', opts: ['Revisar sus consecuencias y mitigar si hace falta', 'Esperar a la auditoría', 'No hacer nada'], a: 0, ref: ['une', 14]},
  {k: 'tf', q: 'Los servicios externos relevantes para el SGSI deben estar controlados.', a: true, ref: ['une', 14]},
  {k: 'choice', q: 'En la cláusula 8 se ejecuta lo que se planificó en la cláusula…', opts: ['6', '9', '10'], a: 0, ref: ['cl810', 5]},
  {k: 'choice', q: '¿Qué medidas del ENS se relacionan con 8.1 según la clase?', opts: ['[op.pl] y [op.exp]', '[mp.per]', '[org.4]'], a: 0, ref: ['cl810', 5]}
 ]
});

/* ═════════════ Unidad 18 · Cambios y proveedores ═════════════ */
U({id: 'u18', n: 18, t: 'Cambios y proveedores en el día a día', icon: 'link', mins: 10, clauses: ['8.1'],
 s: 'Cómo se aterriza 8.1 con los controles del Anexo A: gestión de cambios, procedimientos documentados y proveedores.',
 lesson: [
  {k: 'Puente', t: 'De la cláusula a los controles', body: [
    'La cláusula 8.1 dice **qué** hay que conseguir. Varios controles del Anexo A dicen **cómo**:',
    {ul: [['8.32', '<b>Gestión de cambios</b>: los cambios pasan por un proceso.'], ['8.19', '<b>Instalación de software en producción</b>, de forma controlada.'], ['5.37', '<b>Procedimientos de operación documentados</b>.'], ['5.19-5.22', '<b>Proveedores</b>: riesgos, contratos, cadena de suministro y seguimiento.'], ['5.23', '<b>Servicios en la nube</b>.']]}],
   plain: 'La cláusula es el objetivo; los controles, las herramientas.',
   refs: [['une', 14]]},
  {k: '8.32', t: 'Un buen proceso de cambios', body: [
    {ul: [['1', '<b>Solicitar</b>: qué se cambia y por qué.'], ['2', '<b>Evaluar</b>: riesgos e impacto (¿afecta a la seguridad?).'], ['3', '<b>Aprobar</b>: alguien distinto de quien lo pide.'], ['4', '<b>Probar</b> fuera de producción.'], ['5', '<b>Implantar</b> con plan de vuelta atrás.'], ['6', '<b>Registrar</b> y revisar.']]}],
   case: 'En Albatrel, el desarrollador pide el cambio, el Responsable del Sistema lo aprueba y lo ejecuta otra persona en una ventana acordada. Así se respeta también la segregación de tareas (5.3).',
   refs: [['une', 14]]},
  {check: true, k: 'order', q: 'Ordena el proceso de cambios.', items: ['Solicitar', 'Evaluar el riesgo', 'Aprobar', 'Probar', 'Implantar', 'Registrar']},
  {k: '5.37', t: 'Procedimientos escritos', body: [
    'Las tareas de operación (arrancar y parar sistemas, copias, altas de usuarios…) deben estar **documentadas y al alcance de quien las necesite**.',
    'Así no dependen de que «lo sepa Pepe»: si Pepe está de vacaciones, el procedimiento sigue funcionando.'],
   case: 'NOR-02 (copias) y PRO-01 (incidentes) son ejemplos de procedimientos de operación de Albatrel.',
   refs: [['une', 22]]},
  {k: 'Proveedores', t: 'El ciclo de vida de un proveedor', body: [
    {ul: [['5.19', '<b>Antes</b>: identificar los riesgos que trae el proveedor.'], ['5.20', '<b>Contrato</b>: requisitos de seguridad por escrito (notificación de brechas, auditorías, borrado al terminar).'], ['5.21', '<b>Cadena TIC</b>: también los subproveedores del proveedor.'], ['5.22', '<b>Durante</b>: seguimiento y revisión de cambios en su servicio.'], ['5.23', '<b>Nube</b>: reglas para contratar, usar y salir del servicio.']]}],
   exam: 'Pregunta típica: «transferir un riesgo a un proveedor transfiere la responsabilidad». Falso: la responsabilidad sigue siendo tuya.',
   refs: [['une', 20]]},
  {check: true, k: 'match', q: 'Une cada control con su momento.', pairs: [['5.19', 'Identificar los riesgos del proveedor'], ['5.20', 'Requisitos en el contrato'], ['5.22', 'Seguimiento durante el servicio'], ['5.23', 'Reglas para la nube']], ref: ['une', 20]}
 ],
 labs: [
  {id: 'u18l1', t: 'Cambios', items: [
    {k: 'choice', scenario: 'Un desarrollador de Albatrel pide, aprueba y sube a producción su propio cambio un viernes por la tarde.', q: '¿Qué controles se incumplen?', opts: ['8.32 gestión de cambios y 5.3 segregación de tareas', '7.7 puesto despejado', '6.1 investigación de antecedentes'], a: 0},
    {k: 'tf', q: 'Antes de implantar un cambio en producción conviene probarlo y tener un plan de vuelta atrás.', a: true},
    {k: 'classify', q: '¿Procedimiento de operación (5.37) o política (5.1)?', buckets: [{t: 'Procedimiento', c: '#34c759'}, {t: 'Política', c: '#5e5ce6'}], items: [['Pasos para restaurar una copia', 0], ['Cómo dar de alta a un usuario', 0], ['Compromiso de la Gerencia con la seguridad', 1], ['Principios de seguridad de la empresa', 1]]}
  ]},
  {id: 'u18l2', t: 'Proveedores', items: [
    {k: 'classify', q: '¿Qué debería incluir el contrato de hosting de Albatrel (5.20)?', buckets: [{t: 'Sí', c: '#5e5ce6'}, {t: 'No hace falta', c: '#8e8e93'}], items: [['Plazo para notificar brechas', 0], ['Derecho a pedir evidencias o auditar', 0], ['Borrado de datos al terminar', 0], ['El color del logotipo del proveedor', 1]]},
    {k: 'tf', q: 'Los subproveedores de un proveedor TIC también importan (5.21).', a: true},
    {k: 'choice', q: 'Contratar un ciberseguro transfiere…', opts: ['Parte del impacto económico, no la responsabilidad', 'Toda la responsabilidad', 'El cumplimiento del ENS'], a: 0}
  ]}
 ],
 boss: [
  {k: 'choice', q: '¿Qué control trata la gestión de cambios?', opts: ['8.32', '5.1', '7.1'], a: 0},
  {k: 'tf', q: 'Los procedimientos de operación deben estar documentados y disponibles.', a: true},
  {k: 'choice', q: 'Los requisitos de seguridad por escrito en el contrato con un proveedor son el control…', opts: ['5.20', '8.8', '6.4'], a: 0},
  {k: 'choice', q: 'Las reglas para contratar, usar y abandonar la nube son el control…', opts: ['5.23', '8.13', '7.4'], a: 0},
  {k: 'tf', q: 'Quien pide un cambio debería ser también quien lo aprueba.', a: false},
  {k: 'choice', q: 'El seguimiento del servicio de un proveedor es el control…', opts: ['5.22', '5.2', '8.1'], a: 0}
 ]
});

/* ═════════════ Unidad 19 · 8.2 ═════════════ */
U({id: 'u19', n: 19, t: 'Revaluar los riesgos', icon: 'scan-search', mins: 9, clauses: ['8.2'],
 s: 'Cláusula 8.2: el análisis de riesgos no se hace una vez y se guarda; se repite.',
 lesson: [
  {k: '8.2', t: 'Cuándo se vuelven a evaluar los riesgos', body: [
    'La organización realiza evaluaciones de riesgos:',
    {ul: [['1', '<b>A intervalos planificados</b> (por ejemplo, cada año).'], ['2', '<b>Cuando se propongan o se produzcan cambios importantes</b>.']]},
    'Siempre con los **criterios de 6.1.2**, y **conservando** los resultados como información documentada.'],
   plain: 'Como la ITV: toca cada cierto tiempo, y también si le has hecho un cambio gordo al coche.',
   refs: [['une', 14], ['cl810', 5]]},
  {check: true, k: 'tf', q: 'Basta con hacer el análisis de riesgos una vez, al implantar el SGSI.', a: false, why: '8.2 pide repetirlo a intervalos planificados y ante cambios importantes.', ref: ['une', 14]},
  {k: '6.1.2 vs 8.2', t: 'No confundir las dos cláusulas', body: [
    {ul: [['6.1.2', '<b>Planificación</b>: definir el proceso, los criterios y el método.'], ['8.2', '<b>Operación</b>: aplicar ese proceso de forma periódica y guardar los resultados.']]}],
   exam: 'Si la pregunta habla de «definir el proceso o los criterios» es 6.1.2; si habla de «realizar las evaluaciones periódicas y conservar los resultados», es 8.2.',
   refs: [['une', 9], ['une', 14]]},
  {k: 'Disparadores', t: 'Qué es un «cambio importante»', body: [
    {ul: [['i:briefcase', 'Un servicio o cliente nuevo de peso.'], ['i:server', 'Una migración tecnológica (por ejemplo, a la nube).'], ['i:swords', 'Un incidente grave.'], ['i:scale', 'Una ley o exigencia contractual nueva.'], ['i:building-2', 'Un cambio en la organización (fusión, nueva sede).']]}],
   case: 'Albatrel revaluará sus riesgos si consigue 100 clínicas más, si migra la sede electrónica a la nube o si sufre un incidente alto. Si no pasa nada, lo hará cada año antes de la revisión por la dirección (MET-01).',
   refs: [['une', 14]]},
  {check: true, k: 'classify', q: '¿Obliga a revaluar los riesgos de Albatrel?', buckets: [{t: 'Sí, cambio importante', c: '#ff9f0a'}, {t: 'No', c: '#8e8e93'}], items: [['Migrar la sede electrónica a la nube', 0], ['Sufrir un ransomware', 0], ['Firmar con 100 clínicas nuevas', 0], ['Cambiar el color de la intranet', 1]], ref: ['une', 14]},
  {k: 'Evidencia', t: 'Guardar los resultados', body: [
    'Los resultados de cada evaluación se **conservan**: fecha, riesgos, niveles y quién la aprobó. En el caso Albatrel es el registro REG-01, que cada año tendrá una versión nueva.'],
   refs: [['une', 14]]}
 ],
 labs: [
  {id: 'u19l1', t: 'Periódico y ante cambios', items: [
    {k: 'match', q: 'Une cada cláusula con lo que pide.', pairs: [['6.1.2', 'Definir el proceso y los criterios de evaluación'], ['8.2', 'Realizar evaluaciones periódicas y ante cambios'], ['8.3', 'Aplicar el plan de tratamiento']], ref: ['une', 14]},
    {k: 'choice', scenario: 'Albatrel lleva dos años sin revisar su análisis de riesgos y entretanto ha migrado el correo a la nube.', q: '¿Qué apartado incumple?', opts: ['8.2', '7.4', '5.2'], a: 0, ref: ['une', 14]},
    {k: 'tf', q: 'Las evaluaciones periódicas deben usar los criterios definidos en 6.1.2.', a: true, ref: ['une', 14]},
    {k: 'choice', q: 'Los resultados de la evaluación de riesgos son información documentada que se…', opts: ['Conserva', 'Destruye tras leerla', 'Publica en internet'], a: 0, ref: ['une', 14]}
  ]}
 ],
 boss: [
  {k: 'choice', q: '¿Qué apartado pide repetir la evaluación de riesgos?', opts: ['8.2', '6.2', '9.2'], a: 0, ref: ['une', 14]},
  {k: 'tf', q: 'Un incidente grave puede obligar a revaluar los riesgos.', a: true, ref: ['une', 14]},
  {k: 'choice', q: 'Definir los criterios de aceptación del riesgo es…', opts: ['6.1.2', '8.2', '10.2'], a: 0, ref: ['une', 9]},
  {k: 'tf', q: 'Las evaluaciones se hacen a intervalos planificados y cuando hay cambios importantes.', a: true, ref: ['une', 14]},
  {k: 'choice', q: 'En el caso Albatrel, ¿dónde quedan los resultados de cada evaluación?', opts: ['En una nueva versión de REG-01', 'En la política', 'En ningún sitio'], a: 0}
 ]
});

/* ═════════════ Unidad 20 · 8.3 ═════════════ */
U({id: 'u20', n: 20, t: 'Aplicar el tratamiento', icon: 'list-checks', mins: 9, clauses: ['8.3'],
 s: 'Cláusula 8.3: ejecutar el plan de tratamiento y demostrar que se hizo.',
 lesson: [
  {k: '8.3', t: 'Del papel a la realidad', body: [
    'La organización debe **implementar el plan de tratamiento** de los riesgos y **conservar información documentada de los resultados**.',
    'La clase del curso lo resume así: la SoA debe reflejar el **estado real** de implantación, no solo las intenciones.'],
   plain: 'Un plan que no se ejecuta es un deseo. 8.3 es tachar tareas de la lista y poder demostrarlo.',
   refs: [['une', 14], ['cl810', 5]]},
  {check: true, k: 'tf', q: 'La SoA puede marcar como «implantado» un control que solo está previsto.', a: false, why: 'La SoA debe reflejar el estado real, no las intenciones.', ref: ['cl810', 5]},
  {k: 'Seguimiento', t: 'Cómo se sigue el plan', body: [
    {ul: [['1', 'Cada acción tiene <b>responsable, plazo y estado</b> (planificada, en curso, hecha).'], ['2', 'El Comité revisa el avance periódicamente.'], ['3', 'Al terminar una acción se actualizan la <b>SoA</b> y el <b>riesgo residual</b>.'], ['4', 'Se guarda la <b>evidencia</b>: configuración, acta, informe, captura.']]}],
   case: 'En el PTR-01 de Albatrel, «Cifrado de disco en todos los portátiles» está Hecho: la evidencia es el informe de la consola de gestión de equipos, y el riesgo R-08 baja a Bajo.',
   refs: [['une', 14]]},
  {check: true, k: 'order', q: 'Ordena lo que pasa al terminar una acción del plan.', items: ['Se completa la acción', 'Se guarda la evidencia', 'Se actualiza la SoA', 'Se recalcula el riesgo residual']},
  {k: 'Evidencias', t: 'Qué cuenta como evidencia', body: [
    {ul: [['i:file-check', 'Un registro o informe generado por la herramienta.'], ['i:file-text', 'Un acta o documento firmado.'], ['i:scan-search', 'Una captura de la configuración.'], ['i:users', 'Una entrevista que confirma lo que dicen los documentos.']]},
    'Un control implantado pero **sin evidencia** es invisible para el auditor.'],
   refs: [['s3', 24]]},
  {k: 'Conexión', t: 'Y ahora toca medir', body: [
    'Con 8.3 se cierra la fase **Hacer**. La siguiente pregunta es: ¿funciona? Eso lo responde la cláusula 9 (medición, auditoría interna y revisión por la dirección), en el bloque 5.'],
   refs: [['cl810', 6]]}
 ],
 labs: [
  {id: 'u20l1', t: 'Ejecutar y demostrar', items: [
    {k: 'classify', q: '¿Sirve como evidencia de que una acción del plan se hizo?', buckets: [{t: 'Sí', c: '#34c759'}, {t: 'No', c: '#ff3b30'}], items: [['Informe de la consola con todos los discos cifrados', 0], ['Acta de la reunión que aprobó el cambio', 0], ['Captura de la configuración del MFA', 0], ['«Nos dijeron que ya estaba hecho»', 1]]},
    {k: 'choice', scenario: 'El plan de Albatrel decía «MFA en todas las cuentas antes de diciembre». En enero, la mitad de las cuentas sigue sin MFA y la SoA dice «Implantado».', q: '¿Qué falla?', opts: ['8.3 y la SoA no refleja el estado real', '7.3 concienciación', '4.1 contexto'], a: 0, ref: ['une', 14]},
    {k: 'tf', q: 'Al completar una acción del plan conviene actualizar el riesgo residual.', a: true},
    {k: 'match', q: 'Une cada cláusula de la operación con su idea.', pairs: [['8.1', 'Controlar procesos, cambios y externos'], ['8.2', 'Revaluar los riesgos'], ['8.3', 'Aplicar el plan de tratamiento']], ref: ['une', 14]}
  ]}
 ],
 boss: [
  {k: 'choice', q: 'La cláusula 8.3 pide…', opts: ['Implementar el plan de tratamiento y conservar los resultados', 'Definir la política', 'Hacer la auditoría interna'], a: 0, ref: ['une', 14]},
  {k: 'tf', q: 'Un control sin evidencia es invisible para el auditor.', a: true, ref: ['s3', 24]},
  {k: 'choice', q: '¿Qué documento debe reflejar el estado real de implantación de los controles?', opts: ['La Declaración de Aplicabilidad', 'El organigrama', 'El contrato laboral'], a: 0, ref: ['cl810', 5]},
  {k: 'tf', q: 'Con la cláusula 8 termina la fase Hacer del PDCA.', a: true, ref: ['cl810', 7]},
  {k: 'choice', q: 'Tras la operación, ¿qué cláusula comprueba si el SGSI funciona?', opts: ['9', '4', '7'], a: 0, ref: ['cl810', 6]},
  {k: 'choice', q: 'Una acción del plan sin responsable ni plazo…', opts: ['Es difícil de seguir y de demostrar', 'Es lo recomendable', 'No afecta al SGSI'], a: 0}
 ]
});

T.glossary.push(
  ['Control operacional', 'Criterios y controles para que los procesos se hagan como se planificó (8.1).', ['une', 14]],
  ['Gestión de cambios', 'Solicitar, evaluar, aprobar, probar, implantar y registrar los cambios (control 8.32).', ['une', 14]],
  ['Cambio no previsto', 'Cambio que no se planificó; hay que revisar sus consecuencias y mitigarlas (8.1).', ['une', 14]],
  ['Revaluación de riesgos', 'Repetir la evaluación a intervalos planificados y ante cambios importantes (8.2).', ['une', 14]],
  ['Evidencia', 'Registro, informe, acta o captura que demuestra que algo se hizo.', ['s3', 24]]
);
})();
