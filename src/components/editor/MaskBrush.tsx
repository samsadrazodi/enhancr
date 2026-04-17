"use client"

import { useRef, useEffect, useState } from "react"

interface MaskBrushProps {
  imageBase64: string
  onMaskReady: (maskBlob: Blob) => void
  onCancel: () => void
}

export function MaskBrush({ imageBase64, onMaskReady, onCancel }: MaskBrushProps) {
  const bgCanvasRef = useRef<HTMLCanvasElement>(null)
  const maskCanvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [brushSize, setBrushSize] = useState(20)

  useEffect(() => {
    const bgCanvas = bgCanvasRef.current
    if (!bgCanvas) return

    const ctx = bgCanvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.src = `data:image/png;base64,${imageBase64}`

    img.onload = () => {
      bgCanvas.width = img.width
      bgCanvas.height = img.height

      const maskCanvas = maskCanvasRef.current
      if (maskCanvas) {
        maskCanvas.width = img.width
        maskCanvas.height = img.height
      }

      ctx.drawImage(img, 0, 0)
    }
  }, [imageBase64])

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    paint(e)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    paint(e)
  }

  const handleMouseUp = () => {
    setIsDrawing(false)
  }

  const paint = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const maskCanvas = maskCanvasRef.current
    if (!maskCanvas) return

    const rect = maskCanvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const ctx = maskCanvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = "rgba(220, 53, 69, 0.5)"
    ctx.beginPath()
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2)
    ctx.fill()
  }

  const handleDone = () => {
    const maskCanvas = maskCanvasRef.current
    if (!maskCanvas) return

    const ctx = maskCanvas.getContext("2d")
    if (!ctx) return

    const imageData = ctx.getImageData(0, 0, maskCanvas.width, maskCanvas.height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3]
      if (a > 128) {
        data[i] = 255
        data[i + 1] = 255
        data[i + 2] = 255
        data[i + 3] = 255
      } else {
        data[i] = 0
        data[i + 1] = 0
        data[i + 2] = 0
        data[i + 3] = 255
      }
    }

    ctx.putImageData(imageData, 0, 0)

    maskCanvas.toBlob((blob) => {
      if (blob) {
        onMaskReady(blob)
      }
    }, "image/png")
  }

  const handleClear = () => {
    const maskCanvas = maskCanvasRef.current
    if (!maskCanvas) return

    const ctx = maskCanvas.getContext("2d")
    if (ctx) {
      ctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Paint the region to remove</h2>

        <div className="relative mb-4 border border-stone-300 rounded overflow-auto max-h-96 bg-charcoal-900 bg-opacity-5">
          <canvas
            ref={bgCanvasRef}
            className="absolute inset-0"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
          <canvas
            ref={maskCanvasRef}
            className="absolute inset-0 cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Brush Size: {brushSize}px</label>
          <input
            type="range"
            min="5"
            max="100"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleClear}
            className="flex-1 py-2 bg-stone-300 text-charcoal-900 rounded font-medium hover:bg-stone-400 transition"
          >
            Clear Mask
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-2 bg-stone-600 text-cream-50 rounded font-medium hover:bg-stone-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleDone}
            className="flex-1 py-2 bg-gold-600 text-charcoal-900 rounded font-medium hover:bg-gold-700 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
