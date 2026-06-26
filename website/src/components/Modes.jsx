import { useLang } from '../LangContext.jsx'
import Reveal from './Reveal.jsx'
import { OperationsMock, WriteMock } from './AppMockups.jsx'

function ModeRow({ data, visual, reverse }) {
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
      <div className={reverse ? 'lg:order-1' : ''}>{visual}</div>
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
            <ModeRow data={t.modes.code} visual={<OperationsMock />} />
          </Reveal>
          <Reveal>
            <ModeRow data={t.modes.write} visual={<WriteMock />} reverse />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
