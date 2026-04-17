import { NextRequest, NextResponse } from "next/server"
import sharp from "sharp"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "File required" }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const imageBuffer = Buffer.from(buffer)

    let processedImage = sharp(imageBuffer)

    processedImage = processedImage.withMetadata()

    const metadata = await sharp(imageBuffer).metadata()
    const png = processedImage.png({ quality: 90 })
    const processedBuffer = await png.toBuffer()

    const thumbnail = await sharp(imageBuffer)
      .resize(200, 200, { fit: "cover" })
      .png()
      .toBuffer()

    return NextResponse.json(
      {
        image: processedBuffer.toString("base64"),
        thumbnail: thumbnail.toString("base64"),
        metadata: {
          width: metadata.width,
          height: metadata.height,
          format: metadata.format,
        },
        message: "Image processed successfully",
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Image processing error:", error)
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    )
  }
}
