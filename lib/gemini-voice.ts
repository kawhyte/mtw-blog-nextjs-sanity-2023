// Shared voice + anti-AI vocabulary rules for all Gemini generation routes
// (verdict, seo-excerpt, guide-summary, caption, alt-text). Server-side only.

// Who is writing, also carries the site's core SEO mission naturally.
export const BRAND_VOICE = `You write for "Meet the Whytes", a married couple on a mission to visit and rank every NBA & WNBA arena, reviewing the hotels we sleep in and the food we eat along the way. We write like we talk: relaxed, casual, a little opinionated, always honest.`

// Classic AI-tell vocabulary (per gptzero.me/ai-vocabulary) + marketing clichés
// already banned in individual routes, merged into one list.
export const BANNED_WORDS =
  'delve, leverage, harness, foster, underscore, elevate, intricate, multifaceted, dynamic, transformative, invaluable, furthermore, moreover, consequently, nevertheless, conversely, additionally, notably, ' +
  'stunning, vibrant, nestled, boasting, offering, showcasing, featuring, iconic, world-class, state-of-the-art, seamlessly, impeccable, luxurious, mouthwatering, delightful, exquisite, culinary, modern amenities'

export const BANNED_PHRASES = `"plays a crucial role in shaping", "actionable insights", "a testament to", "in the realm of", "it is important to remember", "cut to the chase", "hit the nail on the head", "the elephant in the room", "look no further", "whether you're ... or ...", "isn't just X, it's Y", "in conclusion", "perfect for", "ideal for"`

// Kenny's style: no dashes in anything we publish. The rule has to show the
// characters so Gemini knows what to avoid; stripDashes() below is the
// safety net for when it slips one in anyway.
export const NO_DASHES_RULE =
  '- Never use em dashes (\u2014) or en dashes (\u2013) between words; use a comma, a period or a colon instead'

// Structural rules, AI detectors weigh sentence rhythm more than word choice.
export const HUMAN_STYLE_RULES = `- Vary sentence length: mix short punchy sentences with longer ones
- Use contractions: we're, it's, don't, wasn't
- It's fine to start a sentence with "And" or "But"
- Never open with a rhetorical question or "If you're looking for..."
- No rule-of-three lists ("great food, great views, great vibes")
- Specific beats generic: name the dish, the seat section, the street, never "a variety of options"
${NO_DASHES_RULE}`

// One combined block for injecting into prompts.
export const ANTI_AI_RULES = `BANNED WORDS (never use any of these): ${BANNED_WORDS}
BANNED PHRASES (never use these or close variants): ${BANNED_PHRASES}
HUMAN STYLE (follow every one):
${HUMAN_STYLE_RULES}`

/**
 * Safety net for the no-dash rule: number ranges ("2 to 3") become "2 to 3",
 * any other em or en dash becomes a comma.
 */
export function stripDashes(text: string): string {
  return text
    .replace(/(\d)\s*[\u2013\u2014]\s*(\d)/g, '$1 to $2')
    .replace(/\s*[\u2013\u2014]\s*/g, ', ')
}

/**
 * Safety net for length limits the prompt alone can't guarantee.
 * If text exceeds maxLen, cut back to the last full sentence that fits;
 * if no sentence boundary fits, cut at the last full word.
 */
export function trimToSentence(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text
  const slice = text.slice(0, maxLen)
  const lastSentenceEnd = Math.max(
    slice.lastIndexOf('.'),
    slice.lastIndexOf('!'),
    slice.lastIndexOf('?'),
  )
  if (lastSentenceEnd > maxLen * 0.5)
    return slice.slice(0, lastSentenceEnd + 1).trim()
  const lastSpace = slice.lastIndexOf(' ')
  return (lastSpace > 0 ? slice.slice(0, lastSpace) : slice).trim()
}

/**
 * The alt text brief without the "return only" line, so the bulk script
 * (scripts/generate-alt-text.mjs) can ask for alt text, a caption and a
 * category in one call
 */
export function altTextRules(contentType?: string, docTitle?: string): string {
  const base = `${BRAND_VOICE} You are writing alt text for a photo on the blog. Accessibility comes first: a screen-reader user must get an accurate picture of what's shown.`

  const context =
    {
      arenas: `This image is from an NBA/WNBA arena visit${docTitle ? `: ${docTitle}` : ''}.`,
      hotelReview: `This image is from a hotel stay${docTitle ? ` at ${docTitle}` : ''}.`,
      foodReview: `This image is from a meal or restaurant${docTitle ? `: ${docTitle}` : ''}.`,
      guide: `This image is from a travel guide${docTitle ? `: "${docTitle}"` : ''}.`,
    }[contentType ?? ''] ?? ''

  return `${base} ${context}

Write alt text the way a travel writer would naturally caption a photo: specific, direct, and real. It must sound like a human wrote it, not an AI.

Rules:
- Describe exactly what is shown (the court, the seats, the dish, the room, the view, etc.)
- Include specific details: arena name, city, hotel name, dish name, but only if clearly visible or inferable. A real name (like the arena or dish) doubles as a search keyword, but never force one in
- 50 to 120 characters total
${NO_DASHES_RULE}
- Do NOT use any of these words: ${BANNED_WORDS}, modern, "beautiful views of"
- Do NOT use these phrases or close variants: ${BANNED_PHRASES}
- Do NOT start with "image of", "photo of", or "picture of"
- Write like you're texting a friend what the photo shows`
}

/** The alt text prompt for the Studio button */
export function altTextPrompt(contentType?: string, docTitle?: string): string {
  return `${altTextRules(contentType, docTitle)}

Return ONLY the alt text. No quotes. No explanation.`
}

/** The caption brief without the "return only" line, shared like altTextRules */
export function captionRules(contentType?: string, docTitle?: string): string {
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
- Contractions are good (we're, it's, don't); write like a person, not an ad`
}

/** The caption prompt for the Studio button */
export function captionPrompt(contentType?: string, docTitle?: string): string {
  return `${captionRules(contentType, docTitle)}

Return ONLY the caption. No quotes. No explanation.`
}
