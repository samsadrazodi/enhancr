"use client"

import { useSession } from "@/components/providers/SessionProvider"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { Upload } from "@/components/Upload"
import { CanvasEditor } from "@/components/CanvasEditor"

interface ImageMetadata {
  width?: number
  height?: number
  format?: string
}

export default function EditorPage() {
  const { user, loading, session } = useSession()
  const router = useRouter()
  const [image, setImage] = useState<string | null>(null)
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null)
  const [enhancing, setEnhancing] = useState(false)
  const [enhanceError, setEnhanceError] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  const handleUploadComplete = (uploadedImage: string, uploadMetadata: ImageMetadata) => {
    setImage(uploadedImage)
    setMetadata(uploadMetadata)
  }

  const handleDownload = (canvas: HTMLCanvasElement) => {
    canvas.toBlob((blob) => {
      if (!blob) return

      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `enhancr-${Date.now()}.png`
      link.click()
      URL.revokeObjectURL(url)
    }, "image/png")
  }

  const handleEnhance = async () => {
    if (!canvasRef.current || !session?.access_token) return

    setEnhancing(true)
    setEnhanceError("")

    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) {
          setEnhanceError("Failed to capture image")
          setEnhancing(false)
          return
        }

        const formData = new FormData()
        formData.append("file", blob, "image.png")

        const response = await fetch("/api/edit", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          body: formData,
        })

        if (!response.ok) {
          const data = await response.json()
          if (response.status === 429) {
            setEnhanceError(`Rate limit reached. Resets at ${new Date(data.resetAt).toLocaleTimeString()}`)
          } else {
            setEnhanceError(data.error || "Enhancement failed")
          }
          setEnhancing(false)
          return
        }

        const result = await response.json()
        setImage(result.image)
        setMetadata(result.metadata)
        setEnhancing(false)
      }, "image/png")
    } catch (err) {
      setEnhanceError(err instanceof Error ? err.message : "Enhancement failed")
      setEnhancing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <p className="text-stone-600">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold font-outfit text-charcoal-900 mb-8">
          Editor
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Upload or Canvas */}
          <div>
            {!image ? (
              <Upload onUploadComplete={handleUploadComplete} />
            ) : (
              <CanvasEditor ref={canvasRef} imageBase64={image} onDownload={handleDownload} />
            )}

            {image && (
              <button
                onClick={() => {
                  setImage(null)
                  setMetadata(null)
                }}
                className="mt-4 w-full py-2 text-gold-600 border border-gold-600 rounded hover:bg-gold-600 hover:text-charcoal-900 transition"
              >
                Upload New Image
              </button>
            )}
          </div>

          {/* Right: Info Panel */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded border border-stone-200">
              <h2 className="text-lg font-semibold mb-4">Tools</h2>
              <div className="space-y-2">
                <p className="text-sm text-stone-600">✓ Crop / Straighten (local)</p>
                {image && (
                  <button
                    onClick={handleEnhance}
                    disabled={enhancing}
                    className="w-full py-2 px-4 bg-gold-600 text-charcoal-900 font-medium rounded hover:bg-gold-700 disabled:opacity-50 transition"
                  >
                    {enhancing ? "Enhancing..." : "✓ Enhance & Upscale"}
                  </button>
                )}
                <p className="text-sm text-stone-600">○ Fix Eyes (Phase 5)</p>
                <p className="text-sm text-stone-600">○ Retouch Skin (Phase 5)</p>
                <p className="text-sm text-stone-600">○ Remove Object (Phase 5)</p>
              </div>
            </div>

            {enhanceError && (
              <div className="bg-red-50 border border-red-200 p-4 rounded">
                <p className="text-red-700 text-sm">{enhanceError}</p>
              </div>
            )}

            {image && metadata && (
              <div className="bg-white p-6 rounded border border-stone-200">
                <h2 className="text-lg font-semibold mb-4">Image Info</h2>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-stone-600">Dimensions:</span>{" "}
                    <span className="font-mono">
                      {(metadata as any)?.width} × {(metadata as any)?.height}
                    </span>
                  </p>
                  <p>
                    <span className="text-stone-600">Format:</span>{" "}
                    <span className="font-mono">{(metadata as any)?.format}</span>
                  </p>
                </div>
              </div>
            )}

            <div className="bg-stone-100 p-4 rounded">
              <p className="text-xs text-stone-600">
                <strong>Tip:</strong> Use the crop tool to select your region,
                then click &quot;Apply Crop&quot;. Adjust rotation with the slider.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
