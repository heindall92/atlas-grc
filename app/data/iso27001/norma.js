/* Mapa de la norma ISO/IEC 27001:2022 (UNE-ISO/IEC 27001:2023).
   - Títulos de cláusulas y controles: los de la norma.
   - «plain»: explicación propia en lenguaje sencillo (no es texto de la norma).
   - ref: cláusula o control de la norma como referencia (el texto oficial no se reproduce).
   - Los datos marcados con web:true salen de fuentes públicas de internet y llevan su enlace. */
ATLAS.track('iso27001').norma = {
  phases: [
    {id: 'P', t: 'Planificar', c: '#5e5ce6', clauses: ['4', '5', '6']},
    {id: 'D', t: 'Hacer', c: '#30b0c7', clauses: ['7', '8']},
    {id: 'C', t: 'Verificar', c: '#ff9f0a', clauses: ['9']},
    {id: 'A', t: 'Actuar', c: '#34c759', clauses: ['10']}
  ],
  clauses: [
    {n: '4', t: 'Contexto de la organización', phase: 'P', sub: [
      {n: '4.1', t: 'Comprensión de la organización y de su contexto', plain: 'Antes de proteger nada, conoce tu empresa: qué cuestiones internas (cultura, recursos, tecnología) y externas (leyes, mercado, competencia, amenazas) afectan a tu seguridad.', doc: false, ref: ['une', 6]},
      {n: '4.2', t: 'Necesidades y expectativas de las partes interesadas', plain: 'Haz la lista de quién te importa (clientes, empleados, reguladores, proveedores…), qué te exige cada uno y cuáles de esas exigencias vas a cubrir con el SGSI.', doc: false, ref: ['une', 7]},
      {n: '4.3', t: 'Determinación del alcance del SGSI', plain: 'Dibuja la frontera: qué sedes, procesos, sistemas y personas entran en el SGSI. Debe quedar por escrito.', doc: true, ref: ['une', 7]},
      {n: '4.4', t: 'Sistema de gestión de la seguridad de la información', plain: 'Monta el SGSI, hazlo funcionar, mantenlo y mejóralo siempre, con sus procesos y cómo se relacionan entre sí.', doc: false, ref: ['une', 7]}
    ]},
    {n: '5', t: 'Liderazgo', phase: 'P', sub: [
      {n: '5.1', t: 'Liderazgo y compromiso', plain: 'La alta dirección no delega su compromiso: fija política y objetivos, pone recursos, integra la seguridad en el negocio y empuja la mejora.', doc: false, ref: ['une', 7]},
      {n: '5.2', t: 'Política', plain: 'La dirección firma una política de seguridad adecuada a la empresa, con objetivos (o un marco para fijarlos) y dos compromisos: cumplir requisitos y mejorar. Se documenta y se comunica.', doc: true, ref: ['une', 8]},
      {n: '5.3', t: 'Roles, responsabilidades y autoridades', plain: 'Cada rol de seguridad tiene dueño y todos lo saben. Alguien vela por que el SGSI cumpla la norma y alguien informa a la dirección de cómo va.', doc: false, ref: ['une', 8]}
    ]},
    {n: '6', t: 'Planificación', phase: 'P', sub: [
      {n: '6.1.1', t: 'Acciones para tratar riesgos y oportunidades: generalidades', plain: 'Con el contexto (4.1) y las partes interesadas (4.2) en mano, decide qué riesgos y oportunidades hay que tratar y cómo comprobarás que las acciones funcionan.', doc: false, ref: ['une', 9]},
      {n: '6.1.2', t: 'Evaluación de los riesgos de seguridad de la información', plain: 'Define un método repetible: criterios de aceptación, identificar riesgos (pérdida de C, I o D) con su dueño, analizarlos (impacto × probabilidad) y priorizarlos.', doc: true, ref: ['une', 9]},
      {n: '6.1.3', t: 'Tratamiento de los riesgos de seguridad de la información', plain: 'Elige qué hacer con cada riesgo, decide los controles, compáralos con el Anexo A, redacta la Declaración de Aplicabilidad (SoA) y el plan de tratamiento, y que los dueños del riesgo lo aprueben.', doc: true, ref: ['une', 10]},
      {n: '6.2', t: 'Objetivos de seguridad de la información y planificación para lograrlos', plain: 'Objetivos medibles y coherentes con la política: qué se hará, con qué recursos, quién, para cuándo y cómo se medirá.', doc: true, ref: ['une', 11]},
      {n: '6.3', t: 'Planificación de los cambios', plain: 'Nueva en 2022: los cambios en el SGSI se hacen de forma planificada, no improvisada.', doc: false, ref: ['une', 12], isNew: true}
    ]},
    {n: '7', t: 'Soporte', phase: 'D', sub: [
      {n: '7.1', t: 'Recursos', plain: 'Gente, dinero, tiempo y herramientas suficientes para el SGSI.', doc: false, ref: ['une', 12]},
      {n: '7.2', t: 'Competencia', plain: 'Quien hace tareas de seguridad sabe hacerlas (formación, experiencia) y se guarda prueba de ello.', doc: true, ref: ['une', 12]},
      {n: '7.3', t: 'Concienciación', plain: 'Todo el personal conoce la política, cómo contribuye y qué pasa si no la cumple.', doc: false, ref: ['une', 12]},
      {n: '7.4', t: 'Comunicación', plain: 'Decide qué comunicar, cuándo, a quién y cómo, dentro y fuera de la empresa.', doc: false, ref: ['une', 12]},
      {n: '7.5', t: 'Información documentada', plain: 'Lo que exige la norma y lo que tú decidas se documenta, se identifica, se revisa, se aprueba y se controla (versiones, acceso, conservación).', doc: true, ref: ['une', 13]}
    ]},
    {n: '8', t: 'Operación', phase: 'D', sub: [
      {n: '8.1', t: 'Planificación y control operacional', plain: 'Ejecuta lo planificado con criterios claros, controla los cambios y también lo que externalizas.', doc: true, ref: ['une', 14]},
      {n: '8.2', t: 'Evaluación de los riesgos de seguridad de la información', plain: 'Repite la evaluación de riesgos a intervalos planificados y cuando haya cambios importantes.', doc: true, ref: ['une', 14]},
      {n: '8.3', t: 'Tratamiento de los riesgos de seguridad de la información', plain: 'Aplica el plan de tratamiento y guarda los resultados.', doc: true, ref: ['une', 14]}
    ]},
    {n: '9', t: 'Evaluación del desempeño', phase: 'C', sub: [
      {n: '9.1', t: 'Seguimiento, medición, análisis y evaluación', plain: 'Decide qué medir, cómo, cuándo y quién lo analiza. Sin métricas no sabes si el SGSI funciona.', doc: true, ref: ['une', 15]},
      {n: '9.2', t: 'Auditoría interna', plain: 'Programa de auditorías internas a intervalos planificados, con auditores objetivos e imparciales, y resultados comunicados a la dirección.', doc: true, ref: ['une', 15]},
      {n: '9.3', t: 'Revisión por la dirección', plain: 'La dirección revisa el SGSI periódicamente con unas entradas fijadas (auditorías, métricas, riesgos, partes interesadas…) y decide mejoras y cambios.', doc: true, ref: ['une', 16]}
    ]},
    {n: '10', t: 'Mejora', phase: 'A', sub: [
      {n: '10.1', t: 'Mejora continua', plain: 'El SGSI tiene que ser cada vez más adecuado y eficaz. Mejorar no es opcional.', doc: false, ref: ['une', 17]},
      {n: '10.2', t: 'No conformidad y acción correctiva', plain: 'Si algo no cumple: contenlo, busca la causa raíz, corrígela para que no se repita, comprueba que funcionó y regístralo.', doc: true, ref: ['une', 17]}
    ]}
  ],
  themes: [
    {id: 'org', n: '5', t: 'Organizacionales', c: 'var(--th-org)', count: 37},
    {id: 'per', n: '6', t: 'Personas', c: 'var(--th-per)', count: 8},
    {id: 'fis', n: '7', t: 'Físicos', c: 'var(--th-fis)', count: 14},
    {id: 'tec', n: '8', t: 'Tecnológicos', c: 'var(--th-tec)', count: 34}
  ],
  ctlPage: {"5.1":18,"5.2":18,"5.3":18,"5.4":18,"5.5":18,"5.6":18,"5.7":18,"5.8":19,"5.9":19,"5.10":19,"5.11":19,"5.12":19,"5.13":19,"5.14":19,"5.15":19,"5.16":19,"5.17":19,"5.18":20,"5.19":20,"5.20":20,"5.21":20,"5.22":20,"5.23":20,"5.24":20,"5.25":20,"5.26":20,"5.27":21,"5.28":21,"5.29":21,"5.30":21,"5.31":21,"5.32":21,"5.33":21,"5.34":21,"5.35":21,"5.36":22,"5.37":22,"6.1":22,"6.2":22,"6.3":22,"6.4":22,"6.5":22,"6.6":22,"6.7":23,"6.8":23,"7.1":23,"7.2":23,"7.3":23,"7.4":23,"7.5":23,"7.6":23,"7.7":23,"7.8":23,"7.9":23,"7.10":24,"7.11":24,"7.12":24,"7.13":24,"7.14":24,"8.1":24,"8.2":24,"8.3":24,"8.4":24,"8.5":24,"8.6":25,"8.7":25,"8.8":25,"8.9":25,"8.10":25,"8.11":25,"8.12":25,"8.13":25,"8.14":25,"8.15":25,"8.16":26,"8.17":26,"8.18":26,"8.19":26,"8.20":26,"8.21":26,"8.22":26,"8.23":26,"8.24":26,"8.25":26,"8.26":27,"8.27":27,"8.28":27,"8.29":27,"8.30":27,"8.31":27,"8.32":27,"8.33":27,"8.34":27},
  /* [número, título, explicación sencilla, nuevo en 2022] */
  controls: [
    ['5.1', 'Políticas para la seguridad de la información', 'Una política general y políticas temáticas, aprobadas por la dirección, comunicadas y revisadas.'],
    ['5.2', 'Roles y responsabilidades en seguridad de la información', 'Quién hace qué en seguridad, definido y asignado.'],
    ['5.3', 'Segregación de tareas', 'Que una misma persona no pueda pedir, aprobar y ejecutar algo crítico ella sola.'],
    ['5.4', 'Responsabilidades de la dirección', 'Los jefes exigen a su equipo que cumpla la política y los procedimientos.'],
    ['5.5', 'Contacto con las autoridades', 'Saber a quién llamar (policía, CCN-CERT, AEPD, INCIBE) y tener el contacto preparado.'],
    ['5.6', 'Contacto con grupos de interés especial', 'Estar en foros y asociaciones de seguridad para aprender y enterarse antes.'],
    ['5.7', 'Inteligencia de amenazas', 'Recoger y analizar información sobre amenazas para anticiparse.', true],
    ['5.8', 'Seguridad de la información en la gestión de proyectos', 'Todo proyecto incluye la seguridad desde el principio, no al final.'],
    ['5.9', 'Inventario de información y otros activos asociados', 'Lista de activos con su dueño. Lo que no está inventariado no se puede proteger.'],
    ['5.10', 'Uso aceptable de la información y activos asociados', 'Reglas claras de qué se puede y qué no se puede hacer con los recursos de la empresa.'],
    ['5.11', 'Devolución de activos', 'Al irse o cambiar de puesto, se devuelve el portátil, la tarjeta, los documentos…'],
    ['5.12', 'Clasificación de la información', 'Etiquetar la información por su sensibilidad (pública, interna, confidencial…).'],
    ['5.13', 'Etiquetado de la información', 'Marcar físicamente o en el fichero la clasificación para que se vea.'],
    ['5.14', 'Transferencia de información', 'Reglas para enviar información dentro y fuera de forma segura (correo, USB, nube, papel).'],
    ['5.15', 'Control de acceso', 'Reglas de quién puede acceder a qué, física y lógicamente, según la necesidad.'],
    ['5.16', 'Gestión de identidades', 'Gestionar el ciclo de vida completo de las identidades (altas, cambios, bajas).'],
    ['5.17', 'Información de autenticación', 'Contraseñas y otros secretos se entregan y gestionan de forma segura.'],
    ['5.18', 'Derechos de acceso', 'Dar, revisar, cambiar y quitar permisos a tiempo (por ejemplo, el día de la baja).'],
    ['5.19', 'Seguridad de la información en las relaciones con los proveedores', 'Gestionar los riesgos que traen los proveedores.'],
    ['5.20', 'Tratamiento de la seguridad de la información en los acuerdos con proveedores', 'Las exigencias de seguridad, escritas en el contrato con cada proveedor.'],
    ['5.21', 'Gestión de la seguridad de la información en la cadena de suministro TIC', 'Controlar los riesgos de los productos y servicios TIC que compras (y de sus subproveedores).'],
    ['5.22', 'Seguimiento, revisión y gestión de cambios de los servicios de proveedores', 'Vigilar que el proveedor cumple y gestionar sus cambios.'],
    ['5.23', 'Seguridad de la información para el uso de servicios en la nube', 'Reglas para contratar, usar, gestionar y abandonar servicios en la nube.', true],
    ['5.24', 'Planificación y preparación de la gestión de incidentes', 'Tener el proceso de incidentes listo antes de que pasen: roles, procedimientos, contactos.'],
    ['5.25', 'Evaluación y decisión sobre los eventos de seguridad', 'Ante un evento, decidir si es un incidente o no.'],
    ['5.26', 'Respuesta a incidentes de seguridad de la información', 'Responder según los procedimientos documentados.'],
    ['5.27', 'Aprendizaje de los incidentes de seguridad de la información', 'Usar cada incidente para mejorar los controles (lecciones aprendidas).'],
    ['5.28', 'Recopilación de evidencias', 'Recoger y conservar evidencias de forma que valgan (por ejemplo, ante un juez).'],
    ['5.29', 'Seguridad de la información durante una interrupción', 'Mantener la seguridad aunque haya una crisis o un corte.'],
    ['5.30', 'Preparación de las TIC para la continuidad del negocio', 'Que la tecnología pueda recuperarse a tiempo para mantener el negocio vivo.', true],
    ['5.31', 'Requisitos legales, estatutarios, reglamentarios y contractuales', 'Identificar las leyes y contratos que aplican (RGPD, ENS, NIS2…) y cumplirlos.'],
    ['5.32', 'Derechos de propiedad intelectual', 'Respetar licencias de software y derechos de autor.'],
    ['5.33', 'Protección de los registros', 'Proteger los registros contra pérdida, destrucción, falsificación o acceso indebido.'],
    ['5.34', 'Privacidad y protección de datos personales', 'Cumplir con la protección de los datos personales (en España, RGPD y LOPDGDD).'],
    ['5.35', 'Revisión independiente de la seguridad de la información', 'Que alguien independiente revise periódicamente cómo se gestiona la seguridad.'],
    ['5.36', 'Cumplimiento de las políticas, reglas y normas de seguridad', 'Comprobar con regularidad que se cumple lo que dicen las políticas.'],
    ['5.37', 'Procedimientos de operación documentados', 'Las tareas de operación de los sistemas, escritas y al alcance de quien las necesite.'],
    ['6.1', 'Investigación de antecedentes', 'Comprobar a los candidatos antes de contratarlos, de forma proporcional al puesto y legal.'],
    ['6.2', 'Términos y condiciones de contratación', 'El contrato laboral recoge las responsabilidades de seguridad.'],
    ['6.3', 'Concienciación, educación y formación en seguridad de la información', 'Formar y concienciar a todo el personal, y actualizar la formación.'],
    ['6.4', 'Proceso disciplinario', 'Proceso formal y conocido para quien incumpla la política.'],
    ['6.5', 'Responsabilidades tras la finalización o cambio de empleo', 'Las obligaciones (como la confidencialidad) siguen vigentes tras irse.'],
    ['6.6', 'Acuerdos de confidencialidad o no divulgación', 'NDA firmados con empleados y terceros, revisados periódicamente.'],
    ['6.7', 'Trabajo en remoto', 'Medidas para proteger la información cuando se trabaja fuera de la oficina.'],
    ['6.8', 'Notificación de eventos de seguridad de la información', 'Un canal fácil para que cualquiera avise rápido de algo raro.'],
    ['7.1', 'Perímetros de seguridad física', 'Definir zonas protegidas (muros, vallas, puertas) para lo sensible.'],
    ['7.2', 'Controles físicos de entrada', 'Controlar quién entra en las zonas seguras (tarjetas, recepción, registro).'],
    ['7.3', 'Seguridad de oficinas, despachos e instalaciones', 'Diseñar la seguridad física de oficinas y salas.'],
    ['7.4', 'Monitorización de la seguridad física', 'Vigilar las instalaciones de forma continua (cámaras, alarmas, vigilantes).', true],
    ['7.5', 'Protección contra amenazas externas y ambientales', 'Proteger frente a incendios, inundaciones, terremotos y similares.'],
    ['7.6', 'Trabajo en áreas seguras', 'Reglas para trabajar dentro de las zonas seguras.'],
    ['7.7', 'Puesto de trabajo despejado y pantalla limpia', 'Mesa sin papeles sensibles y pantalla bloqueada al levantarse.'],
    ['7.8', 'Emplazamiento y protección de equipos', 'Colocar los equipos en sitios seguros y protegidos.'],
    ['7.9', 'Seguridad de los activos fuera de las instalaciones', 'Proteger portátiles y dispositivos fuera de la oficina (hoteles, viajes, casa).'],
    ['7.10', 'Soportes de almacenamiento', 'Gestionar discos y USB durante toda su vida: compra, uso, transporte y eliminación.'],
    ['7.11', 'Instalaciones de suministro', 'Proteger frente a cortes de luz y otros suministros (SAI, generador).'],
    ['7.12', 'Seguridad del cableado', 'Proteger los cables de datos y electricidad contra cortes, interferencias o pinchazos.'],
    ['7.13', 'Mantenimiento de los equipos', 'Mantener los equipos correctamente para que sigan disponibles e íntegros.'],
    ['7.14', 'Eliminación o reutilización segura de los equipos', 'Borrar de forma segura antes de tirar o reutilizar un equipo.'],
    ['8.1', 'Dispositivos de usuario final', 'Proteger portátiles, móviles y tabletas que usan los empleados.'],
    ['8.2', 'Derechos de acceso privilegiado', 'Las cuentas de administrador, restringidas y vigiladas.'],
    ['8.3', 'Restricción del acceso a la información', 'Cada uno accede solo a lo que necesita según la política de acceso.'],
    ['8.4', 'Acceso al código fuente', 'Controlar quién lee y modifica el código fuente.'],
    ['8.5', 'Autenticación segura', 'Mecanismos de autenticación robustos (por ejemplo, MFA) según el riesgo.'],
    ['8.6', 'Gestión de capacidades', 'Vigilar y ajustar el uso de recursos para que no se queden cortos.'],
    ['8.7', 'Protección contra el código malicioso', 'Antimalware más concienciación de los usuarios.'],
    ['8.8', 'Gestión de las vulnerabilidades técnicas', 'Conocer las vulnerabilidades, evaluarlas y parchear a tiempo.'],
    ['8.9', 'Gestión de la configuración', 'Configuraciones seguras definidas, documentadas y vigiladas (bastionado).', true],
    ['8.10', 'Eliminación de la información', 'Borrar la información cuando ya no se necesita.', true],
    ['8.11', 'Enmascaramiento de datos', 'Ocultar datos sensibles (por ejemplo, en entornos de pruebas).', true],
    ['8.12', 'Prevención de fugas de datos', 'Detectar e impedir que la información salga por donde no debe (DLP).', true],
    ['8.13', 'Copias de seguridad de la información', 'Hacer copias y probar que se pueden restaurar.'],
    ['8.14', 'Redundancia de los recursos de tratamiento de la información', 'Duplicar lo crítico para que un fallo no pare el servicio.'],
    ['8.15', 'Registro de eventos', 'Guardar y proteger registros (logs) de actividades y fallos.'],
    ['8.16', 'Actividades de seguimiento', 'Monitorizar redes y sistemas buscando comportamientos anómalos.', true],
    ['8.17', 'Sincronización del reloj', 'Todos los sistemas con la misma hora fiable (clave para investigar).'],
    ['8.18', 'Uso de programas de utilidad con privilegios', 'Restringir herramientas capaces de saltarse los controles.'],
    ['8.19', 'Instalación de software en sistemas en producción', 'Instalar software en producción de forma controlada.'],
    ['8.20', 'Seguridad de redes', 'Proteger y gestionar las redes y sus dispositivos.'],
    ['8.21', 'Seguridad de los servicios de red', 'Mecanismos y niveles de servicio de seguridad para los servicios de red.'],
    ['8.22', 'Segregación de redes', 'Separar la red en segmentos (usuarios, servidores, invitados…).'],
    ['8.23', 'Filtrado web', 'Controlar el acceso a webs externas para reducir la exposición a contenido malicioso.', true],
    ['8.24', 'Uso de la criptografía', 'Reglas para cifrar bien, incluida la gestión de claves.'],
    ['8.25', 'Ciclo de vida de desarrollo seguro', 'Reglas de seguridad para desarrollar software y sistemas.'],
    ['8.26', 'Requisitos de seguridad de las aplicaciones', 'Definir los requisitos de seguridad al desarrollar o comprar aplicaciones.'],
    ['8.27', 'Arquitectura segura de sistemas y principios de ingeniería', 'Diseñar los sistemas con principios de seguridad.'],
    ['8.28', 'Codificación segura', 'Programar con buenas prácticas de código seguro.', true],
    ['8.29', 'Pruebas de seguridad en desarrollo y aceptación', 'Probar la seguridad antes de pasar a producción.'],
    ['8.30', 'Desarrollo externalizado', 'Dirigir y vigilar el desarrollo que se encarga fuera.'],
    ['8.31', 'Separación de los entornos de desarrollo, prueba y producción', 'Desarrollo, pruebas y producción separados y protegidos.'],
    ['8.32', 'Gestión de cambios', 'Los cambios en sistemas pasan por un proceso de gestión de cambios.'],
    ['8.33', 'Información de prueba', 'Elegir, proteger y gestionar bien los datos que se usan para probar.'],
    ['8.34', 'Protección de los sistemas de información durante las pruebas de auditoría', 'Planificar las auditorías técnicas para que no dañen los sistemas en producción.']
  ],
  /* Datos de contexto que vienen de internet (marcados como web) */
  web: [
    {t: '93 controles en 4 temas, 11 nuevos', d: 'La versión 2022 pasó de 114 controles en 14 dominios (2013) a 93 controles en 4 temas: 37 organizacionales, 8 de personas, 14 físicos y 34 tecnológicos. 11 controles son nuevos.', url: 'https://www.iso.org/standard/27001', src: 'ISO.org'},
    {t: 'Fin de la transición desde la 2013', d: 'Los certificados con la versión 2013 dejaron de ser válidos el 31 de octubre de 2025. Hoy toda certificación es con la versión 2022.', url: 'https://www.iaf.nu/', src: 'IAF (documento de transición MD 26)'},
    {t: 'Enmienda de cambio climático (2024)', d: 'La enmienda ISO/IEC 27001:2022/Amd 1:2024 añade en 4.1 que la organización debe determinar si el cambio climático es una cuestión pertinente, y en 4.2 una nota: las partes interesadas pueden tener requisitos relacionados con el clima.', url: 'https://www.iso.org/standard/88435.html', src: 'ISO.org'}
  ]
};
