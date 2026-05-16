import type { NextApiRequest, NextApiResponse } from 'next'

const VOICE_RULES = `You write verdicts for "Meet the Whytes," a travel couple's blog covering NBA arenas, hotel stays, and dining experiences.

VOICE RULES — follow every one:
- Write as "we" (a couple traveling together), warm, direct, and confident
- Use "&" instead of "and" in casual phrasing — not every sentence, just naturally
- State opinions directly: "top-notch", "divine", "exactly what we needed", "worth every penny"
- Be honest about negatives — name them plainly but fairly, don't sugarcoat or bury them
- Use sensory detail for food: textures, flavors, temperatures, reference specific dish names
- End with a clear, forward-looking close: "We'd go back", "We'll be back", "Skip it", "Book it", "Worth every penny"
- Write like a trusted friend giving real advice, not a press release
- FORBIDDEN WORDS — never use any of these: showcasing, stunning, vibrant, world-class, nestled, boasting, iconic, offering, featuring, seamlessly, elevate, state-of-the-art, modern amenities, culinary, experience (as a noun like "the experience was"), impeccable`

function buildHotelPrompt(body: any): string {
  const { title, location, category, positives, negatives, tip, wouldReturn, priceTier, bestFor } =
    body
  const posStr = (positives as string[])
    .filter(Boolean)
    .map((p) => `- ${p}`)
    .join('\n')
  const negStr = (negatives as string[])
    .filter(Boolean)
    .map((n) => `- ${n}`)
    .join('\n')
  const tipStr = tip ? `Quick tip: ${tip}` : ''
  const wouldReturnStr = wouldReturn
    ? `Would return: ${(wouldReturn as string).replace(/_/g, ' ')}`
    : ''
  const priceStr = priceTier
    ? `Price tier: ${(priceTier as string).replace(/_/g, ' ')}`
    : ''
  const bestForStr =
    Array.isArray(bestFor) && bestFor.length ? `Best for: ${bestFor.join(', ')}` : ''

  return `${VOICE_RULES}

SEO RULES:
- Use "${title}" naturally 2–3 times
- Include "${location}" at least once
- Weave 2–3 key differentiators from the positives into natural sentences
- Target 400–500 characters total (roughly 3–4 tight sentences). Count carefully — do not go under 400 or over 500 characters
- Write only the verdict — no headers, no bullet points, plain paragraphs only

HOTEL DATA:
Hotel: ${title}
Location: ${location}
Category: ${category ?? 'not specified'}
${priceStr}
${bestForStr}
${wouldReturnStr}
Positives:
${posStr || '(none listed)'}
Negatives:
${negStr || '(none listed)'}
${tipStr}

Write the verdict now.`
}

function buildFoodPrompt(body: any): string {
  const { title, location, diningType, positives, negatives, tip, foodItems } = body
  const posStr = (positives as string[])
    .filter(Boolean)
    .map((p) => `- ${p}`)
    .join('\n')
  const negStr = (negatives as string[])
    .filter(Boolean)
    .map((n) => `- ${n}`)
    .join('\n')
  const tipStr = tip ? `Quick tip: ${tip}` : ''
  const itemStr = Array.isArray(foodItems)
    ? foodItems
        .filter((i: any) => i.name)
        .map(
          (i: any) =>
            `  - ${i.name}${i.rating != null ? ` (${i.rating}/10)` : ''}${i.review ? `: ${i.review}` : ''}`,
        )
        .join('\n')
    : ''

  return `${VOICE_RULES}

SEO RULES:
- Use "${title}" naturally 2–3 times
- Include "${location}" at least once
- Reference specific dishes by name when available
- Target 150–250 words
- Write only the verdict — no headers, no bullet points, plain paragraphs only

RESTAURANT DATA:
Restaurant: ${title}
Location: ${location}
Dining type: ${diningType ?? 'dine-in'}
Positives:
${posStr || '(none listed)'}
Negatives:
${negStr || '(none listed)'}
${itemStr ? `Dishes/drinks we tried:\n${itemStr}` : ''}
${tipStr}

Write the verdict now.`
}

function buildArenaPrompt(body: any): string {
  const { name, location, positives, negatives, foodItems } = body
  const posStr = (positives as string[])
    .filter(Boolean)
    .map((p) => `- ${p}`)
    .join('\n')
  const negStr = (negatives as string[])
    .filter(Boolean)
    .map((n) => `- ${n}`)
    .join('\n')
  const itemStr = Array.isArray(foodItems)
    ? foodItems
        .filter((i: any) => i.name)
        .map(
          (i: any) =>
            `  - ${i.name}${i.rating != null ? ` (${i.rating}/10)` : ''}${i.review ? `: ${i.review}` : ''}`,
        )
        .join('\n')
    : ''

  return `${VOICE_RULES}

SEO RULES:
- Use "${name}" naturally 2–3 times
- Include "${location}" at least once
- Weave 2–3 key differentiators from the positives into natural sentences
- Target 400–500 characters total (roughly 3–4 tight sentences). Count carefully — do not go under 400 or over 500 characters
- Write only the verdict — no headers, no bullet points, plain paragraphs only

ARENA DATA:
Arena: ${name}
Location: ${location}
Positives:
${posStr || '(none listed)'}
Negatives:
${negStr || '(none listed)'}
${itemStr ? `Food/drinks we tried:\n${itemStr}` : ''}

Write the verdict now.`
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
          generationConfig: { maxOutputTokens: 200, temperature: 0.75 },
        }),
      },
    )

    if (!geminiRes.ok) {
      const err = await geminiRes.json()
      throw new Error(err?.error?.message ?? `Gemini error ${geminiRes.status}`)
    }

    const data = await geminiRes.json()
    const verdict = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

    if (!verdict) throw new Error('No verdict returned from Gemini')

    res.status(200).json({ verdict })
  } catch (err: any) {
    console.error('[generate-verdict]', err)
    res.status(500).json({ error: err.message ?? 'Failed to generate verdict' })
  }
}
