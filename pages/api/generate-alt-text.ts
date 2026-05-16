import type { NextApiRequest, NextApiResponse } from 'next'

// "image-{hexid}-{WxH}-{format}" → Sanity CDN URL
function assetRefToUrl(ref: string): string {
  const withoutPrefix = ref.replace(/^image-/, '')
  const lastHyphen = withoutPrefix.lastIndexOf('-')
  const idAndDims = withoutPrefix.slice(0, lastHyphen)
  const format = withoutPrefix.slice(lastHyphen + 1)
  return `https://cdn.sanity.io/images/k5e2zsor/production/${idAndDims}.${format}`
}

function buildPrompt(contentType?: string, docTitle?: string): string {
  const base = `You are writing alt text for "Meet the Whytes," a travel blog about NBA/WNBA arena visits, hotel stays, and food experiences.`

  const context =
    {
      arenas: `This image is from an NBA/WNBA arena visit${docTitle ? ` — ${docTitle}` : ''}.`,
      hotelReview: `This image is from a hotel stay${docTitle ? ` at ${docTitle}` : ''}.`,
      foodReview: `This image is from a meal or restaurant${docTitle ? ` — ${docTitle}` : ''}.`,
    }[contentType ?? ''] ?? ''

  return `${base} ${context}

Write alt text the way a travel writer would naturally caption a photo — specific, direct, and real. It must sound like a human wrote it, not an AI.

Rules:
- Describe exactly what is shown (the court, the seats, the dish, the room, the view, etc.)
- Include specific details: arena name, city, hotel name, dish name — only if clearly visible or inferable
- 50–120 characters total
- Do NOT use these AI/marketing words: "showcasing", "featuring", "stunning", "vibrant", "modern", "iconic", "offering", "boasting", "nestled", "beautiful views of", "world-class", "state-of-the-art"
- Do NOT start with "image of", "photo of", or "picture of"
- Write like you're texting a friend what the photo shows

Return ONLY the alt text. No quotes. No explanation.`
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') return res.status(405).end()

  const {
    assetRef,
    contentType,
    docTitle,
  }: { assetRef?: string; contentType?: string; docTitle?: string } = req.body

  if (!assetRef)
    return res.status(400).json({ error: 'assetRef is required' })

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey)
    return res.status(500).json({ error: 'Gemini API key not configured' })

  try {
    const imageUrl = assetRefToUrl(assetRef)

    const imageRes = await fetch(imageUrl, {
      signal: AbortSignal.timeout(10000),
    })
    if (!imageRes.ok)
      throw new Error(`Failed to fetch image: ${imageRes.status}`)

    const mimeType = (
      imageRes.headers.get('content-type') ?? 'image/jpeg'
    ).split(';')[0]
    const imageBuffer = await imageRes.arrayBuffer()
    const base64 = Buffer.from(imageBuffer).toString('base64')

    const geminiRes = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        signal: AbortSignal.timeout(15000),
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { inlineData: { mimeType, data: base64 } },
                { text: buildPrompt(contentType, docTitle) },
              ],
            },
          ],
          generationConfig: { maxOutputTokens: 80, temperature: 0.4 },
        }),
      },
    )

    if (!geminiRes.ok) {
      const err = await geminiRes.json()
      throw new Error(
        err?.error?.message ?? `Gemini error ${geminiRes.status}`,
      )
    }

    const data = await geminiRes.json()
    const altText =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

    if (!altText) throw new Error('No alt text returned from Gemini')

    res.status(200).json({ altText })
  } catch (err: any) {
    console.error('[generate-alt-text]', err)
    res.status(500).json({ error: err.message ?? 'Failed to generate alt text' })
  }
}
