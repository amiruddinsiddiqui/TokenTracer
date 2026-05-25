import { getPublicShare, getSharePdf } from '../api/client'
import { formatCurrency, formatPlan, formatToolName, frontendShareUrl } from './format'
import { normalizeAudit, normalizeRecommendation } from './normalizeAudit'

function escapeHtml(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * Loads export data from GET /api/share/:id/pdf, with fallback to GET /api/share/:id.
 */
export async function fetchShareExport(publicId) {
  const res = await getSharePdf(publicId)
  const payload = res.data ?? {}

  let audit = normalizeAudit(payload.audit ?? payload)
  let shareUrl = payload.shareUrl

  if (!audit?.recommendations?.length) {
    const shareRes = await getPublicShare(publicId)
    audit = normalizeAudit(shareRes.data)
  }

  if (!audit) {
    throw new Error('Could not load audit data for export')
  }

  if (!shareUrl) {
    shareUrl = frontendShareUrl(publicId)
  }

  return {
    audit,
    shareUrl,
    format: payload.format ?? 'json',
    message: payload.message,
  }
}

export function buildExportFromAudit(audit, shareUrl) {
  const normalized = normalizeAudit(audit)
  if (!normalized) {
    throw new Error('Invalid audit data for export')
  }
  return {
    audit: normalized,
    shareUrl: shareUrl ?? (normalized.publicId ? frontendShareUrl(normalized.publicId) : ''),
    format: 'inline',
  }
}

function buildPrintHtml({ audit, shareUrl }) {
  const monthly = audit.totalMonthlySavings ?? 0
  const annual = audit.totalAnnualSavings ?? 0
  const recs = audit.recommendations ?? []

  const recRows = recs
    .map((rawRec) => {
      const rec = normalizeRecommendation(rawRec) ?? rawRec
      const reason = escapeHtml(rec.reason || 'No additional detail.')
      return `
    <tr>
      <td>${escapeHtml(formatToolName(rec.tool))}${rec.recommendedTool !== rec.tool ? ` → ${escapeHtml(formatToolName(rec.recommendedTool))}` : ''}</td>
      <td>${escapeHtml(formatPlan(rec.currentPlan))} → ${escapeHtml(formatPlan(rec.recommendedPlan))}</td>
      <td>${escapeHtml(formatCurrency(rec.currentSpend))}/mo</td>
      <td>${escapeHtml(formatCurrency(rec.recommendedSpend))}/mo</td>
      <td>${escapeHtml(formatCurrency(rec.monthlySavings))}/mo</td>
    </tr>
    <tr><td colspan="5" style="font-size:12px;color:#374151;padding-bottom:14px;line-height:1.5"><strong>Why:</strong> ${reason}</td></tr>
  `
    })
    .join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Token Tracer Audit Report</title>
  <style>
    body { font-family: system-ui, sans-serif; color: #111; margin: 40px; line-height: 1.5; }
    h1 { font-size: 22px; margin-bottom: 4px; }
    .meta { color: #666; font-size: 14px; margin-bottom: 24px; }
    .savings { background: #f0fdf4; border: 1px solid #86efac; padding: 16px; border-radius: 8px; margin-bottom: 24px; }
    .savings strong { font-size: 28px; color: #047857; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th, td { text-align: left; padding: 8px; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
    th { background: #f9fafb; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; }
    .summary { margin-top: 16px; font-size: 14px; white-space: pre-wrap; }
    .footer { margin-top: 32px; font-size: 12px; color: #9ca3af; }
    @media print { body { margin: 24px; } }
  </style>
</head>
<body>
  <h1>Token Tracer: AI Spend Audit</h1>
  <p class="meta">Use case: ${escapeHtml(audit.useCase ?? 'N/A')} &middot; Generated ${escapeHtml(new Date().toLocaleString())}</p>
  <div class="savings">
    <div>Estimated savings: <strong>${escapeHtml(formatCurrency(monthly))}</strong> / month &middot; <strong>${escapeHtml(formatCurrency(annual))}</strong> / year</div>
  </div>
  ${audit.summary ? `<p class="summary">${escapeHtml(audit.summary)}</p>` : ''}
  <h2 style="font-size:16px;margin-top:28px">Recommendations</h2>
  <table>
    <thead>
      <tr>
        <th>Tool</th>
        <th>Plan change</th>
        <th>Current</th>
        <th>Recommended</th>
        <th>Savings</th>
      </tr>
    </thead>
    <tbody>${recRows || '<tr><td colspan="5">No recommendations</td></tr>'}</tbody>
  </table>
  ${shareUrl ? `<p class="footer">Share link: ${escapeHtml(shareUrl)}</p>` : ''}
</body>
</html>`
}

/** Print via hidden iframe (no pop-up window required). */
export function printAuditReport(exportData) {
  const html = buildPrintHtml(exportData)
  const iframe = document.createElement('iframe')
  iframe.setAttribute('title', 'Audit report print preview')
  iframe.style.cssText =
    'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;'

  document.body.appendChild(iframe)

  const frameWindow = iframe.contentWindow
  if (!frameWindow) {
    document.body.removeChild(iframe)
    throw new Error('Could not open print preview in this browser.')
  }

  const doc = frameWindow.document
  doc.open()
  doc.write(html)
  doc.close()

  const cleanup = () => {
    if (iframe.parentNode) {
      document.body.removeChild(iframe)
    }
  }

  frameWindow.onafterprint = cleanup

  const runPrint = () => {
    try {
      frameWindow.focus()
      frameWindow.print()
    } catch {
      cleanup()
      throw new Error('Could not open the print dialog.')
    }
    setTimeout(cleanup, 60_000)
  }

  if (doc.readyState === 'complete') {
    runPrint()
  } else {
    iframe.onload = runPrint
  }
}

export function downloadAuditJson(exportData, publicId) {
  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `token-tracer-audit-${publicId}.json`
  a.click()
  URL.revokeObjectURL(url)
}
