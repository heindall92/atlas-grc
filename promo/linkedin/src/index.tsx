import { ArrowRight, Check, FileText, GraduationCap, House, Map, RefreshCw, Scale, ScanSearch } from 'lucide-react'
import type { ReactNode } from 'react'
import { Badge, Row, Stage, Window, type Act } from '../../kit'
import './atlas.css'

/* LinkedIn, 20s, silencio. El recorrido del caso 01 real: bajas de personal
   en Albatrel. La ventana y el cursor siguen el ejemplo de referencia; los
   casos, los pasos y el hallazgo son los de la app. */

type Scene = 'cases' | 'evidence' | 'finding' | 'report'
type S = { scene: Scene }

const initial: S = { scene: 'cases' }
const poster: S = { scene: 'report' }
const REST = { wide: { x: 1088, y: 560 }, compact: { x: 250, y: 250 } }

const STEPS = ['Encargo', 'Plan', 'Muestra', 'Evidencias', 'Entrevistas', 'Pruebas', 'Hallazgos', 'Informe'] as const

const CASES: { n: string; title: string; sub: string; target?: string }[] = [
  { n: '01', title: 'Bajas de personal', sub: '¿Se retiraron los accesos el día de la salida?', target: 'case-01' },
  { n: '02', title: 'Copias de seguridad', sub: 'Regla 3-2-1 y pruebas de restauración' },
  { n: '03', title: 'Cuentas privilegiadas', sub: 'MFA, cuentas compartidas y revisión' },
  { n: '04', title: 'Proveedores', sub: 'Quién accede a datos y con qué contrato' },
  { n: '05', title: 'Respuesta a incidentes', sub: 'Clasificar y avisar a la AEPD en 72 h' },
]

async function script(a: Act<S>) {
  await a.wait(1100)
  a.mark('cases')
  await a.move('case-01')
  await a.wait(650)
  await a.click()
  await a.wait(180)
  await a.set({ scene: 'evidence' })
  await a.wait(1500)
  a.mark('evidence')
  await a.move('ev-06')
  await a.wait(520)
  await a.click()
  await a.wait(180)
  await a.set({ scene: 'finding' })
  await a.wait(1650)
  a.mark('finding')
  await a.move('confirm')
  await a.wait(480)
  await a.click()
  await a.wait(180)
  await a.set({ scene: 'report' })
  await a.wait(820)
  a.mark('report')
  await a.move('cta')
  await a.wait(4600)
}

function Mark() {
  return (
    <svg className="aa-mark" width="28" height="28" viewBox="0 0 32 32" aria-hidden>
      <defs>
        <linearGradient id="aa-atlas" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5e5ce6" />
          <stop offset="1" stopColor="#bf5af2" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#aa-atlas)" />
      <g transform="translate(4 4)" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z" />
      </g>
    </svg>
  )
}

function NavIcon({ children }: { children: ReactNode }) {
  return <span className="aa-nav-ico">{children}</span>
}

const NAV: { label: string; icon: ReactNode; on?: boolean }[] = [
  { label: 'Hoy', icon: <House size={16} strokeWidth={1.75} /> },
  { label: 'Ruta', icon: <Map size={16} strokeWidth={1.75} /> },
  { label: 'Norma', icon: <Scale size={16} strokeWidth={1.75} /> },
  { label: 'Repaso', icon: <RefreshCw size={16} strokeWidth={1.75} /> },
  { label: 'Examen', icon: <GraduationCap size={16} strokeWidth={1.75} /> },
  { label: 'Simulador de auditoría', icon: <ScanSearch size={16} strokeWidth={1.75} />, on: true },
]

function Steps({ now }: { now: number }) {
  return (
    <div className="aa-steps" aria-hidden>
      {STEPS.map((label, i) => {
        const state = i < now ? 'done' : i === now ? 'now' : 'next'
        return (
          <div key={label} className="aa-step" data-state={state}>
            <i>{state === 'done' ? <Check size={12} strokeWidth={2.5} /> : String(i + 1)}</i>
            <span>{label}</span>
          </div>
        )
      })}
    </div>
  )
}

function Head({ kicker, title, lede }: { kicker: string; title: string; lede: string }) {
  return (
    <div className="aa-head">
      <div className="aa-kicker">{kicker}</div>
      <div className="aa-title">{title}</div>
      <div className="aa-lede">{lede}</div>
    </div>
  )
}

function Cases({ compact }: { compact: boolean }) {
  return (
    <section className="aa-panel">
      <Head kicker="Nuevo · simulador interactivo" title="Aprende a auditar. Auditando." lede="Cinco casos sobre Albatrel · ISO/IEC 27001:2022" />
      <div className="aa-card">
        <div className="aa-card-label">Selecciona un caso</div>
        {CASES.map((c) => (
          <Row
            key={c.n}
            pad={10}
            className="aa-row"
            selected={c.n === '01'}
            data-target={c.target}
            data-cursor={c.target ? 'pointer' : undefined}
            lead={<span className="aa-num">{c.n}</span>}
            title={c.title}
            subtitle={compact ? undefined : c.sub}
          >
            <ArrowRight size={16} strokeWidth={1.75} className="aa-chev" />
          </Row>
        ))}
      </div>
      {compact ? null : <div className="aa-note">Simulación educativa. Personas, cuentas y extractos son ficticios. La nota no certifica.</div>}
    </section>
  )
}

function Evidence() {
  const rows: { id: string; title: string; sub: string; badge: ReactNode; target?: string }[] = [
    { id: 'EV-02', title: 'Listado de bajas', sub: 'RR. HH. · primer semestre', badge: <Badge tone="success">Recibido</Badge> },
    { id: 'EV-04', title: 'Directorio Activo', sub: 'Cuentas de las ocho bajas', badge: <Badge tone="success">Recibido</Badge> },
    { id: 'EV-06', title: 'Consola de clínicas', sub: 'soporte.tlopez sigue activa', badge: <Badge tone="danger">Revisar</Badge>, target: 'ev-06' },
    { id: 'EV-07', title: 'Registro de excepciones', sub: 'EX-03 aprobada, con caducidad', badge: <Badge tone="neutral">Recibido</Badge> },
  ]
  return (
    <section className="aa-panel">
      <Head kicker="Caso 01 · trabajo de campo" title="Revisión de evidencias" lede="Pide solo lo que sirve para saber si el acceso se retiró a tiempo." />
      <Steps now={3} />
      <div className="aa-split">
        <div className="aa-card">
          <div className="aa-card-label">Sala de evidencias</div>
          {rows.map((r) => (
            <Row
              key={r.id}
              pad={10}
              className="aa-row"
              selected={Boolean(r.target)}
              data-target={r.target}
              data-cursor={r.target ? 'pointer' : undefined}
              lead={<FileText size={16} strokeWidth={1.75} className="aa-file" />}
              title={`${r.id} · ${r.title}`}
              subtitle={r.sub}
            >
              {r.badge}
            </Row>
          ))}
        </div>
        <aside className="aa-criteria">
          <div className="aa-card-label">Criterios</div>
          <div className="aa-crit-name">NOR-01 §2</div>
          <div className="aa-crit-sub">El mismo día de la salida</div>
          <div className="aa-pills">
            <span className="aa-pill" data-on>Anexo A 5.18</span>
            <span className="aa-pill">Anexo A 6.5</span>
            <span className="aa-pill">Anexo A 8.2</span>
          </div>
        </aside>
      </div>
    </section>
  )
}

function Finding() {
  return (
    <section className="aa-panel">
      <Head kicker="Caso 01 · análisis" title="De la evidencia al hallazgo" lede="La cuenta de la consola no se retiró. El papel decía que sí." />
      <Steps now={6} />
      <div className="aa-card aa-draft">
        <div className="aa-draft-top">
          <div className="aa-card-label">Borrador de hallazgo</div>
          <Badge tone="danger">No conformidad</Badge>
        </div>
        <div className="aa-field">
          <div className="aa-field-k">Afecta a</div>
          <div className="aa-field-v">B-04 · Técnico de soporte a clínicas</div>
        </div>
        <div className="aa-field">
          <div className="aa-field-k">Criterio</div>
          <div className="aa-field-v">NOR-01 §2 · Anexo A 5.18</div>
        </div>
        <div className="aa-field">
          <div className="aa-field-k">Condición observada</div>
          <div className="aa-field-v">Salió el 27/03. soporte.tlopez sigue activa.</div>
        </div>
        <div className="aa-confirm" data-target="confirm" data-cursor="pointer" role="button">
          <Check size={15} strokeWidth={2.25} />
          <span>Documentar criterio, condición y evidencia</span>
        </div>
      </div>
    </section>
  )
}

function Report() {
  const parts = ['Planificación', 'Selección de pruebas', 'Análisis', 'Hallazgos', 'Informe']
  return (
    <section className="aa-panel">
      <Head kicker="Atlas GRC · simulador de auditoría" title="Del conocimiento a la práctica." lede="Planifica, muestrea, contrasta y redacta. Luego ves la solución." />
      <Steps now={7} />
      <div className="aa-card aa-journey">
        <div className="aa-card-label">Cinco competencias</div>
        <div className="aa-tiles">
          {parts.map((name, i) => (
            <div key={name} className="aa-tile">
              <span className="aa-tile-n">{String(i + 1).padStart(2, '0')}</span>
              <span className="aa-tile-l">{name}</span>
            </div>
          ))}
        </div>
        <div className="aa-nc">
          <Badge tone="danger">No conformidad</Badge>
          <span>B-04 · la consola de clínicas sigue activa</span>
        </div>
        <div className="aa-cta" data-target="cta" data-cursor="pointer" role="button">
          <span>Abrir el simulador</span>
          <ArrowRight size={16} strokeWidth={1.75} />
        </div>
      </div>
    </section>
  )
}

function sceneOf(scene: Scene, compact: boolean): ReactNode {
  switch (scene) {
    case 'cases':
      return <Cases compact={compact} />
    case 'evidence':
      return <Evidence />
    case 'finding':
      return <Finding />
    case 'report':
      return <Report />
    default: {
      const never: never = scene
      return never
    }
  }
}

export default function AtlasAudit() {
  return (
    <Stage
      width={1280}
      height={800}
      compact={{ below: 1000, width: 390, height: 340 }}
      theme="light"
      greys="cool"
      fidelity="realistic"
      accent="#5e5ce6"
      tokens={{ '--ss-accent-text': '#3c3ab8', '--ss-radius-window': '18px', '--ss-radius-lg': '16px' }}
      play="once"
      initial={initial}
      poster={poster}
      script={script}
      cursor={{ at: REST, ripple: true, idle: false }}
      className="aa"
    >
      {(s, _rect, layout) => (
        <>
          <Window url="heindall92.github.io/atlas-grc" urlShape="pill" className="aa-window">
            <div className="aa-shell">
              <aside className="aa-side">
                <div className="aa-brand">
                  <Mark />
                  <div>
                    <div className="aa-word">Atlas GRC</div>
                    <div className="aa-tag">Estudio personal</div>
                  </div>
                </div>
                <nav className="aa-nav">
                  {NAV.map((item) => (
                    <div key={item.label} className="aa-nav-item" data-on={item.on || undefined}>
                      <NavIcon>{item.icon}</NavIcon>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </nav>
                <div className="aa-side-foot">
                  <div className="aa-kicker">Entorno educativo</div>
                  <div className="aa-foot-line">Casos y evidencias ficticios</div>
                  <div className="aa-foot-line">v0.7 beta</div>
                </div>
              </aside>
              <div className="aa-view" data-crop>
                <div className="aa-track" data-scene={s.scene}>
                  {(['cases', 'evidence', 'finding', 'report'] as const).map((scene) => (
                    <div key={scene} className="aa-slot">
                      {sceneOf(scene, layout === 'compact')}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Window>
          <div className="aa-progress" data-scene={s.scene} />
        </>
      )}
    </Stage>
  )
}
