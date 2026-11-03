# Rehearsal — simulador de auditoría para LinkedIn

Pieza de 18 s, 1280×800, en silencio, para el post. El relato es el caso 01 real de Atlas GRC: bajas de personal en Albatrel. El cursor abre el caso, revisa la evidencia EV-06 (la consola de clínicas), documenta la no conformidad y se queda en el cierre.

## Qué se copió

La estructura de `examples/hero-demo`: `Stage`, un script con `move` y `click`, `Window`, objetivos `data-target` y el cursor del kit. El contenido y el encuadre salen del ejemplo que se pidió (ventana con semáforo, barra lateral, barra de avance) y de la app (malva `#5e5ce6`, cinco casos, ocho pasos, hallazgo B-04, aviso de simulación educativa).

## Encuadre

La ventana va entera, con el mismo margen en los cuatro lados, porque el ejemplo de referencia es así. El gate de fotograma en 1280 y en 390 no marcó encuadre. En 390 la barra lateral desaparece y la ventana sangra por abajo.

## Comprobación

- Fotogramas de apertura, evidencias, hallazgo e informe, y el diseño estrecho: `rehearsal passed`.
- El recorrido completo no cortó texto. El fundido es en dos tiempos (sale una pantalla y entra la siguiente) para que no se lean dos textos a la vez.
- `play="once"`: LinkedIn no rebobina, y un bucle hacia atrás rompería el relato. El plano final se sostiene.

## Cómo regenerarlo

Los fuentes están en `src/`. Van dentro de `stageshow/examples/atlas-audit/` del kit de Benji Taylor, con el import `../../kit`. Desde esa carpeta: `npx vite playground --config playground/vite.config.ts --host 127.0.0.1 --port 5173` y abrir `/?capture=atlas-audit`.

## Supuestos

- El acento es el malva de Atlas, no el coral del ejemplo. La barra de avance conserva el coral del ejemplo, como línea de tiempo del vídeo.
- La barra lateral reúne la navegación real (Hoy, Ruta, Norma, Repaso, Examen, Simulador). En la app esa navegación está arriba.
- No hay música: el post se entiende sin sonido.
