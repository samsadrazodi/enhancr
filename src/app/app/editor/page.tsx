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
  const [processing, setProcessing] = useState(false)
  const [processError, setProcessError] = useState("")
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

  const processTool = async (tool: string, additionalData?: { mask?: Blob; prompt?: string }) => {
    if (!canvasRef.current || !session?.access_token) return

    setProcessing(true)
    setProcessError("")

    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) {
          setProcessError("Failed to capture image")
          setProcessing(false)
          return
        }

        const formData = new FormData()
        formData.append("file", blob, "image.png")
        formData.append("tool", tool)

        if (additionalData?.mask) {
          formData.append("mask", additionalData.mask, "mask.png")
        }
        if (additionalData?.prompt) {
          formData.append("prompt", additionalData.prompt)
        }

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
            setProcessError(`Rate limit reached. Resets at ${new Date(data.resetAt).toLocaleTimeString()}`)
          } else {
            setProcessError(data.error || "Processing failed")
          }
          setProcessing(false)
          return
        }

        const result = await response.json()
        setImage(result.image)
        setMetadata(result.metadata)
        setProcessing(false)
      }, "image/png")
    } catch (err) {
      setProcessError(err instanceof Error ? err.message : "Processing failed")
      setProcessing(false)
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
                  <>
                    <button
                      onClick={() => processTool("enhance")}
                      disabled={processing}
                      className="w-full py-2 px-4 bg-gold-600 text-charcoal-900 font-medium rounded hover:bg-gold-700 disabled:opacity-50 transition"
                    >
                      {processing ? "Processing..." : "✓ Enhance & Upscale"}
                    </button>

                    <button
                      onClick={() => processTool("fixEyes")}
                      disabled={processing}
                      className="w-full py-2 px-4 bg-stone-200 text-charcoal-900 font-medium rounded hover:bg-stone-300 disabled:opacity-50 transition"
                    >
                      {processing ? "Processing..." : "✓ Fix Eyes"}
                    </button>

                    <button
                      onClick={() => processTool("retouchSkin")}
                      disabled={processing}
                      className="w-full py-2 px-4 bg-stone-200 text-charcoal-900 font-medium rounded hover:bg-stone-300 disabled:opacity-50 transition"
                    >
                      {processing ? "Processing..." : "✓ Retouch Skin"}
                    </button>

                    <button
                      disabled
                      title="Requires image generation API"
                      className="w-full py-2 px-4 bg-stone-100 text-stone-400 font-medium rounded opacity-50 transition text-sm cursor-not-allowed"
                    >
                      ○ Remove Object (coming soon)
                    </button>

                    <button
                      disabled
                      title="Requires image generation API"
                      className="w-full py-2 px-4 bg-stone-100 text-stone-400 font-medium rounded opacity-50 transition text-sm cursor-not-allowed"
                    >
                      ○ Relight (coming soon)
                    </button>

                    <div className="border-t border-stone-300 pt-2 mt-2">
                      <p className="text-xs font-semibold text-stone-600 mb-2">Background</p>
                      <button
                        onClick={() => processTool("blurBackground")}
                        disabled={processing}
                        className="w-full py-2 px-4 bg-stone-200 text-charcoal-900 font-medium rounded hover:bg-stone-300 disabled:opacity-50 transition text-sm"
                      >
                        {processing ? "Processing..." : "✓ Blur"}
                      </button>

                      <button
                        disabled
                        title="Requires image generation API"
                        className="w-full py-2 px-4 bg-stone-100 text-stone-400 font-medium rounded opacity-50 transition text-sm mt-1 cursor-not-allowed"
                      >
                        ○ Replace (coming soon)
                      </button>

                      <button
                        disabled
                        title="Requires image generation API"
                        className="w-full py-2 px-4 bg-stone-100 text-stone-400 font-medium rounded opacity-50 transition text-sm mt-1 cursor-not-allowed"
                      >
                        ○ Remove (coming soon)
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {processError && (
              <div className="bg-red-50 border border-red-200 p-4 rounded">
                <p className="text-red-700 text-sm">{processError}</p>
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

        {/* Modal: no active modals in Phase 5A fallback mode */}
      </div>
    </div>
  )
}
