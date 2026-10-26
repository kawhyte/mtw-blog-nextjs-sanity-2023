import type { NextApiRequest, NextApiResponse } from 'next'

import { askGemini } from '../../lib/gemini'
import { GeminiError } from '../../lib/gemini-image'
import { stripDashes } from '../../lib/gemini-voice'

// Search grounding plus one retry can take longer than the default limit
export const config = { maxDuration: 60 }

function buildPrompt(body: any): string {
  const { cruiseLine, shipName, program, cabinType } = body
  const subject = program && program !== 'none' ? program : `${cabinType ?? 'standard'} cabins`
  return `Use Google Search to find the CURRENT perks of ${subject} on ${cruiseLine}${shipName ? `, as offered on ${shipName}` : ''}. Prefer the cruise line's own site, then recent (2025 or later) guides like Royal Caribbean Blog or Cruise Critic.

Answer with one line per perk, nothing else:
included: <a perk this cabin gets, short, e.g. Access to the Suite Lounge>
notIncluded: <a perk guests often EXPECT but do not get, e.g. No priority tendering>

Rules:
- 4 to 10 "included" lines and 2 to 5 "notIncluded" lines.
- Each perk under 70 characters, plain words, no marketing language.
- Only perks a source confirms. Never guess.
- Do not use em dashes or en dashes.`
}

function parsePerks(text: string) {
  const included: string[] = []
  const notIncluded: string[] = []
  for (const line of text.split('\n')) {
    // Gemini sometimes adds bullets or bold: "- **included:** ..."
    const match = line
      .replace(/[*_]/g, '')
      .trim()
      .match(/^[-•\s]*(included|not\s*included)\s*:\s*(.+)$/i)
    if (!match) continue
    const perk = stripDashes(match[2].replace(/\.$/, '').trim())
    ;(/^included$/i.test(match[1]) ? included : notIncluded).push(perk)
  }
  return { included, notIncluded }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') return res.status(405).end()

  if (!req.body?.cruiseLine) {
    return res.status(400).json({ error: 'Pick the Cruise Line on the Overview tab first' })
  }
  if (!req.body.program && !req.body.cabinType) {
    return res.status(400).json({ error: 'Pick a Perk Program or a Cabin Type first' })
  }

  try {
    // Gemini now and then answers in a format we can't read: ask once more
    let parsed = parsePerks('')
    let candidate: any
    for (let attempt = 1; attempt <= 2 && !parsed.included.length; attempt++) {
      const answer = await askGemini([{ text: buildPrompt(req.body) }], { googleSearch: true })
      parsed = parsePerks(answer.text)
      candidate = answer.candidate
    }
    const { included, notIncluded } = parsed
    if (!included.length) {
      return res.status(502).json({ error: 'Gemini did not return usable perks. Try again.' })
    }

    const sources = ((candidate?.groundingMetadata?.groundingChunks ?? []) as any[])
      .map((c) => c.web?.title as string)
      .filter((t, i, all) => t && all.indexOf(t) === i)
      .slice(0, 5)

    return res.status(200).json({ included, notIncluded, sources })
  } catch (err: any) {
    console.error('[cabin-perks]', err)
    return res
      .status(err instanceof GeminiError ? err.status : 500)
      .json({ error: err.message ?? 'Failed to fetch perks' })
  }
}
