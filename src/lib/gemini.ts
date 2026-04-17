import { GoogleGenerativeAI } from "@google/generative-ai"
import sharp from "sharp"
import {
  ENHANCE_PROMPT_V1,
  FIX_EYES_PROMPT_V1,
  RETOUCH_SKIN_PROMPT_V1,
  REMOVE_OBJECT_PROMPT_V1,
  RELIGHT_PROMPT_V1,
  BACKGROUND_REPLACE_PROMPT_V1,
  BACKGROUND_REMOVE_PROMPT_V1,
} from "./prompts"

let geminiClient: GoogleGenerativeAI | null = null

function getGeminiClient(): GoogleGenerativeAI {
  if (!geminiClient) {
    const key = process.env.GEMINI_API_KEY
    if (!key || key === "placeholder") {
      throw new Error("GEMINI_API_KEY not configured")
    }
    geminiClient = new GoogleGenerativeAI(key)
  }
  return geminiClient
}

interface ImageAnalysis {
  noiseLevel: number
  sharpnessNeeded: number
  exposureIssue: "underexposed" | "overexposed" | "none"
  colorCast: "warm" | "cool" | "none"
}

async function analyzeImage(imageBuffer: Buffer): Promise<ImageAnalysis> {
  const client = getGeminiClient()
  const model = client.getGenerativeModel({ model: "gemini-2.5-flash" })

  const base64Image = imageBuffer.toString("base64")

  let attempt = 0
  const maxAttempts = 3

  while (attempt < maxAttempts) {
    try {
      const response = await Promise.race([
        model.generateContent([
          {
            inlineData: {
              mimeType: "image/png",
              data: base64Image,
            },
          },
          {
            text: ENHANCE_PROMPT_V1,
          },
        ]),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Gemini timeout")), 30000)
        ),
      ]) as Awaited<ReturnType<typeof model.generateContent>>

      const text = response.response.text()
      const analysis: ImageAnalysis = JSON.parse(text)

      return analysis
    } catch (err) {
      attempt += 1
      if (attempt >= maxAttempts) {
        throw new Error(`Gemini API failed after 3 attempts: ${err instanceof Error ? err.message : String(err)}`)
      }
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000))
    }
  }

  throw new Error("Gemini analysis failed")
}

export async function enhanceImage(imageBuffer: Buffer): Promise<Buffer> {
  const analysis = await analyzeImage(imageBuffer)

  let pipeline = sharp(imageBuffer).png({ quality: 90 })

  // Upscale 2x using bicubic interpolation
  const metadata = await sharp(imageBuffer).metadata()
  const width = metadata.width || 1024
  const height = metadata.height || 1024
  pipeline = pipeline.resize(width * 2, height * 2, {
    kernel: "cubic",
  })

  // Sharpen based on analysis
  if (analysis.sharpnessNeeded > 40) {
    pipeline = pipeline.sharpen({ sigma: 1.5 })
  } else if (analysis.sharpnessNeeded > 20) {
    pipeline = pipeline.sharpen({ sigma: 0.8 })
  }

  // Denoise if noisy
  if (analysis.noiseLevel > 50) {
    pipeline = pipeline.median(3)
  } else if (analysis.noiseLevel > 30) {
    pipeline = pipeline.median(2)
  }

  // Normalize levels
  pipeline = pipeline.normalize()

  // Adjust for exposure issues
  if (analysis.exposureIssue === "underexposed") {
    pipeline = pipeline.modulate({ brightness: 1.15 })
  } else if (analysis.exposureIssue === "overexposed") {
    pipeline = pipeline.modulate({ brightness: 0.85 })
  }

  // Adjust for color cast
  if (analysis.colorCast === "warm") {
    pipeline = pipeline.modulate({ saturation: 0.9 })
  } else if (analysis.colorCast === "cool") {
    pipeline = pipeline.modulate({ saturation: 1.1 })
  }

  return await pipeline.toBuffer()
}

// Legacy alias for compatibility
export async function callGeminiAPI(
  _prompt: string,
  imageData: Buffer
): Promise<Buffer> {
  return enhanceImage(imageData)
}

// Phase 5A — Generative image editing tools
// Uses gemini-2.0-flash-exp with image generation capability

export async function callGeminiGenerative(
  imageBuffer: Buffer,
  prompt: string,
  maskBuffer?: Buffer
): Promise<Buffer> {
  const client = getGeminiClient()
  const model = client.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

  const base64Image = imageBuffer.toString("base64")
  const content: (string | { inlineData: { mimeType: string; data: string } } | { text: string })[] = [
    {
      inlineData: {
        mimeType: "image/png",
        data: base64Image,
      },
    },
  ]

  if (maskBuffer) {
    const base64Mask = maskBuffer.toString("base64")
    content.push({
      inlineData: {
        mimeType: "image/png",
        data: base64Mask,
      },
    })
  }

  content.push({
    text: prompt,
  })

  let attempt = 0
  const maxAttempts = 3

  while (attempt < maxAttempts) {
    try {
      const response = await Promise.race([
        model.generateContent(content as (string | { inlineData: { mimeType: string; data: string } } | { text: string })[]),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Gemini generative timeout")), 30000)
        ),
      ])

      const imagePart = response.response.candidates?.[0]?.content?.parts?.find(
        (part: unknown) => (part as { inlineData?: { mimeType: string } }).inlineData?.mimeType?.startsWith("image/")
      ) as { inlineData: { data: string; mimeType: string } } | undefined

      if (!imagePart?.inlineData?.data) {
        throw new Error("Gemini generative API did not return an image")
      }

      return Buffer.from(imagePart.inlineData.data, "base64")
    } catch (err) {
      attempt += 1
      if (attempt >= maxAttempts) {
        const msg = err instanceof Error ? err.message : String(err)
        if (msg.includes("not found")) {
          throw new Error("This tool requires the Gemini image generation API. Contact support.")
        }
        throw new Error(`Gemini generative API failed after 3 attempts: ${msg}`)
      }
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000))
    }
  }

  throw new Error("Gemini generative API failed")
}

export async function fixEyes(buffer: Buffer): Promise<Buffer> {
  return callGeminiGenerative(buffer, FIX_EYES_PROMPT_V1)
}

export async function retouchSkin(buffer: Buffer): Promise<Buffer> {
  return callGeminiGenerative(buffer, RETOUCH_SKIN_PROMPT_V1)
}

export async function removeObject(buffer: Buffer, mask: Buffer): Promise<Buffer> {
  return callGeminiGenerative(buffer, REMOVE_OBJECT_PROMPT_V1, mask)
}

export async function relight(buffer: Buffer, lightingPrompt: string): Promise<Buffer> {
  return callGeminiGenerative(buffer, RELIGHT_PROMPT_V1(lightingPrompt))
}

export async function blurBackground(buffer: Buffer): Promise<Buffer> {
  return await sharp(buffer)
    .blur(15)
    .png({ quality: 90 })
    .toBuffer()
}

export async function replaceBackground(buffer: Buffer, bgPrompt: string): Promise<Buffer> {
  return callGeminiGenerative(buffer, BACKGROUND_REPLACE_PROMPT_V1(bgPrompt))
}

export async function removeBackground(buffer: Buffer): Promise<Buffer> {
  return callGeminiGenerative(buffer, BACKGROUND_REMOVE_PROMPT_V1)
}
