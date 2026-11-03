/* Atlas GRC · Simulador de auditoría · Caso 02: «Copias de seguridad: ¿se prueba la restauración?»
   Todo es FICTICIO. Coherente con NOR-02 de Albatrel (regla 3-2-1, frecuencia y conservación,
   prueba de restauración mensual con registro) y con el riesgo R-01 (ransomware). */
(function () {
const A = window.AUDIT || (window.AUDIT = {cases: {}, order: []});

const C = {
  id: 'c02', v: 1, n: '02',
  t: 'Copias de seguridad: ¿se prueba la restauración?',
  s: 'Auditoría interna de las copias de Albatrel: la regla 3-2-1, las pruebas mensuales y lo que se informa al Comité.',
  kind: 'Auditoría interna', level: 'Inicial', mins: 50,
  skills: ['Muestrear', 'Cruzar registros', 'Detectar contradicciones', 'Informar'],

  brief: {
    from: 'Elena Sanz · Responsable de Seguridad de Albatrel',
    date: '3 de agosto de 2026',
    body: [
      'Las copias son nuestra defensa principal frente al ransomware (riesgo R-01). En el último Comité se informó de que todas las pruebas de restauración del semestre salieron bien.',
      'Quiero que compruebes si NOR-02 se cumple: que haya copias según la regla 3-2-1 y que de verdad se pruebe la restauración cada mes, con registro.',
      'Trabajo de campo el 10 de agosto. El informe va al Comité de septiembre.'
    ],
    facts: [
      ['Organización', 'Albatrel Servicios Digitales, S.L. · 60 personas · Zaragoza'],
      ['Periodo auditado', '1 de enero a 30 de junio de 2026'],
      ['Trabajo de campo', '10 de agosto de 2026'],
      ['Auditor', 'Tú, como auditor interno (independiente de la gestión de copias)'],
      ['Destinatario del informe', 'Comité de Seguridad y Gerencia']
    ]
  },

  plan: {
    objectives: [
      {id: 'o1', t: 'Comprobar si las copias se hacen y se prueban según NOR-02 y el control 8.13, y si lo que se informa al Comité es cierto.'},
      {id: 'o2', t: 'Elegir un software de copias más moderno para Albatrel.'},
      {id: 'o3', t: 'Medir la velocidad de la red durante las copias nocturnas.'}
    ],
    objectiveOk: 'o1',
    systems: [
      {id: 'pad', t: 'Bases de datos de padrón y tributos', in: true},
      {id: 'cli', t: 'Base de datos de la app de clínicas', in: true},
      {id: 'cfg', t: 'Configuraciones de servidores y red', in: true},
      {id: 'sgsi', t: 'Documentación del SGSI', in: true},
      {id: 'lap', t: 'Portátiles del personal', in: false},
      {id: 'web', t: 'Web corporativa de Albatrel', in: false}
    ],
    criteria: [
      {id: 'n2', t: 'NOR-02 §2 · Regla 3-2-1 (una copia fuera de línea o fuera de la sede)', rel: true},
      {id: 'n3', t: 'NOR-02 §3 · Frecuencia y conservación de las copias', rel: true},
      {id: 'n4', t: 'NOR-02 §4 · Prueba de restauración mensual con registro', rel: true},
      {id: 'a813', t: 'Anexo A 8.13 · Copias de seguridad de la información', rel: true},
      {id: 'c91', t: 'Cláusula 9.1 · Seguimiento, medición, análisis y evaluación', rel: true},
      {id: 'a518', t: 'Anexo A 5.18 · Derechos de acceso', rel: false},
      {id: 'a712', t: 'Anexo A 7.12 · Seguridad del cableado', rel: false}
    ],
    techniques: [
      {id: 'doc', t: 'Revisión documental', rel: true},
      {id: 'int', t: 'Entrevistas', rel: true},
      {id: 'smp', t: 'Muestreo de las pruebas mensuales', rel: true},
      {id: 'cmp', t: 'Cruce de registros (copias, pruebas, tickets e informe al Comité)', rel: true},
      {id: 'del', t: 'Borrar una copia para ver si alguien lo nota', rel: false}
    ],
    agenda: [
      ['10 ago · 9:00', 'Reunión de apertura con la Responsable de Seguridad'],
      ['10 ago · 9:30', 'Entrevista al Responsable del Sistema y registros de copias'],
      ['10 ago · 11:00', 'Revisión de las pruebas de restauración de la muestra'],
      ['10 ago · 12:30', 'Entrevista a la Gerencia (custodia de la copia fuera de línea)'],
      ['10 ago · 13:30', 'Reunión de cierre: hallazgos preliminares']
    ]
  },

  population: [
    {id: 'M-01', role: 'Prueba de enero', out: 'Ene 2026', q: 1},
    {id: 'M-02', role: 'Prueba de febrero', out: 'Feb 2026', q: 1},
    {id: 'M-03', role: 'Prueba de marzo', out: 'Mar 2026', q: 1},
    {id: 'M-04', role: 'Prueba de abril', out: 'Abr 2026', q: 2},
    {id: 'M-05', role: 'Prueba de mayo', out: 'May 2026', q: 2},
    {id: 'M-06', role: 'Prueba de junio', out: 'Jun 2026', q: 2}
  ],
  sampleMin: 4,
  popIntro: 'Estas son las seis pruebas de restauración que tocaban en el semestre (la población).',
  sampleWhyPh: '¿Por qué estos meses? Piensa en qué datos son más críticos y en cubrir el periodo.',
  checks: {
    sys: [{id: 'cli', bad: 'El alcance no incluye la base de datos de clínicas, la que guarda datos de salud.'}],
    sysGood: 'El alcance incluye todo lo que NOR-02 manda copiar.',
    mustSample: {ids: ['M-03'], good: 'La muestra incluye marzo, el mes en que se probó la base de datos de clínicas, la más crítica.', bad: 'La muestra no incluye marzo, el mes en que se probó la base de datos de clínicas (EV-03), la más crítica.'},
    ev: [{id: 'EV-03', bad: 'No pediste el registro de pruebas de restauración: es la evidencia central del encargo.'}, {id: 'EV-06', bad: 'No pediste el informe que se presentó al Comité: sin él no puedes comprobar si lo informado es cierto.'}]
  },

  evidence: [
    {id: 'EV-01', t: 'NOR-02 · Normativa de copias de seguridad (v1.1)', from: 'Responsable del Sistema', type: 'Documento', date: '12/01/2026', rel: true,
     note: 'Versión 1.1, aprobada por el Comité de Seguridad el 12/01/2026. Puedes leerla completa en el caso Albatrel.', link: '#/doc/ncop',
     table: {head: ['Apartado', 'Qué dice'], rows: [
       ['§2', 'Tres copias, en dos soportes distintos y una fuera de línea o fuera de la sede.'],
       ['§3', 'Incremental diaria (30 días), completa semanal (3 meses) y fuera de línea mensual (1 año).'],
       ['§4', 'Cada mes se restaura una copia en un entorno aislado y se deja registro del resultado.']]}},
    {id: 'EV-02', t: 'Registro de trabajos de copia del semestre', from: 'Responsable del Sistema', type: 'Extracto de sistema', date: '10/08/2026', rel: true,
     note: 'Resumen del software de copias. Los trabajos fallidos se relanzaron automáticamente esa misma noche.',
     table: {head: ['Tipo', 'Previstos', 'Correctos', 'Conservación'], rows: [
       ['Incremental diaria', '181', '181', '30 días'],
       ['Completa semanal', '26', '26', '3 meses']]}},
    {id: 'EV-03', t: 'Registro de pruebas de restauración', from: 'Responsable del Sistema', type: 'Registro', date: '10/08/2026', rel: true,
     table: {head: ['Mes', 'Fecha', 'Qué se restauró', 'Resultado', 'Firma'], rows: [
       ['Enero', '28/01/2026', 'BD de padrón', 'Correcta (1 h 40 min)', 'RSIS'],
       ['Febrero', '—', '—', 'Sin registro', '—'],
       ['Marzo', '26/03/2026', 'BD de clínicas', 'Fallida: copia dañada', 'RSIS'],
       ['Abril', '29/04/2026', 'Configuraciones de red', 'Correcta (25 min)', 'RSIS'],
       ['Mayo', '27/05/2026', 'BD de tributos', 'Correcta (2 h 05 min)', 'RSIS'],
       ['Junio', '02/07/2026', 'Sede electrónica', 'Correcta (3 h 10 min)', 'RSIS']]}},
    {id: 'EV-04', t: 'Registro de copias fuera de línea', from: 'Gerencia', type: 'Registro', date: '10/08/2026', rel: true,
     note: 'Disco cifrado que se lleva cada mes a la caja fuerte de la Gerencia, fuera de la sede.',
     table: {head: ['Mes', 'Copia hecha', 'Entregada en la caja fuerte', 'Firma'], rows: [
       ['Enero', '30/01/2026', '30/01/2026', 'Gerencia'], ['Febrero', '27/02/2026', '27/02/2026', 'Gerencia'],
       ['Marzo', '31/03/2026', '31/03/2026', 'Gerencia'], ['Abril', '30/04/2026', '30/04/2026', 'Gerencia'],
       ['Mayo', '—', '—', '—'], ['Junio', '30/06/2026', '30/06/2026', 'Gerencia']]}},
    {id: 'EV-05', t: 'Tickets de incidencias de copias', from: 'Responsable del Sistema', type: 'Registro', date: '10/08/2026', rel: true,
     table: {head: ['Ticket', 'Abierto', 'Asunto', 'Estado'], rows: [
       ['TI-2026-049', '26/03/2026', 'Prueba de restauración de clínicas fallida: copia dañada', 'Abierto, sin acciones'],
       ['TI-2026-071', '12/05/2026', 'Disco fuera de línea en reparación', 'Cerrado el 05/06/2026']]}},
    {id: 'EV-06', t: 'Informe de indicadores al Comité de Seguridad (julio)', from: 'Responsable de Seguridad', type: 'Informe', date: '15/07/2026', rel: true,
     table: {head: ['Indicador', 'Objetivo', 'Resultado informado'], rows: [
       ['Pruebas de restauración correctas', '100 %', '6 de 6 (100 %)'],
       ['Copias diarias correctas', '≥ 99 %', '100 %']]}},
    {id: 'EV-07', t: 'Registro de excepciones de seguridad', from: 'Responsable de Seguridad', type: 'Registro', date: '10/08/2026', rel: true,
     table: {head: ['Excepción', 'Qué se permite', 'Aprobada por', 'Caduca'], rows: [
       ['EX-05', 'Hacer la prueba de junio el 02/07/2026 por la migración de la sede electrónica.', 'Responsable de Seguridad, 22/06/2026', '03/07/2026']]}},
    {id: 'EV-90', t: 'Inventario de portátiles', from: 'Responsable del Sistema', type: 'Registro', date: '01/07/2026', rel: false,
     note: 'Modelos y números de serie de los portátiles. No aporta nada sobre las copias del servidor.'},
    {id: 'EV-91', t: 'Factura del proveedor de discos', from: 'Gerencia', type: 'Documento', date: '15/02/2026', rel: false,
     note: 'Compra de discos externos. No demuestra que se hagan copias ni pruebas.'}
  ],

  people: [
    {id: 'sys', name: 'Sergio Lahoz', role: 'Responsable del Sistema (RSIS)', qs: [
      {id: 'sy1', q: '¿Cómo eliges qué restaurar cada mes?', a: 'Voy rotando: padrón, clínicas, tributos, configuraciones… Lo apunto en el registro de pruebas.', key: true},
      {id: 'sy2', q: '¿Qué pasó con la prueba de febrero?', a: 'Febrero fue un mes de locos con la campaña de tributos. Se me pasó y no la hice.', key: true},
      {id: 'sy3', q: '¿Qué hiciste cuando falló la restauración de clínicas en marzo?', a: 'Abrí un ticket. Pensaba repetirla con la copia de la semana siguiente, pero no me dio tiempo. Las copias siguientes salen correctas en el registro.', key: true},
      {id: 'sy4', q: '¿Por qué la prueba de junio se hizo el 2 de julio?', a: 'Estábamos migrando la sede electrónica. Elena aprobó retrasarla un par de días; está en el registro de excepciones.', key: true},
      {id: 'sy5', q: '¿Por qué no te pasas a la nube para las copias?', a: 'Eso lo tendría que decidir la Gerencia. No sé si es algo que te toque a ti.', off: true}
    ]},
    {id: 'ger', name: 'Lucía Ferrer', role: 'Gerente de Albatrel', qs: [
      {id: 'ge1', q: '¿Dónde se guarda la copia fuera de línea?', a: 'En la caja fuerte de mi casa. Es un disco cifrado; la clave la tiene el RSIS.', key: true},
      {id: 'ge2', q: '¿Por qué no hay copia fuera de línea en mayo?', a: 'El disco estaba en reparación y nadie trajo otro. En junio ya se hizo con normalidad.', key: true},
      {id: 'ge3', q: '¿Qué te pareció el informe de julio al Comité?', a: 'Tranquilizador: todo al cien por cien.'}
    ]},
    {id: 'sec', name: 'Elena Sanz', role: 'Responsable de Seguridad (RSEG)', qs: [
      {id: 'se1', q: '¿De dónde salió el «6 de 6» del informe al Comité?', a: 'Del resumen del software de copias, que marca todos los trabajos como correctos. Supuse que las pruebas también.', key: true},
      {id: 'se2', q: '¿Conocías el fallo de marzo?', a: 'No. El ticket no me llegó; solo lo ve el equipo de sistemas.', key: true},
      {id: 'se3', q: '¿Qué esperas de esta auditoría?', a: 'Saber si podemos recuperarnos de verdad de un ataque.'}
    ]}
  ],

  tests: [
    {id: 'P-01', crit: 'n4', t: '¿Existe una normativa de copias aprobada y vigente?', ev: 'NOR-02 aprobada y en vigor durante el periodo.', how: 'Revisar versión, fecha y aprobación de NOR-02.', fail: []},
    {id: 'P-02', crit: 'n4', t: '¿Hay una prueba de restauración cada mes de la muestra?', ev: 'Una prueba registrada por mes.', how: 'Comparar los meses de la muestra con EV-03.', fail: ['M-02']},
    {id: 'P-03', crit: 'n4', t: '¿Las pruebas fallidas se analizan y se repiten?', ev: 'Ticket con causa, acción y nueva prueba correcta.', how: 'Cruzar los fallos de EV-03 con EV-05.', fail: ['M-03'], needs: ['M-03']},
    {id: 'P-04', crit: 'n2', t: '¿Hay copia fuera de línea todos los meses?', ev: 'Una entrega mensual en el registro.', how: 'Revisar EV-04 mes a mes.', fail: ['*']},
    {id: 'P-05', crit: 'n3', t: '¿Se cumplen la frecuencia y la conservación?', ev: 'Trabajos previstos igual a correctos; conservación según NOR-02.', how: 'Revisar EV-02.', fail: []},
    {id: 'P-06', crit: 'n4', t: '¿Los retrasos tienen una excepción aprobada?', ev: 'Excepción registrada, aprobada y respetada.', how: 'Cruzar las fechas de EV-03 con EV-07.', fail: [], needs: ['M-06']},
    {id: 'P-07', crit: 'c91', t: '¿El indicador informado al Comité coincide con los registros?', ev: 'Mismo resultado en EV-06 y en EV-03.', how: 'Comparar EV-06 con EV-03.', fail: ['*']}
  ],
  testStates: [['pend', 'Pendiente'], ['ok', 'Conforme'], ['nc', 'No conforme'], ['insuf', 'Evidencia insuficiente'], ['na', 'No aplica']],
  subjects: [['proc', 'El proceso de copias en general'], ['off', 'Las copias fuera de línea'], ['rep', 'El indicador informado al Comité']],

  conclusions: [
    {id: 'k1', t: 'Las copias son eficaces: se hacen y se prueban como pide NOR-02.'},
    {id: 'k2', t: 'Las copias se hacen, pero la prueba de restauración y la copia fuera de línea fallan y el Comité recibió información incorrecta.'},
    {id: 'k3', t: 'No se hacen copias de seguridad.'}
  ],
  conclusionOk: 'k2',

  hints: {
    brief: ['La Gerencia cree que todo va bien porque así se informó. Tu trabajo es comprobarlo con registros.', 'Las copias valen lo que vale su restauración.'],
    plan: ['El alcance son los datos que NOR-02 manda copiar.', 'Si un criterio no habla de copias ni de medición, sobra.'],
    sample: ['Con seis meses, revisar cuatro o más es razonable.', 'Mira en el registro qué mes se probó la base de datos de clínicas: los datos de salud son los más críticos.'],
    evidence: ['Para saber si lo informado es cierto necesitas el informe y el registro que debería respaldarlo.', 'Una factura de discos no demuestra que se hagan copias.'],
    people: ['Pregunta a quien hace las copias, a quien custodia la copia externa y a quien informa al Comité.', 'Las preguntas sobre decisiones de compra no son de este encargo.'],
    tests: ['Un trabajo de copia correcto no es una restauración probada.', 'Si una prueba depende de un registro único (como la copia fuera de línea), el fallo no depende de tu muestra.'],
    findings: ['Una prueba retrasada con excepción aprobada y vigente no incumple.', 'NOR-02 permite que la copia esté fuera de línea o fuera de la sede: una caja fuerte externa es válida.'],
    report: ['Si el Comité decidió con un dato falso, el informe lo tiene que decir con claridad.', 'La corrección arregla el caso; la acción correctiva evita que se repita.']
  },

  key: [
    {id: 'K1', subj: 'M-02', type: 'nc', crit: ['n4', 'a813'], ev: ['EV-03'],
     t: 'Febrero: no se hizo la prueba de restauración',
     why: 'NOR-02 §4 pide una prueba cada mes con registro. En febrero no hay prueba ni registro, y el RSIS confirma que no se hizo.'},
    {id: 'K2', subj: 'M-03', type: 'nc', crit: ['n4', 'a813'], ev: ['EV-03', 'EV-05'],
     t: 'Marzo: la restauración de clínicas falló y no se repitió',
     why: 'La copia de la base de datos de clínicas estaba dañada. El ticket sigue abierto sin acciones y nadie volvió a probar. Hoy no se sabe si se pueden recuperar los datos de salud.'},
    {id: 'K3', subj: 'off', type: 'nc', crit: ['n2', 'a813'], ev: ['EV-04', 'EV-05'],
     t: 'Mayo: no hubo copia fuera de línea',
     why: 'La regla 3-2-1 de NOR-02 §2 exige una copia fuera de línea. En mayo no se hizo porque el disco estaba en reparación y no se buscó una alternativa.'},
    {id: 'K4', subj: 'rep', type: 'nc', alt: ['obs'], crit: ['c91', 'n4'], ev: ['EV-06', 'EV-03'],
     t: 'El Comité recibió un indicador incorrecto',
     why: 'Se informó «6 de 6 pruebas correctas», pero solo hubo cuatro correctas, una fallida y un mes sin prueba. El dato salió de los trabajos de copia, no de las pruebas de restauración.'}
  ],
  traps: [
    {subj: 'M-06', t: 'M-06 no es un hallazgo', why: 'La prueba de junio se hizo el 02/07 con la excepción EX-05, aprobada, con caducidad y respetada (EV-07).'},
    {subj: 'M-01', t: 'M-01 es conforme', why: 'Prueba hecha, correcta y firmada.'},
    {subj: 'M-04', t: 'M-04 es conforme', why: 'Prueba hecha, correcta y firmada.'},
    {subj: 'M-05', t: 'M-05 es conforme', why: 'La prueba de mayo fue correcta. Lo que falló en mayo fue la copia fuera de línea, que es otro hallazgo.'}
  ],
  model: {
    summary: 'Se auditaron las copias de seguridad del primer semestre de 2026. Los trabajos de copia se ejecutan como pide NOR-02, pero la prueba de restauración no: falta la de febrero y la de clínicas falló en marzo sin repetirse. Además, en mayo no hubo copia fuera de línea y el Comité recibió un indicador de pruebas incorrecto. Hoy no se puede asegurar que Albatrel recupere los datos de salud de las clínicas.',
    actions: [
      ['Corrección', 'Repetir hoy la restauración de la base de datos de clínicas con la última copia completa.'],
      ['Corrección', 'Corregir el indicador ante el Comité con los datos reales del semestre.'],
      ['Acción correctiva', 'Calcular el indicador a partir del registro de pruebas, no de los trabajos de copia.'],
      ['Acción correctiva', 'Avisar a la RSEG de toda prueba fallida y repetirla en un plazo máximo de 7 días.'],
      ['Acción correctiva', 'Tener un segundo disco para la copia fuera de línea.']
    ]
  }
};

A.cases[C.id] = C; A.order.push(C.id);
if (window.I18N && I18N.lang === 'en') I18N.deep(C);
})();
