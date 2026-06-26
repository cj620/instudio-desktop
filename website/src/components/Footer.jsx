import { useLang } from '../LangContext.jsx'
import { LINKS } from '../content.js'
import logo from '../assets/logo.png'

export default function Footer() {
  const { t } = useLang()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/5 py-12">
      <div className="container-page flex flex-col gap-10 sm:flex-row sm:justify-between">
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="小元" className="h-8 w-8 rounded-lg" />
            <span className="text-lg font-bold text-white">小元</span>
          </div>
          <p className="mt-4 text-sm text-slate-400">{t.footer.tagline}</p>
          <p className="mt-2 text-xs text-slate-600">{t.footer.stack}</p>
        </div>

        <div className="flex gap-16">
          <div>
            <h4 className="text-sm font-semibold text-white">{t.footer.colProduct}</h4>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li><a href="#modes" className="hover:text-white">{t.nav.modes}</a></li>
              <li><a href="#models" className="hover:text-white">{t.nav.models}</a></li>
              <li><a href="#download" className="hover:text-white">{t.nav.download}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">{t.footer.colResources}</h4>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li><a href={LINKS.github} target="_blank" rel="noreferrer" className="hover:text-white">GitHub</a></li>
              <li><a href={LINKS.releases} target="_blank" rel="noreferrer" className="hover:text-white">{t.footer.releases}</a></li>
              <li><a href={LINKS.docs} target="_blank" rel="noreferrer" className="hover:text-white">{t.footer.docs}</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container-page mt-10 flex flex-col gap-2 border-t border-white/5 pt-6 text-xs text-slate-600 sm:flex-row sm:justify-between">
        <span>© {year} 小元 · instudio</span>
        <span>{t.footer.license}</span>
      </div>
    </footer>
  )
}
