import { useEffect, useRef, useState } from 'react'
import type { IScannerControls } from '@zxing/browser'
import { BrowserQRCodeReader } from '@zxing/browser'
import styles from './Example2.module.css'

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
    <div className={styles.scannerPage}>
      <div className={styles.scannerHeader}>
        <h1>ZXing Example</h1>
        <p>
          Using{' '}
          <a href="https://www.npmjs.com/package/@zxing/browser" target="_blank" rel="noopener noreferrer">
            @zxing/browser
          </a>
        </p>
      </div>

      <div className={styles.scannerContainer} style={{ display: result ? 'none' : undefined }}>
        <video ref={videoRef} className={styles.video} />
        {scanning && (
          <button type="button" className={styles.btnStop} onClick={stopScanning}>
            Stop Scanner
          </button>
        )}
      </div>

      {result && (
        <div className={styles.result}>
          <span className={styles.resultLabel}>Detected</span>
          <p className={styles.resultText}>{result}</p>
          <button type="button" className={styles.btn} onClick={startScanning}>
            Scan again
          </button>
        </div>
      )}
    </div>
  )
}
