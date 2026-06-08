/**
 * Maps a raw Mbps speed value to a 0–10 internet quality score.
 * Thresholds align with the speedTiers labels in RoomTech.tsx.
 * Returns undefined when mbps is null/undefined (triggers fallback to stored Internet_Speed).
 */
export function mbpsToInternetRating(mbps: number | undefined): number | undefined {
  if (mbps == null) return undefined
  if (mbps <= 0) return 0
  if (mbps >= 100) return 10
  if (mbps >= 40) return 9
  if (mbps >= 23) return 8
  if (mbps >= 13) return 6
  if (mbps >= 6) return 4
  return 2 // 1–5 Mbps
}

/**
 * Returns a copy of hotelRating with Internet_Speed overridden by the Mbps-computed score.
 * When internetSpeedMbps is undefined/null, returns hotelRating unchanged
 * so the stored Internet_Speed value is used as-is (backward compat for old docs).
 */
export function withInternetRating(
  hotelRating: Record<string, number | undefined>,
  internetSpeedMbps?: number,
): Record<string, number | undefined> {
  const computed = mbpsToInternetRating(internetSpeedMbps)
  if (computed == null) return hotelRating
  return { ...hotelRating, Internet_Speed: computed }
}
