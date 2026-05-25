export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount ?? 0)
}

export function formatToolName(name) {
  const labels = {
    cursor: 'Cursor',
    chatgpt: 'ChatGPT',
    claude: 'Claude',
    githubCopilot: 'GitHub Copilot',
    gemini: 'Gemini',
    windsurf: 'Windsurf',
    anthropicApi: 'Anthropic API',
    openaiApi: 'OpenAI API',
  }
  return labels[name] || name
}

export function formatPlan(plan) {
  if (!plan) return 'N/A'
  return plan
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
}

export function frontendShareUrl(publicId) {
  if (!publicId) return ''
  const base = window.location.origin
  return `${base}/share/${publicId}`
}
