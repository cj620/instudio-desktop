import { useLang } from '../LangContext.jsx'
import Reveal from './Reveal.jsx'

export default function Paradigm() {
  const { t } = useLang()
  return (
    <section id="paradigm" className="border-y border-white/5 bg-white/[0.02] py-20 sm:py-28">
      <div className="container-page">
        <Reveal>
          <h2 className="section-title">{t.paradigm.heading}</h2>
          <p className="section-sub">{t.paradigm.sub}</p>
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.paradigm.stages.map((s, i) => (
            <Reveal key={s.stage} delay={i * 70}>
              <div className="card h-full hover:border-brand/40">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/15 text-sm font-bold text-brand-soft">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-lg font-semibold text-white">{s.stage}</h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-400">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
