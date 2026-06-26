import { useLang } from '../LangContext.jsx'
import Reveal from './Reveal.jsx'
import codeGif from '../assets/code.gif'
import writeGif from '../assets/write.gif'

function ModeRow({ data, gif, reverse }) {
  return (
    <div className="grid items-center gap-8 lg:grid-cols-2">
      <div className={reverse ? 'lg:order-2' : ''}>
        <span className="eyebrow">{data.tag}</span>
        <h3 className="mt-4 text-2xl font-bold text-white sm:text-3xl">{data.title}</h3>
        <p className="mt-4 leading-relaxed text-slate-400">{data.desc}</p>
        <ul className="mt-6 space-y-3">
          {data.points.map((p) => (
            <li key={p} className="flex gap-3 text-slate-300">
              <span className="mt-0.5 text-brand-soft">▸</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={reverse ? 'lg:order-1' : ''}>
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-2xl shadow-black/40">
          <img src={gif} alt={data.tag} loading="lazy" className="w-full" />
        </div>
      </div>
    </div>
  )
}

export default function Modes() {
  const { t } = useLang()
  return (
    <section id="modes" className="py-20 sm:py-28">
      <div className="container-page">
        <Reveal>
          <h2 className="section-title">{t.modes.heading}</h2>
          <p className="section-sub">{t.modes.sub}</p>
        </Reveal>
        <div className="mt-14 space-y-16">
          <Reveal>
            <ModeRow data={t.modes.code} gif={codeGif} />
          </Reveal>
          <Reveal>
            <ModeRow data={t.modes.write} gif={writeGif} reverse />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
