import { useState } from 'react'
import {
  buildExportFromAudit,
  downloadAuditJson,
  fetchShareExport,
  printAuditReport,
} from '../utils/exportReport'

export default function ExportReportButton({
  publicId,
  audit,
  shareUrl,
  className = '',
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleExport(mode) {
    if (!publicId && !audit) return
    setLoading(true)
    setError('')

    try {
      let exportData
      if (audit) {
        exportData = buildExportFromAudit(audit, shareUrl)
      } else {
        exportData = await fetchShareExport(publicId)
      }

      if (mode === 'json') {
        downloadAuditJson(exportData, publicId || audit?.publicId || 'audit')
      } else {
        printAuditReport(exportData)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!publicId && !audit) return null

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={loading}
          onClick={() => handleExport('pdf')}
          className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300 hover:bg-emerald-500/20 disabled:opacity-50"
        >
          {loading ? 'Preparing…' : 'Export PDF'}
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => handleExport('json')}
          className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 disabled:opacity-50"
        >
          Download JSON
        </button>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
      <p className="mt-2 text-xs text-slate-500">
        PDF opens your browser print dialog (choose Save as PDF). No pop-up window
        required.
      </p>
    </div>
  )
}
