export function getRankBadgeStyle(rank: number): string {
  if (rank === 1) return 'bg-yellow-400 text-yellow-900'
  if (rank === 2) return 'bg-slate-300 text-slate-800'
  if (rank === 3) return 'bg-amber-600 text-amber-50'
  return 'bg-black/70 text-white'
}
