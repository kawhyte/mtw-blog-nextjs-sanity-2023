import type { NextApiRequest, NextApiResponse } from 'next'

import {
  BANNED_PHRASES,
  BANNED_WORDS,
  BRAND_VOICE,
  NO_DASHES_RULE,
  stripDashes,
  trimToSentence,
} from '../../lib/gemini-voice'

const FORBIDDEN = `${BANNED_WORDS}, modern, comprehensive, ultimate, must-read, must-visit, essential guide`

const CATEGORY_LABELS: Record<string, string> = {
  city: 'city guide',
  tips: 'travel tips',
  transport: 'transportation guide',
  culture: 'culture & history guide',
  adventure: 'adventure guide',
  family: 'family travel guide',
  budget: 'budget travel guide',
  luxury: 'luxury travel guide',
}

function buildPrompt(body: any): string {
  const { title, location, category, tags, contentExcerpt, coverImageAlt } = body
  const categoryLabel = CATEGORY_LABELS[category as string] ?? 'travel guide'
  const tagList = (tags as string[]).filter(Boolean).slice(0, 6).join(', ')

  return `${BRAND_VOICE} You write SEO meta descriptions for our travel guides.

Guide title: ${title}
Type: ${categoryLabel}
${location ? `Location: ${location}` : ''}
${tagList ? `Keywords to target: ${tagList}` : ''}
${contentExcerpt ? `Content excerpt: ${contentExcerpt}` : ''}
${coverImageAlt ? `Cover image: ${coverImageAlt}` : ''}

Write ONE meta description for Google search results. Hard rules:
- MUST be between 120 and 155 characters. Count every character before returning
${NO_DASHES_RULE}
- Include at least one keyword from the keywords list
- If a location is provided, include it in the description
- First person plural: "we" and "our"; write like a real traveler, not a copywriter
- Be specific: pull one concrete detail from the content excerpt
- End with a reason to click: a question, a payoff, or a specific promise
- NEVER use: ${FORBIDDEN}
- NEVER use these phrases or close variants: ${BANNED_PHRASES}
- Use a contraction where it fits naturally (we're, it's, don't); real people use them

Return ONLY the meta description. No quotes. No label. No explanation.`
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'Gemini API key not configured' })

  const { title } = req.body
  if (!title) return res.status(400).json({ error: 'title is required' })

  const prompt = buildPrompt(req.body)

  try {
    const geminiRes = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        signal: AbortSignal.timeout(9000),
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 256,
            temperature: 0.5,
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      },
    )

    if (!geminiRes.ok) {
      const err = await geminiRes.json()
      const msg: string = err?.error?.message ?? `Gemini error ${geminiRes.status}`
      if (geminiRes.status === 429) {
        const retryMatch = msg.match(/retry in ([\d.]+)s/i)
        const seconds = retryMatch ? Math.ceil(Number(retryMatch[1])) : null
        const friendly = seconds
          ? `Gemini rate limit hit. Try again in ${seconds}s.`
          : 'Gemini rate limit hit. Wait a minute then try again.'
        return res.status(429).json({ error: friendly })
      }
      throw new Error(msg)
    }

    const data = await geminiRes.json()
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

    if (!raw) throw new Error('No response from Gemini')

    // Strip surrounding quotes, then enforce the 155-char ceiling the prompt
    // asks for at a word boundary (schema errors at 160)
    const cleaned = stripDashes(raw.replace(/^["']|["']$/g, '').trim())
    const summary = trimToSentence(cleaned, 155)

    res.status(200).json({ summary })
  } catch (err: any) {
    console.error('[generate-guide-summary]', err)
    res.status(500).json({ error: err.message ?? 'Failed to generate guide summary' })
  }
}
