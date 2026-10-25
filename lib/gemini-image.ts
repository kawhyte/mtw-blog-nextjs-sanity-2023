// Shared by the photo AI buttons in Studio (alt text, caption)

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent'

// Wide enough to describe the photo, small enough to stay fast: the
// originals can be several MB and made requests time out
const PHOTO_WIDTH = 1024

/** An error with the HTTP status the API route should answer with */
export class GeminiError extends Error {
  constructor(
    message: string,
    public status = 500,
  ) {
    super(message)
  }
}

// "image-{hexid}-{WxH}-{format}" → a 1024px JPEG from the Sanity CDN
function photoUrl(assetRef: string): string {
  const withoutPrefix = assetRef.replace(/^image-/, '')
  const lastHyphen = withoutPrefix.lastIndexOf('-')
  const idAndDims = withoutPrefix.slice(0, lastHyphen)
  const format = withoutPrefix.slice(lastHyphen + 1)
  return `https://cdn.sanity.io/images/k5e2zsor/production/${idAndDims}.${format}?w=${PHOTO_WIDTH}&fit=max&fm=jpg&q=80`
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Sends a photo and a prompt to Gemini and returns the text it writes.
 * Retries once when Gemini is busy; a used-up free limit comes back as a
 * 429 with a plain message.
 */
export async function describePhoto(
  assetRef: string,
  prompt: string,
  generationConfig: { maxOutputTokens: number; temperature: number },
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new GeminiError('Gemini API key not configured')

  const imageRes = await fetch(photoUrl(assetRef), {
    signal: AbortSignal.timeout(8000),
  })
  if (!imageRes.ok)
    throw new GeminiError(`Could not load the photo (${imageRes.status})`)
  const data = Buffer.from(await imageRes.arrayBuffer()).toString('base64')

  // Two tries of up to 22s each, plus the photo, fit the route's 60s
  for (let attempt = 1; ; attempt++) {
    let geminiRes: Response
    try {
      geminiRes = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        signal: AbortSignal.timeout(22000),
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { inlineData: { mimeType: 'image/jpeg', data } },
                { text: prompt },
              ],
            },
          ],
          generationConfig,
        }),
      })
    } catch {
      // Gemini sometimes hangs when it's busy
      if (attempt < 2) continue
      throw new GeminiError(
        'Gemini is slow to answer right now. Try again in a minute.',
        504,
      )
    }

    if (geminiRes.ok) {
      const json = await geminiRes.json()
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
      if (!text) throw new GeminiError('Gemini returned nothing, try again')
      return text
    }

    // Busy or rate limited: wait a moment and try once more
    if ((geminiRes.status === 429 || geminiRes.status >= 500) && attempt < 2) {
      await sleep(3000)
      continue
    }

    if (geminiRes.status === 429)
      throw new GeminiError(
        "Gemini's free limit is used up for now. Try again in a minute.",
        429,
      )
    const body = await geminiRes.json().catch(() => null)
    throw new GeminiError(
      body?.error?.message ?? `Gemini error ${geminiRes.status}`,
      502,
    )
  }
}
