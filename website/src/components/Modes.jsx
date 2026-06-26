import { useLang } from '../LangContext.jsx'
import Reveal from './Reveal.jsx'
import { OperationsMock, WriteMock } from './AppMockups.jsx'

function FeatureBlock({ data, visual }) {
  return (
    <div>
      <Reveal>
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">{data.tag}</span>
          <h3 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {data.title}
          </h3>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-slate-400">{data.desc}</p>
        </div>
      </Reveal>
      <Reveal>
        <div className="mt-10 sm:mt-12">{visual}</div>
      </Reveal>
      <Reveal>
        <div className="mx-auto mt-8 grid max-w-4xl gap-x-8 gap-y-3 sm:grid-cols-3">
          {data.points.map((p) => (
            <div key={p} className="flex gap-2.5 text-sm leading-relaxed text-slate-300">
              <span className="mt-0.5 shrink-0 text-brand-soft">▸</span>
              <span>{p}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  )
}

export default function Modes() {
  const { t } = useLang()
  return (
    <section id="modes" className="py-20 sm:py-28">
      <div className="container-page">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="section-title">{t.modes.heading}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-400">
              {t.modes.sub}
            </p>
          </div>
        </Reveal>
        <div className="mt-16 space-y-24 sm:mt-20 sm:space-y-28">
          <FeatureBlock data={t.modes.code} visual={<OperationsMock />} />
          <FeatureBlock data={t.modes.write} visual={<WriteMock />} />
        </div>
      </div>
    </section>
  )
}
