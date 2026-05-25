import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuditForm from '../components/AuditForm'
import ErrorAlert from '../components/ErrorAlert'
import FaqSection from '../components/FaqSection'
import PageMeta from '../components/PageMeta'
import SocialProof from '../components/SocialProof'
import { createAudit } from '../api/client'

export default function HomePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(payload) {
    setLoading(true)
    setError('')

    try {
      const { teamSize, ...auditBody } = payload
      const res = await createAudit(auditBody)
      const audit = res.data
      navigate(`/audit/${audit.id}`, {
        state: { audit, teamSize },
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageMeta
        title="Free AI spend audit"
        description="Instant audit for Cursor, ChatGPT, Claude, Copilot and more. See plan waste and annual savings in seconds. No login."
        path="/"
      />

      <div className="space-y-12">
        <section className="text-center sm:text-left">
          <p className="text-sm font-medium uppercase tracking-widest text-emerald-400">
            The Mint for AI tool spend
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Stop overpaying for AI tools
          </h1>
          <p className="mt-3 max-w-2xl text-base text-slate-400 sm:text-lg">
            Free instant audit for startups. Compare plans, seats, and use case.
            See downgrades, swaps, and monthly + annual savings. No login to start.
          </p>
          <p className="mt-4">
            <a
              href="#audit-form"
              className="inline-flex rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 hover:opacity-95"
            >
              Run free audit
            </a>
          </p>
        </section>

        <SocialProof />

        <div id="audit-form">
          <ErrorAlert message={error} />
          <AuditForm onSubmit={handleSubmit} loading={loading} />
        </div>

        <FaqSection />
      </div>
    </>
  )
}
