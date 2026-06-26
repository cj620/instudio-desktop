import { useLang } from '../LangContext.jsx'
import { LINKS } from '../content.js'
import logo from '../assets/logo.png'

export default function Nav() {
  const { t, lang, toggle } = useLang()
  const items = [
    { href: '#modes', label: t.nav.modes },
    { href: '#paradigm', label: t.nav.paradigm },
    { href: '#models', label: t.nav.models },
    { href: '#download', label: t.nav.download }
  ]

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-ink/70 backdrop-blur-md">
      <nav className="container-page flex h-16 items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5">
          <img src={logo} alt="小元" className="h-8 w-8 rounded-lg" />
          <span className="text-lg font-bold text-white">小元</span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {items.map((it) => (
            <a
              key={it.href}
              href={it.href}
              className="text-sm text-slate-300 transition hover:text-white"
            >
              {it.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggle}
            className="rounded-lg border border-slate-700 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition hover:border-slate-500 hover:text-white"
            aria-label="toggle language"
          >
            {lang === 'zh' ? 'EN' : '中'}
          </button>
          <a
            href={LINKS.github}
            target="_blank"
            rel="noreferrer"
            className="hidden text-sm text-slate-300 transition hover:text-white sm:inline"
          >
            GitHub
          </a>
          <a
            href={LINKS.releases}
            target="_blank"
            rel="noreferrer"
            className="btn-primary !px-4 !py-2"
          >
            {t.nav.download}
          </a>
        </div>
      </nav>
    </header>
  )
}
