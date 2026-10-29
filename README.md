# Atlas GRC

**Laboratorio interactivo para aprender GRC desde cero, empezando por la ISO/IEC 27001:2022.** Contenido propio, sin internet y sin cuentas.

## Cómo se abre
1. Doble clic en `Iniciar.bat` (hace falta Python).
2. Se abre `http://127.0.0.1:8643`. Deja la ventana negra abierta mientras estudias.

El progreso se guarda solo en tu navegador (en Ajustes puedes guardar y restaurar una copia).

## Qué hay
| | |
|---|---|
| **Bienvenida** | Tres preguntas (objetivo, nivel y minutos al día) que arman tu plan: desde qué bloque empiezas y tu meta diaria. Se puede rehacer en Ajustes. |
| **Hoy** | Siguiente paso recomendado, anillos de actividad, accesos rápidos redondos y carrusel de bloques. |
| **Bloques** | Cada bloque tiene su página con cabecera grande, progreso y unidades. |
| **Ruta** | Bloque 0 · Fundamentos (5 unidades), Bloque 1 · Cláusulas 4 y 5 (4 unidades) Bloque 2 · Cláusula 6: riesgos con MAGERIT, SoA, plan de tratamiento y objetivos (4 unidades) Bloque 3 · Cláusula 7: soporte y documentación (4 unidades) y Bloque 4 · Cláusula 8: operación, cambios, proveedores y riesgos en el día a día (4 unidades). Bloques 5-10 en camino. |
| **Unidad** | Lección en tarjetas cortas con preguntas rápidas → prácticas (bandera azul 70 %, dorada 100 %) → jefe (3 vidas, 30 s). |
| **Ejercicios** | Elegir, verdadero/falso, emparejar, ordenar y clasificar. Corrección en una hoja inferior con explicación y enlace «Doc, pág. N». |
| **Mapa de la norma** | Cláusulas 4-10 por el ciclo PDCA y los 93 controles del Anexo A, cada uno explicado en sencillo y marcable como «entendido». |
| **Repaso** | Glosario con repaso espaciado (1, 3, 7, 14, 30 días) y «Mis errores» (vuelven a los 1, 3 y 7 días). |
| **Simulacro** | Formato CertiProf (40 preguntas, 60 min) con 216 preguntas propias. Con el pack privado se suma el examen de práctica del curso. |
| **Caso Albatrel** | Empresa inventada (no es el caso del curso) con su SGSI completo en **14 documentos propios**: política, contexto y alcance, roles y RACI, metodología de riesgos, registro de 10 riesgos, Declaración de Aplicabilidad de los 93 controles con justificación, plan de tratamiento, objetivos, plan de formación y comunicación, 3 normativas y 2 procedimientos. Cada uno se puede leer, descargar en Markdown y **construir paso a paso** con ejercicios. |
| **Biblioteca** | Recursos oficiales y gratuitos (ISO, CertiProf, INCIBE, MAGERIT, CCN, BOE). Con el pack privado, también tus PDF del curso. |

## Contenido y derechos de autor
- **Todo el contenido de la app es propio**: lecciones, ejercicios, explicaciones de los 93 controles, simulacro y el caso **Albatrel** (empresa inventada).
- Las **citas** indican de dónde sale cada idea (curso, norma o fuente web) para poder ampliarla, pero no copian su texto.
- De la ISO/IEC 27001 solo se usan los **números y títulos** de cláusulas y controles, como referencia. El texto de la norma no se reproduce: consulta tu ejemplar (ISO o UNE).
- Lo que sale de internet va marcado como **«Fuente web»** con su enlace.
- Inspirado en las clases de GRC del profesor **Ezequiel Wolf**.

### Pack privado (opcional, solo en tu ordenador)
Si tienes el material de un curso, puedes conectarlo en local sin subirlo nunca:
- `app/data/private/pack.js`: rutas a tus PDF y Word (las citas pasan a ser enlaces a la página exacta) y la biblioteca del curso.
- `app/data/private/examen-ezequiel.js`: examen de práctica del curso, que se suma al simulacro.
- `tools/extraer.py` pasa el material a texto con MarkItDown en `sources/md/`.

Las tres rutas (`app/data/private/`, `sources/` y `_version-grok/`) están en `.gitignore`.

## Diseño
Dos temas de color: índigo y coral (en Ajustes), cada uno con modo claro y oscuro. Ilustraciones opcionales en `app/img/`. Logo: una brújula de Lucide cuya aguja busca el norte y oscila. Iconos: solo Lucide, sin emojis. Lenguaje visual propio de inspiración Apple (no es el de LemonByte) y movimiento según Emil Kowalski: curvas ease-out, escala 0,97 al pulsar, avisos apilados tipo Sonner, hojas arrastrables tipo Vaul, pestañas con pastilla deslizante, View Transitions entre pantallas, «mantener para confirmar», contador que rueda y respeto a «reducir movimiento». Sin dependencias ni internet.

## Estructura
- `app/index.html`, `app/css/atlas.css`
- `app/js/`: `store.js` (progreso), `motion.js` (interfaz y movimiento), `exercises.js`, `player.js`, `views.js`, `docs.js` (documentos de Albatrel), `app.js`, `icons.js` (Lucide, ISC)
- `app/data/tracks.js`: registro de normas. **Para añadir ENS u otra ISO**: crea `app/data/<id>/content.js` con el mismo formato que `iso27001`, ponla como `activo` y añade sus `<script>` en `index.html`.
- `app/data/iso27001/`: `content.js` (bloques 0 y 1, glosario, caso, biblioteca), `bloque2.js` (cláusula 6), `bloque3.js` (cláusula 7), `bloque4.js` (cláusula 8), `albatrel.js` (los 14 documentos del caso, riesgos, SoA y plan de tratamiento) y `norma.js` (cláusulas y controles). Cada bloque nuevo va en su propio fichero `bloqueN.js`.
- `tools/extraer.py`: pasa todo el material a Markdown con [MarkItDown](https://github.com/microsoft/markitdown) en `sources/md/` (los PDF página a página).
- `_version-grok/`: la versión anterior, guardada por si acaso.

Autor: **Yoandy Ramírez Delgado**
