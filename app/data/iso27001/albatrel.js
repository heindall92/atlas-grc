/* Caso Albatrel · el SGSI documentado de una empresa INVENTADA.
   Contenido 100 % propio. Sirve para ver cómo se aterriza la norma en documentos reales
   y para construirlos paso a paso desde la app (modo «Construir»).
   Formato de un documento:
     {id, code, t, lvl:'POL'|'DOC'|'NOR'|'PRO'|'REG', icon, cl:[cláusulas], ctl:[controles], owner, appr, why,
      body:[{h, p:[...], ul:[...], table:{head, rows}}], build:[{sec, ex}]}
   build: cada paso es un ejercicio; al acertarlo (o tras corregirlo) se muestra la sección «sec» ya escrita. */
(function () {
const T = ATLAS.track('iso27001');
const C = T.caso;
const D = (o) => Object.assign({ver: '1.0', date: '02/11/2026', cls: 'Uso interno'}, o);

/* ─────────── Riesgos de Albatrel (escala MB-B-M-A-MA) ─────────── */
C.risks = [
  {id: 'R-01', t: 'Ransomware cifra los servidores de padrón y sede electrónica', asset: 'Servicio de padrón y sede electrónica', threat: '[A] Ataque intencionado', p: 'A', i: 'MA', ctl: ['8.7', '8.8', '8.13', '8.16', '5.24', '5.26', '6.3', '8.22'], opt: 'Mitigar', res: 'M', owner: 'Responsable del Sistema'},
  {id: 'R-02', t: 'Acceso no autorizado a historias clínicas con credenciales robadas', asset: 'Datos de salud de las clínicas', threat: '[A] Ataque intencionado', p: 'A', i: 'MA', ctl: ['5.15', '5.16', '5.17', '5.18', '8.2', '8.5', '8.15', '8.3'], opt: 'Mitigar', res: 'B', owner: 'Responsable de Seguridad'},
  {id: 'R-03', t: 'Caída de la sede electrónica en el periodo de pago de tributos', asset: 'Sede electrónica', threat: '[I] Origen industrial / [E] Error', p: 'M', i: 'A', ctl: ['8.6', '8.14', '5.29', '5.30', '7.11'], opt: 'Mitigar', res: 'B', owner: 'Responsable del Sistema'},
  {id: 'R-04', t: 'Envío de datos personales a un destinatario equivocado', asset: 'Datos del padrón y de pacientes', threat: '[E] Error no intencionado', p: 'A', i: 'A', ctl: ['5.12', '5.13', '5.14', '6.3', '8.12'], opt: 'Mitigar', res: 'M', owner: 'Responsable de Seguridad'},
  {id: 'R-05', t: 'Fallo o brecha del proveedor de hosting de la app de clínicas', asset: 'Servicio de agenda e historia clínica', threat: '[A] / [I] Proveedor', p: 'M', i: 'A', ctl: ['5.19', '5.20', '5.21', '5.22', '5.23'], opt: 'Transferir y mitigar', res: 'M', owner: 'Gerencia'},
  {id: 'R-06', t: 'Sobrecalentamiento de la sala técnica en una ola de calor', asset: 'Sala técnica de Zaragoza', threat: '[N] / [I] Ambiental', p: 'M', i: 'A', ctl: ['7.5', '7.8', '7.11', '7.13', '7.4'], opt: 'Mitigar', res: 'B', owner: 'Responsable del Sistema'},
  {id: 'R-07', t: 'Vulnerabilidades en el código propio de la app de clínicas', asset: 'Aplicación de agenda e historia clínica', threat: '[A] Ataque intencionado', p: 'M', i: 'A', ctl: ['8.4', '8.25', '8.26', '8.27', '8.28', '8.29', '8.31', '8.32', '8.33'], opt: 'Mitigar', res: 'B', owner: 'Responsable del Sistema'},
  {id: 'R-08', t: 'Pérdida o robo de un portátil durante el teletrabajo', asset: 'Portátiles del personal', threat: '[A] / [E]', p: 'A', i: 'M', ctl: ['6.7', '8.1', '8.24', '7.9', '7.10', '7.14'], opt: 'Mitigar', res: 'B', owner: 'Responsable del Sistema'},
  {id: 'R-09', t: 'Una persona que deja la empresa conserva sus accesos', asset: 'Cuentas de usuario', threat: '[E] Error de proceso', p: 'M', i: 'A', ctl: ['5.11', '5.18', '6.5', '6.6'], opt: 'Mitigar', res: 'B', owner: 'Responsable de Seguridad'},
  {id: 'R-10', t: 'Incumplir el RGPD o el ENS por falta de procedimientos y evidencias', asset: 'Cumplimiento y contratos', threat: 'Cumplimiento', p: 'M', i: 'MA', ctl: ['5.31', '5.33', '5.34', '5.35', '5.36', '5.37'], opt: 'Mitigar', res: 'B', owner: 'Gerencia'}
];
const LV = {MB: 1, B: 2, M: 3, A: 4, MA: 5};
C.riskLevel = (p, i) => { const s = LV[p] + LV[i]; return s >= 9 ? 'MA' : s >= 7 ? 'A' : s >= 5 ? 'M' : s >= 4 ? 'B' : 'MB'; };
C.acceptance = 'B';   // se acepta todo riesgo residual Bajo o Muy bajo

/* ─────────── Declaración de Aplicabilidad (se genera a partir de los riesgos) ─────────── */
const NOT_APPLICABLE = {'8.30': 'Albatrel no externaliza desarrollo de software: todo el código lo hace su equipo.'};
const DONE = ['5.1', '5.2', '5.4', '5.10', '6.2', '6.6', '7.1', '7.2', '7.3', '7.7', '7.8', '8.7', '8.20'];
const PLANNED = ['5.6', '5.7', '5.35', '8.11', '8.12', '8.16', '8.23', '8.28', '8.34'];
const WHY = {
  '5.1': 'Base del SGSI: política POL-01 y normativas temáticas.', '5.2': 'Roles definidos en ORG-01; exigido por el ENS.',
  '5.3': 'Con 60 personas hay tareas incompatibles (altas de permisos, cambios); se separan o se compensan.',
  '5.4': 'La Gerencia exige a los mandos aplicar la política.', '5.5': 'Contactos con AEPD, CCN-CERT y policía para notificar incidentes.',
  '5.6': 'Suscripción a avisos del CCN-CERT e INCIBE para estar al día.', '5.7': 'Las entidades locales son objetivo frecuente: conviene recibir inteligencia de amenazas.',
  '5.8': 'Las nuevas versiones de la app de clínicas son proyectos con seguridad desde el diseño.',
  '5.9': 'Sin inventario de activos no se puede hacer el análisis de riesgos (REG-01).', '5.10': 'Reglas de uso para toda la plantilla en NOR-03.',
  '5.25': 'El RSEG decide si un evento es incidente (PRO-01).', '5.27': 'Lecciones aprendidas tras cada incidente alto (PRO-01).',
  '5.28': 'Las evidencias pueden ser necesarias ante la AEPD o un juzgado (PRO-01).', '5.32': 'Uso de software con licencia y respeto a librerías de código abierto.',
  '6.1': 'Verificación de referencias proporcional al puesto, sobre todo con acceso a datos de salud.', '6.2': 'Los contratos incluyen las obligaciones de seguridad y confidencialidad.',
  '6.4': 'Proceso disciplinario acordado con RR. HH. (citado en POL-01).', '6.8': 'Canal de incidentes para que cualquiera avise (PRO-01).',
  '7.1': 'La sala técnica es un área segura con perímetro definido.', '7.2': 'Acceso a la sala técnica con tarjeta y registro.',
  '7.3': 'Oficinas con zonas de atención separadas de las de trabajo.', '7.6': 'Reglas para trabajar en la sala técnica (acompañado y con registro).',
  '7.7': 'Puesto despejado y pantalla bloqueada (NOR-03).', '7.12': 'El cableado de la sala técnica está protegido y etiquetado.',
  '8.9': 'Configuraciones seguras de servidores y equipos documentadas.', '8.10': 'Se borran los datos de clínicas y entidades cuando termina el contrato.',
  '8.11': 'Datos enmascarados en los entornos de pruebas de la app.', '8.17': 'Hora sincronizada en todos los sistemas para investigar incidentes.',
  '8.18': 'Herramientas de administración restringidas a los administradores.', '8.19': 'Instalación en producción solo mediante el proceso de cambios.',
  '8.20': 'Cortafuegos y redes gestionados por el RSIS.', '8.21': 'Requisitos de seguridad en los servicios de red contratados.',
  '8.23': 'Filtrado web para reducir el phishing y las descargas maliciosas.', '8.34': 'Las auditorías técnicas se planifican para no afectar a los servicios.'
};
const BASE = {
  '5': 'Necesario para gobernar el SGSI y exigido por el ENS (marco organizativo).',
  '6': 'Necesario para que el personal y los colaboradores protejan la información.',
  '7': 'Albatrel tiene sede y sala técnica propias que hay que proteger.',
  '8': 'Albatrel opera sistemas, redes y una aplicación propia en producción.'
};
C.soaRows = () => (T.norma ? T.norma.controls : []).map(([n, t]) => {
  const risks = C.risks.filter(r => r.ctl.includes(n)).map(r => r.id);
  const na = NOT_APPLICABLE[n];
  const docs = C.docs.filter(d => (d.ctl || []).includes(n)).map(d => d.code);
  return {n, t, ap: !na, why: na || [risks.length ? 'Trata ' + risks.join(', ') + '.' : '', WHY[n] || (risks.length ? '' : BASE[n.split('.')[0]])].filter(Boolean).join(' '),
    st: na ? 'N/A' : DONE.includes(n) ? 'Implantado' : PLANNED.includes(n) ? 'Planificado' : 'En curso', risks, docs};
});

/* ─────────── Plan de tratamiento ─────────── */
C.ptr = [
  ['R-01', '8.13', 'Copias diarias con una copia fuera de línea y prueba de restauración mensual', 'Responsable del Sistema', 'Dic 2026', 'En curso', 'M'],
  ['R-01', '8.8', 'Parchear vulnerabilidades críticas en menos de 7 días', 'Responsable del Sistema', 'Ene 2027', 'En curso', 'M'],
  ['R-01', '8.16', 'Contratar monitorización 24×7 de servidores y red', 'Gerencia', 'Mar 2027', 'Planificado', 'M'],
  ['R-02', '8.5', 'MFA obligatorio en todas las cuentas y en el acceso de las clínicas', 'Responsable de Seguridad', 'Dic 2026', 'En curso', 'B'],
  ['R-02', '5.18', 'Revisión trimestral de permisos con los dueños de cada sistema', 'Responsable de Seguridad', 'Ene 2027', 'Planificado', 'B'],
  ['R-03', '8.14', 'Segundo servidor de la sede electrónica en otro centro de datos', 'Responsable del Sistema', 'Abr 2027', 'Planificado', 'B'],
  ['R-04', '6.3', 'Formación anual en tratamiento de datos y simulacros de error de envío', 'Responsable de Seguridad', 'Feb 2027', 'Planificado', 'M'],
  ['R-05', '5.20', 'Cláusulas de seguridad y de notificación de brechas en el contrato de hosting', 'Gerencia', 'Dic 2026', 'En curso', 'M'],
  ['R-05', '—', 'Ciberseguro que cubra la interrupción del servicio de clínicas (transferir)', 'Gerencia', 'Ene 2027', 'Planificado', 'M'],
  ['R-06', '7.11', 'Segundo equipo de climatización y alarma de temperatura', 'Responsable del Sistema', 'May 2027', 'Planificado', 'B'],
  ['R-07', '8.29', 'Pruebas de seguridad del código antes de cada versión', 'Responsable del Sistema', 'Mar 2027', 'Planificado', 'B'],
  ['R-08', '8.24', 'Cifrado de disco completo en todos los portátiles', 'Responsable del Sistema', 'Dic 2026', 'Hecho', 'B'],
  ['R-09', '5.18', 'Baja de accesos el mismo día de la salida, con lista de comprobación de RR. HH.', 'Responsable de Seguridad', 'Dic 2026', 'Hecho', 'B'],
  ['R-10', '5.31', 'Registro de requisitos legales y contractuales revisado cada año', 'Responsable de Seguridad', 'Ene 2027', 'En curso', 'B']
];

/* ─────────── Los 14 documentos ─────────── */
C.docs = [
D({id: 'pol', code: 'POL-01', t: 'Política de seguridad de la información', lvl: 'POL', icon: 'shield', cl: ['5.2'], ctl: ['5.1'], owner: 'Responsable de Seguridad', appr: 'Gerencia',
 why: 'Es el documento de primer nivel: el compromiso firmado de la dirección. Lo exige la cláusula 5.2 y es el control 5.1.',
 body: [
  {h: '1. Propósito', p: ['Albatrel Servicios Digitales presta servicios de padrón, tributos y sede electrónica a entidades locales, y un servicio en la nube de agenda e historia clínica a clínicas dentales. La información de vecinos y pacientes es el centro de nuestro trabajo. Esta política expresa cómo la protegemos.']},
  {h: '2. Alcance', p: ['Se aplica a todo el personal, a los colaboradores externos y a todos los sistemas incluidos en el alcance del SGSI definido en DOC-01.']},
  {h: '3. Compromisos de la Gerencia', ul: ['Proteger la confidencialidad, integridad y disponibilidad de la información, y su autenticidad y trazabilidad cuando lo exija el ENS.', 'Cumplir los requisitos legales, reglamentarios y contractuales aplicables: RGPD, LOPDGDD, ENS y los contratos con clientes.', 'Mejorar de forma continua el SGSI.', 'Aportar los recursos necesarios y asignar responsabilidades claras (ORG-01).']},
  {h: '4. Marco de objetivos', p: ['Los objetivos de seguridad se fijan cada año en OBJ-01, son medibles y se revisan en la revisión por la dirección.']},
  {h: '5. Principios', ul: ['La seguridad se decide según el riesgo (MET-01).', 'Cada persona accede solo a lo que necesita.', 'Todo incidente se comunica en cuanto se detecta (PRO-01).', 'Lo que no está documentado no se puede demostrar (PRO-02).']},
  {h: '6. Incumplimiento', p: ['Incumplir esta política puede dar lugar a medidas disciplinarias, según el proceso establecido con Recursos Humanos.']},
  {h: '7. Revisión y difusión', p: ['Se revisa al menos una vez al año y siempre que haya cambios importantes. Se comunica a todo el personal al incorporarse y está disponible para las partes interesadas que la soliciten.']}
 ],
 build: [
  {sec: 0, ex: {k: 'choice', q: '¿Con qué debe empezar la política de Albatrel?', opts: ['Con para qué existe y qué protege la empresa', 'Con la configuración del cortafuegos', 'Con la lista de contraseñas'], a: 0, why: 'La política debe ser adecuada al propósito de la organización (5.2 a).', ref: ['une', 8]}},
  {sec: 2, ex: {k: 'classify', q: '¿Qué compromisos no pueden faltar según 5.2?', buckets: [{t: 'Obligatorio', c: '#5e5ce6'}, {t: 'Opcional', c: '#8e8e93'}], items: [['Cumplir los requisitos aplicables', 0], ['Mejorar de forma continua el SGSI', 0], ['Comprar un antivirus concreto', 1], ['Prohibir el teletrabajo', 1]], ref: ['une', 8]}},
  {sec: 3, ex: {k: 'tf', q: 'La política puede incluir los objetivos o un marco para fijarlos en otro documento.', a: true, why: '5.2 b): objetivos o un marco de referencia para establecerlos.', ref: ['une', 8]}},
  {sec: 6, ex: {k: 'choice', q: '¿Quién aprueba la política?', opts: ['La Gerencia (alta dirección)', 'El técnico de sistemas', 'El proveedor de hosting'], a: 0, why: '5.2: la establece la alta dirección.', ref: ['une', 8]}}
 ]}),

D({id: 'ctx', code: 'DOC-01', t: 'Contexto, partes interesadas y alcance del SGSI', lvl: 'DOC', icon: 'compass', cl: ['4.1', '4.2', '4.3'], ctl: [], owner: 'Responsable de Seguridad', appr: 'Comité de Seguridad',
 why: 'Recoge lo que piden las cláusulas 4.1 a 4.3. El alcance es información documentada obligatoria.',
 body: [
  {h: '1. Cuestiones externas', ul: ['La renovación del contrato con la Diputación exige la certificación ENS de categoría MEDIA.', 'Aumento del ransomware contra entidades locales.', 'Datos de salud de las clínicas: RGPD y obligaciones de encargado del tratamiento.', 'Dependencia del proveedor de hosting y del correo en la nube.', 'Olas de calor que afectan a la sala técnica.']},
  {h: '2. Cuestiones internas', ul: ['60 personas: no siempre se pueden separar funciones.', 'Sede única en Zaragoza con sala técnica propia.', 'Teletrabajo dos días por semana.', 'Equipo técnico joven, sin documentación previa.']},
  {h: '3. Partes interesadas y requisitos', table: {head: ['Parte interesada', 'Requisito', '¿Lo aborda el SGSI?'], rows: [['Diputación y ayuntamientos', 'Certificación ENS MEDIA, continuidad del padrón, aviso de incidentes', 'Sí'], ['Clínicas y pacientes', 'Confidencialidad de los datos de salud, contrato de encargado', 'Sí'], ['Personal', 'Reglas claras y formación', 'Sí'], ['Proveedores', 'Requisitos de seguridad en el contrato', 'Sí'], ['AEPD y CCN', 'Cumplimiento y notificación de brechas', 'Sí'], ['Socios', 'Rentabilidad del negocio', 'No (se gestiona fuera del SGSI)']]}},
  {h: '4. Alcance', p: ['«Los servicios de padrón, gestión tributaria y sede electrónica para entidades locales y el servicio en la nube de agenda e historia clínica para clínicas dentales, prestados desde la sede de Zaragoza, con los procesos de soporte que los sustentan, según la Declaración de Aplicabilidad vigente».']},
  {h: '5. Interfaces y exclusiones del alcance', ul: ['Quedan fuera los equipos propios de cada ayuntamiento; entran los accesos de Albatrel a ellos.', 'El hosting y el correo en la nube se tratan como servicios externos controlados por contrato (SOA-01 y PTR-01).']}
 ],
 build: [
  {sec: 0, ex: {k: 'classify', q: 'Clasifica estas cuestiones de Albatrel.', buckets: [{t: 'Externa', c: '#ff9f0a'}, {t: 'Interna', c: '#5e5ce6'}], items: [['El contrato exige el ENS', 0], ['Ransomware contra ayuntamientos', 0], ['Teletrabajo dos días', 1], ['Equipo técnico joven', 1]], ref: ['une', 6]}},
  {sec: 2, ex: {k: 'tf', q: 'En la versión 2022 hay que indicar qué requisitos de las partes interesadas se abordan con el SGSI.', a: true, why: '4.2 c).', ref: ['une', 7]}},
  {sec: 3, ex: {k: 'order', q: 'Ordena lo que hay que considerar para fijar el alcance (4.3).', items: ['Cuestiones internas y externas (4.1)', 'Requisitos de las partes interesadas (4.2)', 'Interfaces y dependencias con otras organizaciones'], ref: ['une', 7]}},
  {sec: 4, ex: {k: 'choice', q: 'Los equipos de un ayuntamiento que Albatrel administra en remoto…', opts: ['Quedan fuera; entran los accesos de Albatrel a ellos', 'Entran como si fueran propios', 'No hay que mencionarlos'], a: 0, ref: ['une', 7]}}
 ]}),

D({id: 'org', code: 'ORG-01', t: 'Organización de la seguridad: roles y responsabilidades', lvl: 'DOC', icon: 'users', cl: ['5.3'], ctl: ['5.2', '5.3', '5.4'], owner: 'Responsable de Seguridad', appr: 'Gerencia',
 why: 'Asigna y comunica los roles de seguridad (5.3) y aplica la segregación de funciones (control 5.3).',
 body: [
  {h: '1. Roles', table: {head: ['Rol', 'Persona', 'Responsabilidades principales'], rows: [['Gerencia', 'Gerente', 'Aprueba la política y los riesgos residuales altos. Revisión por la dirección.'], ['Comité de Seguridad', 'Gerente, RSEG, RSIS, responsable de clínicas, DPD', 'Aprueba normativas, sigue el plan de tratamiento, resuelve conflictos.'], ['Responsable de Seguridad (RSEG)', 'Responsable de seguridad', 'Dueño del SGSI, riesgos, SoA, incidentes, métricas y formación. Informa a la Gerencia.'], ['Responsable del Sistema (RSIS)', 'Jefe de sistemas', 'Opera las medidas técnicas y las copias.'], ['Delegado de Protección de Datos', 'Servicio externo', 'Asesora y supervisa el cumplimiento del RGPD.']]}},
  {h: '2. Matriz RACI', table: {head: ['Actividad', 'Gerencia', 'Comité', 'RSEG', 'RSIS'], rows: [['Aprobar la política', 'A', 'R', 'C', 'I'], ['Aprobar normativas', 'I', 'A', 'R', 'C'], ['Análisis de riesgos', 'I', 'A', 'R', 'C'], ['Aceptar riesgo residual alto', 'A', 'R', 'C', 'I'], ['Operar copias de seguridad', 'I', 'I', 'C', 'A/R'], ['Gestionar incidentes', 'I', 'I', 'A/R', 'R']]}},
  {h: '3. Segregación de funciones', p: ['El RSEG y el RSIS son personas distintas y ninguna depende de la otra. Quien solicita un cambio o un permiso no lo aprueba ni lo ejecuta. Cuando el tamaño no lo permita, se aplica una revisión posterior que firma el RSEG.']}
 ],
 build: [
  {sec: 0, ex: {k: 'choice', q: '¿Qué dos responsabilidades exige asignar 5.3 como mínimo?', opts: ['Asegurar que el SGSI cumple la norma e informar a la dirección de su comportamiento', 'Comprar equipos y contratar personal', 'Hacer copias y auditar proveedores'], a: 0, ref: ['une', 8]}},
  {sec: 1, ex: {k: 'match', q: 'Une cada letra RACI con su significado.', pairs: [['R', 'Realiza'], ['A', 'Aprueba o rinde cuentas'], ['C', 'Consultado'], ['I', 'Informado']]}},
  {sec: 2, ex: {k: 'tf', q: 'El Responsable de Seguridad puede depender jerárquicamente del Responsable del Sistema.', a: false, why: 'Quien supervisa no debe depender de quien opera.'}}
 ]}),

D({id: 'met', code: 'MET-01', t: 'Metodología de análisis y tratamiento de riesgos', lvl: 'DOC', icon: 'scale', cl: ['6.1.2', '6.1.3'], ctl: [], owner: 'Responsable de Seguridad', appr: 'Comité de Seguridad',
 why: 'La cláusula 6.1.2 exige un proceso documentado, con criterios, que dé resultados comparables.',
 body: [
  {h: '1. Método', p: ['Albatrel sigue MAGERIT v3: activos esenciales y de soporte, amenazas por origen, impacto, probabilidad, salvaguardas existentes y riesgo residual.']},
  {h: '2. Escalas', table: {head: ['Nivel', 'Probabilidad', 'Impacto'], rows: [['MB', 'Menos de una vez cada 5 años', 'Sin efecto apreciable'], ['B', 'Una vez cada 2-5 años', 'Molestias internas'], ['M', 'Una vez al año', 'Afecta a un cliente o servicio un día'], ['A', 'Varias veces al año', 'Afecta a varios clientes o a datos personales'], ['MA', 'Mensual o más', 'Datos de salud expuestos o servicio público parado varios días']]}},
  {h: '3. Cálculo del nivel de riesgo', p: ['Se suman los niveles (MB=1 … MA=5): 9-10 Muy alto, 7-8 Alto, 5-6 Medio, 4 Bajo, 2-3 Muy bajo.']},
  {h: '4. Criterio de aceptación', p: ['Se acepta el riesgo residual Bajo o Muy bajo. Un riesgo residual Medio necesita aprobación del Comité, y uno Alto o Muy alto, de la Gerencia.']},
  {h: '5. Tratamiento y periodicidad', ul: ['Opciones: mitigar, transferir, evitar o aceptar.', 'Cada riesgo tiene un dueño, que aprueba su plan de tratamiento (PTR-01).', 'El análisis se repite cada año y ante cambios importantes (8.2).']}
 ],
 build: [
  {sec: 1, ex: {k: 'order', q: 'Ordena la escala de probabilidad de menor a mayor.', items: ['MB', 'B', 'M', 'A', 'MA'], ref: ['mag', 22]}},
  {sec: 3, ex: {k: 'choice', q: 'Si no hubiera criterio de aceptación, ¿qué apartado se incumpliría?', opts: ['6.1.2', '7.4', '9.3'], a: 0, ref: ['une', 9]}},
  {sec: 4, ex: {k: 'match', q: 'Une cada opción de tratamiento con su ejemplo en Albatrel.', pairs: [['Mitigar', 'MFA en todas las cuentas'], ['Transferir', 'Ciberseguro'], ['Evitar', 'Dejar de ofrecer un servicio inseguro'], ['Aceptar', 'Asumir un riesgo residual bajo']], ref: ['mag', 10]}}
 ]}),

D({id: 'rsk', code: 'REG-01', t: 'Registro de análisis de riesgos', lvl: 'REG', icon: 'scan-search', cl: ['6.1.2', '8.2'], ctl: [], owner: 'Responsable de Seguridad', appr: 'Comité de Seguridad', special: 'risks',
 why: 'Evidencia de la evaluación de riesgos (información documentada que se conserva, 8.2).',
 body: [{h: '1. Riesgos identificados', p: ['Tabla generada con los 10 riesgos principales de Albatrel.']}],
 build: [
  {sec: 0, ex: {k: 'choice', q: 'R-02: probabilidad Alta (4) e impacto Muy alto (5). Con la escala de MET-01, ¿qué nivel de riesgo inherente tiene?', opts: ['Muy alto', 'Medio', 'Bajo'], a: 0, why: '4 + 5 = 9 → Muy alto.'}},
  {sec: 0, ex: {k: 'classify', q: '¿De qué origen es cada amenaza (MAGERIT)?', buckets: [{t: '[A] Ataque', c: '#ff3b30'}, {t: '[E] Error', c: '#8e8e93'}, {t: '[N]/[I] Ambiental', c: '#30b0c7'}], items: [['Ransomware (R-01)', 0], ['Envío a destinatario equivocado (R-04)', 1], ['Ola de calor en la sala técnica (R-06)', 2], ['Credenciales robadas (R-02)', 0]], ref: ['mag2', 25]}},
  {sec: 0, ex: {k: 'tf', q: 'Cada riesgo del registro debe tener un dueño.', a: true, why: '6.1.2 c) 2).', ref: ['une', 9]}}
 ]}),

D({id: 'soa', code: 'SOA-01', t: 'Declaración de Aplicabilidad', lvl: 'REG', icon: 'list-checks', cl: ['6.1.3'], ctl: [], owner: 'Responsable de Seguridad', appr: 'Gerencia', special: 'soa',
 why: 'Sin SoA no hay certificación. Recoge los 93 controles: si aplican, por qué y su estado (6.1.3 d).',
 body: [{h: '1. Controles del Anexo A', p: ['Tabla generada a partir del registro de riesgos.']}],
 build: [
  {sec: 0, ex: {k: 'classify', q: '¿Qué debe recoger la SoA según 6.1.3 d)?', buckets: [{t: 'Sí', c: '#5e5ce6'}, {t: 'No', c: '#8e8e93'}], items: [['Los controles necesarios', 0], ['Por qué se incluyen', 0], ['Si están implantados', 0], ['Por qué se excluye alguno', 0], ['El precio de cada control', 1]], ref: ['une', 10]}},
  {sec: 0, ex: {k: 'choice', q: 'Albatrel no externaliza desarrollo. ¿Qué hace con el control 8.30?', opts: ['Lo declara no aplicable y lo justifica', 'Lo borra de la SoA', 'Lo marca como implantado'], a: 0, why: 'Toda exclusión se justifica en la SoA.', ref: ['une', 10]}},
  {sec: 0, ex: {k: 'tf', q: 'La justificación de un control puede ser el riesgo que trata (por ejemplo, «Trata R-02»).', a: true}}
 ]}),

D({id: 'ptr', code: 'PTR-01', t: 'Plan de tratamiento de riesgos', lvl: 'REG', icon: 'target', cl: ['6.1.3', '8.3'], ctl: [], owner: 'Responsable de Seguridad', appr: 'Dueños de los riesgos', special: 'ptr',
 why: 'El «cómo, cuándo y quién» de la SoA. Lo aprueban los dueños de los riesgos (6.1.3 e-f).',
 body: [{h: '1. Acciones', p: ['Tabla generada con las acciones de tratamiento.']}],
 build: [
  {sec: 0, ex: {k: 'match', q: '¿Qué responde cada documento?', pairs: [['SOA-01', 'Qué controles y por qué'], ['PTR-01', 'Cómo, cuándo, quién y cuánto'], ['REG-01', 'Qué riesgos hay y cuánto valen']]}},
  {sec: 0, ex: {k: 'tf', q: 'Los dueños de los riesgos aprueban el plan y aceptan el riesgo residual.', a: true, ref: ['une', 11]}}
 ]}),

D({id: 'obj', code: 'OBJ-01', t: 'Objetivos de seguridad 2027', lvl: 'DOC', icon: 'flag', cl: ['6.2'], ctl: [], owner: 'Responsable de Seguridad', appr: 'Comité de Seguridad',
 why: 'Objetivos medibles y coherentes con la política (6.2), que luego se miden en 9.1.',
 body: [
  {h: '1. Objetivos', table: {head: ['Objetivo', 'Indicador', 'Meta', 'Responsable', 'Plazo'], rows: [['Certificarse', 'Certificados ENS MEDIA e ISO 27001', 'Ambos sin no conformidades mayores', 'RSEG', 'Sep 2027'], ['Disponibilidad', 'Sede electrónica disponible en periodo de pago', '≥ 99,8 %', 'RSIS', 'Continuo'], ['Formación', 'Personal con formación anual', '100 %', 'RSEG', 'Jun 2027'], ['Phishing', 'Clics en simulacros', '< 5 %', 'RSEG', 'Trimestral'], ['MFA', 'Cuentas con MFA', '100 %', 'RSIS', 'Dic 2026'], ['Copias', 'Restauraciones de prueba con éxito', '12 de 12', 'RSIS', 'Mensual']]}},
  {h: '2. Seguimiento', p: ['El Comité revisa los indicadores cada trimestre y la Gerencia en la revisión por la dirección.']}
 ],
 build: [
  {sec: 0, ex: {k: 'classify', q: '¿Es un objetivo medible?', buckets: [{t: 'Medible', c: '#34c759'}, {t: 'Vago', c: '#ff3b30'}], items: [['100 % de cuentas con MFA en diciembre', 0], ['Clics en phishing < 5 %', 0], ['Mejorar la seguridad', 1], ['Concienciar más', 1]], ref: ['une', 11]}},
  {sec: 0, ex: {k: 'order', q: 'Ordena lo que se planifica para cada objetivo (6.2).', items: ['Qué se hará', 'Recursos', 'Responsable', 'Plazo', 'Cómo se evaluará'], ref: ['une', 11]}}
 ]}),

D({id: 'pln', code: 'PLN-01', t: 'Plan de competencia, concienciación y comunicación', lvl: 'DOC', icon: 'graduation-cap', cl: ['7.2', '7.3', '7.4'], ctl: ['6.3'], owner: 'Responsable de Seguridad', appr: 'Comité de Seguridad',
 why: 'Une las cláusulas 7.2, 7.3 y 7.4 en un solo plan práctico.',
 body: [
  {h: '1. Competencia por rol', table: {head: ['Rol', 'Competencia necesaria', 'Cómo se consigue', 'Evidencia'], rows: [['RSEG', 'Gestión de un SGSI e ISO 27001', 'Certificación Foundation y curso de implantación', 'Certificados'], ['RSIS', 'Administración segura y copias', 'Formación técnica anual', 'Acta y evaluación'], ['Desarrolladores', 'Codificación segura', 'Taller anual', 'Acta y prueba práctica']]}},
  {h: '2. Concienciación', ul: ['Sesión de bienvenida sobre la política antes de dar acceso.', 'Refresco anual para toda la plantilla.', 'Simulacros de phishing cada trimestre.', 'Sesión sobre datos de salud para quien atiende a clínicas.']},
  {h: '3. Comunicación', table: {head: ['Qué', 'Cuándo', 'Con quién', 'Cómo'], rows: [['Incidente grave en el padrón', 'Al confirmarse', 'Diputación y ayuntamiento afectado', 'Teléfono y luego por escrito'], ['Brecha con datos de salud', 'Sin dilación', 'Clínica responsable', 'Por escrito (DPD)'], ['Nueva normativa interna', 'Al aprobarse', 'Toda la plantilla', 'Intranet con acuse de recibo'], ['Resultado de auditoría', 'Tras recibir el informe', 'Comité y personal afectado', 'Reunión y resumen escrito']]}}
 ],
 build: [
  {sec: 0, ex: {k: 'tf', q: 'Tras dar una formación hay que evaluar si fue eficaz.', a: true, why: '7.2 c).', ref: ['une', 12]}},
  {sec: 1, ex: {k: 'match', q: 'Une cada letra de 7.3 con lo que debe saber el personal.', pairs: [['a', 'La política'], ['b', 'Su contribución al SGSI'], ['c', 'Qué pasa si no cumple']], ref: ['une', 12]}},
  {sec: 2, ex: {k: 'order', q: 'Ordena las columnas del plan de comunicación según 7.4.', items: ['Qué', 'Cuándo', 'Con quién', 'Cómo'], ref: ['une', 13]}}
 ]}),

D({id: 'nacc', code: 'NOR-01', t: 'Normativa de control de accesos', lvl: 'NOR', icon: 'lock', cl: [], ctl: ['5.15', '5.16', '5.17', '5.18', '8.2', '8.3', '8.5'], owner: 'Responsable de Seguridad', appr: 'Comité de Seguridad',
 why: 'Baja a reglas concretas los controles de acceso que tratan R-02 y R-09.',
 body: [
  {h: '1. Principios', ul: ['Necesidad de conocer y mínimo privilegio.', 'Una persona, una cuenta: no se comparten usuarios.']},
  {h: '2. Altas, cambios y bajas', ul: ['RR. HH. comunica altas y bajas al RSIS con una semana de antelación cuando sea posible.', 'El responsable del área aprueba los permisos; el RSIS los ejecuta.', 'Los accesos se retiran el mismo día de la salida.']},
  {h: '3. Autenticación', ul: ['MFA obligatorio en todas las cuentas y en el acceso de las clínicas.', 'Contraseñas de al menos 12 caracteres, gestionadas con el gestor corporativo.']},
  {h: '4. Accesos privilegiados', ul: ['Cuentas de administrador separadas de las de uso diario.', 'Registro y revisión mensual de su uso.']},
  {h: '5. Revisión', p: ['Los dueños de cada sistema revisan los permisos cada trimestre.']}
 ],
 build: [
  {sec: 0, ex: {k: 'choice', q: '¿Qué principio debe guiar los permisos?', opts: ['Mínimo privilegio y necesidad de conocer', 'Todos acceden a todo para no perder tiempo', 'Solo la dirección tiene contraseña'], a: 0}},
  {sec: 1, ex: {k: 'choice', scenario: 'Una persona deja Albatrel el viernes.', q: '¿Cuándo deben retirarse sus accesos?', opts: ['El mismo día de la salida', 'Al mes siguiente', 'Cuando alguien se acuerde'], a: 0, why: 'Trata el riesgo R-09 (control 5.18).'}},
  {sec: 2, ex: {k: 'tf', q: 'El MFA trata el riesgo de acceso con credenciales robadas (R-02).', a: true}}
 ]}),

D({id: 'ncop', code: 'NOR-02', t: 'Normativa de copias de seguridad', lvl: 'NOR', icon: 'refresh-cw', cl: [], ctl: ['8.13'], owner: 'Responsable del Sistema', appr: 'Comité de Seguridad',
 why: 'Concreta el control 8.13, la defensa principal frente al ransomware (R-01).',
 body: [
  {h: '1. Qué se copia', ul: ['Bases de datos de padrón, tributos y clínicas.', 'Configuraciones de servidores y red.', 'Documentación del SGSI.']},
  {h: '2. Regla 3-2-1', p: ['Tres copias, en dos soportes distintos y una fuera de línea o fuera de la sede.']},
  {h: '3. Frecuencia y conservación', table: {head: ['Tipo', 'Frecuencia', 'Conservación'], rows: [['Incremental', 'Diaria', '30 días'], ['Completa', 'Semanal', '3 meses'], ['Fuera de línea', 'Mensual', '1 año']]}},
  {h: '4. Pruebas de restauración', p: ['Cada mes se restaura una copia en un entorno aislado y se deja registro del resultado (objetivo de OBJ-01).']}
 ],
 build: [
  {sec: 1, ex: {k: 'choice', q: 'En la regla 3-2-1, ¿qué significa el «1»?', opts: ['Una copia fuera de línea o fuera de la sede', 'Una copia al año', 'Un único soporte'], a: 0}},
  {sec: 3, ex: {k: 'tf', q: 'Hacer copias sin probar que se pueden restaurar cumple el control 8.13.', a: false, why: 'El control pide que las copias permitan recuperar la información: hay que probarlas.'}}
 ]}),

D({id: 'pinc', code: 'PRO-01', t: 'Procedimiento de gestión de incidentes', lvl: 'PRO', icon: 'swords', cl: [], ctl: ['5.24', '5.25', '5.26', '5.27', '5.28', '6.8'], owner: 'Responsable de Seguridad', appr: 'Responsable de Seguridad',
 why: 'Cómo se detecta, decide, responde y aprende de un incidente (controles 5.24 a 5.28 y 6.8).',
 body: [
  {h: '1. Notificar', p: ['Cualquier persona que detecte algo raro lo comunica al momento por el canal de incidentes (correo y teléfono de guardia).']},
  {h: '2. Evaluar', p: ['El RSEG decide si el evento es un incidente y lo clasifica: bajo, medio, alto o crítico.']},
  {h: '3. Responder', ul: ['Contener: aislar el equipo o la cuenta afectada.', 'Erradicar y recuperar: eliminar la causa y restaurar desde copias.', 'Comunicar según PLN-01 y, si hay datos personales, valorar la notificación a la AEPD en 72 horas.']},
  {h: '4. Evidencias', p: ['Se conservan registros y copias forenses sin alterarlas, con cadena de custodia.']},
  {h: '5. Aprender', p: ['Tras cada incidente alto o crítico se hace una reunión de lecciones aprendidas y se actualizan riesgos y controles.']}
 ],
 build: [
  {sec: 0, ex: {k: 'order', q: 'Ordena las fases de la gestión de un incidente.', items: ['Notificar', 'Evaluar', 'Responder', 'Aprender']}},
  {sec: 2, ex: {k: 'choice', q: 'Una brecha con datos personales se notifica a la AEPD, si procede, en…', opts: ['72 horas', '30 días', '6 meses'], a: 0}},
  {sec: 4, ex: {k: 'match', q: 'Une cada fase con su control del Anexo A.', pairs: [['Preparación', '5.24'], ['Evaluar y decidir', '5.25'], ['Responder', '5.26'], ['Aprender', '5.27']]}}
 ]}),

D({id: 'pdoc', code: 'PRO-02', t: 'Procedimiento de gestión documental', lvl: 'PRO', icon: 'file-text', cl: ['7.5'], ctl: ['5.37'], owner: 'Responsable de Seguridad', appr: 'Comité de Seguridad',
 why: 'Cómo se crean, aprueban, publican y controlan los documentos del SGSI (7.5).',
 body: [
  {h: '1. Identificación', p: ['Cada documento lleva código (POL, DOC, NOR, PRO, REG), título, versión, fecha, propietario, quién lo aprueba y clasificación.']},
  {h: '2. Aprobación', table: {head: ['Nivel', 'Aprueba'], rows: [['Política', 'Gerencia'], ['Normativas y documentos del sistema', 'Comité de Seguridad'], ['Procedimientos', 'Responsable de Seguridad'], ['Registros', 'Según el proceso']]}},
  {h: '3. Publicación y acceso', ul: ['La versión vigente está en el repositorio documental con permisos de lectura según la necesidad.', 'Solo el propietario y el RSEG pueden modificar.']},
  {h: '4. Cambios y conservación', ul: ['Cada cambio sube la versión y queda en el historial.', 'Las versiones obsoletas se marcan y se retiran del uso.', 'Los registros se conservan al menos 3 años.']},
  {h: '5. Documentos externos', p: ['Normas, contratos y guías necesarios se identifican en un listado y se controla su versión.']}
 ],
 build: [
  {sec: 0, ex: {k: 'classify', q: '¿Qué pide 7.5.2 a) para identificar un documento?', buckets: [{t: 'Sí', c: '#5e5ce6'}, {t: 'No', c: '#8e8e93'}], items: [['Título', 0], ['Fecha', 0], ['Autor o código', 0], ['El color de la portada', 1]], ref: ['une', 13]}},
  {sec: 3, ex: {k: 'choice', q: 'Conviven dos versiones del mismo procedimiento. ¿Qué falla?', opts: ['El control de cambios (7.5.3 e)', 'La competencia (7.2)', 'El contexto (4.1)'], a: 0, ref: ['une', 14]}},
  {sec: 4, ex: {k: 'tf', q: 'Los contratos con proveedores que necesita el SGSI son documentos externos que también se controlan.', a: true, ref: ['une', 14]}}
 ]}),

D({id: 'nuso', code: 'NOR-03', t: 'Normativa de uso aceptable y teletrabajo', lvl: 'NOR', icon: 'users', cl: [], ctl: ['5.10', '6.7', '7.7', '8.1', '6.8'], owner: 'Responsable de Seguridad', appr: 'Comité de Seguridad',
 why: 'Reglas del día a día para toda la plantilla, también en casa (tratan R-04 y R-08).',
 body: [
  {h: '1. Uso de los equipos', ul: ['Los equipos son para trabajar; el uso personal ocasional no debe poner en riesgo la información.', 'No se instala software sin autorización del RSIS.']},
  {h: '2. Puesto despejado y pantalla bloqueada', p: ['Al levantarse, se bloquea la pantalla. No se dejan papeles con datos personales a la vista.']},
  {h: '3. Teletrabajo', ul: ['Solo desde el portátil corporativo, cifrado y con VPN.', 'No trabajar con datos de pacientes en lugares públicos.']},
  {h: '4. Correo y envíos', ul: ['Comprobar el destinatario antes de enviar datos personales.', 'Los datos de salud se envían solo por el canal cifrado de la app.']},
  {h: '5. Avisar', p: ['Cualquier pérdida de equipo o sospecha se comunica al momento (PRO-01).']}
 ],
 build: [
  {sec: 1, ex: {k: 'tf', q: 'Bloquear la pantalla al levantarse es parte del control 7.7.', a: true}},
  {sec: 2, ex: {k: 'choice', q: '¿Qué riesgo trata sobre todo la regla de teletrabajo?', opts: ['R-08 pérdida o robo de portátil', 'R-06 ola de calor', 'R-03 caída de la sede electrónica'], a: 0}},
  {sec: 3, ex: {k: 'choice', q: 'Comprobar el destinatario antes de enviar trata el riesgo…', opts: ['R-04 envío a destinatario equivocado', 'R-07 vulnerabilidades del código', 'R-05 fallo del hosting'], a: 0}}
 ]})
];

C.plan = C.plan || [];
C.plan.unshift(['file-check', 'Los 14 documentos de su SGSI', 'Política, alcance, roles, riesgos, SoA, plan de tratamiento, objetivos, normativas y procedimientos. Constrúyelos paso a paso.']);
})();
