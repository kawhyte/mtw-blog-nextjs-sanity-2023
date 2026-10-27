import type { NextApiRequest, NextApiResponse } from 'next'

import { askGemini } from '../../lib/gemini'
import { GeminiError } from '../../lib/gemini-image'
import { ANTI_AI_RULES, BRAND_VOICE, stripDashes } from '../../lib/gemini-voice'

// Two Gemini calls (find questions, then answer them) need the full minute
export const config = { maxDuration: 60, api: { bodyParser: { sizeLimit: '1mb' } } }

export interface SuggestedFaq {
  question: string
  /** Empty when our review has no answer: Kenny fills it in or deletes it */
  answer: string
}

// What cruisers ask before booking (Oct 2026 research: Cruise Critic threads,
// first-timer FAQs, cruise blogs), most asked first
const RESEARCH_QUESTIONS = `- Is [ship] worth it?
- How much does it really cost in total (fare, gratuities, drinks, Wi-Fi, dining)?
- Is the drink package worth it? How many drinks a day to break even?
- Is the specialty dining package worth it?
- Which cabin or deck is best? Is my cabin noisy or does it move?
- What is included and what costs extra?
- Junior suite vs balcony: what perks do you really get?
- Is the food good? Which restaurants are worth paying for?
- How crowded is it? Do I need to book shows ahead?
- What time do you board and get off? Is a morning flight too early?
- Is it a tender port? What time is all aboard?
- Which airport should I fly into?
- Is there a formal night? What do people wear?
- Is the Wi-Fi good enough to stream or work? Can we share a plan?
- Can you watch NBA, NFL or other games onboard?
- Is it good for kids or teens?`

async function shipQuestions(shipName: string, cruiseLine?: string): Promise<string> {
  try {
    const { text } = await askGemini(
      [
        {
          text: `Use Google Search to find the questions people most often ask online about the cruise ship "${shipName}"${cruiseLine ? ` (${cruiseLine})` : ''}: forums, "People also ask", cruise blogs. List up to 10, one per line, as plain questions. No answers, no numbering.`,
        },
      ],
      { googleSearch: true },
    )
    return text
  } catch {
    // Best effort: the research list alone still gives good questions
    return ''
  }
}

function buildPrompt(review: any, searched: string): string {
  return `${BRAND_VOICE} You are writing the FAQ for our cruise review of ${review.shipName}.

QUESTIONS PEOPLE SEARCH (pick from these, reworded for this ship and cabin):
${RESEARCH_QUESTIONS}
${searched ? `\nQUESTIONS FOUND ONLINE ABOUT THIS SHIP:\n${searched}\n` : ''}
OUR REVIEW DATA (the ONLY source for answers):
${JSON.stringify({ ...review, computed: computed(review) })}

Write 6 to 8 FAQ entries.
- Pick the questions searchers ask most that matter for THIS ship, cabin and route. Use the ship name in at least half of them, e.g. "Is the dining package worth it on ${review.shipName}?"
- Answer ONLY from OUR REVIEW DATA. Use our real numbers, times, names and verdicts. Never use outside facts or general cruise knowledge.
- Opinions ("worth it", "good value", "loved it") only when our ratings, worthIt picks, takes or verdict say so.
- Never infer beyond the data: if a detail is missing, leave it out of the answer.
- Use the numbers in "computed" as given. Never add up, subtract or divide numbers yourself.
- Answer the parts of a question our data covers and simply leave out the parts it does not. Never mention "our data", "the review" or what is missing.
- Only if our data covers no part of a question people often ask, still include it, with the answer written as exactly: NEEDS ANSWER
- Ask port questions about the port by name, e.g. "Is Cabo San Lucas a tender port on this cruise?"
- Money with commas and cents only when given, e.g. $2,414 or $313.76.
- Answers: 1 to 3 sentences, first person plural ("we"), direct answer first.
${ANTI_AI_RULES}

Answer in exactly this format, nothing else:
Q: <question>
A: <answer>

Q: <question>
A: <answer>`
}

const sum = (items: any[] = []) =>
  Math.round(items.reduce((total, item) => total + (Number(item?.amount) || 0), 0) * 100) / 100

const money = (n: number) =>
  `$${n.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })}`

/** Totals worked out in code, so the answers never carry Gemini's arithmetic */
function computed(review: any) {
  const total = sum(review.costItems)
  const guests = Number(review.guests) || 2
  const nights = Number(review.nights) || 0
  return {
    ...(total > 0 && {
      totalPaid: money(total),
      perPerson: money(Math.round((total / guests) * 100) / 100),
      ...(nights && { perPersonPerNight: money(Math.round((total / guests / nights) * 100) / 100) }),
    }),
    packageComparisons: (review.packageComparisons ?? []).map((c: any) => ({
      title: c.title,
      [c.optionA?.label ?? 'optionA']: money(sum(c.optionA?.items)),
      [c.optionB?.label ?? 'optionB']: money(sum(c.optionB?.items)),
      saved: money(Math.abs(sum(c.optionA?.items) - sum(c.optionB?.items))),
    })),
  }
}

function parseFaqs(text: string): SuggestedFaq[] {
  const faqs: SuggestedFaq[] = []
  for (const block of text.split(/\n(?=\s*\**Q:)/)) {
    const q = block.match(/Q:\**\s*(.+)/)?.[1]?.trim()
    const a = block.match(/A:\**\s*([\s\S]+)/)?.[1]?.replace(/\*\*/g, '').trim()
    if (!q) continue
    // A half answer that talks about missing data goes back to Kenny instead
    const unanswered = !a || /^NEEDS ANSWER/i.test(a) || /\b(our|the) (data|review)\b|doesn'?t say|does not say|not (mentioned|provided)/i.test(a)
    faqs.push({
      question: stripDashes(q.replace(/\*\*/g, '')),
      answer: unanswered ? '' : stripDashes(a),
    })
  }
  return faqs.slice(0, 8)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const review = req.body?.review
  if (!review?.shipName) {
    return res.status(400).json({ error: 'Pick the Ship on the Overview tab first' })
  }

  try {
    const searched = await shipQuestions(review.shipName, review.cruiseLine)
    const { text } = await askGemini([{ text: buildPrompt(review, searched) }], {
      maxOutputTokens: 2048,
    })
    const faqs = parseFaqs(text)
    if (!faqs.length) {
      return res.status(502).json({ error: 'Gemini did not return usable questions. Try again.' })
    }
    return res.status(200).json({ faqs })
  } catch (err: any) {
    console.error('[suggest-cruise-faq]', err)
    return res
      .status(err instanceof GeminiError ? err.status : 500)
      .json({ error: err.message ?? 'Failed to suggest FAQs' })
  }
}
