import type { NextApiRequest, NextApiResponse } from 'next'

// --- Weight configs (mirrors lib/ratingWeights.ts + lib/calculateArenaRating.ts) ---

const ARENA_WEIGHTS: Record<string, number> = {
  transportation: 0.1,
  walkability: 0.2,
  seatComfort: 0.2,
  food: 0.2,
  view: 0.2,
  vibes: 0.1,
}

const HOTEL_WEIGHTS: Record<string, number> = {
  Location: 0.25,
  Bed_Comfort: 0.25,
  Service: 0.15,
  Value: 0.15,
  Room_Cleanliness: 0.1,
  Room_Amenities: 0.05,
  Internet_Speed: 0.03,
  Gym: 0.01,
  Pool: 0.01,
}

const FOOD_WEIGHTS: Record<string, number> = {
  Flavor_and_Taste: 0.3,
  Food_Value: 0.2,
  Restaurant_Service: 0.15,
  Memorability: 0.15,
  Presentation_on_Plate: 0.1,
  Restaurant_Cleanliness: 0.05,
  Restaurant_Location: 0.05,
}

const TAKEOUT_WEIGHTS: Record<string, number> = {
  tasteAndFlavor: 0.35,
  foodValue: 0.25,
  overallSatisfaction: 0.2,
  presentation: 0.1,
  packaging: 0.05,
  accuracy: 0.05,
}

// --- Human-readable labels ---

const ARENA_LABELS: Record<string, string> = {
  transportation: 'Getting There / Public Access',
  walkability: 'Navigation Within & Around Arena',
  seatComfort: 'Seat Comfort',
  food: 'Food & Drinks',
  view: 'View from Our Seat',
  vibes: 'Arena Vibes & Entertainment',
}

const HOTEL_LABELS: Record<string, string> = {
  Location: 'Location',
  Bed_Comfort: 'Bed Comfort',
  Service: 'Hotel Service',
  Value: 'Value for Money',
  Room_Cleanliness: 'Room Cleanliness',
  Room_Amenities: 'Room Amenities',
  Internet_Speed: 'WiFi Speed',
  Gym: 'Hotel Gym',
  Pool: 'Hotel Pool',
}

const FOOD_LABELS: Record<string, string> = {
  Flavor_and_Taste: 'Flavor & Taste',
  Food_Value: 'Value',
  Restaurant_Service: 'Service',
  Memorability: 'Would We Return?',
  Presentation_on_Plate: 'Presentation',
  Restaurant_Cleanliness: 'Cleanliness',
  Restaurant_Location: 'Location',
}

const TAKEOUT_LABELS: Record<string, string> = {
  tasteAndFlavor: 'Taste & Flavor',
  foodValue: 'Value',
  overallSatisfaction: 'Would We Order Again?',
  presentation: 'Presentation',
  packaging: 'Packaging',
  accuracy: 'Order Accuracy',
}

// Hotel amenities where an exact 0 means "Not Available" (not a real score)
const HOTEL_NA_FIELDS = ['Pool', 'Gym', 'Internet_Speed']

// --- Rating pre-processing ---

interface DigestedRatings {
  weightedScore: number
  textLabel: string
  strengths: { label: string; score: number; weight: number }[]
  weakSpots: { label: string; score: number; weight: number }[]
  naFields: string[]
  ratingLines: string[]
}

function scoreToLabel(score: number): string {
  if (score >= 9) return 'Excellent'
  if (score >= 8) return 'Great'
  if (score >= 7) return 'Good'
  if (score >= 5.5) return 'Fair'
  if (score >= 3) return 'Poor'
  return 'Horrible'
}

function preDigestRatings(
  ratings: Record<string, number>,
  weights: Record<string, number>,
  labels: Record<string, string>,
  naFields: string[] = [],
): DigestedRatings {
  let weightedSum = 0
  let totalWeight = 0
  const naFieldsFound: string[] = []
  const ratingLines: string[] = []
  const scored: { label: string; score: number; weight: number; contribution: number }[] = []

  for (const key of Object.keys(weights)) {
    const score = ratings[key]
    const weight = weights[key]!
    const label = labels[key] ?? key
    const pct = Math.round(weight * 100)

    if (typeof score !== 'number' || isNaN(score)) continue

    if (naFields.includes(key) && score === 0) {
      naFieldsFound.push(label)
      ratingLines.push(`- ${label}: Not Available  (${pct}% weight)`)
      continue
    }

    weightedSum += score * weight
    totalWeight += weight
    scored.push({ label, score, weight, contribution: score * weight })
    ratingLines.push(`- ${label}: ${score}/10  (${pct}% weight)`)
  }

  const weightedScore = totalWeight > 0 ? weightedSum / totalWeight : 0
  const textLabel = scoreToLabel(weightedScore)

  // Top 2 by weighted contribution (score × weight)
  const strengths = [...scored].sort((a, b) => b.contribution - a.contribution).slice(0, 2)

  // Weak spots: categories below 7, worst-first
  const weakSpots = scored
    .filter(({ score }) => score < 7)
    .sort((a, b) => a.score - b.score)
    .slice(0, 2)

  return { weightedScore, textLabel, strengths, weakSpots, naFields: naFieldsFound, ratingLines }
}

function formatInsights(d: DigestedRatings): string {
  const lines: string[] = []
  lines.push(`WEIGHTED SCORE: ${d.weightedScore.toFixed(1)}/10 = "${d.textLabel}"`)

  if (d.strengths.length > 0) {
    lines.push(`TOP STRENGTHS: ${d.strengths.map((s) => `${s.label} (${s.score}/10)`).join(', ')}`)
  }

  if (d.weakSpots.length > 0) {
    lines.push(
      `WEAK SPOT: ${d.weakSpots.map((s) => `${s.label} (${s.score}/10, ${Math.round(s.weight * 100)}% of score)`).join('; ')}`,
    )
  }

  if (d.naFields.length > 0) {
    lines.push(`NOT AVAILABLE (excluded from score): ${d.naFields.join(', ')}`)
  }

  return lines.join('\n')
}

function toneGuidance(score: number, label: string): string {
  if (score >= 9.0) {
    return `Score ${score.toFixed(1)} = "${label}" — Genuine enthusiasm. Don't hold back on praise. Close with something like "We'd go back in a heartbeat" or "Book it without hesitation."`
  }
  if (score >= 8.0) {
    return `Score ${score.toFixed(1)} = "${label}" — Strong positive. Name the best things with confidence. Acknowledge any weak spot briefly then move on. Close with "We'd go back" or "Worth every penny."`
  }
  if (score >= 7.0) {
    return `Score ${score.toFixed(1)} = "${label}" — Balanced and honest. Name the strongest thing first, then name the one gap plainly. Don't gush. Close with something like "Worth the visit if you're in [city]."`
  }
  if (score >= 5.5) {
    return `Score ${score.toFixed(1)} = "${label}" — Measured and cautionary. Lead with what worked, name the problem clearly. Close with something like "We'd probably try somewhere else next time" or "Worth it only if you're already in the area."`
  }
  if (score >= 3.0) {
    return `Score ${score.toFixed(1)} = "${label}" — Frank and direct. Lead with the core problem. Any positives are mentioned for context only — they cannot save the tone. Close with "Skip it." or "Wouldn't rush back."`
  }
  return `Score ${score.toFixed(1)} = "${label}" — Very blunt. This was a poor experience and the verdict must say so clearly. Do not soften it. Close with "Hard pass." or "We won't be back."`
}

// --- Shared voice rules ---

const VOICE_RULES = `You write verdicts for "Meet the Whytes," a travel couple's blog covering NBA arenas, hotel stays, and dining experiences.

VOICE RULES — follow every one:
- Write as "we" (a couple traveling together), warm, direct, and confident
- Use "&" instead of "and" in casual phrasing — not every sentence, just naturally
- State opinions directly: "top-notch", "divine", "exactly what we needed", "worth every penny"
- Be honest about negatives — name them plainly but fairly, don't sugarcoat or bury them
- Use sensory detail for food: textures, flavors, temperatures, reference specific dish names
- End with a clear, forward-looking close that matches the tone set by the WEIGHTED SCORE
- Write like a trusted friend giving real advice, not a press release
- FORBIDDEN WORDS — never use any of these: showcasing, stunning, vibrant, world-class, nestled, boasting, iconic, offering, featuring, seamlessly, elevate, state-of-the-art, modern amenities, culinary, experience (as a noun), impeccable, overall
- Do NOT mention specific score numbers in the verdict text — let the language carry the weight ("the food was the clear weak link" not "the food scored 5/10")
- TONE IS NON-NEGOTIABLE: The weighted score sets the emotional ceiling. Even if the positives list is glowing, a score below 6 cannot produce a warm or enthusiastic verdict.`

// --- Prompt builders ---

function buildArenaPrompt(body: any): string {
  const { name, location, positives, negatives, foodItems, arenaRatings } = body

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

  let ratingsBlock = ''
  let toneBlock = ''

  const hasRatings =
    arenaRatings && typeof arenaRatings === 'object' && Object.keys(arenaRatings).length > 0

  if (hasRatings) {
    const d = preDigestRatings(arenaRatings, ARENA_WEIGHTS, ARENA_LABELS)
    ratingsBlock = `ARENA RATINGS (1–10 scale):\n${d.ratingLines.join('\n')}\n\n${formatInsights(d)}`
    toneBlock = `TONE — This is non-negotiable:\n${toneGuidance(d.weightedScore, d.textLabel)}\nCRITICAL: Even if the positives list is glowing, the tone must match the weighted score. Positives add color; they cannot override the emotional register.`
  }

  return `${VOICE_RULES}

SEO RULES:
- Use "${name}" naturally 2–3 times
- Include "${location}" at least once
- Weave 2–3 key differentiators from the positives into natural sentences
- HARD LIMIT: Stay under 600 characters total (roughly 85–95 words). Count carefully — do not exceed this.
- Plain paragraphs only — no headers, no bullet points

${ratingsBlock ? ratingsBlock + '\n\n' : ''}${toneBlock ? toneBlock + '\n\n' : ''}ARENA DATA:
Arena: ${name}
Location: ${location}
Positives:
${posStr || '(none listed)'}
Negatives:
${negStr || '(none listed)'}
${itemStr ? `Food/drinks we tried:\n${itemStr}` : ''}

Write the verdict now.`
}

function buildHotelPrompt(body: any): string {
  const {
    title,
    location,
    category,
    positives,
    negatives,
    tip,
    wouldReturn,
    priceTier,
    bestFor,
    hotelRatings,
  } = body

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
  const priceStr = priceTier ? `Price tier: ${(priceTier as string).replace(/_/g, ' ')}` : ''
  const bestForStr =
    Array.isArray(bestFor) && bestFor.length ? `Best for: ${bestFor.join(', ')}` : ''

  let ratingsBlock = ''
  let toneBlock = ''

  const hasRatings =
    hotelRatings && typeof hotelRatings === 'object' && Object.keys(hotelRatings).length > 0

  if (hasRatings) {
    const d = preDigestRatings(hotelRatings, HOTEL_WEIGHTS, HOTEL_LABELS, HOTEL_NA_FIELDS)
    ratingsBlock = `HOTEL RATINGS (0–10 scale):\n${d.ratingLines.join('\n')}\n\n${formatInsights(d)}`
    toneBlock = `TONE — This is non-negotiable:\n${toneGuidance(d.weightedScore, d.textLabel)}\nCRITICAL: Even if the positives list is glowing, the tone must match the weighted score. Positives add color; they cannot override the emotional register.`
  }

  return `${VOICE_RULES}

SEO RULES:
- Use "${title}" naturally 2–3 times
- Include "${location}" at least once
- Weave 2–3 key differentiators from the positives into natural sentences
- HARD LIMIT: Stay under 600 characters total (roughly 85–95 words). Count carefully — do not exceed this.
- Plain paragraphs only — no headers, no bullet points

${ratingsBlock ? ratingsBlock + '\n\n' : ''}${toneBlock ? toneBlock + '\n\n' : ''}HOTEL DATA:
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
  const {
    title,
    location,
    diningType,
    positives,
    negatives,
    tip,
    foodItems,
    foodRatings,
    takeoutRatings,
  } = body

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

  const isTakeout = diningType === 'takeout'
  const activeRatings = isTakeout ? takeoutRatings : foodRatings
  const activeWeights = isTakeout ? TAKEOUT_WEIGHTS : FOOD_WEIGHTS
  const activeLabels = isTakeout ? TAKEOUT_LABELS : FOOD_LABELS

  let ratingsBlock = ''
  let toneBlock = ''

  const hasRatings =
    activeRatings && typeof activeRatings === 'object' && Object.keys(activeRatings).length > 0

  if (hasRatings) {
    const d = preDigestRatings(activeRatings, activeWeights, activeLabels)
    const ratingTitle = isTakeout ? 'TAKEOUT RATINGS (0–10 scale)' : 'FOOD RATINGS (0–10 scale)'
    ratingsBlock = `${ratingTitle}:\n${d.ratingLines.join('\n')}\n\n${formatInsights(d)}`
    toneBlock = `TONE — This is non-negotiable:\n${toneGuidance(d.weightedScore, d.textLabel)}\nCRITICAL: Even if the positives list is glowing, the tone must match the weighted score. Positives add color; they cannot override the emotional register.`
  }

  return `${VOICE_RULES}

SEO RULES:
- Use "${title}" naturally 2–3 times
- Include "${location}" at least once
- Reference specific dishes by name when available
- HARD LIMIT: Stay under 600 characters total (roughly 85–95 words). Count carefully — do not exceed this.
- Plain paragraphs only — no headers, no bullet points

${ratingsBlock ? ratingsBlock + '\n\n' : ''}${toneBlock ? toneBlock + '\n\n' : ''}RESTAURANT DATA:
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
        // 9s — exits cleanly before Vercel Hobby's 10s hard kill
        signal: AbortSignal.timeout(9000),
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 8192, temperature: 0.75 },
          // Disable thinking — gemini-2.5-flash thinks by default, adding 15–30s.
          // For descriptive writing tasks it adds no quality benefit.
          thinkingConfig: { thinkingBudget: 0 },
        }),
      },
    )

    if (!geminiRes.ok) {
      const err = await geminiRes.json()
      const msg: string = err?.error?.message ?? `Gemini error ${geminiRes.status}`
      // Surface quota errors with the retry delay Gemini provides
      if (geminiRes.status === 429) {
        const retryMatch = msg.match(/retry in ([\d.]+)s/i)
        const seconds = retryMatch ? Math.ceil(Number(retryMatch[1])) : null
        const friendly = seconds
          ? `Gemini rate limit hit — try again in ${seconds}s.`
          : 'Gemini rate limit hit — wait a minute then try again.'
        return res.status(429).json({ error: friendly })
      }
      throw new Error(msg)
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
