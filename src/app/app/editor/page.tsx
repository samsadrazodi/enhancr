"use client"

import { useSession } from "@/components/providers/SessionProvider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Upload } from "@/components/Upload"
import { CanvasEditor } from "@/components/CanvasEditor"

interface ImageMetadata {
  width?: number
  height?: number
  format?: string
}

export default function EditorPage() {
  const { user, loading } = useSession()
  const router = useRouter()
  const [image, setImage] = useState<string | null>(null)
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null)

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
              <CanvasEditor imageBase64={image} onDownload={handleDownload} />
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
              <div className="space-y-2 text-sm text-stone-600">
                <p>✓ Crop / Straighten (local)</p>
                <p>○ Enhance & Upscale (Phase 4)</p>
                <p>○ Fix Eyes (Phase 5)</p>
                <p>○ Retouch Skin (Phase 5)</p>
                <p>○ Remove Object (Phase 5)</p>
              </div>
            </div>

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
