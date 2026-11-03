/* Atlas GRC · Simulador de auditoría · Caso 01: «Bajas de personal: ¿se retiraron todos los accesos?»
   Todo es FICTICIO: Albatrel, sus personas, cuentas, tickets y extractos se han inventado para practicar.
   Coherente con el caso Albatrel de la app: NOR-01 §2 («los accesos se retiran el mismo día de la salida»),
   NOR-01 §4 (cuentas de administrador separadas), NOR-01 §5 (revisión trimestral) y el riesgo R-09.
   Estructura:
   - brief, plan, población y evidencias: lo que ve el alumno;
   - key: la «verdad de referencia» que solo se muestra después de entregar. */
(function () {
const A = window.AUDIT || (window.AUDIT = {cases: {}, order: []});

const C = {
  id: 'c01', v: 1, n: '01',
  t: 'Bajas de personal: ¿se retiraron todos los accesos?',
  s: 'Auditoría interna del proceso de bajas de Albatrel: muestreo, evidencias, entrevistas, hallazgos e informe.',
  kind: 'Auditoría interna', level: 'Inicial', mins: 60,
  skills: ['Planificar', 'Muestrear', 'Pedir evidencias', 'Redactar hallazgos', 'Informar'],

  /* ── 1. Encargo ── */
  brief: {
    from: 'Elena Sanz · Responsable de Seguridad de Albatrel',
    date: '6 de julio de 2026',
    body: [
      'Dentro del programa de auditoría interna de 2026 (cláusula 9.2), te encargo auditar el proceso de bajas de personal.',
      'En el plan de tratamiento, la acción del riesgo R-09 («una persona que deja la empresa conserva sus accesos») figura como hecha. La Gerencia quiere saber si eso es verdad en la práctica, no solo en el papel.',
      'Tienes dos días de trabajo de campo, el 13 y el 14 de julio. El informe se presenta en el Comité de Seguridad del día 20.'
    ],
    facts: [
      ['Organización', 'Albatrel Servicios Digitales, S.L. · 60 personas · Zaragoza'],
      ['Periodo auditado', '1 de enero a 30 de junio de 2026'],
      ['Trabajo de campo', '13 y 14 de julio de 2026'],
      ['Auditor', 'Tú, como auditor interno (independiente del proceso de bajas)'],
      ['Destinatario del informe', 'Comité de Seguridad y Gerencia']
    ]
  },

  /* ── 2. Plan ── */
  plan: {
    objectives: [
      {id: 'o1', t: 'Comprobar si los accesos de quienes dejan Albatrel se retiran a tiempo y en todos los sistemas, según NOR-01 y los controles aplicables del Anexo A.'},
      {id: 'o2', t: 'Revisar la configuración técnica del Directorio Activo y proponer mejoras de seguridad.'},
      {id: 'o3', t: 'Evaluar el desempeño del departamento de RR. HH. en la gestión de las salidas.'}
    ],
    objectiveOk: 'o1',
    systems: [
      {id: 'ad', t: 'Directorio Activo (cuentas de red y de administrador)', in: true},
      {id: 'm365', t: 'Microsoft 365 (correo y archivos)', in: true},
      {id: 'vpn', t: 'VPN de teletrabajo', in: true},
      {id: 'app', t: 'Consola de soporte de la app de clínicas', in: true},
      {id: 'wifi', t: 'Wi-Fi de invitados de la oficina', in: false},
      {id: 'pay', t: 'Programa de nóminas de la gestoría externa', in: false}
    ],
    criteria: [
      {id: 'nor2', t: 'NOR-01 §2 · Altas, cambios y bajas («los accesos se retiran el mismo día de la salida»)', rel: true},
      {id: 'nor4', t: 'NOR-01 §4 · Accesos privilegiados (cuentas de administrador separadas)', rel: true},
      {id: 'nor5', t: 'NOR-01 §5 · Revisión trimestral de permisos por los dueños de cada sistema', rel: true},
      {id: 'a518', t: 'Anexo A 5.18 · Derechos de acceso', rel: true},
      {id: 'a65', t: 'Anexo A 6.5 · Responsabilidades tras la finalización o cambio de empleo', rel: true},
      {id: 'a82', t: 'Anexo A 8.2 · Derechos de acceso privilegiado', rel: true},
      {id: 'a813', t: 'Anexo A 8.13 · Copias de seguridad de la información', rel: false},
      {id: 'a712', t: 'Anexo A 7.12 · Seguridad del cableado', rel: false}
    ],
    techniques: [
      {id: 'doc', t: 'Revisión documental', rel: true},
      {id: 'int', t: 'Entrevistas', rel: true},
      {id: 'smp', t: 'Muestreo de expedientes', rel: true},
      {id: 'cmp', t: 'Comparación de extractos de sistemas con las fechas de salida', rel: true},
      {id: 'pen', t: 'Pruebas de intrusión contra los sistemas', rel: false}
    ],
    agenda: [
      ['13 jul · 9:00', 'Reunión de apertura con la Responsable de Seguridad'],
      ['13 jul · 10:00', 'Entrevista a RR. HH. y revisión de la lista de bajas'],
      ['13 jul · 12:00', 'Entrevista al Responsable del Sistema y extractos técnicos'],
      ['14 jul · 9:30', 'Entrevista al responsable de la app de clínicas'],
      ['14 jul · 11:00', 'Pruebas sobre la muestra y redacción de hallazgos'],
      ['14 jul · 13:30', 'Reunión de cierre: hallazgos preliminares']
    ]
  },

  /* ── 3. Población: todas las bajas del periodo ── */
  population: [
    {id: 'B-01', role: 'Técnica de soporte a ayuntamientos', out: '16/01/2026', q: 1},
    {id: 'B-02', role: 'Desarrollador', out: '13/02/2026', q: 1},
    {id: 'B-03', role: 'Analista de datos', out: '06/03/2026', q: 1},
    {id: 'B-04', role: 'Técnico de soporte a clínicas', out: '27/03/2026', q: 1},
    {id: 'B-05', role: 'Comercial', out: '30/04/2026', q: 2},
    {id: 'B-06', role: 'Administrativa', out: '15/05/2026', q: 2},
    {id: 'B-07', role: 'Administrador de sistemas', out: '29/05/2026', q: 2, priv: true},
    {id: 'B-08', role: 'Técnica de soporte a clínicas', out: '26/06/2026', q: 2}
  ],
  sampleMin: 5,
  popIntro: 'Estas son todas las bajas del periodo (la población).',
  sampleWhyPh: '¿Por qué estas bajas? Piensa en riesgo y en el periodo.',
  /* Comprobaciones propias del caso para la evaluación */
  checks: {
    sys: [{id: 'app', bad: 'El alcance no incluye la consola de soporte de clínicas, donde también hay cuentas de personas.'}],
    sysGood: 'El alcance incluye todos los sistemas con cuentas de usuario, también los que no gestiona TI.',
    mustSample: {ids: ['B-07'], good: 'La muestra incluye la baja de un administrador, la de mayor riesgo.', bad: 'La muestra no incluye la baja del administrador de sistemas, la de mayor riesgo.'},
    ev: [{id: 'EV-06', bad: 'No pediste el extracto de la consola de clínicas.'}, {id: 'EV-07', bad: 'No pediste el registro de excepciones: sin él no se puede saber si una demora estaba autorizada.'}]
  },

  /* ── 4. Evidencias que se pueden pedir (dos no sirven para este encargo) ── */
  evidence: [
    {id: 'EV-01', t: 'NOR-01 · Normativa de control de accesos (v1.2)', from: 'Responsable de Seguridad', type: 'Documento', date: '12/01/2026', rel: true,
     note: 'Versión 1.2, aprobada por el Comité de Seguridad el 12/01/2026. Puedes leerla completa en el caso Albatrel.', link: '#/doc/nacc',
     table: {head: ['Apartado', 'Qué dice'], rows: [
       ['§2', 'RR. HH. comunica altas y bajas al RSIS con una semana de antelación cuando sea posible. El responsable del área aprueba los permisos; el RSIS los ejecuta. Los accesos se retiran el mismo día de la salida.'],
       ['§4', 'Cuentas de administrador separadas de las de uso diario. Registro y revisión mensual de su uso.'],
       ['§5', 'Los dueños de cada sistema revisan los permisos cada trimestre.']]}},
    {id: 'EV-02', t: 'Listado de bajas del primer semestre', from: 'RR. HH.', type: 'Registro', date: '10/07/2026', rel: true,
     table: {head: ['Baja', 'Puesto', 'Salida', 'Aviso a TI'], rows: [
       ['B-01', 'Técnica de soporte a ayuntamientos', '16/01/2026', '09/01/2026'],
       ['B-02', 'Desarrollador', '13/02/2026', '19/02/2026'],
       ['B-03', 'Analista de datos', '06/03/2026', '27/02/2026'],
       ['B-04', 'Técnico de soporte a clínicas', '27/03/2026', '20/03/2026'],
       ['B-05', 'Comercial', '30/04/2026', '23/04/2026'],
       ['B-06', 'Administrativa', '15/05/2026', '08/05/2026'],
       ['B-07', 'Administrador de sistemas', '29/05/2026', '15/05/2026'],
       ['B-08', 'Técnica de soporte a clínicas', '26/06/2026', '19/06/2026']]}},
    {id: 'EV-03', t: 'Tickets de baja de TI', from: 'Responsable del Sistema', type: 'Registro', date: '10/07/2026', rel: true,
     note: 'La plantilla del ticket de baja incluye tres tareas: Directorio Activo, Microsoft 365 y VPN.',
     table: {head: ['Ticket', 'Baja', 'Abierto', 'Cerrado', 'Estado', 'Verificado por'], rows: [
       ['TI-2026-014', 'B-01', '09/01/2026', '16/01/2026', 'Cerrado', 'RSIS'],
       ['TI-2026-031', 'B-02', '19/02/2026', '20/02/2026', 'Cerrado', 'RSIS'],
       ['TI-2026-044', 'B-03', '27/02/2026', '05/04/2026', 'Cerrado', 'RSIS'],
       ['TI-2026-052', 'B-04', '20/03/2026', '27/03/2026', 'Cerrado', 'RSIS'],
       ['TI-2026-067', 'B-05', '23/04/2026', '30/04/2026', 'Cerrado', 'RSIS'],
       ['TI-2026-075', 'B-06', '08/05/2026', '—', 'En curso', '—'],
       ['TI-2026-081', 'B-07', '15/05/2026', '29/05/2026', 'Cerrado', 'RSIS'],
       ['TI-2026-093', 'B-08', '19/06/2026', '26/06/2026', 'Cerrado', 'RSIS']]}},
    {id: 'EV-04', t: 'Extracto del Directorio Activo: cuentas de las bajas', from: 'Responsable del Sistema', type: 'Extracto de sistema', date: '13/07/2026', rel: true,
     note: 'Obtenido en presencia del auditor el 13/07/2026.',
     table: {head: ['Cuenta', 'Baja', 'Deshabilitada el', 'Último inicio de sesión'], rows: [
       ['acastro', 'B-01', '16/01/2026', '16/01/2026'],
       ['jmoreno', 'B-02', '20/02/2026', '13/02/2026'],
       ['lvidal', 'B-03', '05/04/2026', '20/03/2026'],
       ['tlopez', 'B-04', '27/03/2026', '27/03/2026'],
       ['nperez', 'B-05', '30/04/2026', '30/04/2026'],
       ['rgomez', 'B-06', '15/05/2026', '15/05/2026'],
       ['dhernandez', 'B-07', '29/05/2026', '29/05/2026'],
       ['adm-dhernandez', 'B-07', '01/06/2026', '28/05/2026'],
       ['mruiz', 'B-08', '26/06/2026', '26/06/2026']]}},
    {id: 'EV-05', t: 'Extracto de Microsoft 365: usuarios dados de baja', from: 'Responsable del Sistema', type: 'Extracto de sistema', date: '13/07/2026', rel: true,
     table: {head: ['Usuario', 'Baja', 'Inicio de sesión bloqueado', 'Buzón'], rows: [
       ['acastro', 'B-01', '16/01/2026', 'Eliminado a los 30 días'],
       ['jmoreno', 'B-02', '20/02/2026', 'Eliminado a los 30 días'],
       ['lvidal', 'B-03', '05/04/2026', 'Eliminado a los 30 días'],
       ['tlopez', 'B-04', '27/03/2026', 'Eliminado a los 30 días'],
       ['nperez', 'B-05', '30/04/2026', 'Eliminado a los 30 días'],
       ['rgomez', 'B-06', '15/05/2026', 'Eliminado a los 30 días'],
       ['dhernandez', 'B-07', '29/05/2026', 'Eliminado a los 30 días'],
       ['mruiz', 'B-08', '26/06/2026', 'Convertido en buzón compartido (acceso de su responsable)']]}},
    {id: 'EV-06', t: 'Extracto de la consola de soporte de la app de clínicas', from: 'Responsable de producto', type: 'Extracto de sistema', date: '14/07/2026', rel: true,
     note: 'Solo tienen cuenta en la consola las personas de soporte a clínicas.',
     table: {head: ['Usuario', 'Baja', 'Estado', 'Desactivada el', 'Último acceso'], rows: [
       ['soporte.tlopez', 'B-04', 'Activa', '—', '26/03/2026'],
       ['soporte.mruiz', 'B-08', 'Desactivada', '26/06/2026', '25/06/2026']]}},
    {id: 'EV-07', t: 'Registro de excepciones de seguridad', from: 'Responsable de Seguridad', type: 'Registro', date: '10/07/2026', rel: true,
     table: {head: ['Excepción', 'Qué se permite', 'Aprobada por', 'Caduca'], rows: [
       ['EX-03', 'B-03: mantener activa la cuenta de lvidal (sin VPN) para el traspaso de informes a su sustituta.', 'Responsable de Seguridad, 02/03/2026', '05/04/2026']]}},
    {id: 'EV-08', t: 'Revisión trimestral de permisos del primer trimestre', from: 'Responsable de Seguridad', type: 'Acta', date: '15/04/2026', rel: true,
     table: {head: ['Sistema', 'Dueño', 'Revisado', 'Resultado'], rows: [
       ['Directorio Activo', 'RSIS', 'Sí, 14/04/2026', 'Sin incidencias'],
       ['Microsoft 365', 'RSIS', 'Sí, 14/04/2026', 'Dos licencias reasignadas'],
       ['VPN', 'RSIS', 'Sí, 14/04/2026', 'Sin incidencias'],
       ['Consola de soporte de clínicas', 'Responsable de producto', 'No', 'Pendiente de incorporar a la revisión']]}},
    {id: 'EV-09', t: 'Listas de comprobación de salida de RR. HH.', from: 'RR. HH.', type: 'Registro', date: '10/07/2026', rel: true,
     note: 'La lista de comprobación se usa desde el 1 de abril de 2026 (acción del riesgo R-09). Incluye: equipo devuelto, Directorio Activo, Microsoft 365, VPN y consola de clínicas.',
     table: {head: ['Baja', 'Lista', 'Equipo devuelto', 'Todos los accesos marcados', 'Firma'], rows: [
       ['B-01 a B-04', 'No existe (anterior a abril)', '—', '—', '—'],
       ['B-05', 'Sí', 'Sí', 'Sí', 'RR. HH. y RSIS'],
       ['B-06', 'Sí', 'Sí', 'Sí', 'Solo RR. HH.'],
       ['B-07', 'Sí', 'Sí', 'Sí', 'RR. HH. y RSIS'],
       ['B-08', 'Sí', 'Sí', 'Sí', 'RR. HH. y RSIS']]}},
    {id: 'EV-90', t: 'Informe mensual del antivirus', from: 'Responsable del Sistema', type: 'Informe', date: '01/07/2026', rel: false,
     note: 'Detecciones de malware por equipo en junio. No aporta nada sobre la retirada de accesos.'},
    {id: 'EV-91', t: 'Plan de formación de 2026', from: 'RR. HH.', type: 'Documento', date: '15/01/2026', rel: false,
     note: 'Cursos previstos para la plantilla. No aporta nada sobre la retirada de accesos.'}
  ],

  /* ── 5. Entrevistas: respuestas fijas, basadas en el caso ── */
  people: [
    {id: 'hr', name: 'Marta Ibáñez', role: 'Responsable de RR. HH.', qs: [
      {id: 'hr1', q: '¿Cómo os enteráis de que alguien se va y cómo avisáis a TI?', a: 'Cuando hay una baja voluntaria, normalmente lo sabemos con dos semanas. Abrimos un ticket a TI con la fecha de salida en cuanto lo sabemos.', key: true},
      {id: 'hr2', q: '¿Ha habido salidas que avisasteis tarde?', a: 'Sí, la del desarrollador de febrero. Fue un fin de contrato y la responsable de su área no nos lo dijo hasta la semana siguiente. Abrimos el ticket ese mismo día.', key: true},
      {id: 'hr3', q: '¿Desde cuándo usáis la lista de comprobación de salida?', a: 'Desde abril. Antes de eso no había lista; todo iba por el ticket de TI.', key: true},
      {id: 'hr4', q: '¿Quién firma la lista?', a: 'RR. HH. y el Responsable del Sistema. En la de mayo de la administrativa creo que falta la firma de TI; estaban de vacaciones.'},
      {id: 'hr5', q: '¿Qué opinas del nuevo convenio colectivo?', a: 'Eso no tiene que ver con la auditoría, ¿no? Prefiero no entrar ahí.', off: true}
    ]},
    {id: 'sys', name: 'Sergio Lahoz', role: 'Responsable del Sistema (RSIS)', qs: [
      {id: 'sy1', q: '¿Qué sistemas cubre el ticket de baja?', a: 'El Directorio Activo, Microsoft 365 y la VPN. La consola de clínicas no es mía: la gestiona el equipo de producto.', key: true},
      {id: 'sy2', q: '¿Cómo tratáis las cuentas de administrador?', a: 'Cada administrador tiene una cuenta normal y otra adm-. Al dar de baja, deshabilito las dos. Bueno, debería; la de David la quité el lunes siguiente porque el viernes se me pasó.', key: true},
      {id: 'sy3', q: '¿Por qué hay un ticket de mayo todavía abierto?', a: 'Hice las tareas el día de la salida, pero no cerré el ticket ni lo verifiqué. Se quedó así.', key: true},
      {id: 'sy4', q: '¿Por qué la cuenta de B-03 se quitó un mes tarde?', a: 'Había una excepción aprobada por Elena para el traspaso de informes. La VPN sí se la quité el día de la salida.', key: true},
      {id: 'sy5', q: '¿Puedes enseñarme cómo se deshabilita una cuenta?', a: 'Claro: se busca la cuenta, se deshabilita y se mueve a la unidad organizativa de bajas. Lo hacemos así siempre.'}
    ]},
    {id: 'prod', name: 'Pablo Gil', role: 'Responsable de producto de la app de clínicas', qs: [
      {id: 'pr1', q: '¿Quién da de baja las cuentas de la consola de soporte?', a: 'Yo, cuando me entero. Desde abril me llega por la lista de RR. HH. Antes dependía de que alguien me lo dijera.', key: true},
      {id: 'pr2', q: '¿Revisas los permisos de la consola cada trimestre?', a: 'Todavía no. Elena me pidió incorporarla a la revisión trimestral, pero aún no lo hemos hecho.', key: true},
      {id: 'pr3', q: '¿Qué puede hacer alguien con una cuenta de la consola?', a: 'Ver las agendas y las fichas de los pacientes de las clínicas para dar soporte. Es un acceso sensible.', key: true}
    ]},
    {id: 'sec', name: 'Elena Sanz', role: 'Responsable de Seguridad (RSEG)', qs: [
      {id: 'se1', q: '¿Cómo funcionan las excepciones?', a: 'Se piden por escrito, las apruebo yo, tienen fecha de caducidad y quedan en el registro de excepciones.', key: true},
      {id: 'se2', q: '¿Por qué la acción del riesgo R-09 figura como hecha?', a: 'Porque desde abril existe la lista de comprobación de RR. HH. Pensamos que con eso quedaba resuelto.', key: true},
      {id: 'se3', q: '¿Qué esperas de esta auditoría?', a: 'Saber si el proceso funciona de verdad. Si hay fallos, prefiero conocerlos antes que el auditor de certificación.'}
    ]}
  ],

  /* ── 6. Pruebas de auditoría (checklist) ── */
  tests: [
    {id: 'P-01', crit: 'nor2', t: '¿Existe un procedimiento de bajas aprobado y vigente?', ev: 'NOR-01 aprobada y en vigor durante el periodo.', how: 'Revisar versión, fecha y aprobación de NOR-01.', fail: [], exp: 'ok'},
    {id: 'P-02', crit: 'nor2', t: '¿Se deshabilita la cuenta del Directorio Activo el mismo día de la salida?', ev: 'Fecha de deshabilitación igual a la fecha de salida.', how: 'Comparar EV-02 con EV-04 para cada baja de la muestra.', fail: ['B-02']},
    {id: 'P-03', crit: 'nor2', t: '¿Se bloquea Microsoft 365 el mismo día de la salida?', ev: 'Fecha de bloqueo igual a la fecha de salida.', how: 'Comparar EV-02 con EV-05.', fail: ['B-02']},
    {id: 'P-04', crit: 'a518', t: '¿Se retiran también los accesos a la consola de soporte de clínicas?', ev: 'Cuenta desactivada en la consola el día de la salida.', how: 'Comparar EV-02 con EV-06 para las bajas con cuenta en la consola.', fail: ['B-04'], needs: ['B-04', 'B-08']},
    {id: 'P-05', crit: 'nor4', t: '¿Se deshabilitan las cuentas de administrador el mismo día?', ev: 'La cuenta adm- deshabilitada el día de la salida.', how: 'Buscar cuentas adm- de las bajas de la muestra en EV-04.', fail: ['B-07'], needs: ['B-07']},
    {id: 'P-06', crit: 'nor2', t: '¿Las demoras están cubiertas por una excepción aprobada y con caducidad?', ev: 'Excepción registrada, aprobada y respetada.', how: 'Cruzar las demoras con EV-07.', fail: [], needs: ['B-03']},
    {id: 'P-07', crit: 'nor5', t: '¿La revisión trimestral cubre todos los sistemas con cuentas de usuario?', ev: 'Acta de revisión con todos los sistemas del alcance.', how: 'Revisar EV-08.', fail: ['*']},
    {id: 'P-08', crit: 'a65', t: '¿Los tickets de baja se cierran y se verifican?', ev: 'Ticket cerrado y verificado por el RSIS.', how: 'Revisar el estado de cada ticket en EV-03.', fail: ['B-06'], also: ['insuf']}
  ],
  testStates: [['pend', 'Pendiente'], ['ok', 'Conforme'], ['nc', 'No conforme'], ['insuf', 'Evidencia insuficiente'], ['na', 'No aplica']],

  /* Sobre qué puede tratar un hallazgo */
  subjects: [['proc', 'El proceso de bajas en general'], ['rev', 'La revisión trimestral de permisos']],

  /* ── 7. Informe: conclusión global ── */
  conclusions: [
    {id: 'k1', t: 'El proceso es eficaz: no se han encontrado desviaciones.'},
    {id: 'k2', t: 'El proceso existe pero no es plenamente eficaz: hay retiradas tardías o incompletas que se deben corregir y analizar.'},
    {id: 'k3', t: 'El proceso no existe: no hay normativa ni registros de bajas.'}
  ],
  conclusionOk: 'k2',

  /* ── Pistas (modo Aprendiz) ── */
  hints: {
    brief: ['Fíjate en quién te encarga la auditoría y qué quiere saber la Gerencia: si la acción del riesgo R-09 funciona en la práctica.', 'Un auditor interno debe ser independiente del proceso que audita.'],
    plan: ['El objetivo de una auditoría interna se mide contra criterios: aquí, NOR-01 y los controles aplicables del Anexo A.', 'Incluye en el alcance todos los sistemas donde una persona tiene cuenta, también los que no gestiona TI.'],
    sample: ['Con 8 bajas, una muestra de 5 o más es razonable. Cubre los dos trimestres.', 'Las cuentas con privilegios son de mayor riesgo: asegúrate de que alguna entra en la muestra.'],
    evidence: ['Para comprobar «el mismo día» necesitas la fecha de salida (RR. HH.) y la fecha de baja en cada sistema.', 'No pidas lo que no sirve para el objetivo: cada petición le cuesta tiempo al auditado.'],
    people: ['Pregunta a cada persona por lo que gestiona. Las respuestas orientan, pero hay que contrastarlas con evidencias.', 'Las preguntas fuera del alcance no aportan y restan confianza.'],
    tests: ['Una prueba es conforme solo si todas las bajas de la muestra lo cumplen.', 'Si no tienes en la muestra ningún caso que permita probar algo, la prueba no aplica o la evidencia es insuficiente.'],
    findings: ['Un hallazgo necesita criterio + lo que has observado + la evidencia. Sin evidencia, no hay hallazgo.', 'Una demora con una excepción aprobada y vigente no incumple. Y convertir un buzón en compartido con autorización tampoco.'],
    report: ['La conclusión debe salir de los hallazgos, no de la impresión general.', 'Distingue la corrección (arreglar el caso) de la acción correctiva (evitar que se repita).']
  },

  /* ═════════ Verdad de referencia: solo se muestra tras entregar ═════════ */
  key: [
    {id: 'K1', subj: 'B-02', type: 'nc', crit: ['nor2', 'a65', 'a518'], ev: ['EV-02', 'EV-04', 'EV-05'],
     t: 'B-02: accesos retirados 7 días después de la salida',
     why: 'Salió el 13/02 y su cuenta del Directorio Activo y su Microsoft 365 se deshabilitaron el 20/02. NOR-01 §2 exige el mismo día. La causa: RR. HH. supo la baja tarde (aviso el 19/02).'},
    {id: 'K2', subj: 'B-04', type: 'nc', crit: ['nor2', 'a518', 'a65'], ev: ['EV-06', 'EV-02'],
     t: 'B-04: la cuenta de la consola de clínicas sigue activa',
     why: 'La cuenta soporte.tlopez sigue activa meses después de la salida (27/03). Da acceso a fichas de pacientes. La causa: la plantilla del ticket de TI no incluye la consola y antes de abril no había lista de RR. HH.'},
    {id: 'K3', subj: 'B-07', type: 'nc', crit: ['nor4', 'nor2', 'a82', 'a518'], ev: ['EV-04'],
     t: 'B-07: la cuenta de administrador se deshabilitó 3 días tarde',
     why: 'dhernandez se deshabilitó el 29/05, pero adm-dhernandez no se deshabilitó hasta el 01/06. Una cuenta privilegiada activa tras la salida es de alto riesgo.'},
    {id: 'K4', subj: 'B-06', type: 'obs', alt: ['om', 'nc'], crit: ['a65', 'nor2'], ev: ['EV-03', 'EV-09'],
     t: 'B-06: ticket de baja sin cerrar ni verificar',
     why: 'Los accesos se retiraron a tiempo (EV-04 y EV-05), pero el ticket sigue «En curso» y la lista solo la firma RR. HH. No hay incumplimiento del plazo, pero falla la verificación: es una observación.'},
    {id: 'K5', subj: 'rev', type: 'nc', alt: ['obs'], crit: ['nor5', 'a518'], ev: ['EV-08'],
     t: 'La revisión trimestral no incluye la consola de clínicas',
     why: 'NOR-01 §5 pide que los dueños de cada sistema revisen los permisos cada trimestre. La consola quedó fuera. Si se hubiera revisado, la cuenta de B-04 se habría detectado en abril.'}
  ],
  traps: [
    {subj: 'B-03', t: 'B-03 no es un hallazgo', why: 'La cuenta se quitó un mes después, pero con la excepción EX-03 aprobada, con caducidad y respetada (EV-07). La VPN se retiró el mismo día.'},
    {subj: 'B-08', t: 'B-08 no es un hallazgo', why: 'Convertir el buzón en compartido con acceso de su responsable es una práctica habitual y estaba autorizado en la lista de salida. El inicio de sesión se bloqueó el mismo día.'},
    {subj: 'B-01', t: 'B-01 es conforme', why: 'Todo se retiró el día de la salida.'},
    {subj: 'B-05', t: 'B-05 es conforme', why: 'Todo se retiró el día de la salida y la lista está completa.'}
  ],
  model: {
    summary: 'Se auditó el proceso de bajas del primer semestre de 2026 sobre una muestra de las bajas, incluida la de un administrador. NOR-01 existe y se aplica en la mayoría de los casos, pero no de forma consistente: hay retiradas tardías (B-02 y la cuenta de administrador de B-07), una cuenta de la consola de clínicas sigue activa (B-04) y la revisión trimestral no cubre esa consola. La acción del riesgo R-09 no puede considerarse eficaz todavía.',
    actions: [
      ['Corrección', 'Desactivar hoy la cuenta soporte.tlopez y revisar sus accesos desde el 27/03.'],
      ['Acción correctiva', 'Añadir la consola de clínicas y las cuentas adm- a la plantilla del ticket de baja.'],
      ['Acción correctiva', 'Incorporar la consola a la revisión trimestral, con el responsable de producto como dueño.'],
      ['Acción correctiva', 'Acordar con los responsables de área que comuniquen los fines de contrato a RR. HH. con antelación.'],
      ['Mejora', 'Exigir la firma del RSIS en la lista de salida antes de cerrar el ticket.']
    ]
  }
};

A.cases[C.id] = C; A.order.push(C.id);
/* Próximos casos (se muestran como «próximamente») */
A.soon = A.soon || [
  ['02', 'Copias de seguridad: ¿se prueba la restauración?', 'Anexo A 8.13 · NOR-02'],
  ['03', 'Cuentas privilegiadas y MFA', 'Anexo A 8.2 y 8.5'],
  ['04', 'Proveedores con acceso a datos', 'Anexo A 5.19 a 5.22'],
  ['05', 'Respuesta a un incidente y lecciones aprendidas', 'Anexo A 5.24 a 5.27 · PRO-01']
];
if (window.I18N && I18N.lang === 'en') I18N.deep(C);
})();
