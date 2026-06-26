import { useLang } from '../LangContext.jsx'
import Reveal from './Reveal.jsx'

export default function Why() {
  const { t } = useLang()
  return (
    <section className="border-y border-white/5 bg-white/[0.02] py-20 sm:py-28">
      <div className="container-page">
        <Reveal>
          <h2 className="section-title">{t.why.heading}</h2>
        </Reveal>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {t.why.items.map((it, i) => (
            <Reveal key={it.want} delay={i * 60}>
              <div className="card h-full hover:border-brand/40">
                <h3 className="text-base font-semibold text-brand-soft">{it.want}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{it.provide}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
