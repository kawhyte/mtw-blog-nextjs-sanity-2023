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
  const base = `You are writing a photo caption for "Meet the Whytes," a travel blog about NBA/WNBA arena visits, hotel stays, food experiences, and cruise travel.`

  const context =
    {
      arenas: `This photo is from an NBA/WNBA arena visit${docTitle ? ` — ${docTitle}` : ''}. Write from a basketball fan's perspective.`,
      hotelReview: `This photo is from a hotel stay${docTitle ? ` at ${docTitle}` : ''}. Write from a traveler's perspective.`,
      foodReview: `This photo is from a meal or restaurant${docTitle ? ` — ${docTitle}` : ''}. Write from a food lover's perspective.`,
      guide: `This photo is from a travel guide${docTitle ? ` — "${docTitle}"` : ''}. Write from a traveler's perspective.`,
    }[contentType ?? ''] ?? `This photo is from the Meet the Whytes travel blog${docTitle ? ` — ${docTitle}` : ''}.`

  return `${base} ${context}

Write a photo caption the way a travel blogger would — specific, real, and in the first person plural ("we"). It should sound like someone who was actually there describing what you see.

Rules:
- Describe what is shown and add just enough context to make it interesting
- 80–160 characters total
- First person plural ("we", "our") when natural — e.g. "Our view from the upper deck at Fiserv Forum"
- Include specific details: arena name, city, dish name, hotel name, location — only when clearly visible or inferable
- Do NOT use these words: "showcasing", "featuring", "stunning", "vibrant", "modern", "iconic", "offering", "boasting", "nestled", "world-class", "state-of-the-art"
- Do NOT start with "A photo of", "An image of", or "This is"
- Write like a caption in a travel magazine, not an ad

Return ONLY the caption. No quotes. No explanation.`
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
          generationConfig: { maxOutputTokens: 120, temperature: 0.5 },
        }),
      },
    )

    if (!geminiRes.ok) {
      const err = await geminiRes.json()
      throw new Error(err?.error?.message ?? `Gemini error ${geminiRes.status}`)
    }

    const data = await geminiRes.json()
    const caption = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

    if (!caption) throw new Error('No caption returned from Gemini')

    res.status(200).json({ caption })
  } catch (err: any) {
    console.error('[generate-caption]', err)
    res.status(500).json({ error: err.message ?? 'Failed to generate caption' })
  }
}
