import type { NextApiRequest, NextApiResponse } from 'next'

import { askGemini } from '../../lib/gemini'
import { GeminiError } from '../../lib/gemini-image'
import { stripDashes } from '../../lib/gemini-voice'

// Search grounding plus one retry can take longer than the default limit
export const config = { maxDuration: 60 }

export interface CabinDetails {
  deck?: number
  position?: 'forward' | 'midship' | 'aft'
  sizeSqFt?: number
  balconySqFt?: number
  above?: string
  below?: string
}

// Celebrity numbers some decks with 2 digits after the deck (1233 is deck 12),
// so the cabin number can't tell its deck apart from 3-digit lines
const NO_DECK_RULE = ['celebrity']

/** Most lines number cabins deck first: 7640 is deck 7, 12216A is deck 12 */
export function deckFromCabinNumber(cabinNumber?: string, cruiseLine?: string): number | undefined {
  const digits = cabinNumber?.match(/^\d+/)?.[0]
  if (!digits || digits.length < 4 || NO_DECK_RULE.includes(cruiseLine ?? '')) return undefined
  return Number(digits.slice(0, digits.length - 3))
}

function buildPrompt(body: any): string {
  const { shipName, cabinNumber, cabinType } = body
  const cabin = cabinNumber ? `cabin ${cabinNumber}` : `a ${cabinType} cabin`
  return `Use Google Search to find details of ${cabin}${cabinType && cabinNumber ? ` (${cabinType})` : ''} on the cruise ship "${shipName}". Cabin-by-cabin sites like CruiseDeckPlans, CruiseMapper and the cruise line's deck plans are best.

Answer in exactly this format, one line each, nothing else:
deck: <deck number>
position: <forward, midship or aft>
sizeSqFt: <interior size in square feet>
balconySqFt: <balcony size in square feet, or none if no balcony>
above: <what is directly above, e.g. Cabins, Windjammer, pool deck>
below: <what is directly below>

Rules:
- Write unknown for anything no source confirms. Never guess.
- Sizes are plain numbers with no units.
- Do not use em dashes or en dashes.`
}

function parseDetails(text: string): CabinDetails {
  const details: CabinDetails = {}
  for (const line of text.split('\n')) {
    const match = line.replace(/[*_]/g, '').trim().match(/^[-•\s]*(\w+)\s*:\s*(.+)$/)
    if (!match) continue
    const [, key, raw] = match
    const value = raw.replace(/\.$/, '').trim()
    if (/^(unknown|n\/a)$/i.test(value)) continue
    const num = Number(value.match(/\d[\d,]*/)?.[0]?.replace(/,/g, ''))

    if (key === 'deck' && num) details.deck = num
    else if (key === 'sizeSqFt' && num) details.sizeSqFt = num
    else if (key === 'balconySqFt' && num) details.balconySqFt = num
    else if (key === 'position') {
      const pos = value.toLowerCase().match(/forward|midship|aft/)?.[0]
      if (pos) details.position = pos as CabinDetails['position']
    } else if (key === 'above') details.above = stripDashes(value)
    else if (key === 'below') details.below = stripDashes(value)
  }
  return details
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') return res.status(405).end()

  const { shipName, cabinNumber, cabinType, cruiseLine } = req.body ?? {}
  if (!shipName || (!cabinNumber && !cabinType)) {
    return res
      .status(400)
      .json({ error: 'Fill in Ship and Cabin Number (or Cabin Type) on the Overview tab first' })
  }

  try {
    const { text, candidate } = await askGemini([{ text: buildPrompt(req.body) }], {
      googleSearch: true,
    })
    const details = parseDetails(text)

    // No deck from the search: work it out from the cabin number where we can
    if (!details.deck) details.deck = deckFromCabinNumber(cabinNumber, cruiseLine)
    if (!details.deck) delete details.deck

    if (Object.keys(details).length === 0) {
      return res.status(404).json({ error: 'Could not find details for this cabin. Fill them in by hand.' })
    }

    const sources = ((candidate?.groundingMetadata?.groundingChunks ?? []) as any[])
      .map((c) => c.web?.title as string)
      .filter((t, i, all) => t && all.indexOf(t) === i)
      .slice(0, 5)

    return res.status(200).json({ details, sources })
  } catch (err: any) {
    console.error('[cabin-details]', err)
    return res
      .status(err instanceof GeminiError ? err.status : 500)
      .json({ error: err.message ?? 'Failed to fetch cabin details' })
  }
}
