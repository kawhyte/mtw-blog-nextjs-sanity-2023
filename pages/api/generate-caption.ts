import type { NextApiRequest, NextApiResponse } from 'next'

import { describePhoto, GeminiError } from '../../lib/gemini-image'
import {
  captionPrompt,
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
      captionPrompt(contentType, docTitle),
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
