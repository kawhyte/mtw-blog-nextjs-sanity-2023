import type { NextApiRequest, NextApiResponse } from 'next'

import { describePhoto, GeminiError } from '../../lib/gemini-image'
import {
  BANNED_PHRASES,
  BANNED_WORDS,
  BRAND_VOICE,
  NO_DASHES_RULE,
  stripDashes,
  trimToSentence,
} from '../../lib/gemini-voice'

// Loading the photo plus one retry can take longer than the default limit
export const config = { maxDuration: 60 }

function buildPrompt(contentType?: string, docTitle?: string): string {
  const base = `${BRAND_VOICE} We also cover the occasional cruise. You are writing a photo caption for the blog.`

  const context =
    {
      arenas: `This photo is from an NBA/WNBA arena visit${docTitle ? `: ${docTitle}` : ''}. Write from a basketball fan's perspective.`,
      hotelReview: `This photo is from a hotel stay${docTitle ? ` at ${docTitle}` : ''}. Write from a traveler's perspective.`,
      foodReview: `This photo is from a meal or restaurant${docTitle ? `: ${docTitle}` : ''}. Write from a food lover's perspective.`,
      guide: `This photo is from a travel guide${docTitle ? `: "${docTitle}"` : ''}. Write from a traveler's perspective.`,
    }[contentType ?? ''] ??
    `This photo is from the Meet the Whytes travel blog${docTitle ? `: ${docTitle}` : ''}.`

  return `${base} ${context}

Write a photo caption the way a travel blogger would: specific, real, and in the first person plural ("we"). It should sound like someone who was actually there describing what you see.

Rules:
- Describe what is shown and add just enough context to make it interesting
- 80 to 160 characters total
${NO_DASHES_RULE}
- First person plural ("we", "our") when natural, e.g. "Our view from the upper deck at Fiserv Forum"
- Include specific details: arena name, city, dish name, hotel name, location, but only when clearly visible or inferable
- Do NOT use any of these words: ${BANNED_WORDS}, modern
- Do NOT use these phrases or close variants: ${BANNED_PHRASES}
- Do NOT start with "A photo of", "An image of", or "This is"
- Contractions are good (we're, it's, don't); write like a person, not an ad

Return ONLY the caption. No quotes. No explanation.`
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') return res.status(405).end()

  const {
    assetRef,
    contentType,
    docTitle,
  }: { assetRef?: string; contentType?: string; docTitle?: string } = req.body

  if (!assetRef) return res.status(400).json({ error: 'assetRef is required' })

  try {
    const raw = await describePhoto(
      assetRef,
      buildPrompt(contentType, docTitle),
      {
        maxOutputTokens: 120,
        temperature: 0.5,
      },
    )

    // Prompt asks for 80 to 160 chars; only intervene on a bad overshoot
    const clean = stripDashes(raw)
    const caption = clean.length > 200 ? trimToSentence(clean, 160) : clean

    res.status(200).json({ caption })
  } catch (err: any) {
    console.error('[generate-caption]', err)
    res
      .status(err instanceof GeminiError ? err.status : 500)
      .json({ error: err.message ?? 'Failed to generate caption' })
  }
}
