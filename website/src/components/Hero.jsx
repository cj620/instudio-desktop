import { useLang } from '../LangContext.jsx'
import { useDownload } from '../DownloadContext.jsx'
import { LINKS } from '../content.js'
import mascot from '../assets/mascot.png'

export default function Hero() {
  const { t } = useLang()
  const { recommended, requestDownload } = useDownload()

  return (
    <section id="top" className="relative pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute left-1/2 top-[-12%] h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-brand/25 blur-[120px]" />
        <div className="absolute right-[6%] top-[28%] h-72 w-72 rounded-full bg-indigo-600/20 blur-[110px]" />
      </div>

      <div className="container-page grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="animate-fade-up">
          <span className="eyebrow">{t.hero.badge}</span>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl">
            {t.hero.titleTop}
            <br />
            <span className="bg-gradient-to-r from-brand-soft to-indigo-300 bg-clip-text text-transparent">
              {t.hero.titleBottom}
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-400">
            {t.hero.subtitle}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <button
              onClick={() =>
                recommended
                  ? requestDownload(recommended)
                  : document.getElementById('download')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="btn-primary"
            >
              {t.hero.ctaDownload} ↓
            </button>
            <a href={LINKS.github} target="_blank" rel="noreferrer" className="btn-ghost">
              {t.hero.ctaGithub}
            </a>
          </div>
          <p className="mt-5 text-sm text-slate-500">{t.hero.note}</p>
        </div>

        <div className="relative mx-auto hidden max-w-xs lg:block">
          <img
            src={mascot}
            alt="小元 mascot"
            className="w-full animate-float drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  )
}
