import { Link } from 'react-router-dom'

import { DirectoryLab } from './DirectoryLab.tsx'
import { InterviewVideo } from './InterviewVideo.tsx'
import { derivedValueExample, duplicatedStateExample, lessons } from './interview-content.ts'
import styles from './GoncyLucasPage.module.css'

export function GoncyLucasPage() {
  return (
    <div className={styles.page}>
      <nav>
        <Link className={styles.brand} to="/">&gt;_ tech.interviews</Link>
        <div>
          <a href="#aprendizajes">Apuntes</a>
          <a href="#laboratorio">Demo</a>
          <a href="#video">Vídeo</a>
        </div>
      </nav>

      <main id="inicio">
        <header className={styles.interviewHero}>
          <div className={styles.heroMeta}><span>ENTREVISTA #001</span><span>REACT · LIVE CODING</span></div>
          <h1>Lucas<br /><em>en el render.</em></h1>
          <div className={styles.heroBottom}>
            <p>Una entrevista técnica con <strong>Goncy</strong> sobre formularios, snapshots, historial y el lugar exacto donde debe vivir cada cálculo.</p>
            <div className={styles.quote}>“¿Y por qué no<br />en el render?”<span>— Goncy, 26:02</span></div>
          </div>
        </header>

        <section className={styles.thesis}>
          <span>LA IDEA CENTRAL</span>
          <p>El estado es la <em>información mínima</em> que cambia. Todo lo que pueda deducirse de ella es una <em>expresión</em>, no un segundo estado.</p>
        </section>

        <section id="aprendizajes" className={styles.lessons}>
          <div className={styles.sectionTitle}><span>NOTAS DE CAMPO</span><h2>Lo que revela<br />el ejercicio</h2></div>
          <div>
            {lessons.map((lesson) => (
              <article key={lesson.number}>
                <span>{lesson.number}</span><h3>{lesson.title}</h3><p>{lesson.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.comparison}>
          <div className={styles.comparisonHead}><span>DECISIÓN DE DISEÑO</span><h2>¿Estado, cálculo<br />o efecto?</h2></div>
          <CodeCard className="bad" label="✕ DOS FUENTES DE VERDAD" verdict="evitar" code={duplicatedStateExample}>
            Renderiza primero con un valor obsoleto, ejecuta el efecto y vuelve a renderizar. Además obliga a mantener la sincronización manualmente.
          </CodeCard>
          <CodeCard className="good" label="✓ UNA SOLA VERDAD" verdict="preferir" code={derivedValueExample}>
            El valor siempre corresponde a este render. No hay estado duplicado, efecto ni render adicional. useMemo optimiza; no corrige la lógica.
          </CodeCard>
        </section>

        <DirectoryLab />
        <EffectChecklist />
        <InterviewVideo />
      </main>

      <footer><span>Entrevistador · Goncy</span><span>Entrevistado · Lucas</span><a href="#inicio">Volver arriba ↑</a></footer>
    </div>
  )
}

type CodeCardProps = {
  children: React.ReactNode
  className: string
  code: string
  label: string
  verdict: string
}

function CodeCard({ children, className, code, label, verdict }: CodeCardProps) {
  return (
    <div className={`${styles.codeCard} ${styles[className]}`}>
      <header><span>{label}</span><b>{verdict}</b></header>
      <pre>{code}</pre>
      <p>{children}</p>
    </div>
  )
}

function EffectChecklist() {
  return (
    <section className={styles.effectRule}>
      <div><span>LA REGLA PRÁCTICA</span><h2>Antes de escribir<br /><code>useEffect</code>…</h2></div>
      <ol>
        <li><b>01</b><p>¿Puedo calcularlo durante el render?</p><span>Hazlo ahí.</span></li>
        <li><b>02</b><p>¿Ocurre por una acción del usuario?</p><span>Hazlo en el handler.</span></li>
        <li><b>03</b><p>¿Sincroniza con navegador, red o librería externa?</p><span>Entonces sí: effect + cleanup.</span></li>
      </ol>
    </section>
  )
}
