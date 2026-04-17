import { NextRequest, NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase"
import { enhanceImage } from "@/lib/gemini"
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

    // Enhance image
    let enhancedBuffer: Buffer
    try {
      enhancedBuffer = await enhanceImage(imageBuffer)
    } catch (err) {
      console.error("Gemini enhancement failed:", err)
      return NextResponse.json(
        { error: "Image enhancement failed. Please try again." },
        { status: 502 }
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
