import { NextRequest, NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase"
import {
  enhanceImage,
  fixEyes,
  retouchSkin,
  removeObject,
  relight,
  blurBackground,
  replaceBackground,
  removeBackground,
} from "@/lib/gemini"
import { preflightCheck } from "@/lib/content-filter"
import { checkRateLimit, recordUsage } from "@/lib/rate-limit"
import sharp from "sharp"

export async function POST(request: NextRequest) {
  try {
    // Get auth token from Authorization header
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing authorization" }, { status: 401 })
    }

    const token = authHeader.slice(7)
    const supabase = getSupabaseClient()

    // Verify token and get user
    const { data, error: authError } = await supabase.auth.getUser(token)
    if (authError || !data.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = data.user.id

    // Get FormData and file
    const formData = await request.formData()
    const file = formData.get("file") as File
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Preflight check
    const filterResult = preflightCheck({ size: file.size, type: file.type })
    if (!filterResult.allowed) {
      return NextResponse.json({ error: filterResult.reason || "File rejected" }, { status: 400 })
    }

    // Rate limit check
    const limit = checkRateLimit(userId, "free") // TODO: get actual tier from DB
    if (!limit.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          remaining: limit.remaining,
          resetAt: limit.resetAt,
        },
        { status: 429 }
      )
    }

    // Convert file to buffer
    const imageBuffer = Buffer.from(await file.arrayBuffer())

    // Get tool name from FormData (default: "enhance")
    const tool = (formData.get("tool") as string) || "enhance"

    // Process image based on tool
    let enhancedBuffer: Buffer
    try {
      switch (tool) {
        case "enhance":
          enhancedBuffer = await enhanceImage(imageBuffer)
          break
        case "fixEyes":
          enhancedBuffer = await fixEyes(imageBuffer)
          break
        case "retouchSkin":
          enhancedBuffer = await retouchSkin(imageBuffer)
          break
        case "removeObject": {
          const maskFile = formData.get("mask") as File
          if (!maskFile) {
            return NextResponse.json({ error: "Mask required for removeObject" }, { status: 400 })
          }
          const maskBuffer = Buffer.from(await maskFile.arrayBuffer())
          enhancedBuffer = await removeObject(imageBuffer, maskBuffer)
          break
        }
        case "relight": {
          const lightingPrompt = formData.get("prompt") as string
          if (!lightingPrompt) {
            return NextResponse.json({ error: "Lighting prompt required for relight" }, { status: 400 })
          }
          enhancedBuffer = await relight(imageBuffer, lightingPrompt)
          break
        }
        case "blurBackground":
          enhancedBuffer = await blurBackground(imageBuffer)
          break
        case "replaceBackground": {
          const bgPrompt = formData.get("prompt") as string
          if (!bgPrompt) {
            return NextResponse.json({ error: "Background prompt required for replaceBackground" }, { status: 400 })
          }
          enhancedBuffer = await replaceBackground(imageBuffer, bgPrompt)
          break
        }
        case "removeBackground":
          enhancedBuffer = await removeBackground(imageBuffer)
          break
        default:
          return NextResponse.json({ error: `Unknown tool: ${tool}` }, { status: 400 })
      }
    } catch (err) {
      console.error(`Gemini ${tool} failed:`, err)
      const msg = err instanceof Error ? err.message : String(err)
      const statusCode = msg.includes("requires the Gemini image generation API") ? 502 : 502
      return NextResponse.json(
        { error: msg || "Image processing failed. Please try again." },
        { status: statusCode }
      )
    }

    // Record usage
    recordUsage(userId)

    // Get metadata
    const metadata = await sharp(enhancedBuffer).metadata()

    // TODO: Insert edit record to edits table (requires migration)
    // Once edits table is created in Supabase, uncomment this:
    // try {
    //   await supabase.from("edits").insert({
    //     user_id: userId,
    //     tool: "enhance",
    //     input_size_bytes: file.size,
    //     output_width: metadata.width,
    //     output_height: metadata.height,
    //     status: "success",
    //   })
    // } catch (dbErr) {
    //   console.error("Failed to record edit:", dbErr)
    // }

    return NextResponse.json(
      {
        image: enhancedBuffer.toString("base64"),
        metadata: {
          width: metadata.width,
          height: metadata.height,
          format: metadata.format,
        },
      },
      { status: 200 }
    )
  } catch (err) {
    console.error("Edit API error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
