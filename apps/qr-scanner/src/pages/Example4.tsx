import { useEffect, useRef, useState, useCallback } from 'react'
import './Example4.css'

// BarcodeDetector API types (only available in Chromium browsers)
interface BarcodeDetectorOptions {
  formats?: string[]
}

interface DetectedBarcode {
  rawValue: string
  format: string
  boundingBox: DOMRectReadOnly
  cornerPoints: { x: number; y: number }[]
}

declare class BarcodeDetector {
  constructor(options?: BarcodeDetectorOptions)
  detect(source: ImageBitmapSource): Promise<DetectedBarcode[]>
  static getSupportedFormats(): Promise<string[]>
}

export function Example4() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number>(0)
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [supported] = useState(() => 'BarcodeDetector' in window)

  const stopScanning = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setScanning(false)
  }, [])

  const startScanning = useCallback(async () => {
    setResult(null)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      })
      streamRef.current = stream
      videoRef.current!.srcObject = stream
      await videoRef.current!.play()
      setScanning(true)

      const detector = new BarcodeDetector({ formats: ['qr_code'] })

      const detect = async () => {
        if (!videoRef.current || videoRef.current.readyState < 2) {
          rafRef.current = requestAnimationFrame(detect)
          return
        }

        try {
          const barcodes = await detector.detect(videoRef.current)
          if (barcodes.length > 0) {
            setResult(barcodes[0].rawValue)
            stopScanning()
            return
          }
        } catch {
          // detect can fail on some frames, just retry
        }

        rafRef.current = requestAnimationFrame(detect)
      }

      rafRef.current = requestAnimationFrame(detect)
    } catch (error) {
      console.error('Failed to start camera:', error)
    }
  }, [stopScanning])

  useEffect(() => {
    if (supported) {
      startScanning()
    }

    return () => {
      cancelAnimationFrame(rafRef.current)
      streamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }, [supported, startScanning])

  if (!supported) {
    return (
      <div className="scanner-page">
        <div className="scanner-header">
          <h1>Native Barcode API</h1>
          <p>
            Using{' '}
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/BarcodeDetector"
              target="_blank"
              rel="noopener noreferrer"
            >
              BarcodeDetector API
            </a>
          </p>
        </div>
        <div className="native-unsupported">
          <p>Your browser does not support the BarcodeDetector API.</p>
          <p>Try Chrome, Edge, or Opera.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="scanner-page">
      <div className="scanner-header">
        <h1>Native Barcode API</h1>
        <p>
          Using{' '}
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/API/BarcodeDetector"
            target="_blank"
            rel="noopener noreferrer"
          >
            BarcodeDetector API
          </a>
        </p>
      </div>

      <div className="scanner-container" style={{ display: result ? 'none' : undefined }}>
        <video ref={videoRef} className="native-video" playsInline muted />
      </div>

      {scanning && (
        <button type="button" className="native-btn native-btn--stop" onClick={stopScanning}>
          Stop Scanner
        </button>
      )}

      {result && (
        <div className="native-result">
          <span className="native-result-label">Detected</span>
          <p className="native-result-text">{result}</p>
          <button type="button" className="native-btn" onClick={startScanning}>
            Scan again
          </button>
        </div>
      )}
    </div>
  )
}
