import { useLang } from '../LangContext.jsx'
import Reveal from './Reveal.jsx'

export default function Models() {
  const { t } = useLang()
  return (
    <section id="models" className="py-20 sm:py-28">
      <div className="container-page">
        <Reveal>
          <h2 className="section-title">{t.models.heading}</h2>
          <p className="section-sub">{t.models.sub}</p>
        </Reveal>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {t.models.items.map((m, i) => (
            <Reveal key={m.name} delay={i * 80}>
              <div className="card h-full hover:border-brand/40">
                <h3 className="text-xl font-bold text-white">{m.name}</h3>
                <div className="mt-3 h-px w-12 bg-brand/50" />
                <p className="mt-4 text-sm leading-relaxed text-slate-400">{m.role}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="mt-6 text-sm text-slate-500">{t.models.note}</p>
        </Reveal>
      </div>
    </section>
  )
}
