import { useState } from 'react'
import { STORAGE_FORM_KEY } from '../constants/app'
import {
  USE_CASES,
  TOOLS,
  createDefaultTool,
  getToolMeta,
} from '../constants/tools'
import { usePersistedState } from '../hooks/usePersistedState'

const inputClass =
  'w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500'

const labelClass =
  'mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400'

const DEFAULT_FORM = {
  useCase: 'coding',
  teamSize: '',
  tools: [createDefaultTool('cursor')],
}

export default function AuditForm({ onSubmit, loading }) {
  const [form, setForm] = usePersistedState(STORAGE_FORM_KEY, DEFAULT_FORM)
  const { useCase, teamSize, tools } = form
  const [error, setError] = useState('')

  function patch(updates) {
    setForm((prev) => ({ ...prev, ...updates }))
  }

  function updateTool(index, field, value) {
    setForm((prev) => {
      const nextTools = [...prev.tools]
      const row = { ...nextTools[index], [field]: value }

      if (field === 'name') {
        const meta = getToolMeta(value)
        if (meta) {
          row.plan = meta.defaultPlan
          row.monthlySpend = meta.defaultSpend
        }
      }

      nextTools[index] = row
      return { ...prev, tools: nextTools }
    })
  }

  function addTool() {
    setForm((prev) => ({
      ...prev,
      tools: [...prev.tools, createDefaultTool('chatgpt')],
    }))
  }

  function removeTool(index) {
    if (tools.length <= 1) return
    setForm((prev) => ({
      ...prev,
      tools: prev.tools.filter((_, i) => i !== index),
    }))
  }

  function clearSavedForm() {
    if (window.confirm('Clear saved form data?')) {
      localStorage.removeItem(STORAGE_FORM_KEY)
      setForm(DEFAULT_FORM)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const payload = {
      useCase,
      teamSize: teamSize ? Number(teamSize) : undefined,
      tools: tools.map((t) => ({
        name: t.name,
        plan: t.plan,
        seats: Number(t.seats),
        monthlySpend: Number(t.monthlySpend),
      })),
    }

    for (const t of payload.tools) {
      if (!t.seats || t.seats < 1) {
        setError('Each tool needs at least 1 seat.')
        return
      }
      if (t.monthlySpend < 0 || Number.isNaN(t.monthlySpend)) {
        setError('Monthly spend must be zero or greater.')
        return
      }
    }

    if (teamSize && (Number(teamSize) < 1 || Number.isNaN(Number(teamSize)))) {
      setError('Team size must be at least 1 when provided.')
      return
    }

    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8" aria-label="AI spend audit form">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <h2 className="text-lg font-semibold text-white">Team & use case</h2>
        <p className="mt-1 text-sm text-slate-400">
          Team size helps benchmark spend; use case drives plan and tool recommendations.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="team-size" className={labelClass}>
              Team size (people using AI)
            </label>
            <input
              id="team-size"
              type="number"
              min={1}
              placeholder="e.g. 12"
              value={teamSize}
              onChange={(e) => patch({ teamSize: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>
        <fieldset className="mt-6">
          <legend className="sr-only">Primary use case</legend>
          <p className={labelClass}>Primary use case</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {USE_CASES.map((uc) => (
              <label
                key={uc.value}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${
                  useCase === uc.value
                    ? 'border-emerald-500/50 bg-emerald-500/10'
                    : 'border-slate-800 bg-slate-950/50 hover:border-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="useCase"
                  value={uc.value}
                  checked={useCase === uc.value}
                  onChange={() => patch({ useCase: uc.value })}
                  className="accent-emerald-500"
                />
                <span className="text-sm text-slate-200">{uc.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-white">AI tools & spend</h2>
            <p className="text-sm text-slate-400">
              Add every subscription you pay for today.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addTool}
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:border-emerald-500/50 hover:text-white"
            >
              + Add tool
            </button>
            <button
              type="button"
              onClick={clearSavedForm}
              className="rounded-lg border border-slate-800 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-300"
            >
              Reset form
            </button>
          </div>
        </div>

        {tools.map((tool, index) => {
          const meta = getToolMeta(tool.name)
          return (
            <div
              key={index}
              className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">
                  Tool {index + 1}
                </span>
                {tools.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTool(index)}
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor={`tool-name-${index}`} className={labelClass}>
                    Tool
                  </label>
                  <select
                    id={`tool-name-${index}`}
                    value={tool.name}
                    onChange={(e) => updateTool(index, 'name', e.target.value)}
                    className={inputClass}
                  >
                    {TOOLS.map((t) => (
                      <option key={t.name} value={t.name}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor={`tool-plan-${index}`} className={labelClass}>
                    Plan
                  </label>
                  <select
                    id={`tool-plan-${index}`}
                    value={tool.plan}
                    onChange={(e) => updateTool(index, 'plan', e.target.value)}
                    className={inputClass}
                  >
                    {meta?.plans.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor={`tool-seats-${index}`} className={labelClass}>
                    Seats
                  </label>
                  <input
                    id={`tool-seats-${index}`}
                    type="number"
                    min={1}
                    value={tool.seats}
                    onChange={(e) => updateTool(index, 'seats', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor={`tool-spend-${index}`} className={labelClass}>
                    Monthly spend ($)
                  </label>
                  <input
                    id={`tool-spend-${index}`}
                    type="number"
                    min={0}
                    step={1}
                    value={tool.monthlySpend}
                    onChange={(e) =>
                      updateTool(index, 'monthlySpend', e.target.value)
                    }
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </section>

      <p className="text-xs text-slate-500">
        Form data is saved in your browser so you can reload without losing inputs.
      </p>

      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 py-3.5 text-base font-semibold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-10"
      >
        {loading ? 'Running audit…' : 'Run free audit'}
      </button>
    </form>
  )
}
