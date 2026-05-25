const API_BASE = import.meta.env.VITE_API_URL || ''

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
    ...options,
  })

  const body = await res.json().catch(() => ({}))

  if (!res.ok) {
    const message =
      body?.message || body?.error || `Request failed (${res.status})`
    const err = new Error(message)
    err.status = res.status
    err.body = body
    throw err
  }

  return body
}

export function createAudit(payload) {
  return request('/api/audit', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getAudit(id) {
  return request(`/api/audit/${id}`)
}

export function getPublicShare(publicId) {
  return request(`/api/share/${publicId}`)
}

/** GET /api/share/:id/pdf: export payload (JSON until server renders PDF bytes). */
export function getSharePdf(publicId) {
  return request(`/api/share/${publicId}/pdf`)
}

export function captureLead(payload) {
  return request('/api/leads', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
