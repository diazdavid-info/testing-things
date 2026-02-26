import { useState } from 'react'
import { Scanner } from '@yudiel/react-qr-scanner'
import './Example3.css'

export function Example3() {
  const [result, setResult] = useState<string | null>(null)
  const [paused, setPaused] = useState(false)

  const handleScan = (detectedCodes: { rawValue: string }[]) => {
    if (detectedCodes.length > 0) {
      setResult(detectedCodes[0].rawValue)
      setPaused(true)
    }
  }

  const handleScanAgain = () => {
    setResult(null)
    setPaused(false)
  }

  return (
    <div className="scanner-page">
      <div className="scanner-header">
        <h1>React QR Scanner Example</h1>
        <p>
          Using{' '}
          <a href="https://www.npmjs.com/package/@yudiel/react-qr-scanner" target="_blank" rel="noopener noreferrer">
            @yudiel/react-qr-scanner
          </a>
        </p>
      </div>

      <div className="scanner-container" style={{ display: result ? 'none' : undefined }}>
        <Scanner paused={paused} onScan={handleScan} onError={(error) => console.error(error)} sound={false} />
      </div>

      {!result && (
        <button type="button" className="yudiel-btn yudiel-btn--stop" onClick={() => setPaused(!paused)}>
          {paused ? 'Resume Scanner' : 'Stop Scanner'}
        </button>
      )}

      {result && (
        <div className="yudiel-result">
          <span className="yudiel-result-label">Detected</span>
          <p className="yudiel-result-text">{result}</p>
          <button type="button" className="yudiel-btn" onClick={handleScanAgain}>
            Scan again
          </button>
        </div>
      )}
    </div>
  )
}
