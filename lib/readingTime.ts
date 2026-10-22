/** Minutes to read a guide's Portable Text body (200 words a minute, min 1) */
export function calculateReadingTime(content?: any[]): number {
  if (!content) return 1
  let wordCount = 0
  const countInBlocks = (blocks: any[]) => {
    for (const block of blocks) {
      if (block?._type === 'block' && Array.isArray(block.children)) {
        for (const child of block.children) {
          if (child?.text) wordCount += child.text.trim().split(/\s+/).length
        }
      } else if (
        (block?._type === 'mediaWithText' || block?._type === 'callout') &&
        Array.isArray(block.text)
      ) {
        countInBlocks(block.text)
      }
    }
  }
  countInBlocks(content)
  return Math.max(1, Math.ceil(wordCount / 200))
}
