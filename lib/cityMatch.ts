/**
 * City pages group arenas, hotels, food and guides by city, but locations
 * are typed many ways in Sanity ("Paradise, NV", "3770 S Las Vegas Blvd,
 * Las Vegas, NV", "Aria Hotel Las Vegas", "Washington D.C."). These helpers
 * turn any of them into one city key, so nothing in Sanity has to change.
 */

// Neighbouring names that belong on another city's page
const CITY_ALIASES: Record<string, string> = {
  'paradise, nv': 'las vegas, nv',
  'inglewood, ca': 'los angeles, ca',
  'new york city, ny': 'new york, ny',
  'manhattan, ny': 'new york, ny',
  'brooklyn, ny': 'new york, ny',
  'toronto, ca': 'toronto, on',
}

/** "Washington, D.C." → "washington, dc"; full street addresses → "city, state" */
function normalise(location: string): string {
  const parts = location
    .toLowerCase()
    .replace(/\./g, '')
    .split(',')
    .map((part) => part.trim().replace(/\s+/g, ' '))
    .filter(Boolean)
  return parts.length >= 2 ? parts.slice(-2).join(', ') : (parts[0] ?? '')
}

/** One key per city, aliases applied */
export function cityKey(location?: string | null): string {
  if (!location) return ''
  const key = normalise(location)
  return CITY_ALIASES[key] ?? key
}

/**
 * The city key for any review location. A location without a state
 * ("Aria Hotel Las Vegas", "Washington DC") matches the arena city whose
 * name it contains.
 */
export function placeCityKey(
  location: string | null | undefined,
  arenaCityKeys: string[],
): string {
  const key = cityKey(location)
  if (!key || key.includes(',')) return key
  const match = arenaCityKeys.find((city) => {
    const cityName = city.split(',')[0]
    return cityName && key.includes(cityName)
  })
  return match ?? key
}

/**
 * The arena location whose page a city lives on. Alias pages (Paradise,
 * Inglewood, …) point at the main city's page; returns the location itself
 * when no other arena location owns the city.
 */
export function primaryCityLocation(
  location: string,
  arenaLocations: string[],
): string {
  const key = cityKey(location)
  return (
    arenaLocations.find((loc) => normalise(loc) === key) ?? location
  ).trim()
}
