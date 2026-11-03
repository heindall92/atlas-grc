/* Atlas GRC · Simulador de auditoría · Caso 03: «Cuentas privilegiadas y MFA»
   Todo es FICTICIO. Coherente con NOR-01 de Albatrel (§1 una persona, una cuenta; §3 MFA obligatorio;
   §4 cuentas de administrador separadas, con registro y revisión mensual) y con el riesgo R-02. */
(function () {
const A = window.AUDIT || (window.AUDIT = {cases: {}, order: []});

const C = {
  id: 'c03', v: 1, n: '03',
  t: 'Cuentas privilegiadas y MFA',
  s: 'Auditoría interna de las cuentas con privilegios de Albatrel: quién las usa, si tienen MFA y si alguien revisa su uso.',
  kind: 'Auditoría interna', level: 'Intermedio', mins: 55,
  skills: ['Muestrear por riesgo', 'Cruzar inventarios', 'Valorar excepciones', 'Redactar hallazgos'],

  brief: {
    from: 'Elena Sanz · Responsable de Seguridad de Albatrel',
    date: '7 de septiembre de 2026',
    body: [
      'El riesgo R-02 (acceso no autorizado a historias clínicas con credenciales robadas) es de los más altos que tenemos, y su tratamiento depende del MFA y del control de las cuentas privilegiadas.',
      'Audita si las cuentas con privilegios cumplen NOR-01: que cada una sea de una sola persona, que tenga MFA, que los privilegios estén aprobados y que se revise su uso cada mes.',
      'Trabajo de campo el 14 de septiembre.'
    ],
    facts: [
      ['Organización', 'Albatrel Servicios Digitales, S.L. · 60 personas · Zaragoza'],
      ['Periodo auditado', '1 de enero a 30 de junio de 2026'],
      ['Trabajo de campo', '14 de septiembre de 2026'],
      ['Auditor', 'Tú, como auditor interno (sin cuenta privilegiada propia)'],
      ['Destinatario del informe', 'Comité de Seguridad y Gerencia']
    ]
  },

  plan: {
    objectives: [
      {id: 'o1', t: 'Comprobar si las cuentas privilegiadas cumplen NOR-01 y los controles 8.2 y 8.5: titular único, MFA, aprobación y revisión del uso.'},
      {id: 'o2', t: 'Intentar acceder con las cuentas de administrador para ver si se puede.'},
      {id: 'o3', t: 'Decidir qué personas deberían ser administradoras.'}
    ],
    objectiveOk: 'o1',
    systems: [
      {id: 'ad', t: 'Directorio Activo (cuentas de administrador)', in: true},
      {id: 'db', t: 'Base de datos de la app de clínicas', in: true},
      {id: 'hyp', t: 'Servidores de virtualización', in: true},
      {id: 'pam', t: 'Gestor de contraseñas corporativo (cofre de cuentas privilegiadas)', in: true},
      {id: 'cam', t: 'Cámaras de la oficina', in: false},
      {id: 'prn', t: 'Impresoras', in: false}
    ],
    criteria: [
      {id: 'n1', t: 'NOR-01 §1 · Una persona, una cuenta: no se comparten usuarios', rel: true},
      {id: 'n3', t: 'NOR-01 §3 · MFA obligatorio en todas las cuentas', rel: true},
      {id: 'n4', t: 'NOR-01 §4 · Cuentas de administrador separadas, con registro y revisión mensual', rel: true},
      {id: 'a82', t: 'Anexo A 8.2 · Derechos de acceso privilegiado', rel: true},
      {id: 'a85', t: 'Anexo A 8.5 · Autenticación segura', rel: true},
      {id: 'a813', t: 'Anexo A 8.13 · Copias de seguridad de la información', rel: false},
      {id: 'a74', t: 'Anexo A 7.4 · Monitorización de la seguridad física', rel: false}
    ],
    techniques: [
      {id: 'doc', t: 'Revisión documental', rel: true},
      {id: 'int', t: 'Entrevistas', rel: true},
      {id: 'smp', t: 'Muestreo de cuentas privilegiadas', rel: true},
      {id: 'cmp', t: 'Cruce de inventario, informe de MFA y registros de acceso', rel: true},
      {id: 'try', t: 'Probar contraseñas de las cuentas de administrador', rel: false}
    ],
    agenda: [
      ['14 sep · 9:00', 'Reunión de apertura con la Responsable de Seguridad'],
      ['14 sep · 9:30', 'Entrevista al Responsable del Sistema: inventario y MFA'],
      ['14 sep · 11:00', 'Entrevista al responsable de desarrollo: base de datos de clínicas'],
      ['14 sep · 12:30', 'Revisión de excepciones y actas de revisión'],
      ['14 sep · 13:30', 'Reunión de cierre: hallazgos preliminares']
    ]
  },

  population: [
    {id: 'C-01', role: 'adm-slahoz · Responsable del Sistema', out: 'Directorio', q: 1},
    {id: 'C-02', role: 'adm-jnavarro · Técnico de sistemas', out: 'Directorio', q: 1},
    {id: 'C-03', role: 'adm-egarcia · Desarrolladora', out: 'Directorio', q: 1},
    {id: 'C-04', role: 'root-clinicas · Base de datos de clínicas', out: 'BD clínicas', q: 2},
    {id: 'C-05', role: 'svc-copias · Cuenta de servicio de copias', out: 'Directorio', q: 2},
    {id: 'C-06', role: 'emergencia · Cuenta de emergencia', out: 'Directorio', q: 2},
    {id: 'C-07', role: 'adm-hyp · Virtualización', out: 'Virtualización', q: 2},
    {id: 'C-08', role: 'adm-rruiz · Técnica de redes', out: 'Directorio', q: 1}
  ],
  sampleMin: 5,
  popIntro: 'Estas son las ocho cuentas privilegiadas del inventario (la población).',
  sampleWhyPh: '¿Por qué estas cuentas? Piensa en a qué datos dan acceso y en cuáles son distintas de las demás.',
  checks: {
    sys: [{id: 'db', bad: 'El alcance no incluye la base de datos de clínicas, que guarda los datos de salud del riesgo R-02.'}],
    sysGood: 'El alcance incluye todos los sistemas con cuentas privilegiadas.',
    mustSample: {ids: ['C-04'], good: 'La muestra incluye la cuenta de la base de datos de clínicas, la que da acceso a los datos de salud.', bad: 'La muestra no incluye la cuenta de la base de datos de clínicas, la que da acceso a los datos de salud.'},
    ev: [{id: 'EV-03', bad: 'No pediste el informe de MFA: sin él no puedes comprobar NOR-01 §3.'}, {id: 'EV-05', bad: 'No pediste el registro de excepciones: sin él no sabes si una cuenta sin MFA está autorizada.'}]
  },

  evidence: [
    {id: 'EV-01', t: 'NOR-01 · Normativa de control de accesos (v1.2)', from: 'Responsable de Seguridad', type: 'Documento', date: '12/01/2026', rel: true,
     note: 'Versión 1.2, aprobada por el Comité de Seguridad el 12/01/2026.', link: '#/doc/nacc',
     table: {head: ['Apartado', 'Qué dice'], rows: [
       ['§1', 'Necesidad de conocer y mínimo privilegio. Una persona, una cuenta: no se comparten usuarios.'],
       ['§3', 'MFA obligatorio en todas las cuentas y en el acceso de las clínicas.'],
       ['§4', 'Cuentas de administrador separadas de las de uso diario. Registro y revisión mensual de su uso.']]}},
    {id: 'EV-02', t: 'Inventario de cuentas privilegiadas', from: 'Responsable del Sistema', type: 'Registro', date: '10/09/2026', rel: true,
     table: {head: ['Cuenta', 'Titular', 'Privilegio', 'Aprobada por'], rows: [
       ['adm-slahoz', 'Sergio Lahoz', 'Administrador del dominio', 'Gerencia, 08/01/2026'],
       ['adm-jnavarro', 'Javier Navarro', 'Administrador de servidores', 'RSIS, 08/01/2026'],
       ['adm-egarcia', 'Eva García', 'Administrador del dominio', '—'],
       ['root-clinicas', 'Equipo de desarrollo', 'Superusuario de la BD de clínicas', 'RSIS, 2024'],
       ['svc-copias', 'Servicio (sin persona)', 'Lectura de todos los servidores', 'RSIS, 08/01/2026'],
       ['emergencia', 'Sobre sellado en la caja fuerte', 'Administrador del dominio', 'Gerencia, 08/01/2026'],
       ['adm-hyp', 'Sergio Lahoz', 'Administrador de virtualización', 'Gerencia, 08/01/2026'],
       ['adm-rruiz', 'Raquel Ruiz', 'Administradora de red', 'RSIS, 08/01/2026']]}},
    {id: 'EV-03', t: 'Informe de MFA de las cuentas privilegiadas', from: 'Responsable del Sistema', type: 'Extracto de sistema', date: '14/09/2026', rel: true,
     note: 'Obtenido en presencia del auditor.',
     table: {head: ['Cuenta', 'MFA', 'Método'], rows: [
       ['adm-slahoz', 'Activo', 'Llave de seguridad'], ['adm-jnavarro', 'Desactivado', '—'], ['adm-egarcia', 'Activo', 'App'],
       ['root-clinicas', 'No admite MFA', '—'], ['svc-copias', 'No aplica (cuenta de servicio)', '—'],
       ['emergencia', 'Desactivado', '—'], ['adm-hyp', 'Activo', 'Llave de seguridad'], ['adm-rruiz', 'Activo', 'App']]}},
    {id: 'EV-04', t: 'Actas de revisión mensual del uso privilegiado', from: 'Responsable de Seguridad', type: 'Acta', date: '10/09/2026', rel: true,
     table: {head: ['Mes', 'Revisión', 'Firmada por'], rows: [
       ['Enero', 'Sí, 05/02/2026', 'RSEG'], ['Febrero', 'Sí, 06/03/2026', 'RSEG'], ['Marzo', 'No consta', '—'],
       ['Abril', 'Sí, 07/05/2026', 'RSEG'], ['Mayo', 'No consta', '—'], ['Junio', 'No consta', '—']]}},
    {id: 'EV-05', t: 'Registro de excepciones de seguridad', from: 'Responsable de Seguridad', type: 'Registro', date: '10/09/2026', rel: true,
     table: {head: ['Excepción', 'Qué se permite', 'Medidas que lo compensan', 'Caduca'], rows: [
       ['EX-07', 'svc-copias sin MFA', 'Sin inicio de sesión interactivo, contraseña de 40 caracteres en el cofre, rotación trimestral', '31/12/2026'],
       ['EX-08', 'emergencia sin MFA', 'Sobre sellado en caja fuerte, uso solo con dos personas y registro de cada apertura', '31/12/2026']]}},
    {id: 'EV-06', t: 'Registro de accesos a root-clinicas', from: 'Responsable de producto', type: 'Extracto de sistema', date: '14/09/2026', rel: true,
     note: 'Accesos de los últimos 30 días.',
     table: {head: ['Fecha', 'Equipo de origen', 'Acción'], rows: [
       ['18/08/2026', 'PC-DES-02', 'Consulta de historias'], ['22/08/2026', 'PC-DES-05', 'Cambio de esquema'],
       ['01/09/2026', 'PC-DES-07', 'Consulta de historias'], ['09/09/2026', 'PC-DES-02', 'Borrado de registros de prueba']]}},
    {id: 'EV-07', t: 'Registro de aperturas del sobre de emergencia', from: 'Gerencia', type: 'Registro', date: '10/09/2026', rel: true,
     table: {head: ['Fecha', 'Motivo', 'Testigos'], rows: [['—', 'No se ha abierto en el periodo', '—']]}},
    {id: 'EV-90', t: 'Informe de parches de los portátiles', from: 'Responsable del Sistema', type: 'Informe', date: '01/09/2026', rel: false,
     note: 'Parches pendientes por portátil. No aporta nada sobre las cuentas privilegiadas.'},
    {id: 'EV-91', t: 'Organigrama de Albatrel', from: 'RR. HH.', type: 'Documento', date: '15/01/2026', rel: false,
     note: 'Quién depende de quién. No dice qué privilegios tiene cada cuenta.'}
  ],

  people: [
    {id: 'sys', name: 'Sergio Lahoz', role: 'Responsable del Sistema (RSIS)', qs: [
      {id: 'sy1', q: '¿Por qué adm-jnavarro no tiene MFA?', a: 'Se le rompió el móvil en primavera y le quité el MFA para que pudiera trabajar. Tenía que volver a activarlo.', key: true},
      {id: 'sy2', q: '¿Quién aprobó los privilegios de adm-egarcia?', a: 'Nadie por escrito. Eva los pidió para una migración en marzo y se los di; la migración terminó en abril.', key: true},
      {id: 'sy3', q: '¿Cómo funciona la cuenta svc-copias?', a: 'Es la cuenta del software de copias. No puede iniciar sesión en ningún equipo; su contraseña está en el cofre y se cambia cada trimestre.', key: true},
      {id: 'sy4', q: '¿Puedes darme la contraseña de un administrador para probarla?', a: 'No. Eso iría contra NOR-01, y no lo necesitas para auditar.', off: true}
    ]},
    {id: 'dev', name: 'Pablo Gil', role: 'Responsable de producto de la app de clínicas', qs: [
      {id: 'de1', q: '¿Quién usa la cuenta root-clinicas?', a: 'Los tres desarrolladores, cuando hay que tocar la base de datos. La contraseña está en un documento compartido del equipo.', key: true},
      {id: 'de2', q: '¿Por qué no tiene MFA?', a: 'La base de datos no lo admite. Habría que crear cuentas nominales para cada desarrollador y entrar a través del cofre.', key: true},
      {id: 'de3', q: '¿Alguien revisa lo que se hace con esa cuenta?', a: 'Hay un registro de accesos, pero solo indica el equipo de origen, no la persona.', key: true}
    ]},
    {id: 'sec', name: 'Elena Sanz', role: 'Responsable de Seguridad (RSEG)', qs: [
      {id: 'se1', q: '¿Por qué faltan actas de revisión en marzo, mayo y junio?', a: 'Estuve con la preparación del ENS y no llegué. Revisaba los registros por encima, pero sin acta.', key: true},
      {id: 'se2', q: '¿Cómo se controla la cuenta de emergencia?', a: 'Sobre sellado en la caja fuerte de Gerencia. Para usarla hacen falta dos personas y se apunta cada apertura. Tiene la excepción EX-08.', key: true},
      {id: 'se3', q: '¿Qué te preocupa más?', a: 'Que alguien entre en las historias clínicas con una cuenta que no controlamos.'}
    ]}
  ],

  tests: [
    {id: 'P-01', crit: 'n4', t: '¿Hay un inventario de cuentas privilegiadas con titular?', ev: 'Inventario completo y actualizado.', how: 'Revisar EV-02.', fail: []},
    {id: 'P-02', crit: 'n1', t: '¿Cada cuenta de la muestra es de una sola persona o de un servicio controlado?', ev: 'Titular nominal o cuenta de servicio documentada.', how: 'Revisar el titular en EV-02 y el uso en EV-06.', fail: ['C-04']},
    {id: 'P-03', crit: 'n3', t: '¿Las cuentas de la muestra tienen MFA o una excepción aprobada?', ev: 'MFA activo en EV-03 o excepción en EV-05.', how: 'Cruzar EV-03 con EV-05.', fail: ['C-02', 'C-04']},
    {id: 'P-04', crit: 'a82', t: '¿Los privilegios de la muestra están aprobados?', ev: 'Aprobación registrada en el inventario.', how: 'Revisar la columna «Aprobada por» de EV-02.', fail: ['C-03']},
    {id: 'P-05', crit: 'n4', t: '¿Se revisa cada mes el uso privilegiado?', ev: 'Un acta firmada por mes.', how: 'Revisar EV-04.', fail: ['*']},
    {id: 'P-06', crit: 'a85', t: '¿Las excepciones tienen medidas que las compensan?', ev: 'Medidas descritas y comprobadas.', how: 'Revisar EV-05 y EV-07.', fail: [], needs: ['C-05', 'C-06']}
  ],
  testStates: [['pend', 'Pendiente'], ['ok', 'Conforme'], ['nc', 'No conforme'], ['insuf', 'Evidencia insuficiente'], ['na', 'No aplica']],
  subjects: [['proc', 'La gestión de cuentas privilegiadas en general'], ['rev', 'La revisión mensual del uso privilegiado']],

  conclusions: [
    {id: 'k1', t: 'Las cuentas privilegiadas están bajo control: todas cumplen NOR-01.'},
    {id: 'k2', t: 'El control existe pero tiene huecos graves: una cuenta compartida sin MFA da acceso a los datos de salud.'},
    {id: 'k3', t: 'No hay ningún control sobre las cuentas privilegiadas.'}
  ],
  conclusionOk: 'k2',

  hints: {
    brief: ['El encargo se centra en cuatro reglas de NOR-01: titular, MFA, aprobación y revisión.', 'El riesgo R-02 trata de datos de salud: es la prioridad.'],
    plan: ['El alcance son los sistemas donde hay cuentas con privilegios.', 'Auditar no es atacar: probar contraseñas sobra.'],
    sample: ['Elige por riesgo: las cuentas que dan acceso a datos de salud y las que son distintas de las demás.', 'Con ocho cuentas, cinco o más es una muestra razonable.'],
    evidence: ['El inventario dice quién debería usar cada cuenta; el registro de accesos dice quién la usa.', 'Un organigrama no dice qué privilegios tiene cada cuenta.'],
    people: ['Pregunta al responsable de cada sistema por sus propias cuentas.', 'Nunca pidas contraseñas: no las necesitas.'],
    tests: ['Una cuenta sin MFA con una excepción aprobada y medidas que lo compensan cumple.', 'Si la revisión mensual falta, falla aunque tu muestra sea distinta.'],
    findings: ['Una cuenta de servicio sin inicio de sesión interactivo no puede tener MFA: mira la excepción.', 'La cuenta de emergencia sin MFA es normal si está sellada, con doble control y registro.'],
    report: ['La conclusión debe nombrar lo más grave: lo que afecta a los datos de salud.', 'Corrección: quitar el privilegio hoy. Acción correctiva: que no vuelva a pasar.']
  },

  key: [
    {id: 'K1', subj: 'C-04', type: 'nc', crit: ['n1', 'n3', 'a82', 'a85'], ev: ['EV-02', 'EV-03', 'EV-06'],
     t: 'root-clinicas: cuenta compartida y sin MFA sobre los datos de salud',
     why: 'La usan tres desarrolladores con una contraseña en un documento compartido (EV-06 muestra tres equipos distintos). Incumple «una persona, una cuenta» y el MFA, y no se puede saber quién hizo cada acción.'},
    {id: 'K2', subj: 'C-02', type: 'nc', crit: ['n3', 'a85'], ev: ['EV-03'],
     t: 'adm-jnavarro: administrador sin MFA y sin excepción',
     why: 'El MFA se desactivó en primavera para salir del paso y no se volvió a activar. No hay excepción ni medida que lo compense.'},
    {id: 'K3', subj: 'C-03', type: 'nc', alt: ['obs'], crit: ['a82', 'n1'], ev: ['EV-02'],
     t: 'adm-egarcia: privilegios de administrador sin aprobación',
     why: 'Se concedieron para una migración que terminó en abril y siguen activos. No hay aprobación en el inventario: incumple el mínimo privilegio.'},
    {id: 'K4', subj: 'rev', type: 'nc', crit: ['n4', 'a82'], ev: ['EV-04'],
     t: 'Faltan tres revisiones mensuales del uso privilegiado',
     why: 'NOR-01 §4 pide revisar el uso cada mes. No hay acta de marzo, mayo ni junio.'}
  ],
  traps: [
    {subj: 'C-05', t: 'C-05 no es un hallazgo', why: 'svc-copias no puede iniciar sesión, su contraseña está en el cofre y rota cada trimestre. Tiene la excepción EX-07 con medidas que lo compensan.'},
    {subj: 'C-06', t: 'C-06 no es un hallazgo', why: 'La cuenta de emergencia está sellada, exige dos personas y cada apertura se registra (EX-08, EV-07). Es una práctica correcta.'},
    {subj: 'C-01', t: 'C-01 es conforme', why: 'Titular único, aprobada y con MFA por llave de seguridad.'},
    {subj: 'C-07', t: 'C-07 es conforme', why: 'Titular único, aprobada y con MFA.'},
    {subj: 'C-08', t: 'C-08 es conforme', why: 'Titular único, aprobada y con MFA.'}
  ],
  model: {
    summary: 'Se auditaron las cuentas privilegiadas del primer semestre de 2026. Hay inventario y la mayoría cumple NOR-01, pero la cuenta root-clinicas se comparte entre tres personas sin MFA y da acceso a los datos de salud; un administrador no tiene MFA y otra cuenta conserva privilegios sin aprobar. Además, faltan tres revisiones mensuales del uso. El tratamiento del riesgo R-02 no es eficaz todavía.',
    actions: [
      ['Corrección', 'Cambiar hoy la contraseña de root-clinicas, guardarla en el cofre y retirar el documento compartido.'],
      ['Corrección', 'Reactivar el MFA de adm-jnavarro y retirar los privilegios de adm-egarcia.'],
      ['Acción correctiva', 'Cuentas nominales para cada desarrollador, con acceso a la base de datos a través del cofre.'],
      ['Acción correctiva', 'Que el MFA solo se desactive con una excepción con fecha de caducidad.'],
      ['Acción correctiva', 'Programar la revisión mensual con un suplente cuando la RSEG no pueda.']
    ]
  }
};

A.cases[C.id] = C; A.order.push(C.id);
if (window.I18N && I18N.lang === 'en') I18N.deep(C);
})();
