import { useLang } from '../LangContext.jsx'
import { LINKS } from '../content.js'
import Reveal from './Reveal.jsx'

export default function Download() {
  const { t } = useLang()
  return (
    <section id="download" className="py-20 sm:py-28">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl border border-brand/20 bg-gradient-to-b from-brand/10 to-transparent p-8 sm:p-12">
          <Reveal>
            <h2 className="section-title">{t.download.heading}</h2>
            <p className="section-sub">{t.download.sub}</p>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {t.download.platforms.map((p, i) => (
              <Reveal key={p.os} delay={i * 70}>
                <a
                  href={LINKS.releases}
                  target="_blank"
                  rel="noreferrer"
                  className="card flex h-full flex-col gap-1 hover:border-brand/50 hover:bg-white/5"
                >
                  <span className="text-lg font-semibold text-white">{p.os}</span>
                  <span className="text-sm text-slate-400">{p.hint}</span>
                  <span className="mt-3 text-sm font-medium text-brand-soft">
                    {t.download.cta} →
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-sm text-slate-500">{t.download.note}</p>
        </div>
      </div>
    </section>
  )
}
