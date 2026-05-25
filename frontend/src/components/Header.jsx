import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const { pathname } = useLocation()

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20">
            TT
          </span>
          <span className="text-lg font-semibold tracking-tight text-white group-hover:text-emerald-300">
            Token Tracer
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            to="/"
            className={
              pathname === '/'
                ? 'font-medium text-emerald-400'
                : 'text-slate-400 hover:text-white'
            }
          >
            New audit
          </Link>
        </nav>
      </div>
    </header>
  )
}
