import type { NextApiRequest, NextApiResponse } from 'next'

import {
  BANNED_PHRASES,
  BANNED_WORDS,
  BRAND_VOICE,
  NO_DASHES_RULE,
  stripDashes,
  trimToSentence,
} from '../../lib/gemini-voice'

const FORBIDDEN = `${BANNED_WORDS}, modern`

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

  return `${BRAND_VOICE} You write SEO meta descriptions for our hotel reviews, the places we stay on our NBA & WNBA arena trips.

Hotel: ${title}
Location: ${location ?? 'Unknown'}
Type: ${category ?? 'hotel'}
${highlights ? `Highlights from our stay: ${highlights}` : ''}
${verdict ? `Our verdict: ${verdict.slice(0, 200)}` : ''}
${wouldReturn ? `Would we return: ${wouldReturnMap[wouldReturn] ?? wouldReturn}` : ''}

Write ONE meta description for Google search results. Hard rules:
- MUST be between 120 and 155 characters. Count every character, do not go under 120 or over 155
${NO_DASHES_RULE}
- Include "${title}" and "${location ?? 'the city'}"
- Mention one specific, honest detail from the stay
- Sound like a real traveler wrote it, not marketing copy, not AI
- End with something that makes a reader want to click through
- NEVER use: ${FORBIDDEN}
- NEVER use these phrases or close variants: ${BANNED_PHRASES}
- Use a contraction where it fits naturally (we're, it's, don't); real people use them

Return ONLY the meta description. No quotes. No label. No explanation.`
}

function buildFoodPrompt(body: any): string {
  const { title, location, diningType, positives, verdict } = body
  const highlights = (positives as string[])
    .filter(Boolean)
    .slice(0, 3)
    .join(' | ')
  const diningLabel = diningType === 'takeout' ? 'Takeout' : 'Dine-in'

  return `${BRAND_VOICE} You write SEO meta descriptions for our restaurant reviews, the food we hunt down on our NBA & WNBA arena trips.

Restaurant: ${title}
Location: ${location ?? 'Unknown'}
Experience type: ${diningLabel}
${highlights ? `Highlights: ${highlights}` : ''}
${verdict ? `Our verdict: ${verdict.slice(0, 200)}` : ''}

Write ONE meta description for Google search results. Hard rules:
- MUST be between 120 and 155 characters. Count every character, do not go under 120 or over 155
${NO_DASHES_RULE}
- Include "${title}" and "${location ?? 'the city'}"
- Mention something specific and honest about the food
- Sound like a real person wrote it, not a food critic or AI
- End with something that makes a reader want to click through
- NEVER use: ${FORBIDDEN}
- NEVER use these phrases or close variants: ${BANNED_PHRASES}
- Use a contraction where it fits naturally (we're, it's, don't); real people use them

Return ONLY the meta description. No quotes. No label. No explanation.`
}

function buildArenaPrompt(body: any): string {
  const { name, location, positives, verdict } = body
  const highlights = (positives as string[])
    .filter(Boolean)
    .slice(0, 3)
    .join(' | ')

  return `${BRAND_VOICE} You write SEO meta descriptions for our arena reviews.

Arena: ${name}
Location: ${location ?? 'Unknown'}
${highlights ? `Highlights: ${highlights}` : ''}
${verdict ? `Our verdict: ${verdict.slice(0, 200)}` : ''}

Write ONE meta description for Google search results. Hard rules:
- MUST be between 120 and 155 characters. Count every character, do not go under 120 or over 155
${NO_DASHES_RULE}
- Include "${name}" and "${location ?? 'the city'}"
- Mention one specific honest detail (food, sightlines, parking, atmosphere, etc.)
- Sound like a real fan who attended a game wrote it, not a tourism board
- End with something that makes a reader want to click through
- NEVER use: ${FORBIDDEN}
- NEVER use these phrases or close variants: ${BANNED_PHRASES}
- Use a contraction where it fits naturally (we're, it's, don't); real people use them

Return ONLY the meta description. No quotes. No label. No explanation.`
}

function buildCruisePrompt(body: any): string {
  const { title, shipName, cruiseLine, cabinType, nights, itineraryName, departurePort, tldr, positives, verdict } = body
  const highlights = ((positives ?? []) as string[])
    .filter(Boolean)
    .slice(0, 3)
    .join(' | ')
  const route = itineraryName || (nights ? `${nights}-night cruise` : 'cruise')

  return `${BRAND_VOICE} You write SEO meta descriptions for our cruise reviews.

Review: ${title ?? shipName}
Ship: ${shipName}${cruiseLine ? ` (${cruiseLine})` : ''}
Route: ${route}${departurePort ? ` from ${departurePort}` : ''}
${cabinType ? `Cabin: ${cabinType}` : ''}
${tldr ? `Our one-line take: ${tldr}` : ''}
${highlights ? `Highlights: ${highlights}` : ''}
${verdict ? `Our verdict: ${verdict.slice(0, 200)}` : ''}

Write ONE meta description for Google search results. Hard rules:
- MUST be between 120 and 155 characters. Count every character, do not go under 120 or over 155
${NO_DASHES_RULE}
- Start with "${shipName}" so it matches searches like "${shipName} review"
- Mention the route or cabin, and one specific, honest detail (food, crowds, cabin, cost)
- Sound like real cruisers wrote it, not a cruise line ad, not AI
- End with something that makes a reader want to click through
- NEVER use: ${FORBIDDEN}
- NEVER use these phrases or close variants: ${BANNED_PHRASES}
- Use a contraction where it fits naturally (we're, it's, don't); real people use them

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
  } else if (docType === 'cruiseReview') {
    prompt = buildCruisePrompt(req.body)
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
        signal: AbortSignal.timeout(9000),
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 1024,
            temperature: 0.5,
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      },
    )

    if (!geminiRes.ok) {
      const err = await geminiRes.json()
      const msg: string = err?.error?.message ?? `Gemini error ${geminiRes.status}`
      if (geminiRes.status === 429) {
        const retryMatch = msg.match(/retry in ([\d.]+)s/i)
        const seconds = retryMatch ? Math.ceil(Number(retryMatch[1])) : null
        const friendly = seconds
          ? `Gemini rate limit hit. Try again in ${seconds}s.`
          : 'Gemini rate limit hit. Wait a minute then try again.'
        return res.status(429).json({ error: friendly })
      }
      throw new Error(msg)
    }

    const data = await geminiRes.json()
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

    if (!raw) throw new Error('No response from Gemini')

    // Strip any surrounding quotes Gemini sometimes adds, then enforce the
    // 155-char meta description ceiling at a word boundary (schema only warns)
    const cleaned = stripDashes(raw.replace(/^["']|["']$/g, '').trim())
    const seoExcerpt = trimToSentence(cleaned, 155)

    res.status(200).json({ seoExcerpt })
  } catch (err: any) {
    console.error('[generate-seo-excerpt]', err)
    res.status(500).json({ error: err.message ?? 'Failed to generate SEO excerpt' })
  }
}
