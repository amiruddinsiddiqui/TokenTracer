import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AuditResults from '../components/AuditResults'
import ErrorAlert from '../components/ErrorAlert'
import LoadingSpinner from '../components/LoadingSpinner'
import PageMeta from '../components/PageMeta'
import { getPublicShare } from '../api/client'
import { formatCurrency } from '../utils/format'
import { normalizeAudit } from '../utils/normalizeAudit'

export default function SharePage() {
  const { publicId } = useParams()
  const [audit, setAudit] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError('')
      try {
        const res = await getPublicShare(publicId)
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
  }, [publicId])

  const monthly = audit?.totalMonthlySavings ?? 0
  const ogDescription = useMemo(() => {
    if (!audit) return 'Shared AI spend audit from Token Tracer.'
    return `This stack could save ${formatCurrency(monthly)}/month on AI tools. View the full breakdown. Tools and savings only, no private data.`
  }, [audit, monthly])

  if (loading) {
    return <LoadingSpinner label="Loading shared audit…" />
  }

  if (error || !audit) {
    return (
      <div className="space-y-4">
        <ErrorAlert message={error || 'Shared audit not found'} />
        <Link to="/" className="text-sm text-emerald-400 hover:underline">
          Run your own audit
        </Link>
      </div>
    )
  }

  return (
    <>
      <PageMeta
        title={`${formatCurrency(monthly)}/mo in AI savings`}
        description={ogDescription}
        path={`/share/${publicId}`}
      />

      <div className="space-y-8">
        <div>
          <p className="text-sm font-medium text-cyan-400">Shared audit</p>
          <h1 className="text-2xl font-bold text-white">AI spend snapshot</h1>
          <p className="mt-2 text-sm text-slate-400">
            Use case:{' '}
            <span className="text-slate-200">{audit.useCase}</span>
            <span className="mx-2 text-slate-600">·</span>
            No email or company name on public shares
          </p>
        </div>

        <AuditResults audit={audit} shareUrl={null} publicId={publicId} />

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 text-center">
          <p className="text-slate-300">Want your own audit?</p>
          <Link
            to="/"
            className="mt-3 inline-block rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
          >
            Start free audit
          </Link>
        </div>
      </div>
    </>
  )
}
