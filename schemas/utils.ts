export const getPortableTextLength = (blocks: any[]): number => {
  if (!Array.isArray(blocks)) return 0
  return blocks
    .filter((b) => b._type === 'block' && Array.isArray(b.children))
    .map((b) => b.children.map((span: any) => span.text || '').join(''))
    .join('\n').length
}
