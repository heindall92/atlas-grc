/* Atlas GRC · Simulador de auditoría · Caso 04: «Proveedores con acceso a datos»
   Todo es FICTICIO, también las empresas proveedoras. Coherente con el riesgo R-05 de Albatrel (hosting)
   y con su acción del plan de tratamiento: cláusulas de seguridad y de notificación de brechas, en curso. */
(function () {
const A = window.AUDIT || (window.AUDIT = {cases: {}, order: []});

const C = {
  id: 'c04', v: 1, n: '04',
  t: 'Proveedores con acceso a datos',
  s: 'Auditoría interna de los proveedores de Albatrel: registro, contratos de encargado, cláusulas de seguridad y revisiones.',
  kind: 'Auditoría interna', level: 'Intermedio', mins: 55,
  skills: ['Definir la población', 'Leer contratos', 'Distinguir lo ya tratado', 'Informar'],

  brief: {
    from: 'Elena Sanz · Responsable de Seguridad de Albatrel',
    date: '5 de octubre de 2026',
    body: [
      'Varios proveedores tocan datos de Albatrel: el hosting de la app de clínicas, la gestoría de nóminas, el soporte del software de tributos… El riesgo R-05 ya nos dijo que el hosting es delicado.',
      'Audita si los proveedores con acceso a datos están en el registro, tienen contrato de encargado del tratamiento con cláusulas de seguridad y se revisan cada año.',
      'Trabajo de campo el 13 de octubre.'
    ],
    facts: [
      ['Organización', 'Albatrel Servicios Digitales, S.L. · 60 personas · Zaragoza'],
      ['Periodo auditado', 'Proveedores activos a 30 de septiembre de 2026'],
      ['Trabajo de campo', '13 de octubre de 2026'],
      ['Auditor', 'Tú, como auditor interno (sin relación con las compras)'],
      ['Destinatario del informe', 'Comité de Seguridad y Gerencia']
    ]
  },

  plan: {
    objectives: [
      {id: 'o1', t: 'Comprobar si los proveedores con acceso a datos están identificados, tienen contrato con cláusulas de seguridad y se revisan, según 5.19 a 5.22 y el RGPD.'},
      {id: 'o2', t: 'Negociar mejores precios con los proveedores.'},
      {id: 'o3', t: 'Auditar por dentro los sistemas de cada proveedor.'}
    ],
    objectiveOk: 'o1',
    systems: [
      {id: 'reg', t: 'Registro de proveedores del SGSI', in: true},
      {id: 'con', t: 'Contratos y anexos de encargado del tratamiento', in: true},
      {id: 'pay', t: 'Listado de proveedores con facturas (contabilidad)', in: true},
      {id: 'rev', t: 'Revisiones anuales de proveedores', in: true},
      {id: 'net', t: 'Cortafuegos de la oficina', in: false},
      {id: 'mkt', t: 'Campañas de marketing', in: false}
    ],
    criteria: [
      {id: 'a519', t: 'Anexo A 5.19 · Seguridad de la información en las relaciones con los proveedores', rel: true},
      {id: 'a520', t: 'Anexo A 5.20 · Seguridad en los acuerdos con proveedores', rel: true},
      {id: 'a522', t: 'Anexo A 5.22 · Seguimiento, revisión y gestión de cambios de los servicios de proveedores', rel: true},
      {id: 'rgpd', t: 'RGPD art. 28 · Contrato de encargado del tratamiento', rel: true},
      {id: 'ptr', t: 'PTR-01 · Acción del riesgo R-05 (cláusulas del contrato de hosting)', rel: true},
      {id: 'a813', t: 'Anexo A 8.13 · Copias de seguridad de la información', rel: false},
      {id: 'a77', t: 'Anexo A 7.7 · Puesto de trabajo despejado y pantalla limpia', rel: false}
    ],
    techniques: [
      {id: 'doc', t: 'Revisión documental de contratos', rel: true},
      {id: 'int', t: 'Entrevistas', rel: true},
      {id: 'smp', t: 'Muestreo de proveedores', rel: true},
      {id: 'cmp', t: 'Cruce del registro con la contabilidad', rel: true},
      {id: 'vis', t: 'Visitar las oficinas de cada proveedor sin avisar', rel: false}
    ],
    agenda: [
      ['13 oct · 9:00', 'Reunión de apertura con la Responsable de Seguridad'],
      ['13 oct · 9:30', 'Entrevista a la Gerencia: contratos y compras'],
      ['13 oct · 11:00', 'Revisión de contratos de la muestra'],
      ['13 oct · 12:30', 'Entrevista al Responsable del Sistema: accesos de proveedores'],
      ['13 oct · 13:30', 'Reunión de cierre: hallazgos preliminares']
    ]
  },

  population: [
    {id: 'PR-01', role: 'NubeAragón · hosting de la app de clínicas', out: '2023', q: 1},
    {id: 'PR-02', role: 'Gestoría Ebro · nóminas', out: '2021', q: 1},
    {id: 'PR-03', role: 'Clima Pilar · mantenimiento de la climatización', out: '2022', q: 1},
    {id: 'PR-04', role: 'Proveedor de correo en la nube', out: '2020', q: 2},
    {id: 'PR-05', role: 'Destrucciones Moncayo · destrucción de papel', out: '2025', q: 2},
    {id: 'PR-06', role: 'TributaSoft · soporte del software de tributos', out: '2024', q: 2}
  ],
  sampleMin: 4,
  popIntro: 'Estos son los proveedores con facturas en el último año, según contabilidad (la población). La columna indica desde cuándo trabajan con Albatrel.',
  sampleWhyPh: '¿Por qué estos proveedores? Piensa en qué datos tocan y en cómo acceden.',
  checks: {
    sys: [{id: 'pay', bad: 'El alcance no incluye la contabilidad: sin ella no puedes saber si el registro de proveedores está completo.'}],
    sysGood: 'El alcance incluye el registro, los contratos, las revisiones y la contabilidad para cruzarlos.',
    mustSample: {ids: ['PR-06'], good: 'La muestra incluye a TributaSoft, que entra en remoto a los sistemas con datos del padrón.', bad: 'La muestra no incluye a TributaSoft, el único proveedor que entra en remoto a sistemas con datos personales.'},
    ev: [{id: 'EV-02', bad: 'No pediste el registro de proveedores del SGSI: es el centro del encargo.'}, {id: 'EV-06', bad: 'No pediste el plan de tratamiento: sin él no sabes qué huecos ya están en tratamiento.'}]
  },

  evidence: [
    {id: 'EV-01', t: 'Listado de proveedores con facturas (último año)', from: 'Gerencia', type: 'Registro', date: '30/09/2026', rel: true,
     table: {head: ['Proveedor', 'Servicio', 'Importe anual'], rows: [
       ['NubeAragón', 'Hosting de la app de clínicas', '38.400 €'], ['Gestoría Ebro', 'Nóminas y seguros sociales', '7.200 €'],
       ['Clima Pilar', 'Mantenimiento de la climatización', '2.900 €'], ['Correo en la nube', 'Correo y ofimática', '9.800 €'],
       ['Destrucciones Moncayo', 'Destrucción certificada de papel', '1.100 €'], ['TributaSoft', 'Soporte del software de tributos', '12.500 €']]}},
    {id: 'EV-02', t: 'Registro de proveedores del SGSI', from: 'Responsable de Seguridad', type: 'Registro', date: '30/09/2026', rel: true,
     table: {head: ['Proveedor', 'Datos personales', 'Contrato de encargado', 'Última revisión'], rows: [
       ['NubeAragón', 'Sí (salud)', 'Sí, 2023', '15/03/2026'], ['Gestoría Ebro', 'Sí (plantilla)', 'Sí, 2021', '20/05/2024'],
       ['Clima Pilar', 'No', 'No aplica', '10/02/2026'], ['Correo en la nube', 'Sí', 'Sí (condiciones en línea)', '12/01/2026'],
       ['TributaSoft', 'Sí (padrón y tributos)', 'No', '—']]}},
    {id: 'EV-03', t: 'Contrato de hosting con NubeAragón', from: 'Gerencia', type: 'Documento', date: '01/06/2023', rel: true,
     table: {head: ['Cláusula', 'Contenido'], rows: [
       ['Encargado del tratamiento', 'Sí, con instrucciones, confidencialidad y subencargados.'],
       ['Medidas de seguridad', 'Cifrado, copias y control de accesos.'],
       ['Notificación de brechas', 'No figura.'],
       ['Auditoría por el cliente', 'Sí, con un aviso de 30 días.']]}},
    {id: 'EV-04', t: 'Contrato de soporte con TributaSoft', from: 'Gerencia', type: 'Documento', date: '10/01/2024', rel: true,
     note: 'Contrato comercial de soporte. No incluye anexo de encargado del tratamiento.',
     table: {head: ['Cláusula', 'Contenido'], rows: [
       ['Objeto', 'Soporte y actualizaciones del software de tributos.'],
       ['Acceso', 'Acceso remoto a los servidores de tributos cuando haya incidencias.'],
       ['Confidencialidad', 'Cláusula genérica de confidencialidad comercial.'],
       ['Encargado del tratamiento', 'No figura.']]}},
    {id: 'EV-05', t: 'Registro de accesos remotos de proveedores', from: 'Responsable del Sistema', type: 'Extracto de sistema', date: '13/10/2026', rel: true,
     table: {head: ['Proveedor', 'Accesos en el último año', 'Sistemas'], rows: [
       ['TributaSoft', '14', 'Servidores de tributos y padrón'], ['NubeAragón', '— (opera su propia plataforma)', '—']]}},
    {id: 'EV-06', t: 'Plan de tratamiento de riesgos (PTR-01), riesgo R-05', from: 'Responsable de Seguridad', type: 'Registro', date: '30/09/2026', rel: true, link: '#/caso',
     table: {head: ['Riesgo', 'Acción', 'Responsable', 'Plazo', 'Estado'], rows: [
       ['R-05', 'Cláusulas de seguridad y de notificación de brechas en el contrato de hosting', 'Gerencia', 'Dic 2026', 'En curso: borrador enviado a NubeAragón']]}},
    {id: 'EV-07', t: 'Certificado de destrucción de Destrucciones Moncayo', from: 'Gerencia', type: 'Documento', date: '18/06/2026', rel: true,
     note: 'Certifica la destrucción de 12 cajas de expedientes del padrón. No hay contrato firmado: el servicio se pide por correo cada vez.'},
    {id: 'EV-90', t: 'Encuesta de satisfacción con los proveedores', from: 'Gerencia', type: 'Informe', date: '01/07/2026', rel: false,
     note: 'Puntuaciones de 1 a 5 sobre trato y puntualidad. No dice nada de seguridad ni de datos.'},
    {id: 'EV-91', t: 'Catálogo de servicios de NubeAragón', from: 'Gerencia', type: 'Documento', date: '2026', rel: false,
     note: 'Folleto comercial del proveedor. No es el contrato.'}
  ],

  people: [
    {id: 'ger', name: 'Lucía Ferrer', role: 'Gerente de Albatrel', qs: [
      {id: 'ge1', q: '¿Cómo se da de alta un proveedor en el registro?', a: 'Cuando firmamos un contrato, se lo paso a Elena y ella lo añade. Si no hay contrato, no pasa por ella.', key: true},
      {id: 'ge2', q: '¿Por qué TributaSoft no tiene contrato de encargado?', a: 'Lo contratamos deprisa cuando se jubiló el técnico que lo llevaba. Firmamos su contrato estándar y no caímos en el anexo.', key: true},
      {id: 'ge3', q: '¿Cómo va el nuevo contrato con NubeAragón?', a: 'Les enviamos el borrador con las cláusulas de brechas en agosto. Está en el plan de tratamiento para diciembre.', key: true},
      {id: 'ge4', q: '¿Cuánto paga Albatrel a cada proveedor?', a: 'Eso está en contabilidad, pero no veo qué tiene que ver con la seguridad.', off: true}
    ]},
    {id: 'sec', name: 'Elena Sanz', role: 'Responsable de Seguridad (RSEG)', qs: [
      {id: 'se1', q: '¿Cada cuánto revisáis a los proveedores?', a: 'Una vez al año, con un cuestionario y sus certificados. La gestoría se me ha quedado atrás.', key: true},
      {id: 'se2', q: '¿Conoces a Destrucciones Moncayo?', a: 'No me suena. Si destruyen papel del padrón, tendrían que estar en el registro.', key: true},
      {id: 'se3', q: '¿Por qué Clima Pilar no tiene contrato de encargado?', a: 'Porque no toca datos: solo mantiene las máquinas de la sala técnica, siempre acompañado.', key: true}
    ]},
    {id: 'sys', name: 'Sergio Lahoz', role: 'Responsable del Sistema (RSIS)', qs: [
      {id: 'sy1', q: '¿Cómo entra TributaSoft en los servidores?', a: 'Por VPN con un usuario propio cuando abren una incidencia. Ven las bases de datos de padrón y tributos.', key: true},
      {id: 'sy2', q: '¿Y el proveedor de correo?', a: 'Aceptamos sus condiciones en línea, que incluyen el contrato de encargado. Está en el registro.', key: true},
      {id: 'sy3', q: '¿Usáis el catálogo de NubeAragón para algo?', a: 'Para nada técnico; es publicidad.'}
    ]}
  ],

  tests: [
    {id: 'P-01', crit: 'a519', t: '¿Los proveedores de la muestra están en el registro del SGSI?', ev: 'Cada proveedor con datos aparece en EV-02.', how: 'Cruzar EV-01 con EV-02.', fail: ['PR-05']},
    {id: 'P-02', crit: 'rgpd', t: '¿Los que tratan datos personales tienen contrato de encargado?', ev: 'Contrato o anexo de encargado firmado.', how: 'Revisar EV-02, EV-03 y EV-04.', fail: ['PR-06', 'PR-05'], needs: ['PR-01', 'PR-02', 'PR-04', 'PR-05', 'PR-06']},
    {id: 'P-03', crit: 'a520', t: '¿Los contratos incluyen las cláusulas de seguridad necesarias?', ev: 'Medidas de seguridad y notificación de brechas.', how: 'Leer los contratos de la muestra.', fail: ['PR-01', 'PR-06'], needs: ['PR-01', 'PR-02', 'PR-04', 'PR-06']},
    {id: 'P-04', crit: 'a522', t: '¿Se revisa cada año a los proveedores de la muestra?', ev: 'Última revisión hace menos de un año.', how: 'Revisar la columna «Última revisión» de EV-02.', fail: ['PR-02', 'PR-06', 'PR-05']},
    {id: 'P-05', crit: 'ptr', t: '¿Los huecos conocidos están en el plan de tratamiento con plazo?', ev: 'Acción registrada, con responsable y plazo.', how: 'Revisar EV-06.', fail: [], needs: ['PR-01']}
  ],
  testStates: [['pend', 'Pendiente'], ['ok', 'Conforme'], ['nc', 'No conforme'], ['insuf', 'Evidencia insuficiente'], ['na', 'No aplica']],
  subjects: [['proc', 'La gestión de proveedores en general'], ['reg', 'El registro de proveedores del SGSI']],

  conclusions: [
    {id: 'k1', t: 'La gestión de proveedores es eficaz: todos están controlados.'},
    {id: 'k2', t: 'Hay un proceso, pero no cubre a los proveedores que entran sin contrato: uno accede a datos personales sin contrato de encargado.'},
    {id: 'k3', t: 'Albatrel no tiene proveedores con acceso a datos.'}
  ],
  conclusionOk: 'k2',

  hints: {
    brief: ['El registro solo sabe de los proveedores que alguien dio de alta. La contabilidad sabe de todos los que cobran.', 'La pregunta clave: ¿quién toca datos personales y con qué contrato?'],
    plan: ['Sin la contabilidad no puedes saber si el registro está completo.', 'Auditar a Albatrel no es auditar los sistemas del proveedor.'],
    sample: ['Elige por riesgo: quién toca más datos y quién entra en los sistemas.', 'Con seis proveedores, cuatro o más es razonable.'],
    evidence: ['Un folleto comercial no es un contrato.', 'El plan de tratamiento te dice qué huecos ya se conocen y se están arreglando.'],
    people: ['La Gerencia firma los contratos; la RSEG lleva el registro; el RSIS sabe quién entra.', 'Los importes no son asunto de esta auditoría.'],
    tests: ['Un proveedor que no toca datos no necesita contrato de encargado.', 'Unas condiciones en línea aceptadas pueden ser un contrato de encargado válido.'],
    findings: ['Un hueco que ya está en el plan de tratamiento, con responsable y plazo, se informa como observación.', 'Que un proveedor falte en el registro es un fallo del proceso, no solo de ese proveedor.'],
    report: ['El hallazgo más grave es quien entra a datos personales sin contrato de encargado.', 'Acción correctiva: que ningún proveedor cobre sin pasar por el registro.']
  },

  key: [
    {id: 'K1', subj: 'PR-06', type: 'nc', crit: ['rgpd', 'a520', 'a519'], ev: ['EV-04', 'EV-02', 'EV-05'],
     t: 'TributaSoft entra a datos personales sin contrato de encargado',
     why: 'Accede en remoto a los servidores de padrón y tributos (14 accesos), pero su contrato es solo comercial. Falta el contrato de encargado que exige el RGPD, y además nunca se ha revisado.'},
    {id: 'K2', subj: 'PR-02', type: 'nc', crit: ['a522'], ev: ['EV-02'],
     t: 'Gestoría Ebro: sin revisión desde 2024',
     why: 'Trata datos de toda la plantilla y la última revisión es del 20/05/2024. 5.22 pide seguimiento y revisión periódicos: la anual se ha saltado.'},
    {id: 'K3', subj: 'PR-05', type: 'nc', alt: ['obs'], crit: ['a519', 'rgpd'], ev: ['EV-01', 'EV-02', 'EV-07'],
     t: 'Destrucciones Moncayo no está en el registro ni tiene contrato',
     why: 'Destruye expedientes del padrón (EV-07) y cobra (EV-01), pero no aparece en el registro del SGSI. Se le encarga por correo, sin contrato. El alta en el registro depende de que haya contrato, y aquí no lo hubo.'},
    {id: 'K4', subj: 'PR-01', type: 'obs', alt: ['om', 'nc'], crit: ['a520', 'ptr'], ev: ['EV-03', 'EV-06'],
     t: 'NubeAragón: falta la cláusula de brechas, ya en tratamiento',
     why: 'El contrato no incluye la notificación de brechas, pero el hueco está en el plan de tratamiento con responsable, plazo y un borrador enviado. Se informa como observación para seguir su cierre.'}
  ],
  traps: [
    {subj: 'PR-03', t: 'PR-03 no es un hallazgo', why: 'Clima Pilar no trata datos personales: solo mantiene la climatización, acompañado. No necesita contrato de encargado.'},
    {subj: 'PR-04', t: 'PR-04 no es un hallazgo', why: 'Las condiciones en línea del proveedor de correo incluyen el contrato de encargado, están aceptadas y figuran en el registro, revisado en enero.'}
  ],
  model: {
    summary: 'Se auditaron los proveedores con acceso a datos de Albatrel. El registro y la revisión anual funcionan para los proveedores con contrato, pero no para los que entran sin él: TributaSoft accede a datos del padrón sin contrato de encargado y Destrucciones Moncayo ni siquiera figura en el registro. La gestoría lleva dos años sin revisarse. El hueco del contrato de hosting ya está en tratamiento.',
    actions: [
      ['Corrección', 'Firmar con TributaSoft el anexo de encargado del tratamiento antes de su próximo acceso.'],
      ['Corrección', 'Dar de alta a Destrucciones Moncayo y firmar su contrato.'],
      ['Acción correctiva', 'Que contabilidad no pague a ningún proveedor que no esté en el registro del SGSI.'],
      ['Acción correctiva', 'Calendario anual de revisiones con aviso a la RSEG un mes antes.'],
      ['Seguimiento', 'Comprobar en diciembre la firma del nuevo contrato con NubeAragón.']
    ]
  }
};

A.cases[C.id] = C; A.order.push(C.id);
if (window.I18N && I18N.lang === 'en') I18N.deep(C);
})();
