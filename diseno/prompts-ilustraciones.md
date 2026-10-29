# Atlas GRC · Prompts de ilustraciones

Para pasarlos tal cual al generador de imágenes. Van en inglés porque los generadores responden mejor, con una nota en español de qué es cada una.

## Reglas para TODAS las imágenes (pégalas al principio de cada prompt)

```
STYLE GUIDE (apply to every image):
Soft 3D illustration, Apple-like product art: smooth clay/glass materials, gentle studio lighting,
soft long shadows, subtle grain. Calm, premium, optimistic, educational (cybersecurity governance).
Palette: indigo #5E5CE6, violet #BF5AF2, electric blue #0A84FF, with small accents of warm coral #F2545B
and white. Rounded shapes, no sharp aggressive elements, no hackers in hoodies, no skulls, no padlocks
dripping code, no matrix rain.
Composition: one clear hero object, generous negative space, centered or slightly right-weighted.
NO text, NO letters, NO numbers, NO logos, NO brand marks, NO ISO logo, NO flags.
Consistent recurring motif: a small elegant compass (round, thin ring, diamond-shaped needle) appears
somewhere in every image as the brand mascot.
```

## Especificaciones técnicas

| Uso | Tamaño | Formato | Nombre del fichero |
|---|---|---|---|
| Cabecera de bloque (idea 1) | 1600 × 1000 px (16:10) | PNG con fondo transparente o WebP | `bloque-N-cabecera.webp` |
| Portada del carrusel (idea 3) | 900 × 1200 px (3:4) | WebP, fondo de color pleno | `bloque-N-portada.webp` |
| Bienvenida (idea 4) | 1400 × 1600 px (7:8) | WebP | `bienvenida.webp` |

Cuando las tengas, guárdalas en `app/img/` y yo las conecto. Si el generador solo da una versión, mejor la de fondo transparente: con ella puedo hacer las dos.

---

## Prompt 1 · Bienvenida (persona estudiando con la brújula)
*Para la pantalla de bienvenida en 3 pasos. Inspirada en la imagen del chico con el portátil.*

```
[STYLE GUIDE]
A young adult learner (gender-neutral, friendly, casual dark hoodie, sneakers) sitting relaxed in a
lounge chair by a large window at dusk, laptop on lap, studying. Floating around them, translucent
glass UI cards: a checklist, a small risk heat-map grid, a document with a check mark, a shield.
Above the laptop, a softly glowing holographic compass (brand mascot) with its needle pointing up.
Background: modern apartment, city skyline at golden-violet dusk, indoor plants, warm lamp.
Mood: focused, calm, motivated. Leave the RIGHT 45% of the image visually quiet (soft sky and wall)
because a white sign-up card will be placed there.
```

## Prompt 2 · Bloque 0 · Fundamentos
*Qué es GRC, familia ISO 27000, SGSI y PDCA.*

```
[STYLE GUIDE]
Three smooth pillars of different heights (representing Governance, Risk and Compliance, no labels)
supporting a floating rounded platform. On the platform, a circular loop of four soft arrows forming
a continuous cycle (Plan-Do-Check-Act, no letters). The brand compass rests at the base of the
pillars like a cornerstone. Clean indigo-to-blue gradient environment.
```

## Prompt 3 · Bloque 1 · Contexto y liderazgo (cláusulas 4 y 5)
*La organización y su entorno, partes interesadas, alcance y liderazgo.*

```
[STYLE GUIDE]
A miniature isometric small-town scene on a floating island: a modern office building in the center,
a town hall, a small dental clinic, a data center, connected by glowing thin paths. A soft dashed
circle drawn around part of the island (the scope boundary). Tiny friendly figures stand at the paths
(stakeholders). On the office roof, a person holding a small flag (leadership). The brand compass floats
above the island like a sun.
```

## Prompt 4 · Bloque 2 · Riesgos con MAGERIT (cláusula 6)
*Evaluar y tratar riesgos, la SoA y el plan de tratamiento.*

```
[STYLE GUIDE]
An elegant balance scale in soft clay: on one plate a small cloud with a lightning bolt (threat),
on the other a shield (safeguard). Behind it, a large translucent 5x5 grid tilted in perspective with
cells fading from green to amber to coral-red (risk heat map, no numbers). A short checklist card
leaning against the scale (Statement of Applicability). The brand compass lies on the base of the scale.
```

## Prompt 5 · Bloque 3 · Soporte y documentos (cláusula 7)
*Recursos, competencia, concienciación, comunicación e información documentada.*

```
[STYLE GUIDE]
A neat stack of soft rounded document folders forming a small pyramid (policy on top, procedures in the
middle, records at the base), each with a subtle check mark seal. Beside it, a graduation cap, a speech
bubble and a small megaphone (training, awareness, communication). Floating version tags as tiny
pills (no text). The brand compass sits on top of the pyramid.
```

## Prompt 6 · Bloque 4 · Operación (cláusula 8)
```
[STYLE GUIDE]
A calm control room desk seen from the side: interlocking soft gears turning smoothly, a conveyor of
small cubes passing through a glowing gate (operational control), a clipboard with a plan. Gentle,
orderly, no alarms. The brand compass is engraved on the largest gear.
```

## Prompt 7 · Bloque 5 · Métricas y auditoría (cláusula 9)
```
[STYLE GUIDE]
A large friendly magnifying glass over a floating dashboard with rounded bar charts and a ring gauge
(no numbers), next to a clipboard with checkboxes (internal audit) and a small round meeting table with
three chairs (management review). The brand compass is reflected in the magnifying lens.
```

## Prompt 8 · Bloque 6 · Mejora (cláusula 10)
```
[STYLE GUIDE]
A soft spiral staircase rising upwards and getting brighter at each step (continuous improvement),
with a small wrench and a bandage icon on the lower steps (fixing nonconformities) and a glowing
star at the top. The brand compass floats beside the top step.
```

## Prompt 9 · Bloque 7 · Controles organizacionales (Anexo A · 5)
```
[STYLE GUIDE]
A modern glass building cut open like a dollhouse, showing tidy rooms: a policy book on a desk, an
inventory shelf with labeled boxes (no text), a handshake between two figures (suppliers), a cloud
hovering above (cloud services). The brand compass is on the building's front door.
```

## Prompt 10 · Bloque 8 · Controles de personas y físicos (Anexo A · 6 y 7)
```
[STYLE GUIDE]
Split composition: left, three friendly diverse office workers with ID badges and a small training
screen; right, a secure door with a badge reader, a camera dome and a tidy clean desk with a locked
screen. Warm and human, not intimidating. The brand compass hangs as a pendant on one badge.
```

## Prompt 11 · Bloque 9 · Controles tecnológicos (Anexo A · 8)
```
[STYLE GUIDE]
A sleek server rack and a laptop connected by glowing network lines through a translucent shield
dome; small floating elements: a key (cryptography), a backup cylinder with a circular arrow,
a fingerprint (authentication), a radar ring (monitoring). Clean, futuristic but soft.
The brand compass is the emblem on the shield dome.
```

## Prompt 12 · Bloque 10 · Auditoría y certificación
```
[STYLE GUIDE]
A rounded certificate scroll with a soft ribbon seal (no text) resting on a podium, a medal next to it,
and a small path of footprints leading up the podium steps (the road to certification).
Confetti in indigo, violet and coral. The brand compass is embossed on the medal.
```

---

### Variante coral (opcional)
Si quieres las mismas imágenes para el tema coral, añade al final de cualquier prompt:

```
Color variant: replace indigo/violet with warm coral #F2545B, peach #FF9A76 and cream white #FBF8F6,
keep electric blue only as a tiny accent.
```
