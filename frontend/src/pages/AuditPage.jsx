import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import AuditResults from '../components/AuditResults'
import ErrorAlert from '../components/ErrorAlert'
import LeadCapture from '../components/LeadCapture'
import LoadingSpinner from '../components/LoadingSpinner'
import PageMeta from '../components/PageMeta'
import { getAudit } from '../api/client'
import { formatCurrency, frontendShareUrl } from '../utils/format'
import { normalizeAudit } from '../utils/normalizeAudit'
import { getSavingsTier } from '../utils/savingsTier'

export default function AuditPage() {
  const { id } = useParams()
  const location = useLocation()
  const [audit, setAudit] = useState(() =>
    normalizeAudit(location.state?.audit),
  )
  const [teamSize] = useState(location.state?.teamSize)
  const [loading, setLoading] = useState(!location.state?.audit)
  const [error, setError] = useState('')

  useEffect(() => {
    if (location.state?.audit) return

    let cancelled = false

    async function load() {
      setLoading(true)
      setError('')
      try {
        const res = await getAudit(id)
        if (!cancelled) setAudit(normalizeAudit(res.data))
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [id, location.state?.audit])

  const shareUrl = audit?.publicId
    ? frontendShareUrl(audit.publicId)
    : location.state?.audit?.shareUrl
      ? location.state.audit.shareUrl
          .replace(/\/api\/share\//, '/share/')
          .replace(/^https?:\/\/[^/]+/, window.location.origin)
      : ''

  const tier = useMemo(
    () =>
      audit
        ? getSavingsTier(audit.totalMonthlySavings, audit.recommendations)
        : 'medium',
    [audit],
  )

  const monthly = audit?.totalMonthlySavings ?? 0

  if (loading) {
    return <LoadingSpinner label="Loading your audit…" />
  }

  if (error || !audit) {
    return (
      <div className="space-y-4">
        <ErrorAlert
          message={error || 'Audit not found'}
          onRetry={() => window.location.reload()}
        />
        <Link to="/" className="text-sm text-emerald-400 hover:underline">
          ← Start a new audit
        </Link>
      </div>
    )
  }

  return (
    <>
      <PageMeta
        title={`${formatCurrency(monthly)}/mo savings found`}
        description={
          audit.summary?.slice(0, 155) ||
          'AI spend audit: tools, recommendations, and savings.'
        }
        path={`/audit/${id}`}
      />

      <div className="space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Audit complete</p>
            <h1 className="text-2xl font-bold text-white">Your savings report</h1>
          </div>
          <Link
            to="/"
            className="text-sm text-slate-400 hover:text-emerald-400"
          >
            New audit
          </Link>
        </div>

        <AuditResults
          audit={audit}
          shareUrl={shareUrl}
          publicId={audit.publicId}
        />
        <LeadCapture
          auditId={audit.id}
          tier={tier}
          defaultTeamSize={teamSize}
        />
      </div>
    </>
  )
}
