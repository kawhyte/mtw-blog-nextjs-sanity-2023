import type { NextApiRequest, NextApiResponse } from 'next'

import {
  ANTI_AI_RULES,
  BRAND_VOICE,
  stripDashes,
  trimToSentence,
} from '../../lib/gemini-voice'

// Allow time for a slow Gemini response (default function limits can be ~10s)
export const config = { maxDuration: 30 }

// Matches the schema's warning for the Verdict Headline field
const MAX_LENGTH = 120

const WOULD_RETURN: Record<string, string> = {
  yes: 'Yes, absolutely',
  if_prices_drop: 'Only if prices drop',
  maybe: 'Maybe',
  no: 'No',
}

const PRICE_TIER: Record<string, string> = {
  under_100: 'under $100/night',
  '100_200': '$100 to $200/night',
  '200_350': '$200 to $350/night',
  '350_500': '$350 to $500/night',
  '500_plus': '$500+/night',
}

// Keys whose value is "yes" in the tech / amenities objects, as readable words
const availableFeatures = (obj?: Record<string, unknown>) =>
  Object.entries(obj ?? {})
    .filter(
      ([key, value]) =>
        !key.startsWith('_') && String(value).toLowerCase() === 'yes',
    )
    .map(([key]) =>
      key
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/_/g, ' ')
        .toLowerCase(),
    )

function buildHotelPrompt(body: any): string {
  const {
    title,
    location,
    category,
    room,
    positives = [],
    negatives = [],
    verdict,
    wouldReturn,
    priceTier,
    internetSpeed,
    techRating,
    roomAmenities,
  } = body
  const loved = (positives as string[]).filter(Boolean).slice(0, 5).join(' | ')
  const disliked = (negatives as string[])
    .filter(Boolean)
    .slice(0, 4)
    .join(' | ')
  const features = [
    ...availableFeatures(techRating),
    ...availableFeatures(roomAmenities),
  ]
    .slice(0, 8)
    .join(', ')

  return `${BRAND_VOICE} You write the one-line "Our take" that sits under the photos on our hotel reviews, the first thing a reader sees after the pictures.

Hotel: ${title}
Location: ${location ?? 'Unknown'}
${category ? `Type: ${category}` : ''}
${room ? `Room we stayed in: ${room}` : ''}
${verdict ? `Our full verdict: ${String(verdict).slice(0, 600)}` : ''}
${loved ? `What we loved: ${loved}` : ''}
${disliked ? `What we didn't like: ${disliked}` : ''}
${wouldReturn ? `Would we return: ${WOULD_RETURN[wouldReturn] ?? wouldReturn}` : ''}
${priceTier ? `Price: ${PRICE_TIER[priceTier] ?? priceTier}` : ''}
${internetSpeed ? `Wi-Fi speed: ${internetSpeed} Mbps` : ''}
${features ? `In-room tech & amenities: ${features}` : ''}

Write ONE line that sums up the stay. Hard rules:
- ONE sentence, ${MAX_LENGTH} characters or fewer. Count every character
- Give the honest bottom line (would we stay again, and why): a real opinion, not a description
- Work in the hotel's name or the city naturally, so it reads well in search; never keyword-stuff
- Use ONE specific detail from our notes above, never a generic one
- If there's a real catch (a resort fee, a closed pool), it's fine to hint at it
- First person plural ("we"), like we're telling a friend
- Don't open with "We'd" or "We would". Lead with the most telling detail or the hotel itself, e.g. "The staff made this stay…", "Great location, but…"
${ANTI_AI_RULES}

Return ONLY the line. No quotes. No label. No explanation.`
}

// Best-rated dishes first, as "Branzino (4.5/5, $44)"
const topDishes = (
  dishes: { name?: string; rating?: number; price?: number }[] = [],
) =>
  dishes
    .filter((dish) => dish?.name)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 4)
    .map((dish) => {
      const details = [
        dish.rating != null ? `${dish.rating / 2}/5` : null,
        dish.price ? `$${dish.price}` : null,
      ].filter(Boolean)
      return `${dish.name!.trim()}${details.length ? ` (${details.join(', ')})` : ''}`
    })
    .join(' | ')

function buildFoodPrompt(body: any): string {
  const {
    title,
    location,
    diningType,
    priceTier,
    positives = [],
    negatives = [],
    verdict,
    dishes,
  } = body
  const loved = (positives as string[]).filter(Boolean).slice(0, 5).join(' | ')
  const disliked = (negatives as string[])
    .filter(Boolean)
    .slice(0, 4)
    .join(' | ')
  const ordered = topDishes(dishes)

  return `${BRAND_VOICE} You write the one-line "Our take" that sits under the photos on our restaurant reviews, the first thing a reader sees after the pictures.

Restaurant: ${title}
Location: ${location ?? 'Unknown'}
${diningType ? `How we ate: ${diningType === 'takeout' ? 'Takeout' : 'Dine-in'}` : ''}
${priceTier ? `Price: ${priceTier}` : ''}
${verdict ? `Our full verdict: ${String(verdict).slice(0, 600)}` : ''}
${loved ? `What we loved: ${loved}` : ''}
${disliked ? `What we didn't like: ${disliked}` : ''}
${ordered ? `What we ordered (best first): ${ordered}` : ''}

Write ONE line that sums up the meal. Hard rules:
- ONE sentence, ${MAX_LENGTH} characters or fewer. Count every character
- Give the honest bottom line (would we go back, and why): a real opinion, not a description
- Work in the restaurant's name or the city naturally, so it reads well in search; never keyword-stuff
- Use ONE specific detail from our notes above (a dish we loved is ideal), never a generic one
- If there's a real catch (slow service, tiny tables), it's fine to hint at it
- First person plural ("we"), like we're telling a friend
- Don't open with "We'd" or "We would". Lead with the most telling detail or the restaurant itself, e.g. "The branzino alone…", "Great seafood, but…"
${ANTI_AI_RULES}

Return ONLY the line. No quotes. No label. No explanation.`
}

const ARENA_RATING_NAMES: Record<string, string> = {
  vibes: 'Atmosphere',
  view: 'Sightlines',
  seatComfort: 'Seat comfort',
  food: 'Food',
  transportation: 'Getting there',
  walkability: 'Walkability',
}

function buildArenaPrompt(body: any): string {
  const {
    title,
    location,
    positives = [],
    negatives = [],
    verdict,
    arenaReview,
    teams = [],
  } = body
  const loved = (positives as string[]).filter(Boolean).slice(0, 5).join(' | ')
  const disliked = (negatives as string[])
    .filter(Boolean)
    .slice(0, 4)
    .join(' | ')
  // Scores are stored out of 10; readers see them out of 5
  const scores = Object.entries(ARENA_RATING_NAMES)
    .filter(([key]) => typeof arenaReview?.[key] === 'number')
    .map(([key, name]) => `${name} ${(arenaReview[key] / 2).toFixed(1)}/5`)
    .join(', ')
  const games = (teams as { name: string; games: number }[])
    .map(
      (team) =>
        `${team.name} (${team.games} game${team.games === 1 ? '' : 's'})`,
    )
    .join(', ')

  return `${BRAND_VOICE} You write the one-line "Our take" that sits under the photos on our NBA and WNBA arena reviews. It's the first thing a reader sees after the pictures.

Arena: ${title}
Location: ${location ?? 'Unknown'}
${games ? `Teams we saw here: ${games}` : ''}
${scores ? `Our scores: ${scores}` : ''}
${verdict ? `Our full verdict: ${String(verdict).slice(0, 600)}` : ''}
${loved ? `What we loved: ${loved}` : ''}
${disliked ? `What we didn't like: ${disliked}` : ''}

Write ONE line that sums up a game night here. Hard rules:
- ONE sentence, ${MAX_LENGTH} characters or fewer. Count every character
- Give the honest bottom line (is it worth the trip, and why). A real opinion, not a description
- Work in the arena's name, the team or the city naturally, so it reads well in search. Never keyword-stuff
- Use ONE specific detail from our notes or scores above, never a generic one
- If there's a real catch (weak food, a long walk), it's fine to hint at it
- First person plural ("we"), like we're telling a friend
- Don't open with "We'd" or "We would". Lead with the most telling detail, the team or the arena itself
${ANTI_AI_RULES}

Return ONLY the line. No quotes. No label. No explanation.`
}

const PROMPT_BUILDERS: Record<string, (body: any) => string> = {
  hotelReview: buildHotelPrompt,
  foodReview: buildFoodPrompt,
  arenas: buildArenaPrompt,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') return res.status(405).end()

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey)
    return res.status(500).json({ error: 'Gemini API key not configured' })

  const { docType } = req.body
  const buildPrompt = PROMPT_BUILDERS[docType]
  if (!buildPrompt) {
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
        // Gemini occasionally takes ~10s; the Studio button waits up to 20s
        signal: AbortSignal.timeout(15000),
        body: JSON.stringify({
          contents: [{ parts: [{ text: buildPrompt(req.body) }] }],
          generationConfig: {
            maxOutputTokens: 512,
            temperature: 0.8,
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      },
    )

    if (!geminiRes.ok) {
      const err = await geminiRes.json()
      const msg: string =
        err?.error?.message ?? `Gemini error ${geminiRes.status}`
      if (geminiRes.status === 429) {
        const retryMatch = msg.match(/retry in ([\d.]+)s/i)
        const seconds = retryMatch ? Math.ceil(Number(retryMatch[1])) : null
        return res.status(429).json({
          error: seconds
            ? `Gemini rate limit hit. Try again in ${seconds}s.`
            : 'Gemini rate limit hit. Wait a minute then try again.',
        })
      }
      throw new Error(msg)
    }

    const data = await geminiRes.json()
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
    if (!raw) throw new Error('No response from Gemini')

    // Keep it to one line; strip quotes only when they wrap the whole line
    // (a quoted word inside the line, like say "maybe", must stay intact).
    // Then enforce the length limit at a sentence/word boundary.
    const firstLine = raw.split('\n')[0].trim()
    const cleaned = /^["“].*["”]$/.test(firstLine)
      ? firstLine.slice(1, -1).trim()
      : firstLine
    // Kenny's style: no dashes, even if Gemini slips one in
    const verdictHeadline = trimToSentence(stripDashes(cleaned), MAX_LENGTH)

    res.status(200).json({ verdictHeadline })
  } catch (err: any) {
    console.error('[generate-verdict-headline]', err)
    res
      .status(500)
      .json({ error: err.message ?? 'Failed to generate verdict headline' })
  }
}
