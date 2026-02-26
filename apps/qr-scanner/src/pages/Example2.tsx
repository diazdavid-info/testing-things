import { useEffect, useRef, useState } from 'react'
import type { IScannerControls } from '@zxing/browser'
import { BrowserQRCodeReader } from '@zxing/browser'
import './Example2.css'

export function Example2() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const controlsRef = useRef<IScannerControls | null>(null)
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const stopScanning = () => {
    controlsRef.current?.stop()
    controlsRef.current = null
    setScanning(false)
  }

  const startScanning = async () => {
    setResult(null)
    setScanning(false)
    const reader = new BrowserQRCodeReader()

    try {
      controlsRef.current = await reader.decodeFromVideoDevice(undefined, videoRef.current!, (res) => {
        if (res) {
          setResult(res.getText())
          controlsRef.current?.stop()
          controlsRef.current = null
          setScanning(false)
        }
      })
      setScanning(true)
    } catch (error) {
      console.error('Failed to start scanner:', error)
    }
  }

  useEffect(() => {
    startScanning()

    return () => {
      controlsRef.current?.stop()
    }
  }, [])

  return (
    <div className="scanner-page">
      <div className="scanner-header">
        <h1>ZXing Example</h1>
        <p>
          Using{' '}
          <a href="https://www.npmjs.com/package/@zxing/browser" target="_blank" rel="noopener noreferrer">
            @zxing/browser
          </a>
        </p>
      </div>

      <div className="scanner-container" style={{ display: result ? 'none' : undefined }}>
        <video ref={videoRef} className="zxing-video" />
        {scanning && (
          <button type="button" className="zxing-btn zxing-btn--stop" onClick={stopScanning}>
            Stop Scanner
          </button>
        )}
      </div>

      {result && (
        <div className="zxing-result">
          <span className="zxing-result-label">Detected</span>
          <p className="zxing-result-text">{result}</p>
          <button type="button" className="zxing-btn" onClick={startScanning}>
            Scan again
          </button>
        </div>
      )}
    </div>
  )
}
