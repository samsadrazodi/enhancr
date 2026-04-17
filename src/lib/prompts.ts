export const ENHANCE_PROMPT_V1 = `Analyze this photo and return a JSON object with these fields. Return ONLY the JSON object, no markdown or explanation.

{
  "noiseLevel": <integer 0-100, where 0=pristine and 100=extremely grainy/noisy>,
  "sharpnessNeeded": <integer 0-100, where 0=already sharp and 100=very blurry>,
  "exposureIssue": "<"underexposed" | "overexposed" | "none">",
  "colorCast": "<"warm" | "cool" | "none">"
}

Example response:
{"noiseLevel": 45, "sharpnessNeeded": 30, "exposureIssue": "none", "colorCast": "cool"}`

// Phase 5A — Standard tools (generative image editing)

export const FIX_EYES_PROMPT_V1 = `Fix the eyes in this photograph. Correct red-eye, remove glare, and sharpen the iris detail. Keep all other aspects of the face and image unchanged. Return the corrected image.`

export const RETOUCH_SKIN_PROMPT_V1 = `Retouch the skin in this photograph. Remove only blemishes, pimples, and small spots. Do NOT whiten or lighten skin tone. Do NOT slim or reshape the face or body. Keep hair, clothing, background, and all other details unchanged. Return the retouched image.`

export const REMOVE_OBJECT_PROMPT_V1 = `Remove the object in the masked region and fill the area with a natural background that matches the surrounding scene. Do NOT change anything outside the masked region. Do NOT alter the rest of the image. Return the completed image.`

export const RELIGHT_PROMPT_V1 = (userPrompt: string) => `Adjust the lighting in this photograph to: ${userPrompt}

Constraints:
- Keep all faces, features, identity, and expressions unchanged
- Do NOT alter hairstyles, clothing, or body
- Do NOT change the composition or background
- Natural-looking result only

Return the relighted image.`

export const BACKGROUND_BLUR_PROMPT_V1 = `Blur the background of this photograph while keeping the subject sharp and in focus. Use a natural blur that looks like camera depth-of-field. Keep the subject unchanged. Return the image with blurred background.`

export const BACKGROUND_REPLACE_PROMPT_V1 = (bgPrompt: string) => `Replace the background of this photograph with: ${bgPrompt}

Constraints:
- Keep the subject fully intact and unchanged
- The new background should match the lighting and perspective of the subject
- Natural-looking composite only
- Keep all details of the subject (clothes, hair, pose, expression)

Return the image with new background.`

export const BACKGROUND_REMOVE_PROMPT_V1 = `Remove the background of this photograph and make it transparent. Keep the subject sharp and intact. Return a PNG with transparent background.`
