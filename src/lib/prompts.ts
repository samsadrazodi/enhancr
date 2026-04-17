export const ENHANCE_PROMPT_V1 = `Analyze this photo and return a JSON object with these fields. Return ONLY the JSON object, no markdown or explanation.

{
  "noiseLevel": <integer 0-100, where 0=pristine and 100=extremely grainy/noisy>,
  "sharpnessNeeded": <integer 0-100, where 0=already sharp and 100=very blurry>,
  "exposureIssue": "<"underexposed" | "overexposed" | "none">",
  "colorCast": "<"warm" | "cool" | "none">"
}

Example response:
{"noiseLevel": 45, "sharpnessNeeded": 30, "exposureIssue": "none", "colorCast": "cool"}`
