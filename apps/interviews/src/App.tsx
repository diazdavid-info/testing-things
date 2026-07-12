type Interview = {
  title: string
  href: string
  description: string
}

const interviews: Interview[] = []

export function App() {
  return (
    <div className="app-shell">
      <nav aria-label="Navegación principal">
        <a className="brand" href="/" aria-label="Technical interviews, inicio">
          <span aria-hidden="true">&gt;_</span>
          tech.interviews
        </a>
        <span className="system-status"><i aria-hidden="true" /> system ready</span>
      </nav>

      <main>
        <header className="hero">
          <div className="line-number" aria-hidden="true">01</div>
          <div>
            <span className="eyebrow">// interview workspace</span>
            <h1>Technical<br /><strong>Interviews</strong></h1>
            <p>
              Ejercicios, retos y recursos para preparar entrevistas técnicas. Todo el material,
              organizado en un único workspace.
            </p>
            <div className="stack" aria-label="Tecnologías utilizadas">
              <span>React</span><span>TypeScript</span><span>Algorithms</span><span>System Design</span>
            </div>
          </div>
        </header>

        <section aria-labelledby="interviews-title">
          <div className="section-heading">
            <div>
              <span aria-hidden="true">02</span>
              <h2 id="interviews-title">./interviews</h2>
            </div>
            <span>{String(interviews.length).padStart(2, '0')} entries</span>
          </div>

          {interviews.length > 0 ? (
            <ul className="interview-list">
              {interviews.map((interview, index) => (
                <li key={interview.href}>
                  <a href={interview.href}>
                    <span className="item-index">{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <h3>{interview.title}</h3>
                      <p>{interview.description}</p>
                    </div>
                    <span className="arrow" aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <div className="terminal-bar" aria-hidden="true">
                <span /><span /><span />
                <p>workspace — bash</p>
              </div>
              <div className="terminal-body">
                <p><span className="prompt">$</span> ls ./interviews</p>
                <p className="output">Directory is empty.</p>
                <p><span className="prompt">$</span> <span className="cursor" aria-hidden="true" /></p>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer><span>localhost:5173</span><span>UTF-8 · TSX</span></footer>
    </div>
  )
}
