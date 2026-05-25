export const USE_CASES = [
  { value: 'coding', label: 'Coding & development' },
  { value: 'writing', label: 'Writing & content' },
  { value: 'research', label: 'Research' },
  { value: 'data', label: 'Data & analytics' },
  { value: 'mixed', label: 'Mixed workflows' },
  { value: 'general', label: 'General productivity' },
]

export const TOOLS = [
  {
    name: 'cursor',
    label: 'Cursor',
    plans: [
      { value: 'hobby', label: 'Hobby (free)' },
      { value: 'pro', label: 'Pro' },
      { value: 'business', label: 'Business' },
      { value: 'enterprise', label: 'Enterprise' },
    ],
    defaultPlan: 'pro',
    defaultSpend: 20,
  },
  {
    name: 'chatgpt',
    label: 'ChatGPT',
    plans: [
      { value: 'plus', label: 'Plus' },
      { value: 'team', label: 'Team' },
      { value: 'enterprise', label: 'Enterprise' },
      { value: 'api', label: 'API (usage-based)' },
    ],
    defaultPlan: 'plus',
    defaultSpend: 20,
  },
  {
    name: 'claude',
    label: 'Claude',
    plans: [
      { value: 'free', label: 'Free' },
      { value: 'pro', label: 'Pro' },
      { value: 'max', label: 'Max' },
      { value: 'team', label: 'Team' },
      { value: 'enterprise', label: 'Enterprise' },
      { value: 'api', label: 'API (usage-based)' },
    ],
    defaultPlan: 'pro',
    defaultSpend: 20,
  },
  {
    name: 'githubCopilot',
    label: 'GitHub Copilot',
    plans: [
      { value: 'individual', label: 'Individual' },
      { value: 'business', label: 'Business' },
      { value: 'enterprise', label: 'Enterprise' },
    ],
    defaultPlan: 'individual',
    defaultSpend: 10,
  },
  {
    name: 'gemini',
    label: 'Google Gemini',
    plans: [
      { value: 'pro', label: 'Pro' },
      { value: 'ultra', label: 'Ultra' },
      { value: 'api', label: 'API (usage-based)' },
    ],
    defaultPlan: 'pro',
    defaultSpend: 20,
  },
  {
    name: 'windsurf',
    label: 'Windsurf',
    plans: [
      { value: 'pro', label: 'Pro' },
      { value: 'team', label: 'Team' },
    ],
    defaultPlan: 'pro',
    defaultSpend: 15,
  },
  {
    name: 'anthropicApi',
    label: 'Anthropic API',
    plans: [{ value: 'api', label: 'Usage-based' }],
    defaultPlan: 'api',
    defaultSpend: 0,
  },
  {
    name: 'openaiApi',
    label: 'OpenAI API',
    plans: [{ value: 'api', label: 'Usage-based' }],
    defaultPlan: 'api',
    defaultSpend: 0,
  },
]

export const TOOL_LABELS = Object.fromEntries(
  TOOLS.map((t) => [t.name, t.label]),
)

export function getToolMeta(name) {
  return TOOLS.find((t) => t.name === name)
}

export function createDefaultTool(name = 'cursor') {
  const meta = getToolMeta(name) || TOOLS[0]
  return {
    name: meta.name,
    plan: meta.defaultPlan,
    seats: 1,
    monthlySpend: meta.defaultSpend,
  }
}
