const interviews = [
  {
    title: 'Goncy × Lucas — React live coding',
    href: '/interviews/goncy-lucas',
    description:
      'Formularios, estado como snapshot, valores derivados, useEffect e historial con deshacer.',
  },
]

export function HomePage() {
  return (
    <div className={styles.appShell}>
      <nav aria-label="Navegación principal">
        <Link className={styles.brand} to="/" aria-label="Technical interviews, inicio">
          <span aria-hidden="true">&gt;_</span>
          tech.interviews
        </Link>
        <span className={styles.systemStatus}><i aria-hidden="true" /> system ready</span>
      </nav>

      <main>
        <header className={styles.hero}>
          <div className={styles.lineNumber} aria-hidden="true">01</div>
          <div>
            <span className={styles.eyebrow}>// interview workspace</span>
            <h1>Technical<br /><strong>Interviews</strong></h1>
            <p>Ejercicios, retos y recursos para preparar entrevistas técnicas. Todo el material, organizado en un único workspace.</p>
            <div className={styles.stack} aria-label="Tecnologías utilizadas">
              <span>React</span><span>TypeScript</span><span>Algorithms</span><span>System Design</span>
            </div>
          </div>
        </header>

        <section aria-labelledby="interviews-title">
          <div className={styles.sectionHeading}>
            <div><span aria-hidden="true">02</span><h2 id="interviews-title">./interviews</h2></div>
            <span>{String(interviews.length).padStart(2, '0')} entries</span>
          </div>
          <ul className={styles.interviewList}>
            {interviews.map((interview, index) => (
              <li key={interview.href}>
                <Link to={interview.href}>
                  <span className={styles.itemIndex}>{String(index + 1).padStart(2, '0')}</span>
                  <div><h3>{interview.title}</h3><p>{interview.description}</p></div>
                  <span className={styles.arrow} aria-hidden="true">↗</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <footer><span>localhost:5173</span><span>UTF-8 · TSX</span></footer>
    </div>
  )
}
import { Link } from 'react-router-dom'

import styles from './HomePage.module.css'
