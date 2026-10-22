/** Plain text of a Portable Text block */
export const blockText = (block: any): string =>
  Array.isArray(block?.children)
    ? block.children
        .map((child: any) => child?.text ?? '')
        .join('')
        .trim()
    : ''

/** Anchor id for a heading, e.g. "How We Test" → "how-we-test" */
export const headingId = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80)

/** The guide's H2 sections for "On this page" (empty headings skipped) */
export const sectionHeadings = (content?: any[]) =>
  (content ?? [])
    .filter((block) => block?._type === 'block' && block.style === 'h2')
    .map(blockText)
    .filter(Boolean)
    .map((text) => ({ text, id: headingId(text) }))
