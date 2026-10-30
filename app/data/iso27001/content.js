/* ISO/IEC 27001:2022 — contenido de estudio (bloques 0 y 1).
   Contenido PROPIO (redacción, ejercicios, explicaciones y caso Albatrel).
   - Las citas (refs) indican la fuente de cada idea: curso, norma o web. No se copia su texto.
   - Lo que sale del texto de la norma va con added:true; lo de internet, con web:{src,url}.
   - Los enlaces a los ficheros del curso solo existen con el pack privado (data/private, fuera de Git).
   Formato de una diapositiva de lección:
     {t, k, body:[texto | {ul:[[marca, texto]]} | {dia:'pdca'|'cia'|'dciat'|'flow', items}], plain, case, exam, web, added, refs}
   Una comprobación dentro de la lección es un ejercicio con check:true. */
(function () {
const T = ATLAS.track('iso27001');

T.docs = {
  s1:    {s: 'Sesión 1', t: 'Sesión 1 · GRC, ISO 27001:2022 y ENS'},
  uc01:  {s: 'UC01', t: 'UC01 · Importancia de la ISO 27001 en el SGSI'},
  ucimp: {s: 'UC Implantación', t: 'UC · Implantación de la ISO 27001'},
  ucnec: {s: 'UC Liderazgo', t: 'UC · Necesidades, expectativas y liderazgo'},
  une:   {s: 'ISO/IEC 27001', t: 'ISO/IEC 27001:2022 (UNE-ISO/IEC 27001:2023)', nopage: true},
  pol:   {s: 'Ejemplo POL del curso', t: 'POL-SI-01 · Ejemplo de política del curso'}
};

/* Caso práctico PROPIO de esta app (inventado). No es el caso del curso. */
T.caso = {
  name: 'Albatrel Servicios Digitales, S.L.',
  short: 'Albatrel',
  facts: [
    ['building-2', 'Albatrel Servicios Digitales, S.L.: empresa privada de servicios TI con sede única en Zaragoza y una pequeña sala técnica.'],
    ['users', '60 personas. Teletrabajo dos días a la semana. Equipo técnico joven y sin costumbre de documentar.'],
    ['landmark', 'Da servicio a una Diputación provincial y 14 ayuntamientos: padrón municipal, gestión de tributos y sede electrónica.'],
    ['heart', 'Y a 40 clínicas dentales privadas: agenda de citas e historia clínica en la nube (datos de salud).'],
    ['shield', 'No tiene SGSI. La Diputación le exige la certificación ENS de categoría MEDIA para renovar el contrato, y las clínicas le piden garantías: quiere también la ISO 27001.']
  ],
  kpis: [['60', 'personas'], ['15', 'entidades públicas'], ['65 %', 'facturación pública'], ['MEDIA', 'categoría ENS']],
  plan: [
    ['compass', 'Bloques 0 y 1 · Contexto, partes interesadas, alcance, política y roles', 'Ya los tienes en las unidades 5 a 8.'],
    ['scale', 'Bloque 2 · Análisis de riesgos, SoA y plan de tratamiento', 'Riesgos del padrón, la sede electrónica y las historias clínicas.'],
    ['file-text', 'Bloque 3 · Competencia, concienciación, comunicación y documentación', 'Su plan de formación y su cuerpo normativo.'],
    ['refresh-cw', 'Bloques 4 a 6 · Operación, métricas, auditoría interna y mejora', 'Sus indicadores, su programa de auditoría, el acta de revisión y la NC de las copias (PRO-03).'],
    ['shield', 'Bloques 7 a 9 · Controles del Anexo A aplicados a Albatrel', 'Próximamente.']
  ],
  pyramid: [
    ['Política (POL)', 'Principios y compromisos. La aprueba la Gerencia.'],
    ['Normativas (NOR)', 'Obligaciones y prohibiciones por ámbito. Las aprueba el Comité de Seguridad.'],
    ['Procedimientos (PRO) e instrucciones técnicas (IT)', 'Cómo se hace cada tarea. Los aprueba el Responsable de Seguridad.'],
    ['Registros (REG)', 'La evidencia de que se hizo.']
  ]
};


/* Biblioteca pública: solo recursos abiertos. El material del curso se añade desde el pack privado. */
T.library = [
  {g: 'Recursos oficiales y gratuitos', items: [
    {url: 'https://www.iso.org/standard/27001', t: 'ISO.org · ISO/IEC 27001:2022', note: 'Ficha oficial de la norma.'},
    {url: 'https://certiprof.com/es/pages/certified-iso-iec-27001-2022-foundation-i27001f-spanish', t: 'CertiProf · ISO/IEC 27001 Foundation (I27001F)', note: 'Página oficial del examen.'},
    {url: 'https://www.incibe.es/empresas/que-te-interesa/sistema-gestion-seguridad-informacion', t: 'INCIBE · Qué es un SGSI', note: 'Explicación gratuita para empresas.'},
    {url: 'https://administracionelectronica.gob.es/pae_Home/pae_Documentacion/pae_Metodolog/pae_Magerit.html', t: 'PAe · MAGERIT v3 (Libros I, II y III)', note: 'Metodología oficial de análisis de riesgos, de descarga gratuita.'},
    {url: 'https://www.ccn-cert.cni.es/es/guias.html', t: 'CCN-CERT · Guías CCN-STIC', note: 'Guías públicas del CCN (ENS, 825…).'},
    {url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2022-7191', t: 'BOE · Real Decreto 311/2022 (ENS)', note: 'Texto consolidado del Esquema Nacional de Seguridad.'}
  ]}
];

T.modules = [
  {id: 'm0', n: '0', t: 'Fundamentos', s: 'GRC, normas, SGSI, PDCA y el vocabulario básico', units: ['u0', 'u1', 'u2', 'u3', 'u4']},
  {id: 'm1', n: '1', t: 'Cláusulas 4 y 5', s: 'Contexto, partes interesadas, alcance, liderazgo, política y roles', units: ['u5', 'u6', 'u7', 'u8']},
  {id: 'm2', n: '2', t: 'Cláusula 6', s: 'Riesgos con MAGERIT, Declaración de Aplicabilidad y plan de tratamiento', soon: true},
  {id: 'm3', n: '3', t: 'Cláusula 7', s: 'Recursos, competencia, concienciación, comunicación y documentación', soon: true},
  {id: 'm4', n: '4', t: 'Cláusula 8', s: 'Operación', soon: true},
  {id: 'm5', n: '5', t: 'Cláusula 9', s: 'Métricas, auditoría interna y revisión por la dirección', soon: true},
  {id: 'm6', n: '6', t: 'Cláusula 10', s: 'No conformidades, acciones correctivas y mejora', soon: true},
  {id: 'm7', n: '7', t: 'Anexo A · 5', s: 'Controles organizacionales', soon: true},
  {id: 'm8', n: '8', t: 'Anexo A · 6 y 7', s: 'Controles de personas y físicos', soon: true},
  {id: 'm9', n: '9', t: 'Anexo A · 8', s: 'Controles tecnológicos', soon: true},
  {id: 'm10', n: '10', t: 'Auditoría y certificación', s: 'ISO 19011, fases de la certificación y no conformidades', soon: true}
];

T.units = {};
const U = (u) => { T.units[u.id] = u; };

/* ═════════════ Unidad 0 ═════════════ */
U({id: 'u0', n: 0, t: 'Empieza aquí', icon: 'compass', mins: 6,
 s: 'Qué vas a aprender, cómo funciona esta app y qué examen te espera.',
 lesson: [
  {k: 'Bienvenida', t: 'Partes de cero. Perfecto.', body: [
    'Esta app está pensada para alguien que **no sabe nada** de GRC ni de la ISO 27001. Cada idea va en una tarjeta corta, con un ejemplo y, a menudo, una explicación «en cristiano».',
    'Vas a seguir siempre el mismo ritmo en cada unidad:',
    {ul: [['1', '<b>Lección</b>: tarjetas cortas con preguntas rápidas entre medias.'], ['2', '<b>Prácticas</b>: ejercicios variados. Bandera azul con un 70 %, dorada con un 100 %.'], ['3', '<b>Jefe</b>: examen de la unidad con 3 vidas y 30 segundos por pregunta.']]}],
   plain: 'Primero entiendes, luego practicas y al final te pones a prueba. Lo que falles volverá a salir en el repaso días después.'},
  {k: 'El objetivo', t: 'Qué es la ISO 27001 en una frase', body: [
    'La ISO/IEC 27001 es una norma internacional que dice **qué tiene que hacer una organización para gestionar la seguridad de su información** de forma ordenada, basada en riesgos y mejorando siempre.',
    'Ese «sistema ordenado» se llama **SGSI** (Sistema de Gestión de la Seguridad de la Información). Una empresa puede pedir a un auditor externo que compruebe que su SGSI cumple la norma y, si cumple, obtiene un **certificado**.'],
   plain: 'La 27001 no te dice qué antivirus comprar. Te dice cómo organizarte para decidir, con cabeza, qué proteger y cómo.',
   refs: [['uc01', 6], ['s1', 9]]},
  {k: 'Tu meta', t: 'El examen de CertiProf', web: {src: 'CertiProf', url: 'https://certiprof.com/es/pages/certified-iso-iec-27001-2022-foundation-i27001f-spanish'}, body: [
    'La certificación **ISO/IEC 27001 Foundation (I27001F)** de CertiProf valida que conoces los principios, conceptos y requisitos de la ISO 27001:2022.',
    {ul: [['40', 'preguntas de opción múltiple'], ['60', 'minutos como máximo'], ['ES', 'disponible en español, en línea']]},
    'En esta app tienes un **simulacro** con ese formato. Úsalo cuando termines los primeros bloques.'],
   exam: 'Datos públicos del temario de CertiProf. Antes de pagar el examen, confirma en su web la nota de aprobado y las condiciones vigentes.'},
  {k: 'El mapa', t: 'La norma tiene dos partes', body: [
    {ul: [['4-10', '<b>Cláusulas obligatorias</b>: los requisitos del sistema de gestión (contexto, liderazgo, planificación, soporte, operación, evaluación y mejora). No se puede excluir ninguna.'], ['A', '<b>Anexo A</b>: una lista de 93 controles de seguridad. Se eligen según los riesgos y se justifica cuáles aplican.']]},
    'Los bloques de esta app siguen ese mismo orden: primero los fundamentos, luego las cláusulas 4 a 10 y después los controles.'],
   refs: [['une', 6], ['s1', 8]], added: true},
  {check: true, k: 'tf', q: 'La ISO 27001 te dice exactamente qué productos de seguridad tienes que comprar.', a: false, why: 'Te dice cómo gestionar la seguridad (basándote en riesgos), no qué productos comprar.'},
  {k: 'Consejo', t: 'Cómo estudiar sin agobiarte', body: [
    {ul: [['i:timer', 'Mejor 15 minutos al día que 3 horas un domingo. El anillo de «Aprender» se cierra con una lección.'], ['i:refresh-cw', 'Haz el <b>repaso</b> cuando te lo pida: es lo que fija la memoria.'], ['i:file-text', 'Cada tarjeta indica de dónde sale la idea (curso, norma o fuente web), para que puedas ampliarla.']]}],
   plain: 'No intentes memorizar los 93 controles el primer día. Primero entiende el «para qué»; los números llegan solos con la práctica.'}
 ],
 labs: [
  {id: 'u0l1', t: 'Primer contacto', items: [
    {k: 'choice', q: '¿Cómo se llama el sistema que la ISO 27001 pide implantar?', opts: ['SGSI', 'ENS', 'RGPD'], a: 0, why: 'Sistema de Gestión de la Seguridad de la Información.', ref: ['uc01', 6]},
    {k: 'tf', q: 'Una empresa puede excluir la cláusula 7 si no le conviene y seguir certificándose.', a: false, why: 'Las cláusulas 4 a 10 son obligatorias: no se acepta excluir ninguna.', ref: ['une', 6]},
    {k: 'match', q: 'Une cada parte de la norma con lo que contiene.', pairs: [['Cláusulas 4-10', 'Requisitos obligatorios del sistema de gestión'], ['Anexo A', 'Lista de 93 controles de referencia']], ref: ['s1', 8]},
    {k: 'choice', q: 'En esta app, ¿qué necesitas para ganar la bandera dorada de una práctica?', opts: ['Un 70 %', 'Un 100 %', 'Hacerla 3 veces'], a: 1, why: 'Azul con un 70 %, dorada con un 100 %.'}
  ]}
 ],
 boss: [
  {k: 'tf', q: 'El SGSI es un sistema de gestión, no un producto.', a: true, ref: ['uc01', 6]},
  {k: 'choice', q: '¿Cuántos controles tiene el Anexo A de la versión 2022?', opts: ['114', '93', '74'], a: 1, ref: ['s1', 8]},
  {k: 'tf', q: 'Los controles del Anexo A se eligen según los riesgos.', a: true, ref: ['une', 10]},
  {k: 'choice', q: '¿Qué valida un organismo de certificación externo?', opts: ['Que el SGSI cumple los requisitos de la norma', 'Que la empresa no tendrá incidentes', 'Que el antivirus está actualizado'], a: 0, ref: ['s1', 8]}
 ]
});

/* ═════════════ Unidad 1 ═════════════ */
U({id: 'u1', n: 1, t: 'GRC y por qué existen las normas', icon: 'shield-check', mins: 10,
 s: 'Qué significa GRC, de qué incidentes nacen las normas y en qué se diferencia una ley de una norma ISO.',
 lesson: [
  {k: 'Concepto', t: 'GRC son tres preguntas', body: [
    'GRC son las iniciales de **Gobierno, Riesgo y Cumplimiento** (en inglés, Governance, Risk, Compliance).',
    {ul: [['G', '<b>Gobierno</b>: ¿quién decide sobre la seguridad y cómo rinde cuentas? Roles, políticas, responsabilidades.'], ['R', '<b>Riesgo</b>: ¿qué puede salir mal, con qué probabilidad y con qué impacto?'], ['C', '<b>Cumplimiento</b>: ¿cumplimos las leyes, contratos y normas que nos aplican? Incluye las auditorías.']]}],
   plain: 'Gobierno es «quién manda y quién responde»; Riesgo, «qué nos puede pasar»; Cumplimiento, «demostrar que hacemos lo que debemos».',
   case: 'En Albatrel: Gobierno es decidir quién se encarga de la seguridad; Riesgo, pensar qué puede fallar en el padrón o en las historias clínicas; Cumplimiento, demostrar a la Diputación que cumple el ENS.',
   refs: [['s1', 4]]},
  {check: true, k: 'choice', q: 'Definir roles, políticas y responsabilidades pertenece sobre todo a…', opts: ['Gobierno', 'Riesgo', 'Cumplimiento'], a: 0, why: 'Gobierno es la estructura: roles, políticas y responsabilidades.', ref: ['s1', 4]},
  {k: 'Historia', t: 'Las normas nacen de incidentes reales', body: [
    'El profesor lo resume así: «las normas se escriben con las cicatrices del sector».',
    {ul: [['SEPE', '<b>2021</b> · Ransomware que paralizó las prestaciones por desempleo. Entrada por phishing, software desactualizado y red sin segmentar.'], ['Clínic', '<b>2023</b> · Hospital Clínic de Barcelona: sistemas cifrados, datos de pacientes publicados y 150 operaciones canceladas. Sin BIA ni plan de continuidad operativo.'], ['CP', '<b>2021</b> · Colonial Pipeline: una cuenta VPN inactiva, contraseña reutilizada y sin MFA. Costa Este de EE. UU. sin combustible 6 días; rescate de 4,4 M$.']]}],
   plain: 'Cuando conoces la historia detrás de un control, deja de ser un requisito y pasa a ser una herramienta con sentido.',
   refs: [['s1', 5]]},
  {k: 'Clasificar', t: 'Ley, norma, marco y guía no son lo mismo', body: [
    {ul: [['BOE', '<b>Ley o reglamento</b>: obligatoria, con sanciones. RD 311/2022 (ENS), RGPD, Ley 40/2015.'], ['UE', '<b>Directiva europea</b>: obligatoria cuando el país la incorpora. NIS2, DORA.'], ['ISO', '<b>Norma ISO/IEC</b>: voluntaria, salvo que un contrato la exija. ISO 27001, 27002, 27005.'], ['Guía', '<b>Marco o guía</b>: referencia voluntaria. NIST CSF 2.0, CIS Controls, CCN-STIC 825, MAGERIT.']]}],
   plain: 'Regla rápida del curso: si tiene número de BOE, es obligatorio; si tiene número ISO, es voluntario; si es un framework o una guía, es una referencia.',
   refs: [['s1', 7]]},
  {check: true, k: 'tf', q: 'La ISO 27001 es obligatoria por ley para todas las empresas españolas.', a: false, why: 'Es voluntaria, salvo que un contrato la exija.', ref: ['s1', 7]},
  {k: 'Comparar', t: 'ISO 27001 y ENS: complementarios', body: [
    {ul: [['ISO', '<b>ISO 27001:2022</b>: internacional y voluntaria, para cualquier organización. 93 controles. Certificado de una entidad acreditada por ENAC, con auditoría de seguimiento anual y recertificación cada 3 años.'], ['ENS', '<b>ENS (RD 311/2022)</b>: obligatorio en España para el sector público y sus proveedores. 74 medidas en el Anexo II (según el material del curso) y categorías BÁSICA, MEDIA y ALTA.']]},
    'Cumplir uno ayuda mucho a cumplir el otro. Para una empresa como Albatrel, lo eficiente es implantarlos en paralelo.'],
   case: 'Albatrel trabaja para una Diputación y 14 ayuntamientos: por eso le exigen el ENS. La ISO 27001 la quiere para dar confianza a sus clínicas privadas.',
   refs: [['s1', 8], ['s1', 13]]}
 ],
 labs: [
  {id: 'u1l1', t: 'Las tres letras de GRC', items: [
    {k: 'match', q: 'Une cada letra con la pregunta que responde.', pairs: [['Gobierno', '¿Quién decide y cómo rinde cuentas?'], ['Riesgo', '¿Qué puede salir mal, con qué probabilidad e impacto?'], ['Cumplimiento', '¿Cumplimos las normas y regulaciones aplicables?']], ref: ['s1', 4]},
    {k: 'tf', q: 'Las auditorías internas y externas forman parte del «Cumplimiento».', a: true, why: 'Cumplimiento incluye obligaciones legales, contractuales y auditorías.', ref: ['s1', 4]},
    {k: 'classify', q: 'Clasifica cada tarea en su letra de GRC.', buckets: [{t: 'Gobierno', c: '#5e5ce6'}, {t: 'Riesgo', c: '#ff9f0a'}, {t: 'Cumplimiento', c: '#34c759'}], items: [['Nombrar un Responsable de Seguridad', 0], ['Aprobar la política de seguridad', 0], ['Estimar la probabilidad de un ransomware', 1], ['Decidir qué hacer con un riesgo alto', 1], ['Preparar la auditoría de certificación', 2], ['Revisar qué exige el RGPD', 2]], ref: ['s1', 4]}
  ]},
  {id: 'u1l2', t: 'Incidentes que cambiaron las normas', items: [
    {k: 'match', q: 'Une cada incidente con su causa principal.', pairs: [['SEPE (2021)', 'Phishing y software desactualizado'], ['Hospital Clínic (2023)', 'Sin BIA ni plan de continuidad operativo'], ['Colonial Pipeline (2021)', 'VPN inactiva, contraseña reutilizada y sin MFA']], ref: ['s1', 5]},
    {k: 'choice', scenario: 'Una cuenta de VPN de un exempleado sigue activa. Su contraseña aparece en una filtración y alguien entra en la red.', q: '¿A qué incidente del curso se parece?', opts: ['Colonial Pipeline', 'SEPE', 'Hospital Clínic'], a: 0, why: 'Colonial Pipeline: VPN inactiva, contraseña reutilizada y sin MFA.', ref: ['s1', 5]},
    {k: 'tf', q: 'El Hospital Clínic no estaba obligado a cumplir el ENS.', a: false, why: 'La diapositiva indica que era una entidad obligada a cumplir el ENS.', ref: ['s1', 5]}
  ]},
  {id: 'u1l3', t: 'Ley, norma o guía', items: [
    {k: 'classify', q: 'Clasifica cada documento.', buckets: [{t: 'Obligatorio', c: '#ff3b30'}, {t: 'Voluntario (norma)', c: '#5e5ce6'}, {t: 'Referencia (guía)', c: '#8e8e93'}], items: [['RD 311/2022 (ENS)', 0], ['RGPD', 0], ['ISO 27001', 1], ['ISO 27005', 1], ['NIST CSF 2.0', 2], ['MAGERIT', 2]], ref: ['s1', 7]},
    {k: 'choice', q: 'Según la regla del curso, si un documento tiene número de BOE es…', opts: ['Voluntario', 'Obligatorio', 'Solo una referencia'], a: 1, why: 'BOE: obligatorio. ISO: voluntario. Framework o guía: referencia.', ref: ['s1', 7]},
    {k: 'choice', q: '¿Cada cuánto se recertifica la ISO 27001?', opts: ['Cada año', 'Cada 3 años, con seguimiento anual', 'Nunca, es para siempre'], a: 1, ref: ['s1', 8]},
    {k: 'tf', q: 'Según el curso, para una empresa que necesita ENS e ISO 27001 lo más eficiente es implantarlos en paralelo.', a: true, why: 'Cumplir uno facilita mucho el otro.', ref: ['s1', 14]}
  ]}
 ],
 boss: [
  {k: 'choice', q: '¿Qué significa la «C» de GRC?', opts: ['Confidencialidad', 'Cumplimiento', 'Control'], a: 1, ref: ['s1', 4]},
  {k: 'tf', q: 'NIS2 es una directiva europea.', a: true, ref: ['s1', 7]},
  {k: 'choice', q: '¿Quién certifica la ISO 27001 de una organización en España?', opts: ['Una entidad de certificación acreditada por ENAC', 'El BOE', 'El propio responsable de sistemas'], a: 0, ref: ['s1', 8]},
  {k: 'tf', q: 'El ENS clasifica los sistemas en categorías BÁSICA, MEDIA y ALTA.', a: true, ref: ['s1', 8]},
  {k: 'choice', q: '¿Por qué a Albatrel le exigen el ENS?', opts: ['Porque tiene 60 empleados', 'Porque presta servicios a la Administración pública', 'Porque está en Zaragoza'], a: 1, ref: ['s1', 8]},
  {k: 'choice', q: '¿Qué faltó en Colonial Pipeline?', opts: ['Copias de seguridad', 'Autenticación multifactor (MFA)', 'Un antivirus'], a: 1, ref: ['s1', 5]},
  {k: 'tf', q: 'Una guía como la CCN-STIC 825 tiene consecuencias legales directas si no se sigue.', a: false, ref: ['s1', 7]},
  {k: 'tf', q: 'La ISO 27001 se puede aplicar a una organización de cualquier tamaño y sector.', a: true, ref: ['une', 6]}
 ]
});

/* ═════════════ Unidad 2 ═════════════ */
U({id: 'u2', n: 2, t: 'La familia ISO 27000 y quién es quién', icon: 'library', mins: 9,
 s: 'La 27001 no está sola: tiene hermanas. Y hay organismos que oirás en cada clase.',
 lesson: [
  {k: 'Familia', t: 'Cada norma tiene su papel', body: [
    {ul: [['27000', '<b>Vocabulario</b>: las definiciones oficiales.'], ['27001', '<b>Requisitos del SGSI</b>: la única que se certifica.'], ['27002', '<b>Guía de los 93 controles</b>: cómo implantarlos.'], ['27005', '<b>Gestión del riesgo</b>.'], ['27701', '<b>Privacidad</b>: extensión de la 27001 para el RGPD.']]}],
   plain: 'La 27001 dice «qué» hay que cumplir; la 27002 explica «cómo» aplicar cada control. Te certificas solo en la 27001.',
   refs: [['s1', 9]]},
  {check: true, k: 'choice', q: '¿Cuál de estas normas se certifica?', opts: ['ISO 27002', 'ISO 27001', 'ISO 27000'], a: 1, why: 'La 27001 contiene los requisitos y es la certificable.', ref: ['s1', 9]},
  {k: 'Organismos', t: 'Quién es quién', body: [
    {ul: [['CCN', '<b>Centro Criptológico Nacional</b>: autoridad técnica del ENS. Publica las guías CCN-STIC y la herramienta PILAR.'], ['INCIBE', '<b>Instituto Nacional de Ciberseguridad</b>: sector privado y ciudadanía, con materiales gratuitos.'], ['ENAC', '<b>Entidad Nacional de Acreditación</b>: acredita a quienes certifican la ISO 27001 en España.'], ['ENISA', '<b>Agencia de ciberseguridad de la UE</b>.'], ['ISO', 'Emite las normas. En España llegan a través de <b>UNE</b> (antes AENOR).']]}],
   refs: [['s1', 9], ['uc01', 6]]},
  {k: 'El puente', t: 'CCN-STIC 825: de la ISO al ENS', body: [
    'Es una guía del CCN que relaciona cada control del Anexo A de la ISO 27001:2022 con su medida equivalente del ENS, en los dos sentidos.',
    {ul: [['=', '<b>Total</b>: una implantación vale para los dos.'], ['≈', '<b>Parcial</b>: hay que completar con el otro marco.'], ['≠', '<b>Sin equivalencia</b>: hay que implantarlo aparte.']]}],
   case: 'Cuando hagas la Declaración de Aplicabilidad de Albatrel, cada fila citará el control del Anexo A y la medida del ENS.',
   refs: [['s1', 10]]},
  {k: 'Novedades 2022', t: 'Qué cambió respecto a la 2013', web: {src: 'ISO.org', url: 'https://www.iso.org/standard/27001'}, body: [
    'La versión 2013 tenía 114 controles en 14 dominios. La 2022 los reorganiza en **93 controles y 4 temas**: 37 organizacionales, 8 de personas, 14 físicos y 34 tecnológicos. **11 controles son nuevos**, como inteligencia de amenazas (5.7), servicios en la nube (5.23) o codificación segura (8.28).',
    'Los certificados de la versión 2013 caducaron el 31 de octubre de 2025: hoy todo se certifica con la 2022.'],
   exam: 'Pregunta típica: «¿cuántos controles y temas tiene el Anexo A de 2022?» → 93 controles en 4 temas.'},
  {check: true, k: 'choice', q: 'Si un control ISO no tiene medida ENS equivalente, la equivalencia es…', opts: ['Total', 'Parcial', 'Sin equivalencia'], a: 2, ref: ['s1', 10]}
 ],
 labs: [
  {id: 'u2l1', t: 'Cada norma, su papel', items: [
    {k: 'match', q: 'Une cada norma con lo que trata.', pairs: [['ISO 27000', 'Vocabulario y definiciones'], ['ISO 27001', 'Requisitos del SGSI (certificable)'], ['ISO 27002', 'Guía de los 93 controles'], ['ISO 27005', 'Gestión del riesgo'], ['ISO 27701', 'Privacidad (RGPD)']], ref: ['s1', 9]},
    {k: 'choice', q: 'Quieres saber cómo implantar en la práctica el control 8.13 (copias de seguridad). ¿Qué norma consultas?', opts: ['ISO 27002', 'ISO 27000', 'ISO 27701'], a: 0, why: 'La 27002 es la guía de implantación de los controles.', ref: ['s1', 9]},
    {k: 'classify', q: '¿Qué controles son nuevos en 2022?', buckets: [{t: 'Nuevo en 2022', c: '#ff9f0a'}, {t: 'Ya existía', c: '#8e8e93'}], items: [['5.7 Inteligencia de amenazas', 0], ['5.23 Servicios en la nube', 0], ['8.28 Codificación segura', 0], ['8.13 Copias de seguridad', 1], ['5.3 Segregación de tareas', 1], ['7.1 Perímetros de seguridad física', 1]], ref: ['une', 18]}
  ]},
  {id: 'u2l2', t: 'Organismos', items: [
    {k: 'match', q: 'Une cada organismo con su función.', pairs: [['CCN', 'Autoridad técnica del ENS'], ['INCIBE', 'Sector privado y ciudadanía'], ['ENAC', 'Acredita a los certificadores'], ['ENISA', 'Agencia de ciberseguridad de la UE']], ref: ['s1', 9]},
    {k: 'choice', q: '¿Qué relaciona la guía CCN-STIC 825?', opts: ['Los controles de la ISO 27001 con las medidas del ENS', 'El RGPD con NIS2', 'MAGERIT con PILAR'], a: 0, ref: ['s1', 10]},
    {k: 'match', q: 'Une cada tipo de equivalencia con su significado.', pairs: [['Total', 'Una implantación vale para los dos'], ['Parcial', 'Hay que completar con el otro marco'], ['Sin equivalencia', 'Hay que implantarlo aparte']], ref: ['s1', 10]}
  ]}
 ],
 boss: [
  {k: 'choice', q: '¿Qué norma tiene las definiciones oficiales?', opts: ['ISO 27000', 'ISO 27005', 'ISO 27701'], a: 0, ref: ['s1', 9]},
  {k: 'choice', q: '¿Quién acredita a los certificadores de la ISO 27001 en España?', opts: ['CCN', 'ENAC', 'INCIBE'], a: 1, ref: ['s1', 9]},
  {k: 'tf', q: 'La ISO 27002 es una guía de los controles del Anexo A.', a: true, ref: ['s1', 9]},
  {k: 'tf', q: 'El CCN es la autoridad técnica del ENS.', a: true, ref: ['s1', 9]},
  {k: 'choice', q: '¿En cuántos temas se agrupan los controles de 2022?', opts: ['14', '4', '11'], a: 1, ref: ['une', 18]},
  {k: 'choice', q: '¿Qué norma de la familia trata la privacidad?', opts: ['ISO 27701', 'ISO 27002', 'ISO 27005'], a: 0, ref: ['s1', 9]},
  {k: 'tf', q: 'Una empresa se puede certificar en la ISO 27002.', a: false, ref: ['s1', 9]}
 ]
});

/* ═════════════ Unidad 3 ═════════════ */
U({id: 'u3', n: 3, t: 'El SGSI y el ciclo PDCA', icon: 'refresh-cw', mins: 11,
 s: 'El corazón de la norma: qué es un SGSI, cómo se organiza en procesos y cómo mejora con el PDCA.',
 lesson: [
  {k: 'Concepto', t: 'Qué es un SGSI', body: [
    'SGSI significa **Sistema de Gestión de la Seguridad de la Información**.',
    'Es la parte del sistema de gestión de la empresa que, **basándose en el riesgo**, sirve para establecer, implantar, revisar, mantener y mejorar la seguridad de la información.',
    'Su finalidad última es la **mejora continua**, midiendo si se cumplen los objetivos.'],
   plain: 'Un SGSI no es un programa ni un papel: es una forma de trabajar. Como un gimnasio: no basta con apuntarse, hay que ir, medir y ajustar.',
   case: 'Albatrel todavía no tiene SGSI: es justo lo que vas a construir con ella.',
   refs: [['uc01', 6], ['ucimp', 11]]},
  {k: 'Procesos', t: 'Todo es un proceso', body: [
    'Un **proceso** transforma unas entradas en salidas que aportan valor. Las salidas de unos procesos son las entradas de otros.',
    {dia: 'flow', items: ['Entradas', 'Actividades', 'Salidas', 'Siguiente proceso']},
    'Cada actividad necesita **límites claros, un indicador medible y un responsable**.'],
   refs: [['ucimp', 3], ['ucimp', 5]]},
  {k: 'El ciclo', t: 'PDCA: planificar, hacer, verificar, actuar', body: [
    {dia: 'pdca'},
    'En español también se dice **PHVA**. Es un ciclo que no termina: después de actuar, se vuelve a planificar.'],
   plain: 'Como una receta que mejoras cada vez: decides (P), cocinas (D), pruebas (C) y ajustas la receta para la próxima (A).',
   refs: [['uc01', 6], ['ucimp', 6]]},
  {check: true, k: 'order', q: 'Ordena las fases del ciclo PDCA.', items: ['Planificar', 'Hacer', 'Verificar', 'Actuar'], ref: ['ucimp', 6]},
  {k: 'Encaja', t: 'PDCA y las cláusulas de la norma', body: [
    {ul: [['P', '<b>Planificar</b>: 4 Contexto, 5 Liderazgo y 6 Planificación.'], ['D', '<b>Hacer</b>: 7 Soporte y 8 Operación.'], ['C', '<b>Verificar</b>: 9 Evaluación del desempeño.'], ['A', '<b>Actuar</b>: 10 Mejora.']]}],
   plain: 'Por eso los bloques de la app siguen las cláusulas 4 a 10: recorres el ciclo entero.',
   refs: [['ucimp', 7]]},
  {k: 'Claves', t: 'Si no está documentado, no existe', body: [
    'La documentación del SGSI incluye la **política, el alcance y los objetivos**, los procedimientos y controles, y los **registros** que pide la norma. Su tamaño depende de cada organización.',
    'Factores de éxito que destaca el curso: **participación activa de la alta dirección**, formación del personal y mejora continua.',
    'La 27001 es compatible con otros sistemas (ISO 9001, 22301, 20000-1) porque comparten la misma estructura de alto nivel.'],
   exam: '«Si no está documentado, no existe»: la evidencia es el idioma de la auditoría.',
   refs: [['uc01', 7], ['ucimp', 16], ['s1', 14], ['une', 5]]},
  {check: true, k: 'choice', q: 'Evaluar, auditar y medir el desempeño pertenece a la fase…', opts: ['Planificar', 'Verificar', 'Actuar'], a: 1, ref: ['ucimp', 7]}
 ],
 labs: [
  {id: 'u3l1', t: 'Ordena el ciclo', items: [
    {k: 'match', q: 'Une cada fase con lo que se hace en ella.', pairs: [['Planificar', 'Fijar política, objetivos y procesos'], ['Hacer', 'Implantar y operar los controles'], ['Verificar', 'Evaluar, auditar y medir'], ['Actuar', 'Acciones correctivas para mejorar']], ref: ['ucimp', 7]},
    {k: 'choice', q: 'En la fase «Hacer» de un SGSI se…', opts: ['Mantiene y mejora el SGSI', 'Implanta y ejecuta el SGSI', 'Hace el seguimiento y la revisión'], a: 1, why: 'Pregunta del test final de UC01.', ref: ['uc01', 12]},
    {k: 'classify', q: 'Coloca cada cláusula en su fase del PDCA.', buckets: [{t: 'P', c: '#5e5ce6'}, {t: 'D', c: '#30b0c7'}, {t: 'C', c: '#ff9f0a'}, {t: 'A', c: '#34c759'}], items: [['4 Contexto', 0], ['5 Liderazgo', 0], ['6 Planificación', 0], ['7 Soporte', 1], ['8 Operación', 1], ['9 Evaluación', 2], ['10 Mejora', 3]], ref: ['ucimp', 7]}
  ]},
  {id: 'u3l2', t: 'Procesos y documentación', items: [
    {k: 'tf', q: 'En una empresa los procesos son independientes y no se relacionan.', a: false, why: 'Las salidas de unos son las entradas de otros.', ref: ['ucimp', 3]},
    {k: 'choice', q: '¿Qué NO necesita cada actividad de un proceso?', opts: ['Un responsable', 'Un indicador medible', 'Que nadie la revise'], a: 2, ref: ['ucimp', 5]},
    {k: 'tf', q: 'Todas las organizaciones deben tener la misma cantidad de documentación.', a: false, why: 'Depende del tamaño, la actividad y la complejidad.', ref: ['uc01', 7]},
    {k: 'choice', q: '¿Qué factor de éxito destaca el curso en primer lugar?', opts: ['Comprar un buen antivirus', 'La participación activa de la alta dirección', 'Contratar un auditor externo'], a: 1, ref: ['ucimp', 16]}
  ]}
 ],
 boss: [
  {k: 'choice', q: '¿Qué significa SGSI?', opts: ['Sistema de Gestión de la Seguridad de la Información', 'Servicio General de Seguridad Informática', 'Sistema Global de Seguridad Interna'], a: 0, ref: ['uc01', 6]},
  {k: 'choice', q: 'El capítulo «Soporte» corresponde a…', opts: ['Hacer', 'Actuar', 'Verificar'], a: 0, ref: ['ucimp', 7]},
  {k: 'tf', q: 'El PDCA es un sistema de mejora continua.', a: true, ref: ['ucimp', 6]},
  {k: 'choice', q: 'Las acciones correctivas tras una auditoría pertenecen a…', opts: ['Planificar', 'Actuar', 'Hacer'], a: 1, ref: ['ucimp', 7]},
  {k: 'tf', q: 'La ISO 27001 es compatible con otros sistemas de gestión como la ISO 9001.', a: true, ref: ['ucimp', 9]},
  {k: 'tf', q: 'Albatrel ya tiene un SGSI implantado.', a: false},
  {k: 'choice', q: '¿Qué frase resume la importancia de la documentación?', opts: ['«Si no está documentado, no existe»', '«Menos papeles, más seguridad»', '«La documentación es opcional»'], a: 0, ref: ['s1', 14]}
 ]
});

/* ═════════════ Unidad 4 ═════════════ */
U({id: 'u4', n: 4, t: 'Vocabulario básico de seguridad', icon: 'book-a', mins: 12,
 s: 'Las palabras de todas las sesiones: CIA, activo, amenaza, riesgo, control, incidente…',
 lesson: [
  {k: 'Lo que se protege', t: 'Confidencialidad, Integridad, Disponibilidad', body: [
    {dia: 'cia'},
    {ul: [['C', '<b>Confidencialidad</b>: no se revela a quien no está autorizado.'], ['I', '<b>Integridad</b>: es exacta y completa; nadie la ha manipulado indebidamente.'], ['D', '<b>Disponibilidad</b>: se puede usar cuando la necesitan los autorizados.']]}],
   case: 'En las historias clínicas que gestiona Albatrel: C es que nadie sin permiso las lea; I, que nadie cambie un diagnóstico; D, que el dentista las tenga cuando atiende al paciente.',
   refs: [['s1', 6], ['ucimp', 10]]},
  {check: true, k: 'choice', scenario: 'Un empleado cambia sin permiso un diagnóstico en una historia clínica.', q: '¿Qué dimensión falla?', opts: ['Disponibilidad', 'Integridad', 'Confidencialidad'], a: 1, ref: ['s1', 6]},
  {k: 'ENS', t: 'El ENS añade dos más: DCIAT', body: [
    {dia: 'dciat'},
    'A las tres anteriores el ENS suma **Autenticidad** (se puede verificar quién actúa) y **Trazabilidad** (se puede rastrear qué hizo cada uno).'],
   exam: 'Trampa típica: la ISO 27001 habla de 3 dimensiones (CIA); el ENS, de 5 (DCIAT).',
   refs: [['s1', 6]]},
  {k: 'La cadena', t: 'Activo, amenaza, riesgo, impacto, control', body: [
    {ul: [['A', '<b>Activo</b>: lo que la organización necesita para funcionar (datos, sistemas, personas, instalaciones).'], ['Am', '<b>Amenaza</b>: evento que puede causar un incidente y daños.'], ['R', '<b>Riesgo</b>: posibilidad de que una amenaza se materialice.'], ['Im', '<b>Impacto</b>: la consecuencia sobre el activo si ocurre.'], ['C', '<b>Control</b>: práctica, procedimiento o mecanismo que reduce el riesgo.']]}],
   plain: 'Tu casa (activo), un ladrón (amenaza), la posibilidad de que entre (riesgo), lo que perderías (impacto) y la cerradura (control).',
   case: 'Activo: la base de datos del padrón de Albatrel. Amenaza: un phishing como el del SEPE. Control: la MFA que faltó en Colonial Pipeline.',
   refs: [['uc01', 11]]},
  {check: true, k: 'match', q: 'Une cada término con su ejemplo de la casa.', pairs: [['Activo', 'Tu casa'], ['Amenaza', 'Un ladrón'], ['Control', 'La cerradura'], ['Impacto', 'Lo que perderías']]},
  {k: 'Distinguir', t: 'Evento no es lo mismo que incidente', body: [
    {ul: [['Ev', '<b>Evento de seguridad</b>: algo detectado que indica una posible violación de la política o un fallo de las salvaguardas.'], ['In', '<b>Incidente</b>: uno o varios eventos no deseados con probabilidad significativa de comprometer la actividad.']]}],
   plain: 'Un intento fallido de inicio de sesión es un evento. Que alguien entre y cifre los servidores es un incidente.',
   refs: [['ucimp', 10]]},
  {k: 'Riesgo', t: 'El lenguaje del riesgo', body: [
    {ul: [['1', '<b>Análisis</b>: identificar fuentes y estimar el riesgo.'], ['2', '<b>Evaluación</b>: comparar el riesgo con los criterios para ver si importa.'], ['3', '<b>Tratamiento</b>: elegir e implantar medidas para modificarlo.'], ['4', '<b>Aceptación</b>: decidir asumirlo.'], ['R', '<b>Riesgo residual</b>: el que queda después del tratamiento.'], ['SoA', '<b>Declaración de aplicabilidad</b>: documento con los controles aplicables y su justificación.']]}],
   refs: [['ucimp', 11]]},
  {k: 'Matiz', t: 'Seguridad informática ≠ seguridad de la información', body: [
    '**Informática**: protege hardware, software y comunicaciones.',
    '**De la información**: protege la información **en cualquier soporte**, también en papel o en una conversación. La ISO 27001 trata de esta, que es más amplia.'],
   refs: [['uc01', 11]]}
 ],
 labs: [
  {id: 'u4l1', t: 'CIA y DCIAT', items: [
    {k: 'match', q: 'Une cada dimensión con su definición.', pairs: [['Confidencialidad', 'No se revela a quien no está autorizado'], ['Integridad', 'No ha sido manipulada indebidamente'], ['Disponibilidad', 'Accesible cuando la necesitan los autorizados'], ['Autenticidad', 'La identidad de quien actúa es verificable'], ['Trazabilidad', 'Las acciones son rastreables']], ref: ['s1', 6]},
    {k: 'classify', q: '¿Qué dimensión se pierde en cada caso?', buckets: [{t: 'Confidencialidad', c: '#5e5ce6'}, {t: 'Integridad', c: '#ff9f0a'}, {t: 'Disponibilidad', c: '#34c759'}], items: [['Se publican datos de pacientes', 0], ['Un USB con historias clínicas se pierde en el metro', 0], ['Alguien modifica un expediente', 1], ['Un virus corrompe la base de datos', 1], ['La sede electrónica se cae', 2], ['Un ransomware cifra los servidores', 2]], ref: ['s1', 6]},
    {k: 'tf', q: 'La ISO 27001 trabaja con 5 dimensiones y el ENS con 3.', a: false, why: 'Al revés: CIA (3) en ISO, DCIAT (5) en el ENS.', ref: ['s1', 6]}
  ]},
  {id: 'u4l2', t: 'Activo, amenaza, riesgo', items: [
    {k: 'match', q: 'Une cada término con su definición.', pairs: [['Activo', 'Recurso necesario para funcionar'], ['Amenaza', 'Evento que puede causar un incidente'], ['Riesgo', 'Posibilidad de que una amenaza se materialice'], ['Impacto', 'Consecuencia sobre un activo'], ['Control', 'Mecanismo que reduce el riesgo']], ref: ['uc01', 11]},
    {k: 'choice', q: 'La posibilidad de que una amenaza se materialice se llama…', opts: ['Activo', 'Riesgo', 'Impacto'], a: 1, why: 'Pregunta del test final de UC01.', ref: ['uc01', 12]},
    {k: 'tf', q: 'Un evento de seguridad siempre es un incidente.', a: false, why: 'El incidente tiene probabilidad significativa de comprometer la actividad.', ref: ['ucimp', 10]},
    {k: 'choice', q: 'Un paciente de una clínica de Albatrel puede ver la historia clínica de otro paciente. ¿Qué propiedad se rompe?', opts: ['Confidencialidad', 'No repudio', 'Disponibilidad', 'Integridad'], a: 0, why: 'Confidencialidad: la información no se pone a disposición de quien no está autorizado.', ref: ['s1', 6]}
  ]},
  {id: 'u4l3', t: 'El lenguaje del riesgo', items: [
    {k: 'order', q: 'Ordena el proceso de gestión del riesgo.', items: ['Análisis del riesgo', 'Evaluación del riesgo', 'Tratamiento del riesgo', 'Riesgo residual'], ref: ['ucimp', 11]},
    {k: 'match', q: 'Une cada término con su definición.', pairs: [['Riesgo residual', 'El que queda tras el tratamiento'], ['Tratamiento', 'Elegir e implantar medidas'], ['Evaluación', 'Comparar con los criterios'], ['SoA', 'Documento con los controles aplicables']], ref: ['ucimp', 11]},
    {k: 'tf', q: 'La seguridad de la información solo protege lo que está en ordenadores.', a: false, why: 'Protege la información en cualquier soporte.', ref: ['uc01', 11]}
  ]}
 ],
 boss: [
  {k: 'choice', q: '¿Qué significa la «T» de DCIAT?', opts: ['Tratamiento', 'Trazabilidad', 'Tecnología'], a: 1, ref: ['s1', 6]},
  {k: 'tf', q: 'Un control es una práctica, procedimiento o mecanismo que reduce el riesgo.', a: true, ref: ['uc01', 11]},
  {k: 'choice', q: 'La sede electrónica se cae y nadie puede tramitar. ¿Qué se pierde?', opts: ['Disponibilidad', 'Confidencialidad', 'Autenticidad'], a: 0, ref: ['s1', 6]},
  {k: 'choice', q: 'El riesgo que queda después de tratarlo es el…', opts: ['Riesgo inherente', 'Riesgo residual', 'Riesgo aceptado'], a: 1, ref: ['ucimp', 11]},
  {k: 'tf', q: 'El impacto es la consecuencia sobre un activo si una amenaza se materializa.', a: true, ref: ['uc01', 11]},
  {k: 'tf', q: 'Las tres dimensiones CIA se pueden separar: basta con proteger una.', a: false, ref: ['s1', 14]},
  {k: 'choice', q: '¿Qué es la Declaración de aplicabilidad?', opts: ['Un contrato con el cliente', 'Un documento con los controles aplicables al SGSI', 'Una multa del BOE'], a: 1, ref: ['ucimp', 11]},
  {k: 'choice', q: 'Un intento fallido de inicio de sesión es…', opts: ['Un incidente grave', 'Un evento de seguridad', 'Un riesgo residual'], a: 1, ref: ['ucimp', 10]}
 ]
});

/* ═════════════ Unidad 5 · Cláusula 4.1 y 4.2 ═════════════ */
U({id: 'u5', n: 5, t: 'Contexto y partes interesadas', icon: 'compass', mins: 11, clauses: ['4.1', '4.2'],
 s: 'Cláusulas 4.1 y 4.2: conocer tu empresa por dentro y por fuera, y a quién le importa tu seguridad.',
 lesson: [
  {k: 'Cláusula 4', t: 'Antes de proteger, conoce tu casa', body: [
    'La cláusula 4 pide algo que parece obvio pero casi nadie hace bien: **entender la organización y su entorno** antes de decidir nada de seguridad.',
    {ul: [['4.1', 'Comprensión de la organización y de su contexto.'], ['4.2', 'Necesidades y expectativas de las partes interesadas.'], ['4.3', 'Alcance del SGSI.'], ['4.4', 'El propio SGSI.']]}],
   refs: [['ucnec', 3], ['ucnec', 4]]},
  {k: '4.1', t: 'Cuestiones internas y externas', body: [
    'La organización debe determinar las **cuestiones externas e internas** pertinentes para su propósito que afectan a su capacidad de lograr los resultados del SGSI, y **hacer su seguimiento**.',
    {ul: [['Ext', '<b>Externas</b>: entorno legal, tecnológico, competitivo, de mercado, cultural, social y económico.'], ['Int', '<b>Internas</b>: tamaño, cultura, recursos, estructura, madurez, tecnología propia.']]}],
   plain: 'Es como un análisis DAFO pensando en seguridad: qué te afecta desde fuera y qué tienes (o te falta) dentro.',
   refs: [['ucnec', 4], ['une', 6]]},
  {k: 'Tu caso', t: 'El contexto de Albatrel', body: [
    {ul: [['Ext', 'La renovación del contrato con la Diputación exige el ENS · oleada de ransomware contra ayuntamientos · RGPD y datos de salud de las clínicas · NIS2 · dependencia de la nube y del hosting · olas de calor (la sala técnica no tiene climatización redundante).'], ['Int', '60 personas (difícil separar funciones) · sede única · teletrabajo dos días por semana · equipo técnico joven · ningún documento de seguridad todavía.']]}],
   case: 'Albatrel lo apuntará en su registro de contexto y lo revisará al menos una vez al año.'},
  {check: true, k: 'classify', q: '¿Interna o externa?', buckets: [{t: 'Interna', c: '#5e5ce6'}, {t: 'Externa', c: '#ff9f0a'}], items: [['Plantilla de 60 personas', 0], ['Teletrabajo dos días por semana', 0], ['Nueva directiva NIS2', 1], ['Ransomware contra ayuntamientos', 1]]},
  {k: 'Novedad 2024', t: 'El cambio climático entra en 4.1', web: {src: 'ISO.org · Amd 1:2024', url: 'https://www.iso.org/standard/88435.html'}, body: [
    'En 2024 se publicó una enmienda (Amd 1:2024) que añade a 4.1 que la organización debe **determinar si el cambio climático es una cuestión pertinente**, y a 4.2 una nota: las partes interesadas pueden tener requisitos relacionados con el clima.',
    'No obliga a hacer nada «verde»: obliga a **pensarlo** y decidir si afecta a tu SGSI.'],
   case: 'Para Albatrel es relevante en un punto: las olas de calor pueden tumbar su sala técnica, que no tiene climatización redundante.'},
  {k: '4.2', t: 'Partes interesadas: quién y qué pide', body: [
    'La organización debe determinar:',
    {ul: [['a', 'Las <b>partes interesadas</b> relevantes para el SGSI.'], ['b', 'Sus <b>requisitos</b> relevantes (pueden ser legales, regulatorios o contractuales).'], ['c', '<b>Cuáles de esos requisitos se abordarán</b> a través del SGSI. (Esto es nuevo en la versión 2022).']]}],
   exam: 'Pregunta típica: «en 4.2 la organización debe determinar…». Son tres cosas a la vez, así que la respuesta suele ser «todas las anteriores».',
   refs: [['une', 7], ['ucnec', 5]]},
  {k: 'Tu caso', t: 'Las partes interesadas de Albatrel', body: [
    {ul: [['i:landmark', '<b>Diputación y ayuntamientos</b>: certificación ENS MEDIA, que el padrón y los tributos no se paren, avisar de incidentes.'], ['i:users', '<b>Vecinos</b>: que sus datos del padrón estén protegidos.'], ['i:heart', '<b>Clínicas y pacientes</b>: confidencialidad de los datos de salud y contrato de encargado del tratamiento (RGPD).'], ['i:building-2', '<b>Gerencia y socios</b>: viabilidad, reputación, no perder el contrato público.'], ['i:user-round', '<b>Personal</b>: reglas claras y formación.'], ['i:link', '<b>Proveedores</b> (nube, hosting, monitorización): responsabilidades por contrato.'], ['i:scale', '<b>AEPD y CCN</b>: cumplimiento y notificación de brechas.'], ['i:badge-check', '<b>Entidad de certificación</b> y <b>aseguradora</b>: evidencias y controles mínimos.']]}],
   case: 'Para cada parte, Albatrel anotará además «cómo lo aborda el SGSI» (4.2 c).'},
  {check: true, k: 'tf', q: 'En la versión 2022, la organización debe decidir cuáles de los requisitos de las partes interesadas abordará con el SGSI.', a: true, why: 'Es el apartado 4.2 c), nuevo en 2022.', ref: ['une', 7]},
  {k: 'Por qué importa', t: 'Para que el SGSI no viva en una burbuja', body: [
    'Identificar a las partes interesadas **conecta el SGSI con la estrategia del negocio** y evita que se desconecte de la realidad.',
    'Además, como el entorno cambia, hay que **revisar** esta información de forma continuada. La alta dirección participa en decidir qué partes interesadas entran: es el enlace con la cláusula 5.'],
   refs: [['ucnec', 5], ['ucnec', 6]]}
 ],
 labs: [
  {id: 'u5l1', t: 'Dentro o fuera', items: [
    {k: 'classify', q: 'Clasifica las cuestiones de Albatrel.', buckets: [{t: 'Interna', c: '#5e5ce6'}, {t: 'Externa', c: '#ff9f0a'}], items: [['Sede única con sala técnica', 0], ['Equipo técnico joven', 0], ['Ningún documento de seguridad', 0], ['El contrato público exige el ENS', 1], ['Dependencia del hosting en la nube', 1], ['Olas de calor extremo', 1]]},
    {k: 'choice', q: 'Según el material, el contexto externo puede incluir cuestiones del entorno…', opts: ['Legal, tecnológico, competitivo, de mercado, cultural, social y económico', 'Solo legal', 'Solo tecnológico'], a: 0, ref: ['ucnec', 4]},
    {k: 'tf', q: 'Basta con analizar el contexto una vez al implantar el SGSI.', a: false, why: 'La norma pide hacer el seguimiento y la revisión de estas cuestiones.', ref: ['ucnec', 4]},
    {k: 'choice', q: 'Para Albatrel, la oleada de ransomware contra ayuntamientos es…', opts: ['Una cuestión externa que influye en sus prioridades de seguridad', 'Una cuestión interna', 'Algo ajeno al SGSI'], a: 0, why: 'Las amenazas del entorno son cuestiones externas de 4.1 y orientan las prioridades.', ref: ['ucnec', 4]}
  ]},
  {id: 'u5l2', t: 'Quién pide qué', items: [
    {k: 'match', q: 'Une cada parte interesada de Albatrel con su requisito.', pairs: [['Diputación', 'Certificación ENS MEDIA y avisar de incidentes'], ['Clínicas', 'Confidencialidad de los datos de salud'], ['Personal', 'Reglas claras y formación'], ['Aseguradora', 'Controles mínimos de la póliza'], ['Entidad de certificación', 'Evidencias de conformidad']]},
    {k: 'order', q: 'Ordena lo que pide 4.2.', items: ['Determinar las partes interesadas relevantes', 'Determinar sus requisitos relevantes', 'Decidir cuáles se abordan con el SGSI'], ref: ['une', 7]},
    {k: 'choice', q: 'Los requisitos de las partes interesadas pueden incluir…', opts: ['Requisitos legales, regulatorios y obligaciones contractuales', 'Solo los deseos del cliente', 'Solo requisitos técnicos'], a: 0, ref: ['une', 7]},
    {k: 'choice', scenario: 'En la reunión anual de revisión del SGSI de Albatrel nadie trae las quejas que han enviado las clínicas, y el auditor lo señala.', q: '¿Qué apartado echa en falta esa información?', opts: ['4.2', '9.3.2', '5.1', '9.1'], a: 1, why: 'La revisión por la dirección (9.3.2) debe considerar la retroalimentación de las partes interesadas. 4.2 es identificarlas; 9.3 es revisarlas.', ref: ['une', 16]}
  ]}
 ],
 boss: [
  {k: 'choice', q: 'La cláusula 4.1 trata de…', opts: ['Las cuestiones internas y externas', 'La política de seguridad', 'La auditoría interna'], a: 0, ref: ['une', 6]},
  {k: 'tf', q: 'La dependencia del hosting en la nube es una cuestión externa para Albatrel.', a: true},
  {k: 'choice', q: 'Según 4.2, ¿qué tiene que determinar la organización?', opts: ['Solo quiénes son sus clientes', 'Sus partes interesadas, los requisitos de estas y cuáles abordará el SGSI', 'Solo los requisitos legales'], a: 1, ref: ['une', 7]},
  {k: 'tf', q: 'La enmienda de 2024 obliga a valorar si el cambio climático es una cuestión pertinente.', a: true},
  {k: 'choice', q: 'Identificar a las partes interesadas sirve sobre todo para…', opts: ['Conectar el SGSI con la estrategia del negocio', 'Reducir el número de controles', 'Evitar auditorías'], a: 0, ref: ['ucnec', 5]},
  {k: 'tf', q: 'El tamaño de la plantilla es una cuestión externa.', a: false, ref: ['ucnec', 4]},
  {k: 'choice', q: '¿Qué hace la organización con la información de contexto y partes interesadas?', opts: ['Hacer su seguimiento y revisarla', 'Archivarla para siempre sin tocarla', 'Enviarla al BOE'], a: 0, ref: ['ucnec', 4]},
  {k: 'tf', q: 'La alta dirección debe participar en decidir qué partes interesadas se incorporan.', a: true, ref: ['ucnec', 6]}
 ]
});

/* ═════════════ Unidad 6 · 4.3 y 4.4 ═════════════ */
U({id: 'u6', n: 6, t: 'Alcance y sistema de gestión', icon: 'target', mins: 10, clauses: ['4.3', '4.4'],
 s: 'Cláusulas 4.3 y 4.4: dibujar la frontera del SGSI y por qué no se puede excluir ninguna cláusula.',
 lesson: [
  {k: '4.3', t: 'El alcance es la frontera', body: [
    'La organización debe determinar los **límites y la aplicabilidad** del SGSI. Para ello considera:',
    {ul: [['a', 'Las cuestiones internas y externas (4.1).'], ['b', 'Los requisitos de las partes interesadas (4.2).'], ['c', 'Las <b>interfaces y dependencias</b> con lo que hacen otras organizaciones.']]},
    'El alcance debe estar disponible como **información documentada**.'],
   plain: 'Es el mapa con la línea roja: lo que está dentro se protege y se audita; lo de fuera, no (pero hay que justificar dónde pones la línea).',
   refs: [['une', 7], ['ucnec', 6]]},
  {k: 'Para qué', t: 'Un alcance claro evita malentendidos', body: [
    'La intención es que las partes interesadas y el organismo de certificación **conozcan sin ambigüedades** el campo de actuación del SGSI.',
    'Beneficios que cita el material: diferenciarte de la competencia, mejor posición en **licitaciones**, mejor comunicación y requisitos legales identificados con precisión.'],
   refs: [['ucnec', 6]]},
  {k: 'Tu caso', t: 'Un alcance para Albatrel', body: [
    'Propuesta: «Los servicios de **padrón, gestión tributaria y sede electrónica** para entidades locales y el servicio en la nube de **agenda e historia clínica** para clínicas dentales, prestados desde la **sede de Zaragoza**, con los procesos de soporte que los sustentan, según la Declaración de Aplicabilidad vigente».',
    'Fíjate en las **interfaces**: los equipos propios de cada ayuntamiento quedan fuera (solo entran los accesos de Albatrel a ellos), y el hosting y el correo en la nube se tratan como servicios externos.'],
   case: 'Si un día Albatrel cambia el alcance, deberá aprobarlo el Comité de Seguridad y actualizar la SoA.'},
  {check: true, k: 'choice', q: 'Al fijar el alcance, ¿qué NO pide considerar 4.3?', opts: ['Las cuestiones de 4.1', 'Los requisitos de 4.2', 'Las interfaces y dependencias con otras organizaciones', 'El precio de la certificación'], a: 3, ref: ['une', 7]},
  {k: '¡Ojo, trampa!', t: 'Las cláusulas 4 a 10 no se pueden excluir', body: [
    'La norma lo dice en su apartado 1: **no se acepta la exclusión de ninguno de los requisitos de los capítulos 4 al 10** si quieres declarar conformidad.',
    'Lo que **sí** se puede es declarar **no aplicable un control del Anexo A**, justificándolo en la Declaración de Aplicabilidad.'],
   exam: 'Pregunta típica: excluir una cláusula (por ejemplo, 5.3) es no conformidad; declarar no aplicable un control del Anexo A con justificación es válido.',
   refs: [['une', 6]]},
  {k: 'Contradicción', t: 'El caso AVITT: cuidado con el material antiguo', added: true, body: [
    'La unidad UC del curso cuenta el caso de **AVITT**, un fabricante que excluye el apartado 7.5 «Información documentada» y concluye que puede hacerlo.',
    'Ese razonamiento viene de la versión 2017 y de la lógica de la ISO 9001. **Con la ISO 27001:2022 no vale**: 7.5 es una cláusula obligatoria y no se puede excluir.'],
   plain: 'Si en el examen te preguntan si se puede excluir una cláusula de la 4 a la 10, la respuesta es no. Siempre.',
   refs: [['ucnec', 8], ['ucnec', 9], ['une', 6]]},
  {check: true, k: 'tf', q: 'Una organización puede declarar no aplicable un control del Anexo A si lo justifica.', a: true, why: 'Se justifica en la Declaración de Aplicabilidad (6.1.3 d).', ref: ['une', 10]},
  {k: '4.4', t: 'El SGSI y sus procesos', body: [
    'La organización debe **establecer, implementar, mantener y mejorar de forma continua** un SGSI, incluidos los procesos necesarios **y sus interacciones**.',
    'Para cada proceso: entradas y salidas, secuencia, criterios e indicadores, recursos, responsables, riesgos y oportunidades, y oportunidades de mejora.'],
   refs: [['une', 7], ['ucnec', 9]]}
 ],
 labs: [
  {id: 'u6l1', t: 'Dibujar la frontera', items: [
    {k: 'order', q: 'Ordena lo que considera 4.3 según su letra.', items: ['Cuestiones internas y externas (4.1)', 'Requisitos de las partes interesadas (4.2)', 'Interfaces y dependencias con otras organizaciones'], ref: ['une', 7]},
    {k: 'tf', q: 'El alcance del SGSI debe estar disponible como información documentada.', a: true, ref: ['une', 7]},
    {k: 'choice', q: '¿Cuál es un beneficio de un alcance bien definido según el material?', opts: ['Mejor posicionamiento en ofertas y licitaciones', 'No tener que hacer auditorías', 'Poder excluir cláusulas'], a: 0, ref: ['ucnec', 6]},
    {k: 'choice', scenario: 'Albatrel administra en remoto los equipos de un ayuntamiento, que son propiedad del ayuntamiento.', q: '¿Cómo lo trata su alcance?', opts: ['Incluye las actividades y accesos de Albatrel sobre ellos, no su titularidad', 'Los excluye por completo', 'Los incluye como si fueran propios'], a: 0, ref: ['une', 7]}
  ]},
  {id: 'u6l2', t: 'Se puede o no se puede', items: [
    {k: 'classify', q: '¿Se puede excluir?', buckets: [{t: 'Se puede (con justificación)', c: '#34c759'}, {t: 'No se puede', c: '#ff3b30'}], items: [['Control 7.1 Perímetros físicos (empresa 100 % en remoto)', 0], ['Control 8.30 Desarrollo externalizado (no se externaliza)', 0], ['Cláusula 5.3 Roles', 1], ['Cláusula 7.5 Información documentada', 1], ['Cláusula 9.2 Auditoría interna', 1]], ref: ['une', 6]},
    {k: 'choice', q: 'Albatrel presenta su SoA y su SGSI. ¿Qué decisión provocaría una no conformidad?', opts: ['Declarar no aplicable el control 8.30 porque no externaliza desarrollo (justificado)', 'Declarar no aplicable el control 7.1 si trabajara 100 % en remoto (justificado)', 'Excluir la cláusula 7.5 porque no le gusta documentar', 'Declarar no aplicable el control 8.4 si no tuviera código propio (justificado)'], a: 2, why: 'Las cláusulas 4 a 10 no se pueden excluir; los controles del Anexo A sí, justificándolo.', ref: ['une', 6]},
    {k: 'tf', q: 'Con la ISO 27001:2022, AVITT puede excluir el apartado 7.5 y seguir certificándose.', a: false, why: 'Las cláusulas 4 a 10 no se pueden excluir. El caso del material sigue la lógica de 2017/ISO 9001.', ref: ['une', 6]}
  ]}
 ],
 boss: [
  {k: 'choice', q: 'La cláusula 4.3 trata de…', opts: ['El alcance del SGSI', 'Las partes interesadas', 'La política'], a: 0, ref: ['une', 7]},
  {k: 'tf', q: 'Se acepta excluir requisitos de los capítulos 4 a 10 si se justifica.', a: false, ref: ['une', 6]},
  {k: 'choice', q: '¿Qué apartado pide el SGSI «con los procesos necesarios y sus interacciones»?', opts: ['4.4', '4.1', '5.3'], a: 0, ref: ['une', 7]},
  {k: 'tf', q: 'Las interfaces con proveedores (como la nube) hay que considerarlas al fijar el alcance.', a: true, ref: ['une', 7]},
  {k: 'choice', q: '¿Dónde se justifica que un control del Anexo A no aplica?', opts: ['En la Declaración de Aplicabilidad', 'En el contrato laboral', 'En el BOE'], a: 0, ref: ['une', 10]},
  {k: 'tf', q: 'El alcance propuesto para Albatrel incluye el servicio de historia clínica en la nube.', a: true},
  {k: 'choice', q: 'La intención de 4.3 es que el alcance se conozca…', opts: ['Sin ambigüedades', 'Solo por la dirección', 'Solo tras la certificación'], a: 0, ref: ['ucnec', 6]}
 ]
});

/* ═════════════ Unidad 7 · 5.1 y 5.2 ═════════════ */
U({id: 'u7', n: 7, t: 'Liderazgo y política', icon: 'crown', mins: 11, clauses: ['5.1', '5.2'],
 s: 'Cláusulas 5.1 y 5.2: el papel de la alta dirección y la política de seguridad.',
 lesson: [
  {k: 'Cláusula 5', t: 'Sin la dirección, no hay SGSI', body: [
    'El compromiso de la dirección es **uno de los pilares que marcan el éxito o el fracaso** de cualquier cambio en una empresa.',
    'Un SGSI no da beneficios a corto plazo: sus efectos se ven con el tiempo y exigen un esfuerzo continuado de todos. Por eso la norma fija lo que la alta dirección tiene que hacer.'],
   refs: [['ucnec', 10]]},
  {k: '5.1', t: 'Ocho formas de demostrar liderazgo', body: [
    {ul: [['a', 'Política y objetivos <b>compatibles con la estrategia</b>.'], ['b', '<b>Integrar</b> el SGSI en los procesos de la organización.'], ['c', 'Que haya <b>recursos</b>.'], ['d', '<b>Comunicar</b> la importancia de la seguridad.'], ['e', 'Que el SGSI consiga los <b>resultados previstos</b>.'], ['f', '<b>Dirigir y apoyar</b> a las personas.'], ['g', 'Promover la <b>mejora continua</b>.'], ['h', '<b>Apoyar a otros roles</b> de dirección en sus áreas.']]}],
   refs: [['une', 7], ['une', 8], ['ucnec', 12]]},
  {k: 'Clave', t: 'Estos verbos no se delegan', body: [
    'Promover, comunicar, asegurar, dirigir y apoyar son tareas que **la alta dirección no puede delegar**.',
    'La dirección será **auditada con más intensidad** para evidenciar su compromiso y liderazgo.'],
   plain: 'El director puede delegar el trabajo, pero no el compromiso. Si en la auditoría el director no sabe qué es el SGSI, mala señal.',
   exam: 'En examen, cuando la pregunta es «quién debe asegurarse» de algo del SGSI, la respuesta suele ser la alta dirección.',
   refs: [['ucnec', 13]]},
  {check: true, k: 'choice', q: '¿Cuál de estas NO es una forma de liderazgo de 5.1?', opts: ['Asegurar que haya recursos', 'Promover la mejora continua', 'Configurar personalmente el cortafuegos', 'Comunicar la importancia de la seguridad'], a: 2, ref: ['une', 7]},
  {k: '5.2', t: 'La política de seguridad', body: [
    'La alta dirección establece una política que:',
    {ul: [['a', 'Sea <b>adecuada al propósito</b> de la organización.'], ['b', 'Incluya <b>objetivos</b> o un marco para fijarlos (6.2).'], ['c', 'Incluya el compromiso de <b>cumplir los requisitos</b> aplicables.'], ['d', 'Incluya el compromiso de <b>mejora continua</b>.']]},
    'Y además debe: estar **documentada**, **comunicarse** dentro de la organización y estar **disponible para las partes interesadas** según proceda.'],
   plain: 'Dos compromisos que nunca pueden faltar en la política: cumplir y mejorar.',
   refs: [['une', 8], ['ucnec', 14]]},
  {k: 'Tu caso', t: 'Cómo será la política de Albatrel', body: [
    'Documento de **primer nivel**, aprobado por la **Gerencia** a propuesta del Comité de Seguridad, con revisión anual.',
    {ul: [['i:circle-check', 'Compromisos: proteger la información de vecinos y pacientes, cumplir ENS, RGPD y contratos, <b>mejorar el SGSI</b> y poner los recursos necesarios.'], ['i:target', 'Marco de objetivos: sede electrónica disponible ≥ 99,8 % en periodo de pago de tributos, 100 % de la plantilla formada en 6 meses, MFA en todas las cuentas, una restauración de copia de prueba cada mes.']]}],
   case: 'Una sola política bien hecha cubre la cláusula 5.2, el control 5.1 del Anexo A y la política que pide el ENS. Si quieres ver un ejemplo completo, abre la plantilla del curso.',
   refs: [['pol', 1]]},
  {k: 'No confundir', t: 'Cláusula 5.2 y control 5.1', body: [
    {ul: [['5.2', '<b>Cláusula 5.2</b>: la política general del SGSI, firmada por la alta dirección. Obligatoria.'], ['A.5.1', '<b>Control 5.1 del Anexo A</b>: la política general <b>y las políticas temáticas</b> (accesos, copias, proveedores…), revisadas periódicamente.']]}],
   exam: 'Cuando una pregunta dice «cláusula» piensa en 4-10; cuando dice «control» o «Anexo A», en los 93 controles.'},
  {check: true, k: 'tf', q: 'La política debe incluir el compromiso de mejora continua del SGSI.', a: true, ref: ['une', 8]}
 ],
 labs: [
  {id: 'u7l1', t: 'Liderazgo', items: [
    {k: 'classify', q: '¿Es una obligación de la alta dirección según 5.1?', buckets: [{t: 'Sí, 5.1', c: '#34c759'}, {t: 'No', c: '#8e8e93'}], items: [['Asegurar los recursos del SGSI', 0], ['Comunicar la importancia de la seguridad', 0], ['Apoyar a otros roles de dirección', 0], ['Revisar los logs del servidor cada día', 1], ['Instalar parches en los portátiles', 1]], ref: ['une', 7]},
    {k: 'choice', q: '¿Quién debe asegurarse de que el SGSI consigue sus resultados y de que se informa de su desempeño?', opts: ['El técnico de sistemas', 'Un proveedor externo', 'La alta dirección', 'El auditor de certificación'], a: 2, why: '5.1 e): la alta dirección asegura que el SGSI consigue los resultados previstos; en 5.3 b) asigna quién le informa.', ref: ['une', 7]},
    {k: 'tf', q: 'Según el material, la alta dirección puede delegar el «promover, comunicar, asegurar, dirigir y apoyar».', a: false, ref: ['ucnec', 13]}
  ]},
  {id: 'u7l2', t: 'La política', items: [
    {k: 'classify', q: '¿Qué debe incluir o cumplir la política (5.2)?', buckets: [{t: 'Lo exige 5.2', c: '#5e5ce6'}, {t: 'No lo exige', c: '#8e8e93'}], items: [['Adecuada al propósito de la organización', 0], ['Compromiso de cumplir requisitos', 0], ['Compromiso de mejora continua', 0], ['Estar documentada y comunicada', 0], ['La marca del antivirus', 1], ['Las contraseñas del administrador', 1]], ref: ['une', 8]},
    {k: 'choice', q: '¿Quién aprobará la política de Albatrel?', opts: ['La Gerencia, a propuesta del Comité de Seguridad', 'El jefe de sistemas', 'Cada empleado'], a: 0, ref: ['une', 8]},
    {k: 'match', q: 'Une cada pieza con lo que es.', pairs: [['Cláusula 5.2', 'Política del SGSI firmada por la dirección'], ['Control A.5.1', 'Política general y políticas temáticas'], ['Cláusula 6.2', 'Objetivos medibles de seguridad']], ref: ['une', 8]},
    {k: 'tf', q: 'La política debe estar disponible para las partes interesadas, según sea apropiado.', a: true, ref: ['une', 8]}
  ]}
 ],
 boss: [
  {k: 'choice', q: '¿Qué cláusula trata del liderazgo y compromiso?', opts: ['5.1', '4.1', '7.3'], a: 0, ref: ['une', 7]},
  {k: 'tf', q: 'La política y los objetivos deben ser compatibles con la dirección estratégica.', a: true, ref: ['une', 7]},
  {k: 'choice', q: 'Dos compromisos que siempre debe incluir la política:', opts: ['Cumplir requisitos y mejora continua', 'Reducir costes y contratar', 'Comprar software y formar'], a: 0, ref: ['une', 8]},
  {k: 'tf', q: 'La alta dirección será auditada para evidenciar su liderazgo.', a: true, ref: ['ucnec', 13]},
  {k: 'choice', q: 'Integrar los requisitos del SGSI en los procesos de la organización es…', opts: ['Una obligación de la alta dirección (5.1 b)', 'Opcional', 'Tarea exclusiva de TI'], a: 0, ref: ['une', 7]},
  {k: 'tf', q: 'La política de seguridad no necesita comunicarse dentro de la organización.', a: false, ref: ['une', 8]},
  {k: 'choice', q: 'En la pirámide documental, la política es un documento de…', opts: ['Primer nivel', 'Tercer nivel', 'Registro'], a: 0, ref: ['pol', 1]},
  {k: 'choice', q: 'Un SGSI da beneficios…', opts: ['A lo largo del tiempo, con esfuerzo continuado', 'Inmediatos', 'Solo el día de la certificación'], a: 0, ref: ['ucnec', 10]}
 ]
});

/* ═════════════ Unidad 8 · 5.3 ═════════════ */
U({id: 'u8', n: 8, t: 'Roles, responsabilidades y autoridades', icon: 'users', mins: 10, clauses: ['5.3'],
 s: 'Cláusula 5.3: que cada rol tenga dueño, la matriz RACI y la segregación de funciones.',
 lesson: [
  {k: '5.3', t: 'Cada rol, un dueño', body: [
    'La alta dirección debe asegurarse de que las responsabilidades y autoridades de los roles de seguridad **se asignan y se comunican**.',
    'Y debe asignar, como mínimo, la responsabilidad y autoridad para:',
    {ul: [['a', 'Asegurar que el SGSI <b>es conforme</b> con la norma.'], ['b', '<b>Informar a la alta dirección</b> sobre el comportamiento del SGSI.']]}],
   plain: 'Que ninguna función quede sin dueño y que ninguna tenga dos dueños que se pisen.',
   refs: [['une', 8], ['ucnec', 15]]},
  {k: 'Tu caso', t: 'Los roles de Albatrel', body: [
    {ul: [['GER', '<b>Gerencia</b>: aprueba la política, nombra los roles, preside el Comité y hace la revisión por la dirección.'], ['CS', '<b>Comité de Seguridad</b>: gerente, responsables de seguridad y de sistemas, responsable de clínicas y DPD. Aprueba normativas y resuelve conflictos.'], ['RSEG', '<b>Responsable de Seguridad</b>: dueño del SGSI, riesgos, SoA, incidentes y métricas. Reporta a la Gerencia.'], ['RSIS', '<b>Responsable del Sistema</b> (jefe de sistemas): opera las medidas técnicas.'], ['DPD', '<b>Delegado de Protección de Datos</b>, externo.']]}],
   case: 'El Responsable de Seguridad y el del Sistema serán personas distintas, sin depender uno del otro: quien vigila no depende de quien opera. Es lo que pide el ENS y lo que recomienda el curso.',
   refs: [['pol', 1]]},
  {check: true, k: 'choice', q: '¿Por qué el Responsable de Seguridad no depende del Responsable del Sistema?', opts: ['Para que quien supervisa sea independiente de quien opera', 'Porque cobra más', 'Porque lo exige el RGPD'], a: 0, ref: ['pol', 1]},
  {k: 'Herramienta', t: 'La matriz RACI', body: [
    {ul: [['R', '<b>Realiza</b> la tarea.'], ['A', '<b>Aprueba</b> o rinde cuentas (solo uno por tarea).'], ['C', 'Es <b>consultado</b> antes.'], ['I', 'Es <b>informado</b> después.']]},
    'Ejemplo para Albatrel: aprobar la política → **A** Gerencia, **R** Comité, **C** RSEG; aceptar un riesgo residual alto → **A** Gerencia.'],
   plain: 'La RACI responde en una tabla a «¿quién hace, quién decide, a quién preguntamos y a quién avisamos?».',
   refs: [['pol', 1]]},
  {k: 'Principio', t: 'Segregación de funciones', body: [
    'Las tareas incompatibles (por ejemplo **solicitar, aprobar y ejecutar** un cambio o un alta de privilegios) se asignan a personas distintas. Es el **control 5.3** del Anexo A.',
    'Si la empresa es pequeña y no puede separarlas, aplica **controles compensatorios** documentados: revisión posterior, registro reforzado…'],
   case: 'Con 60 personas, Albatrel no siempre podrá separar funciones: lo recoge como cuestión interna (4.1) y lo compensa con revisiones posteriores aprobadas por el RSEG.',
   refs: [['pol', 1]]},
  {check: true, k: 'tf', q: 'En una matriz RACI puede haber varias «A» para la misma tarea.', a: false, why: 'Solo debe haber un responsable que rinde cuentas (A) por tarea.'},
  {k: 'Para que funcione', t: 'Formación, comunicación y participación', body: [
    'El material insiste: para que el reparto de roles dé resultado hacen falta **formación adecuada, buena comunicación interna y participación** de los trabajadores.',
    'La nota de 5.3 añade que la dirección también puede asignar responsabilidades para informar del SGSI **dentro** de la organización.'],
   refs: [['ucnec', 15], ['une', 8]]}
 ],
 labs: [
  {id: 'u8l1', t: 'Quién hace qué', items: [
    {k: 'match', q: 'Une cada rol de Albatrel con su función principal.', pairs: [['Gerencia', 'Aprueba la política y hace la revisión por la dirección'], ['Comité de Seguridad', 'Aprueba normativas y resuelve conflictos'], ['Responsable de Seguridad', 'Dueño del SGSI, riesgos y SoA'], ['Responsable del Sistema', 'Opera las medidas técnicas']]},
    {k: 'order', q: 'Pon en orden de nivel los documentos (de más general a más concreto).', items: ['Política (POL)', 'Normativas (NOR)', 'Procedimientos e instrucciones técnicas (PRO/IT)', 'Registros (REG)'], ref: ['pol', 1]},
    {k: 'choice', q: '¿Qué dos responsabilidades exige asignar 5.3 como mínimo?', opts: ['Asegurar la conformidad del SGSI e informar a la dirección de su comportamiento', 'Comprar licencias y contratar personal', 'Auditar a proveedores y hacer copias'], a: 0, ref: ['une', 8]}
  ]},
  {id: 'u8l2', t: 'RACI y segregación', items: [
    {k: 'match', q: 'Une cada letra RACI con su significado.', pairs: [['R', 'Realiza la tarea'], ['A', 'Aprueba o rinde cuentas'], ['C', 'Consultado antes'], ['I', 'Informado después']]},
    {k: 'choice', scenario: 'En una pyme, la misma persona pide un alta de administrador, la aprueba y la ejecuta.', q: '¿Qué principio se incumple?', opts: ['Segregación de funciones (control 5.3)', 'Clasificación de la información', 'Mantenimiento de equipos'], a: 0, ref: ['pol', 1]},
    {k: 'tf', q: 'Si la empresa es pequeña, puede usar controles compensatorios documentados en vez de separar funciones.', a: true, ref: ['pol', 1]},
    {k: 'choice', q: 'En la RACI de Albatrel, ¿quién aprueba aceptar un riesgo residual alto?', opts: ['La Gerencia', 'Los usuarios', 'El Responsable del Sistema'], a: 0}
  ]}
 ],
 boss: [
  {k: 'choice', q: 'La cláusula 5.3 trata de…', opts: ['Roles, responsabilidades y autoridades', 'La política', 'El alcance'], a: 0, ref: ['une', 8]},
  {k: 'tf', q: 'Las responsabilidades de seguridad deben asignarse y comunicarse.', a: true, ref: ['une', 8]},
  {k: 'choice', q: 'Excluir la cláusula 5.3 en una auditoría supone…', opts: ['Una no conformidad', 'Una buena práctica', 'Nada'], a: 0, ref: ['une', 6]},
  {k: 'tf', q: 'En Albatrel, el Responsable de Seguridad reporta directamente a la Gerencia.', a: true},
  {k: 'choice', q: 'En RACI, la «C» significa…', opts: ['Consultado', 'Controlado', 'Comunicado después'], a: 0},
  {k: 'choice', q: 'Solicitar, aprobar y ejecutar un cambio deberían hacerlo…', opts: ['Personas distintas', 'La misma persona', 'Un proveedor'], a: 0, ref: ['pol', 1]},
  {k: 'tf', q: 'Para que el sistema de roles funcione hacen falta formación, comunicación y participación.', a: true, ref: ['ucnec', 15]}
 ]
});

/* ── Glosario (repaso espaciado) ── */
T.glossary = [
  ['GRC', 'Gobierno, Riesgo y Cumplimiento.', ['s1', 4]],
  ['SGSI', 'Sistema de Gestión de la Seguridad de la Información.', ['uc01', 6]],
  ['ENS', 'Esquema Nacional de Seguridad (RD 311/2022): obligatorio para el sector público y sus proveedores.', ['s1', 8]],
  ['PDCA / PHVA', 'Planificar, Hacer, Verificar, Actuar: el ciclo de mejora continua.', ['ucimp', 6]],
  ['Confidencialidad', 'La información no se revela a quien no está autorizado.', ['s1', 6]],
  ['Integridad', 'La información es exacta y completa; no ha sido manipulada indebidamente.', ['s1', 6]],
  ['Disponibilidad', 'La información es accesible cuando la necesitan los autorizados.', ['s1', 6]],
  ['Autenticidad', 'Se puede verificar la identidad de quien actúa (dimensión del ENS).', ['s1', 6]],
  ['Trazabilidad', 'Las acciones sobre la información se pueden rastrear (dimensión del ENS).', ['s1', 6]],
  ['Activo', 'Recurso que la organización necesita para funcionar y lograr sus objetivos.', ['uc01', 11]],
  ['Amenaza', 'Evento que puede causar un incidente y daños en los activos.', ['uc01', 11]],
  ['Riesgo', 'Posibilidad de que una amenaza se materialice.', ['uc01', 11]],
  ['Impacto', 'Consecuencia sobre un activo de que una amenaza se materialice.', ['uc01', 11]],
  ['Control', 'Práctica, procedimiento o mecanismo que reduce el riesgo.', ['uc01', 11]],
  ['Riesgo residual', 'El riesgo que queda después del tratamiento.', ['ucimp', 11]],
  ['Declaración de aplicabilidad (SoA)', 'Documento con los controles necesarios, si están implantados y la justificación de inclusiones y exclusiones.', ['une', 10]],
  ['Evento de seguridad', 'Algo detectado que indica una posible violación de la política o un fallo de las salvaguardas.', ['ucimp', 10]],
  ['Incidente de seguridad', 'Uno o varios eventos no deseados con probabilidad significativa de comprometer la actividad.', ['ucimp', 10]],
  ['CCN-STIC 825', 'Guía del CCN que relaciona los controles de la ISO 27001 con las medidas del ENS.', ['s1', 10]],
  ['ENAC', 'Entidad Nacional de Acreditación: acredita a quienes certifican la ISO 27001.', ['s1', 9]],
  ['MFA', 'Autenticación multifactor. Su ausencia fue clave en Colonial Pipeline.', ['s1', 5]],
  ['Cuestiones internas y externas', 'Factores de dentro y de fuera que afectan a la capacidad del SGSI de lograr sus resultados (4.1).', ['une', 6]],
  ['Parte interesada', 'Persona u organización que puede afectar, verse afectada o percibirse afectada por una decisión (clientes, personal, reguladores…).', ['une', 7]],
  ['Alcance del SGSI', 'Límites y aplicabilidad del SGSI; debe estar documentado (4.3).', ['une', 7]],
  ['Alta dirección', 'Quien dirige y controla la organización al más alto nivel. Su liderazgo no se delega (5.1).', ['une', 7]],
  ['Política de seguridad', 'Documento de la alta dirección con objetivos (o su marco) y los compromisos de cumplir y mejorar (5.2).', ['une', 8]],
  ['RACI', 'Matriz de responsabilidades: Realiza, Aprueba, Consultado, Informado.', ['pol', 1]],
  ['Segregación de funciones', 'Separar tareas incompatibles entre personas distintas (control 5.3).', ['pol', 1]],
  ['No conformidad', 'Incumplimiento de un requisito.', ['une', 17]],
  ['Exclusión', 'Las cláusulas 4 a 10 no se pueden excluir; los controles del Anexo A sí, con justificación en la SoA.', ['une', 6]]
];
})();
