import { useEffect, useRef, useState } from 'react'
import './Example1.css'
import { Html5QrcodeScanner, type QrcodeSuccessCallback } from 'html5-qrcode'
import type { Html5QrcodeScannerConfig } from 'html5-qrcode/html5-qrcode-scanner'

const qrcodeRegionId = 'html5qr-code-full-region'

export function Example1() {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)
  const [result, setResult] = useState<string | null>(null)

  const startScanner = () => {
    setResult(null)

    const config: Html5QrcodeScannerConfig = {
      fps: 10,
      qrbox: 250,
      aspectRatio: 1,
      disableFlip: false,
      rememberLastUsedCamera: true,
    }

    const qrCodeSuccessCallback: QrcodeSuccessCallback = (decodedText) => {
      setResult(decodedText)
      scannerRef.current?.clear().catch((error) => {
        console.error('Failed to clear html5QrcodeScanner. ', error)
      })
      scannerRef.current = null
    }

    const scanner = new Html5QrcodeScanner(qrcodeRegionId, config, false)
    scannerRef.current = scanner
    scanner.render(qrCodeSuccessCallback, undefined)
  }

  useEffect(() => {
    startScanner()

    return () => {
      scannerRef.current?.clear().catch((error) => {
        console.error('Failed to clear html5QrcodeScanner. ', error)
      })
    }
  }, [])

  return (
    <div className="scanner-page">
      <div className="scanner-header">
        <h1>Html5-QRCode Example</h1>
        <p>
          Using{' '}
          <a href="https://www.npmjs.com/package/html5-qrcode" target="_blank" rel="noopener noreferrer">
            html5-qrcode
          </a>
        </p>
      </div>

      <div className="scanner-container" style={{ display: result ? 'none' : undefined }}>
        <div id={qrcodeRegionId} />
      </div>

      {result && (
        <div className="html5qr-result">
          <span className="html5qr-result-label">Detected</span>
          <p className="html5qr-result-text">{result}</p>
          <button type="button" className="html5qr-btn" onClick={startScanner}>
            Scan again
          </button>
        </div>
      )}
    </div>
  )
}
