import type { NextApiRequest, NextApiResponse } from 'next'

import { askGemini } from '../../lib/gemini'
import { GeminiError } from '../../lib/gemini-image'
import { stripDashes } from '../../lib/gemini-voice'

// Search grounding plus one retry can take longer than the default limit
export const config = { maxDuration: 60 }

const NUMBER_KEYS = [
  'yearBuilt',
  'lastRefurb',
  'grossTonnage',
  'guestsDouble',
  'guestsMax',
  'crew',
  'decks',
] as const

export interface ShipFacts {
  shipClass?: string
  yearBuilt?: number
  lastRefurb?: number
  grossTonnage?: number
  guestsDouble?: number
  guestsMax?: number
  crew?: number
  decks?: number
  sisterShips?: string[]
  sisterDifferences?: string
}

export interface FactSource {
  field: string
  sourceCount: number
  sources: { title: string; url: string }[]
}

// One sentence per fact, so Google's grounding data can tie each fact to the
// pages that support it (JSON comes back as one block with no per-field sources)
function buildPrompt(shipName: string, cruiseLine?: string): string {
  return `Look up current facts about the cruise ship "${shipName}"${cruiseLine ? ` (${cruiseLine})` : ''} using Google Search.

Answer with exactly one sentence per line, in this order, each line starting with its key and a colon, and each ending with a period:
shipClass: The ship class is X Class.
yearBuilt: The ship entered service in YEAR.
lastRefurb: The most recent dry dock refurbishment was in YEAR.
grossTonnage: The gross tonnage is N.
guestsDouble: Double occupancy capacity is N guests.
guestsMax: Maximum capacity is N guests.
crew: The crew numbers N.
decks: The ship has N decks.
sisterShips: Sister ships in the same class are A, B and C.
sisterDifferences: One plain sentence on how this ship differs from its sisters.

Rules:
- If no source confirms a fact, write the key followed by: unknown.
- Never guess.
- Do not use em dashes or en dashes.
- No other text.`
}

function parseLines(raw: string): ShipFacts {
  const facts: ShipFacts = {}
  for (const line of raw.split('\n')) {
    const match = line.match(/^\s*(\w+):\s*(.+?)\s*$/)
    if (!match) continue
    const [, key, sentence] = match
    if (/^unknown\.?$/i.test(sentence)) continue

    if ((NUMBER_KEYS as readonly string[]).includes(key)) {
      // Years are the 4-digit number, so "on 5 September 2025" reads as 2025
      const num = /year|refurb/i.test(key)
        ? sentence.match(/\b(?:19|20)\d{2}\b/)
        : sentence.match(/\d[\d,]*/)
      const n = num ? Number(num[0].replace(/,/g, '')) : NaN
      if (Number.isFinite(n) && n > 0) facts[key as (typeof NUMBER_KEYS)[number]] = n
    } else if (key === 'shipClass') {
      const value = sentence.match(/class is (.+?)\.?$/i)?.[1]
      if (value) facts.shipClass = value
    } else if (key === 'sisterShips') {
      const list = sentence.match(/ are (.+?)\.?$/i)?.[1]
      if (list) {
        facts.sisterShips = list
          .split(/,\s*(?:and\s+)?|\s+and\s+/)
          .map((s) => s.trim())
          .filter(Boolean)
      }
    } else if (key === 'sisterDifferences') {
      facts.sisterDifferences = stripDashes(sentence)
    }
  }
  // A refurb can't come before the ship was built
  if (facts.lastRefurb && facts.yearBuilt && facts.lastRefurb <= facts.yearBuilt) {
    delete facts.lastRefurb
  }
  return facts
}

// Grounding links are Google redirects; turn them into the real page address
async function resolveUrl(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      redirect: 'manual',
      signal: AbortSignal.timeout(4000),
    })
    return res.headers.get('location') ?? url
  } catch {
    return url
  }
}

async function factSources(candidate: any, facts: ShipFacts): Promise<FactSource[]> {
  const chunks: any[] = candidate?.groundingMetadata?.groundingChunks ?? []
  const supports: any[] = candidate?.groundingMetadata?.groundingSupports ?? []
  const urls = new Map<number, Promise<string>>()
  const urlFor = (i: number) => {
    if (!urls.has(i)) urls.set(i, resolveUrl(chunks[i]?.web?.uri ?? ''))
    return urls.get(i) as Promise<string>
  }

  const byField = new Map<string, number[]>()
  for (const support of supports) {
    const key = String(support.segment?.text ?? '').trim().match(/^(\w+):/)?.[1]
    if (!key || !(key in facts)) continue
    byField.set(key, [...(byField.get(key) ?? []), ...(support.groundingChunkIndices ?? [])])
  }

  return Promise.all(
    Object.keys(facts).map(async (field) => {
      // One link per site, so 5 royalcaribbean.com pages count once
      const seen = new Set<string>()
      const indices = (byField.get(field) ?? []).filter((i) => {
        const title = chunks[i]?.web?.title
        if (!title || seen.has(title)) return false
        seen.add(title)
        return true
      })
      const sources = await Promise.all(
        indices.slice(0, 3).map(async (i) => ({
          _key: `${field}-${i}`,
          title: chunks[i].web.title as string,
          url: await urlFor(i),
        })),
      )
      return { _key: field, field, sourceCount: indices.length, sources }
    }),
  )
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') return res.status(405).end()

  const { shipName, cruiseLine }: { shipName?: string; cruiseLine?: string } =
    req.body
  if (!shipName?.trim()) {
    return res.status(400).json({ error: 'Fill in Ship Name on the Overview tab first' })
  }

  try {
    const { text, candidate } = await askGemini(
      [{ text: buildPrompt(shipName.trim(), cruiseLine) }],
      { googleSearch: true },
    )
    const facts = parseLines(text)
    if (Object.keys(facts).length === 0) {
      return res.status(502).json({ error: 'Gemini did not return usable ship facts. Try again.' })
    }
    return res.status(200).json({ facts, factSources: await factSources(candidate, facts) })
  } catch (err: any) {
    console.error('[ship-facts]', err)
    return res
      .status(err instanceof GeminiError ? err.status : 500)
      .json({ error: err.message ?? 'Failed to fetch ship facts' })
  }
}
