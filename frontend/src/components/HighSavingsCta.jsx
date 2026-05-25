import { formatCurrency } from '../utils/format'

export default function HighSavingsCta({ monthlySavings }) {
  return (
    <section
      className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/15 via-slate-900 to-orange-500/10 p-6 sm:p-8"
      aria-labelledby="high-savings-cta-heading"
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">
        High savings detected
      </p>
      <h2
        id="high-savings-cta-heading"
        className="mt-2 text-xl font-bold text-white sm:text-2xl"
      >
        You could save {formatCurrency(monthlySavings)}/mo with the right plans
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
        Your audit shows significant overspend on AI subscriptions. Downgrades
        and tool swaps help, but discounted credits and enterprise pricing can
        capture even more. Save your report below and we can follow up on next
        steps for your stack.
      </p>
    </section>
  )
}
