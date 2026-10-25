import type { NextApiRequest, NextApiResponse } from 'next'

import { describePhoto, GeminiError } from '../../lib/gemini-image'
import {
  altTextPrompt,
  stripDashes,
  trimToSentence,
} from '../../lib/gemini-voice'

// Loading the photo plus one retry can take longer than the default limit
export const config = { maxDuration: 60 }

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
      altTextPrompt(contentType, docTitle),
      {
        maxOutputTokens: 80,
        temperature: 0.4,
      },
    )

    // Prompt asks for 50 to 120 chars; only intervene on a bad overshoot
    const clean = stripDashes(raw)
    const altText = clean.length > 150 ? trimToSentence(clean, 120) : clean

    res.status(200).json({ altText })
  } catch (err: any) {
    console.error('[generate-alt-text]', err)
    res
      .status(err instanceof GeminiError ? err.status : 500)
      .json({ error: err.message ?? 'Failed to generate alt text' })
  }
}
