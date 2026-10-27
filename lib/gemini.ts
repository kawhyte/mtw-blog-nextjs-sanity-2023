// Shared by the cruise lookup routes (ship facts, itinerary)

import { GeminiError } from './gemini-image'

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export interface GeminiAnswer {
  text: string
  /** The raw candidate, for grounding (source) data */
  candidate: any
}

/**
 * Sends parts (text and/or inline images) to Gemini and returns the text.
 * Retries once when Gemini is busy or slow; a used-up free limit comes back
 * as a 429 GeminiError with a plain message. Two tries of up to 25s each fit
 * a 60s route.
 */
export async function askGemini(
  parts: unknown[],
  options: { googleSearch?: boolean; maxOutputTokens?: number } = {},
): Promise<GeminiAnswer> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new GeminiError('Gemini API key not configured')

  for (let attempt = 1; ; attempt++) {
    let res: Response
    try {
      res = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        signal: AbortSignal.timeout(25000),
        body: JSON.stringify({
          contents: [{ parts }],
          ...(options.googleSearch && { tools: [{ google_search: {} }] }),
          generationConfig: {
            maxOutputTokens: options.maxOutputTokens ?? 1024,
            temperature: 0.1,
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      })
    } catch {
      // Gemini sometimes hangs when it's busy
      if (attempt < 2) continue
      throw new GeminiError('Gemini is slow to answer right now. Try again in a minute.', 504)
    }

    if (res.ok) {
      const data = await res.json()
      const candidate = data.candidates?.[0]
      const text: string = (candidate?.content?.parts ?? [])
        .map((p: any) => p.text ?? '')
        .join('')
        .trim()
      if (!text) throw new GeminiError('Gemini returned nothing, try again', 502)
      return { text, candidate }
    }

    if ((res.status === 429 || res.status >= 500) && attempt < 2) {
      await sleep(3000)
      continue
    }
    if (res.status === 429) {
      throw new GeminiError("Gemini's free limit is used up for now. Try again in a minute.", 429)
    }
    const body = await res.json().catch(() => null)
    throw new GeminiError(body?.error?.message ?? `Gemini error ${res.status}`, 502)
  }
}
