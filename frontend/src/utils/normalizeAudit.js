/**
 * Normalizes audit + recommendation shapes from API/DB (camelCase or snake_case).
 */
export function normalizeRecommendation(rec) {
  if (!rec) return null

  let raw = rec
  if (typeof raw === 'string') {
    try {
      raw = JSON.parse(raw)
    } catch {
      return null
    }
  }

  const monthlySavings = Number(
    raw.monthlySavings ?? raw.monthly_savings ?? 0,
  )
  const annualSavings = Number(raw.annualSavings ?? raw.annual_savings ?? 0)

  return {
    tool: raw.tool,
    recommendedTool: raw.recommendedTool ?? raw.recommended_tool ?? raw.tool,
    currentPlan: raw.currentPlan ?? raw.current_plan ?? '',
    recommendedPlan: raw.recommendedPlan ?? raw.recommended_plan ?? '',
    currentSpend: Number(raw.currentSpend ?? raw.current_spend ?? 0),
    recommendedSpend: Number(raw.recommendedSpend ?? raw.recommended_spend ?? 0),
    monthlySavings,
    annualSavings,
    reason:
      raw.reason ??
      raw.reasoning ??
      raw.recommendation_reason ??
      '',
  }
}

export function normalizeRecommendations(recommendations) {
  if (!recommendations) return []

  let list = recommendations
  if (typeof list === 'string') {
    try {
      list = JSON.parse(list)
    } catch {
      return []
    }
  }

  if (!Array.isArray(list)) return []

  return list.map(normalizeRecommendation).filter(Boolean)
}

export function normalizeAudit(raw) {
  if (!raw) return null

  return {
    id: raw.id,
    useCase: raw.use_case ?? raw.useCase,
    recommendations: normalizeRecommendations(raw.recommendations),
    totalMonthlySavings: Number(
      raw.total_monthly_savings ?? raw.totalMonthlySavings ?? 0,
    ),
    totalAnnualSavings: Number(
      raw.total_annual_savings ?? raw.totalAnnualSavings ?? 0,
    ),
    summary: raw.summary ?? '',
    publicId: raw.public_id ?? raw.publicId,
  }
}
