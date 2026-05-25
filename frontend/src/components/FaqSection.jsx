const FAQ = [
  {
    q: 'Do I need to create an account?',
    a: 'No. Run a free audit instantly. Email is optional and only asked after you see your results.',
  },
  {
    q: 'How accurate are the savings numbers?',
    a: 'They are estimates from published list prices and seat-fit rules, not your actual invoices. Use them to spot obvious plan mismatches, then validate with your billing.',
  },
  {
    q: 'Which tools do you support?',
    a: 'Cursor, GitHub Copilot, Claude, ChatGPT, Anthropic API, OpenAI API, Gemini, and Windsurf, with plan-level inputs and seat counts.',
  },
  {
    q: 'Can I get help implementing recommendations?',
    a: 'Yes. High-savings audits can include a follow-up if you save your report with email. We focus on plan fit and realistic downgrades first.',
  },
  {
    q: 'Is my data shared publicly?',
    a: 'Share links show tools and savings only. Never your email or company name.',
  },
]

export default function FaqSection() {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-lg font-semibold text-white">
        FAQ
      </h2>
      <dl className="mt-4 space-y-4">
        {FAQ.map((item) => (
          <div key={item.q}>
            <dt className="font-medium text-slate-200">{item.q}</dt>
            <dd className="mt-1 text-sm text-slate-400">{item.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
