export function extractPlainText(blocks: any[]): string {
  if (!Array.isArray(blocks)) return ''
  return blocks
    .filter((b) => b._type === 'block' && Array.isArray(b.children))
    .map((b) => b.children.map((span: any) => span.text || '').join(''))
    .join(' ')
    .trim()
}
