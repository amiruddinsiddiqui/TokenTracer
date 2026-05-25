import { formatCurrency, formatPlan, formatToolName } from '../utils/format'
import { normalizeRecommendation } from '../utils/normalizeAudit'

export default function RecommendationCard({ rec: rawRec }) {
  const rec = normalizeRecommendation(rawRec) ?? rawRec
  const hasSavings = (rec.monthlySavings ?? 0) > 0
  const toolChanged = rec.recommendedTool && rec.recommendedTool !== rec.tool
  const reason = (rec.reason ?? '').trim()

  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">
            {formatToolName(rec.tool)}
            {toolChanged && (
              <span className="ml-2 text-sm font-normal text-cyan-400">
                → {formatToolName(rec.recommendedTool)}
              </span>
            )}
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            {formatPlan(rec.currentPlan)} → {formatPlan(rec.recommendedPlan)}
          </p>
        </div>
        {hasSavings ? (
          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-medium text-emerald-400">
            Save {formatCurrency(rec.monthlySavings)}/mo
          </span>
        ) : (
          <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-400">
            Optimized
          </span>
        )}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-slate-950/50 px-3 py-2">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Current spend
          </p>
          <p className="text-lg font-medium text-slate-200">
            {formatCurrency(rec.currentSpend)}/mo
          </p>
        </div>
        <div className="rounded-lg bg-slate-950/50 px-3 py-2">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Recommended
          </p>
          <p className="text-lg font-medium text-emerald-300">
            {formatCurrency(rec.recommendedSpend)}/mo
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-slate-700/80 bg-slate-950/60 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400/90">
          Why this recommendation
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-200">
          {reason || 'No additional detail provided for this tool.'}
        </p>
      </div>

      {hasSavings && (
        <p className="mt-2 text-xs text-slate-500">
          Annual savings: {formatCurrency(rec.annualSavings)}
        </p>
      )}
    </article>
  )
}
