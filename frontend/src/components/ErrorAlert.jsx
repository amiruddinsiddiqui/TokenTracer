export default function ErrorAlert({ message, onRetry }) {
  if (!message) return null

  return (
    <div
      className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-200"
      role="alert"
    >
      <p className="text-sm">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 text-sm font-medium text-red-300 underline hover:text-white"
        >
          Try again
        </button>
      )}
    </div>
  )
}
