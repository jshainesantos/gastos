export function getBudgetBarColor(pct: number): string {
  if (pct >= 100) return '#F87171'
  if (pct >= 80) return '#FBBF24'
  return '#818CF8'
}
