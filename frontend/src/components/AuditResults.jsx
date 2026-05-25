import RecommendationCard from './RecommendationCard'
import HighSavingsCta from './HighSavingsCta'
import ExportReportButton from './ExportReportButton'
import SpendingWellBanner from './SpendingWellBanner'
import { formatCurrency } from '../utils/format'
import { normalizeAudit } from '../utils/normalizeAudit'
import { getSavingsTier } from '../utils/savingsTier'

export default function AuditResults({ audit: rawAudit, shareUrl, publicId }) {
  const audit = normalizeAudit(rawAudit) ?? rawAudit
  const recommendations = audit.recommendations || []
  const monthly = audit.totalMonthlySavings ?? 0
  const annual = audit.totalAnnualSavings ?? 0
  const summary = audit.summary
  const tier = getSavingsTier(monthly, recommendations)
  const heroLabel =
    tier === 'low' ? 'Estimated savings' : 'Potential savings'

  return (
    <div className="space-y-8">
      <section
        className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-slate-900 to-cyan-500/5 p-6 sm:p-8"
        aria-labelledby="savings-hero"
      >
        <p className="text-sm font-medium uppercase tracking-wider text-emerald-400">
          {heroLabel}
        </p>
        <div id="savings-hero" className="mt-2 flex flex-wrap items-end gap-6">
          <div>
            <p className="text-4xl font-bold text-white sm:text-5xl">
              {formatCurrency(monthly)}
            </p>
            <p className="text-slate-400">per month</p>
          </div>
          <div className="text-slate-400">
            <p className="text-2xl font-semibold text-slate-200">
              {formatCurrency(annual)}
            </p>
            <p className="text-sm">per year</p>
          </div>
        </div>
        {summary && (
          <p className="mt-6 max-w-3xl whitespace-pre-wrap text-sm leading-relaxed text-slate-300 sm:text-base">
            {summary}
          </p>
        )}
      </section>

      {tier === 'high' && <HighSavingsCta monthlySavings={monthly} />}
      {tier === 'low' && <SpendingWellBanner />}

      {(shareUrl || publicId) && (
        <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          {shareUrl && (
            <>
              <p className="text-sm font-medium text-slate-300">Share this audit</p>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  aria-label="Shareable audit link"
                  className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300"
                  onFocus={(e) => e.target.select()}
                />
                <button
                  type="button"
                  className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                  onClick={() => navigator.clipboard?.writeText(shareUrl)}
                >
                  Copy link
                </button>
              </div>
            </>
          )}
          {publicId && (
            <div>
              <p className="text-sm font-medium text-slate-300">Export report</p>
              <ExportReportButton
                publicId={publicId}
                audit={audit}
                shareUrl={shareUrl}
                className="mt-2"
              />
            </div>
          )}
        </section>
      )}

      <section aria-labelledby="recommendations-heading">
        <h2 id="recommendations-heading" className="mb-4 text-xl font-semibold text-white">
          Recommendations ({recommendations.length})
        </h2>
        <div className="space-y-4">
          {recommendations.map((rec, i) => (
            <RecommendationCard key={`${rec.tool}-${i}`} rec={rec} />
          ))}
        </div>
      </section>
    </div>
  )
}
