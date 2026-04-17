"use client"

import { useRef, useEffect, useState } from "react"

interface CanvasEditorProps {
  imageBase64: string
  onDownload: (canvas: HTMLCanvasElement) => void
}

export function CanvasEditor({ imageBase64, onDownload }: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cropMode, setCropMode] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [cropStart, setCropStart] = useState({ x: 0, y: 0 })
  const [cropEnd, setCropEnd] = useState({ x: 0, y: 0 })
  const [isDrawingCrop, setIsDrawingCrop] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.src = `data:image/png;base64,${imageBase64}`

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height

      ctx.save()
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.drawImage(img, -img.width / 2, -img.height / 2)
      ctx.restore()

      if (cropMode && (cropEnd.x !== 0 || cropEnd.y !== 0)) {
        ctx.strokeStyle = "#d4a574"
        ctx.lineWidth = 2
        ctx.strokeRect(
          Math.min(cropStart.x, cropEnd.x),
          Math.min(cropStart.y, cropEnd.y),
          Math.abs(cropEnd.x - cropStart.x),
          Math.abs(cropEnd.y - cropStart.y)
        )
      }
    }
  }, [imageBase64, rotation, cropMode, cropStart, cropEnd])

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!cropMode) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    setCropStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
    setIsDrawingCrop(true)
  }

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingCrop || !cropMode) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    setCropEnd({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const handleCanvasMouseUp = () => {
    setIsDrawingCrop(false)
  }

  const applyCrop = () => {
    const canvas = canvasRef.current
    if (!canvas || !cropMode) return

    const x = Math.min(cropStart.x, cropEnd.x)
    const y = Math.min(cropStart.y, cropEnd.y)
    const width = Math.abs(cropEnd.x - cropStart.x)
    const height = Math.abs(cropEnd.y - cropStart.y)

    if (width === 0 || height === 0) return

    const croppedCanvas = document.createElement("canvas")
    croppedCanvas.width = width
    croppedCanvas.height = height

    const ctx = croppedCanvas.getContext("2d")
    const sourceCtx = canvas.getContext("2d")

    if (!ctx || !sourceCtx) return

    const imageData = sourceCtx.getImageData(x, y, width, height)
    ctx.putImageData(imageData, 0, 0)

    const newCanvas = document.createElement("canvas")
    newCanvas.width = croppedCanvas.width
    newCanvas.height = croppedCanvas.height

    const newCtx = newCanvas.getContext("2d")
    if (newCtx) {
      newCtx.drawImage(croppedCanvas, 0, 0)
    }

    setCropMode(false)
    setCropEnd({ x: 0, y: 0 })
  }

  return (
    <div className="space-y-4">
      <div className="border border-stone-300 rounded overflow-auto max-h-96 bg-charcoal-900 bg-opacity-5">
        <canvas
          ref={canvasRef}
          className="mx-auto cursor-crosshair"
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
        />
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-2">Rotation</label>
          <input
            type="range"
            min="-180"
            max="180"
            value={rotation}
            onChange={(e) => setRotation(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-stone-500 mt-1">{rotation}°</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setCropMode(!cropMode)}
            className={`flex-1 py-2 rounded font-medium transition ${
              cropMode
                ? "bg-gold-600 text-charcoal-900"
                : "bg-stone-300 text-charcoal-900 hover:bg-stone-400"
            }`}
          >
            {cropMode ? "Crop Mode ON" : "Crop Mode OFF"}
          </button>

          {cropMode && (
            <button
              onClick={applyCrop}
              className="flex-1 py-2 bg-stone-600 text-cream-50 rounded font-medium hover:bg-stone-700 transition"
            >
              Apply Crop
            </button>
          )}

          <button
            onClick={() => onDownload(canvasRef.current!)}
            className="flex-1 py-2 bg-gold-600 text-charcoal-900 rounded font-medium hover:bg-gold-700 transition"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  )
}
