/* Atlas GRC · Simulador de auditoría · Caso 05: «Respuesta a incidentes y lecciones aprendidas»
   Todo es FICTICIO. Coherente con PRO-01 de Albatrel (notificar, evaluar y clasificar, responder,
   conservar evidencias y aprender) y con la notificación a la AEPD en 72 horas del RGPD (art. 33). */
(function () {
const A = window.AUDIT || (window.AUDIT = {cases: {}, order: []});

const C = {
  id: 'c05', v: 1, n: '05',
  t: 'Respuesta a incidentes y lecciones aprendidas',
  s: 'Auditoría interna de los incidentes del semestre: clasificación, notificación a la AEPD, evidencias y lecciones aprendidas.',
  kind: 'Auditoría interna', level: 'Avanzado', mins: 65,
  skills: ['Reconstruir una cronología', 'Aplicar plazos legales', 'Valorar decisiones', 'Informar'],

  brief: {
    from: 'Elena Sanz · Responsable de Seguridad de Albatrel',
    date: '2 de noviembre de 2026',
    body: [
      'Este semestre hemos tenido de todo: phishing, un portátil perdido, una brecha en la app de clínicas y un intento de ransomware. El auditor de certificación va a mirar con lupa cómo respondimos.',
      'Audita si cumplimos PRO-01 en cada incidente: clasificación, contención, evidencias, notificación a la AEPD cuando toca y lecciones aprendidas en los altos y críticos.',
      'Trabajo de campo el 9 y el 10 de noviembre.'
    ],
    facts: [
      ['Organización', 'Albatrel Servicios Digitales, S.L. · 60 personas · Zaragoza'],
      ['Periodo auditado', '1 de enero a 30 de junio de 2026'],
      ['Trabajo de campo', '9 y 10 de noviembre de 2026'],
      ['Auditor', 'Tú, como auditor interno (no participaste en la respuesta a ningún incidente)'],
      ['Destinatario del informe', 'Comité de Seguridad y Gerencia']
    ]
  },

  plan: {
    objectives: [
      {id: 'o1', t: 'Comprobar si la respuesta a los incidentes del semestre cumplió PRO-01, los controles 5.24 a 5.28 y la notificación del RGPD.'},
      {id: 'o2', t: 'Averiguar quién tuvo la culpa de cada incidente.'},
      {id: 'o3', t: 'Volver a investigar técnicamente el ransomware de mayo.'}
    ],
    objectiveOk: 'o1',
    systems: [
      {id: 'reg', t: 'Registro de incidentes', in: true},
      {id: 'tic', t: 'Tickets y cronologías de respuesta', in: true},
      {id: 'aepd', t: 'Notificaciones a la AEPD y comunicaciones a clientes', in: true},
      {id: 'les', t: 'Actas de lecciones aprendidas', in: true},
      {id: 'pay', t: 'Nóminas del equipo de sistemas', in: false},
      {id: 'web', t: 'Web corporativa', in: false}
    ],
    criteria: [
      {id: 'p2', t: 'PRO-01 §2 · Evaluar y clasificar cada evento', rel: true},
      {id: 'p3', t: 'PRO-01 §3 · Responder y valorar la notificación a la AEPD en 72 horas', rel: true},
      {id: 'p4', t: 'PRO-01 §4 · Conservar evidencias con cadena de custodia', rel: true},
      {id: 'p5', t: 'PRO-01 §5 · Lecciones aprendidas tras incidentes altos o críticos', rel: true},
      {id: 'rgpd', t: 'RGPD art. 33 · Notificación de brechas a la autoridad en 72 horas', rel: true},
      {id: 'a528', t: 'Anexo A 5.28 · Recopilación de evidencias', rel: true},
      {id: 'a811', t: 'Anexo A 8.11 · Enmascaramiento de datos', rel: false}
    ],
    techniques: [
      {id: 'doc', t: 'Revisión documental', rel: true},
      {id: 'int', t: 'Entrevistas', rel: true},
      {id: 'smp', t: 'Muestreo de incidentes', rel: true},
      {id: 'cro', t: 'Reconstrucción de la cronología de cada incidente', rel: true},
      {id: 'blm', t: 'Interrogar a las personas que causaron los incidentes', rel: false}
    ],
    agenda: [
      ['9 nov · 9:00', 'Reunión de apertura con la Responsable de Seguridad'],
      ['9 nov · 9:30', 'Revisión del registro de incidentes y selección de la muestra'],
      ['9 nov · 11:30', 'Entrevista a la RSEG: decisiones de clasificación y notificación'],
      ['10 nov · 9:30', 'Entrevista al Responsable del Sistema: contención y evidencias'],
      ['10 nov · 12:00', 'Entrevista a la DPD: notificaciones a la AEPD'],
      ['10 nov · 13:30', 'Reunión de cierre: hallazgos preliminares']
    ]
  },

  population: [
    {id: 'INC-01', role: 'Correo de phishing denunciado por una empleada', out: '12/01/2026', q: 1},
    {id: 'INC-02', role: 'Caída de la sede electrónica', out: '23/02/2026', q: 1},
    {id: 'INC-03', role: 'Acceso indebido a historias clínicas', out: '17/03/2026', q: 1},
    {id: 'INC-04', role: 'Phishing con clic, sin credenciales', out: '08/04/2026', q: 2},
    {id: 'INC-05', role: 'Ransomware detenido en un servidor', out: '19/05/2026', q: 2},
    {id: 'INC-06', role: 'Pérdida de un portátil', out: '11/06/2026', q: 2}
  ],
  sampleMin: 4,
  popIntro: 'Estos son los seis eventos del registro de incidentes del semestre (la población).',
  sampleWhyPh: '¿Por qué estos incidentes? Piensa en la gravedad, en los datos personales y en las decisiones que hubo que tomar.',
  checks: {
    sys: [{id: 'aepd', bad: 'El alcance no incluye las notificaciones a la AEPD: sin ellas no puedes comprobar el plazo de 72 horas.'}],
    sysGood: 'El alcance cubre el registro, la respuesta, las notificaciones y las lecciones aprendidas.',
    mustSample: {ids: ['INC-03', 'INC-05'], good: 'La muestra incluye los incidentes más graves.', bad: 'La muestra no incluye ninguno de los dos incidentes más graves (INC-03 e INC-05).'},
    ev: [{id: 'EV-04', bad: 'No pediste las notificaciones a la AEPD: el plazo de 72 horas es el punto más delicado.'}, {id: 'EV-05', bad: 'No pediste las actas de lecciones aprendidas.'}]
  },

  evidence: [
    {id: 'EV-01', t: 'PRO-01 · Procedimiento de gestión de incidentes (v1.0)', from: 'Responsable de Seguridad', type: 'Documento', date: '12/01/2026', rel: true,
     note: 'Versión 1.0, en vigor desde el 12/01/2026.', link: '#/doc/pinc',
     table: {head: ['Apartado', 'Qué dice'], rows: [
       ['§2', 'El RSEG decide si el evento es un incidente y lo clasifica: bajo, medio, alto o crítico.'],
       ['§3', 'Contener, erradicar y recuperar. Si hay datos personales, valorar la notificación a la AEPD en 72 horas.'],
       ['§4', 'Conservar registros y copias forenses sin alterarlas, con cadena de custodia.'],
       ['§5', 'Tras cada incidente alto o crítico, reunión de lecciones aprendidas y actualización de riesgos y controles.']]}},
    {id: 'EV-02', t: 'Registro de incidentes del semestre', from: 'Responsable de Seguridad', type: 'Registro', date: '09/11/2026', rel: true,
     table: {head: ['Incidente', 'Detectado', 'Clasificación', 'Datos personales', 'Cerrado'], rows: [
       ['INC-01', '12/01/2026 09:10', 'Bajo', 'No', '12/01/2026'],
       ['INC-02', '23/02/2026 10:30', '— (sin clasificar)', 'No', '23/02/2026'],
       ['INC-03', '17/03/2026 16:00', 'Alto', 'Sí (salud)', '02/04/2026'],
       ['INC-04', '08/04/2026 11:45', 'Bajo', 'No', '08/04/2026'],
       ['INC-05', '19/05/2026 03:20', 'Crítico', 'No (servidor de pruebas)', '24/05/2026'],
       ['INC-06', '11/06/2026 19:00', 'Medio', 'Sí (cifrados)', '15/06/2026']]}},
    {id: 'EV-03', t: 'Cronología de INC-03 (acceso indebido a historias clínicas)', from: 'Responsable de Seguridad', type: 'Registro', date: '02/04/2026', rel: true,
     table: {head: ['Fecha y hora', 'Qué pasó'], rows: [
       ['17/03 16:00', 'Una clínica avisa de que un paciente ha recibido datos de otro paciente.'],
       ['17/03 18:30', 'Se confirma el fallo de permisos en la app y se corrige (contención).'],
       ['18/03 10:00', 'La RSEG lo clasifica como alto: 214 historias expuestas.'],
       ['21/03 16:00', 'Se notifica a la AEPD.'],
       ['02/04', 'Se cierra el incidente.']]}},
    {id: 'EV-04', t: 'Notificaciones y decisiones sobre la AEPD', from: 'DPD', type: 'Registro', date: '09/11/2026', rel: true,
     table: {head: ['Incidente', 'Decisión', 'Fecha', 'Justificación'], rows: [
       ['INC-03', 'Notificado', '21/03/2026 16:00', 'Datos de salud expuestos a terceros.'],
       ['INC-06', 'No notificar', '12/06/2026', 'Disco cifrado y clave no comprometida: riesgo improbable para las personas. Decisión firmada por la DPD.']]}},
    {id: 'EV-05', t: 'Actas de lecciones aprendidas', from: 'Responsable de Seguridad', type: 'Acta', date: '09/11/2026', rel: true,
     table: {head: ['Incidente', 'Reunión', 'Acciones'], rows: [
       ['INC-05', '28/05/2026', 'Segmentar la red de pruebas; parchear en 7 días (R-01 actualizado).'],
       ['INC-03', 'No consta', '—']]}},
    {id: 'EV-06', t: 'Informe técnico de INC-05 (ransomware)', from: 'Responsable del Sistema', type: 'Informe', date: '24/05/2026', rel: true,
     table: {head: ['Paso', 'Qué se hizo'], rows: [
       ['Contención', 'El servidor de pruebas se desconectó de la red a las 03:35.'],
       ['Erradicación', 'Se formateó y reinstaló el servidor el mismo día.'],
       ['Evidencias', 'No se hizo copia forense del disco antes de formatear. Los registros del servidor se perdieron.'],
       ['Recuperación', 'Restaurado desde la copia del 18/05.']]}},
    {id: 'EV-07', t: 'Ticket de INC-02 (caída de la sede electrónica)', from: 'Responsable del Sistema', type: 'Registro', date: '23/02/2026', rel: true,
     note: 'Caída de 50 minutos por la caducidad de un certificado. Se resolvió renovándolo. Nadie lo evaluó ni lo clasificó como incidente.'},
    {id: 'EV-90', t: 'Cuadrante de vacaciones del equipo de sistemas', from: 'RR. HH.', type: 'Documento', date: '2026', rel: false,
     note: 'Quién estaba de vacaciones cada semana. No dice nada de la respuesta.'},
    {id: 'EV-91', t: 'Presentación comercial del antivirus', from: 'Responsable del Sistema', type: 'Documento', date: '2025', rel: false,
     note: 'Folleto del fabricante. No es evidencia de nada de lo ocurrido.'}
  ],

  people: [
    {id: 'sec', name: 'Elena Sanz', role: 'Responsable de Seguridad (RSEG)', qs: [
      {id: 'se1', q: '¿Cuándo empezó a contar el plazo de 72 horas en INC-03?', a: 'Para mí, cuando lo clasifiqué el 18 a las 10:00. Desde ahí notificamos en poco más de 72 horas.', key: true},
      {id: 'se2', q: '¿Por qué no hubo reunión de lecciones aprendidas en INC-03?', a: 'Se nos echó encima el ENS. Corregimos el permiso y lo dimos por cerrado.', key: true},
      {id: 'se3', q: '¿Por qué INC-02 no tiene clasificación?', a: 'Lo resolvió sistemas en menos de una hora y no me llegó. Debí clasificarlo igualmente.', key: true},
      {id: 'se4', q: '¿Quién tuvo la culpa del acceso indebido?', a: 'Preferiría no buscar culpables. Lo que importa es el fallo de permisos.', off: true}
    ]},
    {id: 'sys', name: 'Sergio Lahoz', role: 'Responsable del Sistema (RSIS)', qs: [
      {id: 'sy1', q: '¿Por qué se formateó el servidor de INC-05 sin copia forense?', a: 'Eran las cuatro de la mañana y quería quitarlo de en medio cuanto antes. No pensé en las evidencias.', key: true},
      {id: 'sy2', q: '¿Qué cambió después de INC-05?', a: 'Segmentamos la red de pruebas y ahora parcheamos los críticos en una semana. Está en el acta.', key: true},
      {id: 'sy3', q: '¿Y el certificado de INC-02?', a: 'Caducó un viernes. Lo renové y la sede volvió a funcionar en 50 minutos.'}
    ]},
    {id: 'dpd', name: 'Carmen Aznar', role: 'Delegada de Protección de Datos (DPD)', qs: [
      {id: 'dp1', q: '¿Desde cuándo cuenta el plazo de 72 horas?', a: 'Desde que se tiene constancia de la brecha, no desde que se clasifica. En INC-03 eso fue el aviso de la clínica, el 17 a las 16:00.', key: true},
      {id: 'dp2', q: '¿Por qué no se notificó la pérdida del portátil?', a: 'El disco estaba cifrado y la clave no se comprometió. Lo valoré, lo dejé por escrito y lo firmé.', key: true},
      {id: 'dp3', q: '¿Se avisó a las clínicas en INC-03?', a: 'Sí, el 19 de marzo, como encargados del tratamiento.'}
    ]}
  ],

  tests: [
    {id: 'P-01', crit: 'p2', t: '¿Cada incidente de la muestra se evaluó y clasificó?', ev: 'Clasificación en el registro.', how: 'Revisar EV-02.', fail: ['INC-02']},
    {id: 'P-02', crit: 'rgpd', t: '¿Las brechas con datos personales se notificaron en 72 horas o se justificó no hacerlo?', ev: 'Notificación en plazo o decisión documentada.', how: 'Comparar EV-03 con EV-04.', fail: ['INC-03'], needs: ['INC-03', 'INC-06']},
    {id: 'P-03', crit: 'p4', t: '¿Se conservaron las evidencias con cadena de custodia?', ev: 'Copia forense o registros conservados.', how: 'Revisar EV-06 y la cronología de cada incidente.', fail: ['INC-05'], needs: ['INC-03', 'INC-05']},
    {id: 'P-04', crit: 'p5', t: '¿Los incidentes altos o críticos tienen lecciones aprendidas?', ev: 'Acta con acciones y riesgos actualizados.', how: 'Revisar EV-05.', fail: ['INC-03'], needs: ['INC-03', 'INC-05']},
    {id: 'P-05', crit: 'p3', t: '¿Se contuvo cada incidente de forma rápida?', ev: 'Contención en la cronología.', how: 'Revisar EV-03 y EV-06.', fail: []}
  ],
  testStates: [['pend', 'Pendiente'], ['ok', 'Conforme'], ['nc', 'No conforme'], ['insuf', 'Evidencia insuficiente'], ['na', 'No aplica']],
  subjects: [['proc', 'La gestión de incidentes en general'], ['reg', 'El registro de incidentes']],

  conclusions: [
    {id: 'k1', t: 'La respuesta a incidentes es eficaz: se cumplió PRO-01 en todos los casos.'},
    {id: 'k2', t: 'La contención funciona, pero fallan la notificación en plazo, las evidencias y el aprendizaje en los incidentes más graves.'},
    {id: 'k3', t: 'Albatrel no tiene procedimiento de incidentes.'}
  ],
  conclusionOk: 'k2',

  hints: {
    brief: ['No se trata de buscar culpables, sino de comprobar si se siguió PRO-01.', 'El plazo legal de 72 horas es el punto más delicado.'],
    plan: ['Sin las notificaciones a la AEPD no puedes comprobar el plazo.', 'Volver a investigar el ransomware no es tu trabajo: el tuyo es comprobar cómo se respondió.'],
    sample: ['Incluye los incidentes más graves y los que obligaron a decidir algo.', 'Con seis incidentes, cuatro o más es razonable.'],
    evidence: ['La cronología te da las horas; las notificaciones, cuándo se avisó a la AEPD.', 'Un folleto del antivirus no demuestra nada sobre la respuesta.'],
    people: ['Pregunta a la DPD desde cuándo cuenta el plazo: no todos lo cuentan igual.', 'Una auditoría no busca culpables.'],
    tests: ['El plazo de 72 horas cuenta desde que se tiene constancia, no desde que se clasifica.', 'Las lecciones aprendidas solo son obligatorias en incidentes altos y críticos.'],
    findings: ['No notificar una brecha puede ser correcto si se valoró, se justificó y se documentó.', 'Un incidente bajo sin reunión de lecciones aprendidas cumple PRO-01.'],
    report: ['Contener rápido no compensa perder las evidencias ni notificar tarde.', 'Acción correctiva: que no dependa de recordarlo a las cuatro de la mañana.']
  },

  key: [
    {id: 'K1', subj: 'INC-03', type: 'nc', crit: ['rgpd', 'p3'], ev: ['EV-03', 'EV-04'],
     t: 'INC-03: la AEPD se notificó a las 96 horas',
     why: 'Albatrel tuvo constancia el 17/03 a las 16:00 (aviso de la clínica) y notificó el 21/03 a las 16:00: 96 horas. El plazo se contó desde la clasificación, no desde la constancia, como recuerda la DPD.'},
    {id: 'K2', subj: 'INC-03', type: 'nc', crit: ['p5', 'p3'], ev: ['EV-05', 'EV-02'],
     t: 'INC-03: sin lecciones aprendidas tras un incidente alto',
     why: 'PRO-01 §5 exige la reunión tras cada incidente alto o crítico. En INC-03, el más grave para los datos de salud, no consta.'},
    {id: 'K3', subj: 'INC-05', type: 'nc', crit: ['p4', 'a528'], ev: ['EV-06'],
     t: 'INC-05: se perdieron las evidencias del ransomware',
     why: 'El servidor se formateó sin copia forense y los registros se perdieron. La contención fue buena, pero PRO-01 §4 y el control 5.28 piden conservar las evidencias.'},
    {id: 'K4', subj: 'INC-02', type: 'obs', alt: ['nc', 'om'], crit: ['p2'], ev: ['EV-02', 'EV-07'],
     t: 'INC-02: un evento sin evaluar ni clasificar',
     why: 'La caída de la sede electrónica se resolvió en 50 minutos, pero nadie la evaluó como pide PRO-01 §2. Sin impacto en datos, se informa como observación.'}
  ],
  traps: [
    {subj: 'INC-04', t: 'INC-04 no es un hallazgo', why: 'Es un incidente bajo: PRO-01 solo exige lecciones aprendidas en los altos y críticos.'},
    {subj: 'INC-06', t: 'INC-06 no es un hallazgo', why: 'No notificar fue una decisión valorada, justificada (disco cifrado, clave segura) y firmada por la DPD. El RGPD no obliga a notificar si el riesgo es improbable.'},
    {subj: 'INC-01', t: 'INC-01 es conforme', why: 'Phishing denunciado, clasificado como bajo y cerrado el mismo día.'}
  ],
  model: {
    summary: 'Se auditaron los incidentes del primer semestre de 2026. La contención fue rápida en todos los casos, pero en los dos incidentes más graves falló lo que viene después: la brecha de historias clínicas se notificó a la AEPD a las 96 horas y no tuvo lecciones aprendidas, y en el ransomware se perdieron las evidencias. Un evento quedó sin clasificar. Las decisiones del portátil perdido y del phishing bajo fueron correctas.',
    actions: [
      ['Corrección', 'Celebrar ya la reunión de lecciones aprendidas de INC-03 y actualizar el riesgo R-02.'],
      ['Corrección', 'Clasificar INC-02 en el registro.'],
      ['Acción correctiva', 'Escribir en PRO-01 que las 72 horas cuentan desde la constancia y avisar a la DPD desde el primer momento.'],
      ['Acción correctiva', 'Lista de comprobación de guardia: copia forense antes de formatear.'],
      ['Acción correctiva', 'Que todo evento de sistemas se registre y se envíe a la RSEG para clasificarlo.']
    ]
  }
};

A.cases[C.id] = C; A.order.push(C.id);
if (window.I18N && I18N.lang === 'en') I18N.deep(C);
})();
