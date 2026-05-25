import { SAVINGS_HIGH_MONTHLY } from '../constants/app'

/**
 * @returns {'high' | 'medium' | 'low'}
 * - high: large savings (>$500/mo), prominent follow-up CTA
 * - medium: real savings found, standard report + email capture
 * - low: already optimized (no per-tool savings), "spending well" messaging
 */
export function getSavingsTier(monthlySavings, recommendations = []) {
  const monthly = Number(monthlySavings) || 0
  const allOptimized =
    recommendations.length > 0 &&
    recommendations.every((r) => (r.monthlySavings ?? 0) <= 0)

  if (monthly > SAVINGS_HIGH_MONTHLY) return 'high'
  if (allOptimized || monthly <= 0) return 'low'
  return 'medium'
}
