import { useState } from 'react'
import { captureLead } from '../api/client'

const inputClass =
  'w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500'

const COPY = {
  high: {
    title: 'Email me this audit and a savings follow-up',
    description:
      'High-savings audits qualify for a deeper review. We will send your report and may reach out about discounted credits and plan changes.',
    cta: 'Send report and request follow-up',
  },
  medium: {
    title: 'Save this audit to your inbox',
    description:
      'Get a copy of your results and tips when new optimizations match your stack.',
    cta: 'Email me the report',
  },
  low: {
    title: 'Notify me when new optimizations apply',
    description:
      'Your stack looks efficient today. Leave your email and we will ping you when pricing or tools change for your setup.',
    cta: 'Notify me',
  },
}

export default function LeadCapture({ auditId, tier = 'medium', defaultTeamSize = '' }) {
  const copy = COPY[tier] || COPY.medium
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [teamSize, setTeamSize] = useState(
    defaultTeamSize ? String(defaultTeamSize) : '',
  )
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setStatus('loading')

    try {
      await captureLead({
        email: email.trim(),
        company: company.trim() || undefined,
        role: role.trim() || undefined,
        teamSize: teamSize ? Number(teamSize) : undefined,
        auditId: auditId || undefined,
        _honeypot: honeypot,
      })
      setStatus('success')
    } catch (err) {
      setError(err.message)
      setStatus('idle')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center">
        <p className="font-medium text-emerald-300">Check your inbox shortly.</p>
        <p className="mt-1 text-sm text-slate-400">
          {tier === 'high'
            ? 'Your audit is saved. We may reach out for high-savings cases.'
            : 'Your audit is saved. Share the link with your team anytime.'}
        </p>
      </div>
    )
  }

  return (
    <section
      className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6"
      aria-labelledby="lead-capture-heading"
    >
      <h2 id="lead-capture-heading" className="text-lg font-semibold text-white">
        {copy.title}
      </h2>
      <p className="mt-1 text-sm text-slate-400">{copy.description}</p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        <div>
          <label htmlFor="lead-email" className="mb-1 block text-xs text-slate-400">
            Work email
          </label>
          <input
            id="lead-email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="lead-company" className="sr-only">
              Company
            </label>
            <input
              id="lead-company"
              type="text"
              placeholder="Company (optional)"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="lead-role" className="sr-only">
              Role
            </label>
            <input
              id="lead-role"
              type="text"
              placeholder="Role (optional)"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="lead-team" className="sr-only">
              Team size
            </label>
            <input
              id="lead-team"
              type="number"
              min={1}
              placeholder="Team size"
              value={teamSize}
              onChange={(e) => setTeamSize(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {status === 'loading' ? 'Submitting…' : copy.cta}
        </button>
      </form>
    </section>
  )
}
