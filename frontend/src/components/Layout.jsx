import Header from './Header'

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-emerald-500 focus:px-4 focus:py-2 focus:text-slate-950"
      >
        Skip to main content
      </a>
      <Header />
      <main
        id="main-content"
        className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8"
      >
        {children}
      </main>
      <footer className="border-t border-slate-800 py-6 text-center text-sm text-slate-500">
        Token Tracer: free AI spend audit
      </footer>
    </div>
  )
}
