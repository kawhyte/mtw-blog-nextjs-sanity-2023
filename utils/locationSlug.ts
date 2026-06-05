export function locationToSlug(location: string): string {
  return location
    .toLowerCase()
    .replace(/,\s*/g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}
