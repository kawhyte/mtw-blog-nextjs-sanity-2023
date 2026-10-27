import type { NextApiRequest, NextApiResponse } from 'next'

import { askGemini } from '../../lib/gemini'
import { GeminiError } from '../../lib/gemini-image'

// Search grounding plus one retry can take longer than the default limit
export const config = {
  maxDuration: 60,
  // Screenshots are shrunk in the browser first, this is headroom
  api: { bodyParser: { sizeLimit: '4mb' } },
}

const STOP_TYPES = ['embarkation', 'sea', 'docked', 'tendered', 'overnight', 'debarkation']

export interface ItineraryDay {
  day: number
  port: string
  stopType?: string
  arrive?: string
  depart?: string
}

export interface Itinerary {
  itineraryName?: string
  departurePort?: string
  foundDate?: string
  days: ItineraryDay[]
}

const OUTPUT_FORMAT = `Answer in exactly this plain text format, nothing else:
foundDate: <departure date of the sailing you used, YYYY-MM-DD, or empty if not shown>
itineraryName: <the line's name for the route, e.g. 6-Night Mexican Riviera (Cabo Overnight & Ensenada)>
departurePort: <city (port area), e.g. Los Angeles (San Pedro)>
Day 1 | <port> | embarkation | | <depart time>
Day 2 | Sea Day | sea | |
Day 3 | <port> | <docked or tendered or overnight> | <arrive time> | <depart time>
...
Day N | <port> | debarkation | <arrive time> |

Rules:
- One line per day, every day of the sailing, numbered from Day 1.
- The type is one of: ${STOP_TYPES.join(', ')}. Use "overnight" for both days of an overnight stay.
- Times like 8:00 AM. Leave a time empty when it is not shown or not confirmed. Never guess.
- Use the port's common English name, e.g. Cabo San Lucas, Mexico.
- Do not use em dashes or en dashes.`

function searchPrompt(body: any): string {
  const { shipName, cruiseLine, sailingDate, nights } = body
  return `Use Google Search to find the published itinerary for the cruise ship "${shipName}"${cruiseLine ? ` (${cruiseLine})` : ''} departing on ${sailingDate}${nights ? ` for ${nights} nights` : ''}. Prefer the cruise line's own site, then CruiseMapper or travel agent listings for that exact date.

If that exact date is not listed but the same ship has a sailing of the same length within 3 days of it, use that sailing and give its date in foundDate. Otherwise answer only: NOT FOUND

${OUTPUT_FORMAT}`
}

const SCREENSHOT_PROMPT = `This is a screenshot of a cruise itinerary from a cruise line app, booking confirmation or website. Read the itinerary exactly as shown. Do not add anything that is not in the image.

If the image is not a cruise itinerary, answer only: NOT FOUND

${OUTPUT_FORMAT}`

function parseItinerary(text: string): Itinerary {
  const result: Itinerary = { days: [] }
  for (const raw of text.split('\n')) {
    const line = raw.trim()
    const field = line.match(/^(itineraryName|departurePort):\s*(.+)$/)
    if (field) {
      result[field[1] as 'itineraryName' | 'departurePort'] = field[2].replace(/[–—]/g, ', ')
      continue
    }
    const cells = line.split('|').map((c) => c.trim())
    const dayNum = Number(cells[0]?.match(/^Day\s+(\d+)$/i)?.[1])
    if (!dayNum || !cells[1]) continue
    const stopType = cells[2]?.toLowerCase()
    result.days.push({
      day: dayNum,
      port: cells[1],
      ...(STOP_TYPES.includes(stopType) && { stopType }),
      ...(cells[3] && { arrive: cells[3] }),
      ...(cells[4] && { depart: cells[4] }),
    })
  }
  return result
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') return res.status(405).end()

  const { mode, imageBase64, mimeType, shipName, sailingDate } = req.body ?? {}

  if (mode === 'search' && (!shipName || !sailingDate)) {
    return res
      .status(400)
      .json({ error: 'Fill in Ship and Sailing Date on the Overview tab first' })
  }
  if (mode === 'screenshot' && !imageBase64) {
    return res.status(400).json({ error: 'No screenshot received' })
  }
  if (mode !== 'search' && mode !== 'screenshot') {
    return res.status(400).json({ error: 'mode must be search or screenshot' })
  }

  try {
    const { text, candidate } =
      mode === 'search'
        ? await askGemini([{ text: searchPrompt(req.body) }], { googleSearch: true })
        : await askGemini([
            { inlineData: { mimeType: mimeType || 'image/jpeg', data: imageBase64 } },
            { text: SCREENSHOT_PROMPT },
          ])

    const itinerary = parseItinerary(text)
    if (/NOT FOUND/.test(text) || itinerary.days.length === 0) {
      return res.status(404).json({
        error:
          mode === 'search'
            ? 'Could not find this exact sailing online. Try a screenshot of your itinerary instead.'
            : 'Could not read an itinerary in that image. Try a clearer screenshot.',
      })
    }

    const sources = ((candidate?.groundingMetadata?.groundingChunks ?? []) as any[])
      .map((c) => c.web?.title as string)
      .filter((t, i, all) => t && all.indexOf(t) === i)
      .slice(0, 5)

    return res.status(200).json({ itinerary, sources })
  } catch (err: any) {
    console.error('[cruise-itinerary]', err)
    return res
      .status(err instanceof GeminiError ? err.status : 500)
      .json({ error: err.message ?? 'Failed to fill the itinerary' })
  }
}
