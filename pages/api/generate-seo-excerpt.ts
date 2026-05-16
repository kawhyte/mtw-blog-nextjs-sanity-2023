import type { NextApiRequest, NextApiResponse } from 'next'

const FORBIDDEN =
  'stunning, vibrant, nestled, boasting, offering, showcasing, modern, iconic, world-class, state-of-the-art, perfect for, ideal for, luxurious, mouthwatering, delightful, exquisite, seamlessly, impeccable'

function buildHotelPrompt(body: any): string {
  const { title, location, category, positives, wouldReturn, verdict } = body
  const highlights = (positives as string[])
    .filter(Boolean)
    .slice(0, 3)
    .join(' | ')
  const wouldReturnMap: Record<string, string> = {
    yes: 'Yes, absolutely',
    if_prices_drop: 'Yes, if prices drop',
    maybe: 'Maybe',
    no: 'No',
  }

  return `You write SEO meta descriptions for "Meet the Whytes," a travel couple's blog covering hotel stays near NBA arenas.

Hotel: ${title}
Location: ${location ?? 'Unknown'}
Type: ${category ?? 'hotel'}
${highlights ? `Highlights from our stay: ${highlights}` : ''}
${verdict ? `Our verdict: ${verdict.slice(0, 200)}` : ''}
${wouldReturn ? `Would we return: ${wouldReturnMap[wouldReturn] ?? wouldReturn}` : ''}

Write ONE meta description for Google search results. Hard rules:
- MUST be between 120 and 155 characters — count every character, do not go under 120 or over 155
- Include "${title}" and "${location ?? 'the city'}"
- Mention one specific, honest detail from the stay
- Sound like a real traveler wrote it — not marketing copy, not AI
- End with something that makes a reader want to click through
- NEVER use: ${FORBIDDEN}

Return ONLY the meta description. No quotes. No label. No explanation.`
}

function buildFoodPrompt(body: any): string {
  const { title, location, diningType, positives, verdict } = body
  const highlights = (positives as string[])
    .filter(Boolean)
    .slice(0, 3)
    .join(' | ')
  const diningLabel = diningType === 'takeout' ? 'Takeout' : 'Dine-in'

  return `You write SEO meta descriptions for "Meet the Whytes," a travel couple's blog covering restaurants near NBA arenas.

Restaurant: ${title}
Location: ${location ?? 'Unknown'}
Experience type: ${diningLabel}
${highlights ? `Highlights: ${highlights}` : ''}
${verdict ? `Our verdict: ${verdict.slice(0, 200)}` : ''}

Write ONE meta description for Google search results. Hard rules:
- MUST be between 120 and 155 characters — count every character, do not go under 120 or over 155
- Include "${title}" and "${location ?? 'the city'}"
- Mention something specific and honest about the food
- Sound like a real person wrote it — not a food critic or AI
- End with something that makes a reader want to click through
- NEVER use: ${FORBIDDEN}

Return ONLY the meta description. No quotes. No label. No explanation.`
}

function buildArenaPrompt(body: any): string {
  const { name, location, positives, verdict } = body
  const highlights = (positives as string[])
    .filter(Boolean)
    .slice(0, 3)
    .join(' | ')

  return `You write SEO meta descriptions for "Meet the Whytes," a travel couple's blog reviewing NBA arenas.

Arena: ${name}
Location: ${location ?? 'Unknown'}
${highlights ? `Highlights: ${highlights}` : ''}
${verdict ? `Our verdict: ${verdict.slice(0, 200)}` : ''}

Write ONE meta description for Google search results. Hard rules:
- MUST be between 120 and 155 characters — count every character, do not go under 120 or over 155
- Include "${name}" and "${location ?? 'the city'}"
- Mention one specific honest detail (food, sightlines, parking, atmosphere, etc.)
- Sound like a real fan who attended a game wrote it — not a tourism board
- End with something that makes a reader want to click through
- NEVER use: ${FORBIDDEN}

Return ONLY the meta description. No quotes. No label. No explanation.`
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'Gemini API key not configured' })

  const { docType } = req.body
  if (!docType) return res.status(400).json({ error: 'docType is required' })

  let prompt: string
  if (docType === 'hotelReview') {
    prompt = buildHotelPrompt(req.body)
  } else if (docType === 'foodReview') {
    prompt = buildFoodPrompt(req.body)
  } else if (docType === 'arenas') {
    prompt = buildArenaPrompt(req.body)
  } else {
    return res.status(400).json({ error: `Unsupported docType: ${docType}` })
  }

  try {
    const geminiRes = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        signal: AbortSignal.timeout(25000),
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 1024, temperature: 0.5 },
        }),
      },
    )

    if (!geminiRes.ok) {
      const err = await geminiRes.json()
      throw new Error(err?.error?.message ?? `Gemini error ${geminiRes.status}`)
    }

    const data = await geminiRes.json()
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

    if (!raw) throw new Error('No response from Gemini')

    // Strip any surrounding quotes Gemini sometimes adds
    const seoExcerpt = raw.replace(/^["']|["']$/g, '').trim()

    res.status(200).json({ seoExcerpt })
  } catch (err: any) {
    console.error('[generate-seo-excerpt]', err)
    res.status(500).json({ error: err.message ?? 'Failed to generate SEO excerpt' })
  }
}
