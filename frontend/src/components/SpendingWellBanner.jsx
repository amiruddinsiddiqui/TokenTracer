export default function SpendingWellBanner() {
  return (
    <section
      className="rounded-2xl border border-slate-700 bg-slate-900/60 p-6"
      role="status"
    >
      <h2 className="text-lg font-semibold text-slate-200">
        You&apos;re spending well
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">
        We did not find meaningful waste in your current plans for this use
        case, and we will not invent savings to sell you something. Save your
        report below and we will notify you when new optimizations apply to
        your stack.
      </p>
    </section>
  )
}
