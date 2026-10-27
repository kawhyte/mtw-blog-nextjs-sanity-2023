import type { NextApiRequest, NextApiResponse } from 'next'

import { askGemini } from '../../lib/gemini'
import { GeminiError } from '../../lib/gemini-image'
import { stripDashes } from '../../lib/gemini-voice'

function buildPrompt(body: any): string {
  const { shipName, cruiseLine, cabinType, perkProgram, nights, itineraryName, region, departurePort, ports, theme } = body
  return `You pick search tags for a cruise review on a travel blog. Tags feed site search and topic pages, so they should be the exact phrases cruisers type into Google.

Ship: ${shipName}
Cruise line: ${cruiseLine ?? 'unknown'}
${cabinType ? `Cabin type: ${cabinType}` : ''}
${perkProgram ? `Perk program: ${perkProgram}` : ''}
${nights ? `Length: ${nights} nights` : ''}
${itineraryName ? `Itinerary: ${itineraryName}` : ''}
${region ? `Region: ${region}` : ''}
${departurePort ? `Departs from: ${departurePort}` : ''}
${ports?.length ? `Ports: ${ports.join(', ')}` : ''}
${theme ? `Theme: ${theme}` : ''}

Give 10 to 14 tags, one per line, nothing else. Mix:
- the ship and line ("${shipName}", "${cruiseLine ?? ''}")
- ship plus cabin, e.g. "${shipName} ${cabinType ?? 'balcony'}"
- route searches, e.g. "Cabo overnight cruise", "cruises from Los Angeles"
- each port as a cruise port, e.g. "Ensenada cruise port"
- the perk program if any, e.g. "Sea Class", "The Retreat"

Rules:
- Short phrases, 1 to 5 words, Title Case for names
- Only use facts given above. Do not invent ports or features.
- No hashtags, no numbering, no quotes, no em dashes or en dashes`
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  if (!req.body?.shipName) {
    return res.status(400).json({ error: 'Pick the Ship on the Overview tab first' })
  }

  try {
    const { text } = await askGemini([{ text: buildPrompt(req.body) }])
    const tags = text
      .split('\n')
      .map((t) => stripDashes(t.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, '').replace(/["#]/g, '').trim()))
      .filter((t) => t && t.length <= 60)
      .filter((t, i, all) => all.findIndex((x) => x.toLowerCase() === t.toLowerCase()) === i)
      .slice(0, 14)

    if (!tags.length) return res.status(502).json({ error: 'Gemini returned no tags. Try again.' })
    return res.status(200).json({ tags })
  } catch (err: any) {
    console.error('[suggest-cruise-tags]', err)
    return res
      .status(err instanceof GeminiError ? err.status : 500)
      .json({ error: err.message ?? 'Failed to suggest tags' })
  }
}
