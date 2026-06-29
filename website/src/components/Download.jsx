import { useLang } from '../LangContext.jsx'
import { useDownload, formatSize } from '../DownloadContext.jsx'
import Reveal from './Reveal.jsx'

function RecommendedCard({ d, os, asset, assets, onPick }) {
  const osName = d.osNames[os] || os
  // 已推荐的不是 x64,且确实存在 x64 包时,给 Intel 用户一个切换入口。
  const showMacIntel = os === 'mac' && assets.macX64 && asset !== assets.macX64

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-brand/40 bg-brand/5 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <span className="eyebrow">{d.recommendedTitle}</span>
        <p className="mt-3 text-xl font-bold text-white">{osName}</p>
        <p className="mt-1 break-all text-sm text-slate-400">
          {asset.name}
          {asset.size ? <span className="text-slate-600"> · {formatSize(asset.size)}</span> : null}
        </p>
        {showMacIntel ? (
          <button
            onClick={() => onPick(assets.macX64)}
            className="mt-2 text-xs font-medium text-brand-soft hover:underline"
          >
            {d.macIntelHint}
          </button>
        ) : null}
      </div>
      <button onClick={() => onPick(asset)} className="btn-primary shrink-0">
        {d.recommendBtn} ↓
      </button>
    </div>
  )
}

export default function Download() {
  const { t } = useLang()
  const d = t.download
  const { loading, error, version, assets, os, recommended, requestDownload } = useDownload()

  const otherPlatforms = d.platforms.filter((p) => assets[p.key])
  const isDesktop = os === 'mac' || os === 'windows' || os === 'linux'

  return (
    <section id="download" className="py-20 sm:py-28">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl border border-brand/20 bg-gradient-to-b from-brand/10 to-transparent p-8 sm:p-12">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="section-title">{d.heading}</h2>
              {version ? (
                <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400">
                  {d.latest} {version}
                </span>
              ) : null}
            </div>
            <p className="section-sub">{d.sub}</p>
          </Reveal>

          <Reveal>
            <div className="mt-10">
              {loading ? (
                <div className="card animate-pulse text-sm text-slate-500">{d.detecting}</div>
              ) : recommended ? (
                <RecommendedCard d={d} os={os} asset={recommended} assets={assets} onPick={requestDownload} />
              ) : (
                <div className="card text-sm text-slate-400">
                  <p>{error ? d.loadError : isDesktop ? d.noBuild : d.unsupported}</p>
                </div>
              )}
            </div>
          </Reveal>

          {otherPlatforms.length > 0 ? (
            <div className="mt-10">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">{d.otherTitle}</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {otherPlatforms.map((p, i) => (
                  <Reveal key={p.key} delay={i * 60}>
                    <button
                      onClick={() => requestDownload(assets[p.key])}
                      className="card flex h-full w-full flex-col items-start gap-1 text-left hover:border-brand/50 hover:bg-white/5"
                    >
                      <span className="text-base font-semibold text-white">{p.os}</span>
                      <span className="text-xs text-slate-400">{p.hint}</span>
                      <span className="text-xs text-slate-600">{formatSize(assets[p.key].size)}</span>
                      <span className="mt-3 text-sm font-medium text-brand-soft">{d.downloadBtn} ↓</span>
                    </button>
                  </Reveal>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-8">
            <p className="text-sm text-slate-500">{d.note}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
