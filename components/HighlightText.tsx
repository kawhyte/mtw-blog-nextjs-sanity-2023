// Wraps the parts of `text` that start with one of `words` in <mark>, mirroring
// how search matches word prefixes ("vega" highlights the start of "Vegas").
const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export default function HighlightText({
  text,
  words,
}: {
  text: string
  words?: string[]
}) {
  if (!text || !words?.length) return <>{text}</>

  const pattern = new RegExp(
    `(?<![\\p{L}\\p{N}])(${words.map(escapeRegExp).join('|')})`,
    'giu',
  )
  // split() with a capture group puts the matches at the odd indexes
  const parts = text.split(pattern)

  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="rounded-sm bg-primary/15 text-inherit">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  )
}
