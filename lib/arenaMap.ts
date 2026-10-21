import { US_MAP_PROJECTION } from './usMapPaths'

// Arena pin positions for the /arenas quest map, keyed by the arena's slug.
// Kept in code (not Sanity) so the map needs no new CMS fields: when a new
// arena is added in Studio, add its [longitude, latitude] here or it simply
// won't get a pin.
export const ARENA_COORDINATES: Record<string, [number, number]> = {
  'american-airlines-center': [-96.81, 32.79],
  'amway-center': [-81.38, 28.54],
  'ball-arena': [-105.01, 39.75],
  'barclays-center': [-73.98, 40.68],
  'capital-one-arena': [-77.02, 38.9],
  'chase-center': [-122.39, 37.77],
  'climate-pledge-arena': [-122.35, 47.62],
  'coca-cola-coliseum': [-79.42, 43.64],
  'college-park-center': [-97.11, 32.73],
  'crypto-com-arena': [-118.27, 34.04],
  'delta-center': [-111.9, 40.77],
  'entertainment-and-sports-arena': [-76.99, 38.84],
  fedexforum: [-90.05, 35.14],
  'fiserv-forum': [-87.92, 43.04],
  'footprint-center': [-112.07, 33.45],
  'frost-bank-center': [-98.44, 29.43],
  'gainbridge-fieldhouse': [-86.16, 39.76],
  'gateway-center-arena': [-84.45, 33.65],
  'golden-1-center': [-121.5, 38.58],
  'intuit-dome': [-118.34, 33.95],
  'kaseya-center': [-80.19, 25.78],
  'little-caesars-arena': [-83.05, 42.34],
  'madison-square-garden': [-73.99, 40.75],
  'michelob-ultra-arena': [-115.17, 36.09],
  'moda-center': [-122.67, 45.53],
  'mohegan-sun-arena': [-72.09, 41.49],
  'paycom-center': [-97.52, 35.46],
  'rocket-mortgage-fieldhouse': [-81.69, 41.5],
  'scotiabank-arena': [-79.38, 43.64],
  'smoothie-king-center': [-90.08, 29.95],
  'spectrum-center': [-80.84, 35.23],
  'state-farm-arena': [-84.4, 33.76],
  't-mobile-arena': [-115.18, 36.1],
  'td-garden': [-71.06, 42.37],
  'target-center': [-93.28, 44.98],
  'toyota-center': [-95.36, 29.75],
  'united-center': [-87.67, 41.88],
  'wells-fargo-center': [-75.17, 39.9],
  'wintrust-arena': [-87.62, 41.85],
}

// Same Albers equal-area conic as usMapPaths.ts (parallels 29.5°/45.5°,
// rotated -96°), so pins line up with the pre-projected outline.
const RAD = Math.PI / 180
const SIN_Y0 = Math.sin(29.5 * RAD)
const N = (SIN_Y0 + Math.sin(45.5 * RAD)) / 2
const C = 1 + SIN_Y0 * (2 * N - SIN_Y0)
const R0 = Math.sqrt(C) / N

/** Projects [longitude, latitude] to x/y in the US map's viewBox. */
export function projectToMap(lon: number, lat: number): { x: number; y: number } {
  const lambda = (lon + 96) * RAD * N
  const r = Math.sqrt(C - 2 * N * Math.sin(lat * RAD)) / N
  const { scale, translateX, translateY } = US_MAP_PROJECTION
  return {
    x: scale * r * Math.sin(lambda) + translateX,
    y: translateY - scale * (R0 - r * Math.cos(lambda)),
  }
}

export interface MapCluster<T> {
  x: number
  y: number
  items: T[]
}

/**
 * Groups points that would overlap on the map (e.g. the two Chicago or
 * Las Vegas arenas) into one pin. `distance` is in viewBox units.
 */
export function clusterMapPoints<T extends { x: number; y: number }>(
  points: T[],
  distance = 18,
): MapCluster<T>[] {
  const clusters: MapCluster<T>[] = []
  for (const point of points) {
    const near = clusters.find(
      (c) => Math.hypot(c.x - point.x, c.y - point.y) < distance,
    )
    if (near) {
      near.items.push(point)
      near.x = near.items.reduce((sum, p) => sum + p.x, 0) / near.items.length
      near.y = near.items.reduce((sum, p) => sum + p.y, 0) / near.items.length
    } else {
      clusters.push({ x: point.x, y: point.y, items: [point] })
    }
  }
  return clusters
}
