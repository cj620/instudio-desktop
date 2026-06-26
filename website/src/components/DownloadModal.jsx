import { useEffect } from 'react'
import { useLang } from '../LangContext.jsx'
import { formatSize } from '../DownloadContext.jsx'

// 下载确认弹窗:有待下载 asset 时显示,确认后由父级触发直链下载。
export default function DownloadModal({ asset, onConfirm, onCancel }) {
  const { t } = useLang()
  const c = t.download.confirm

  useEffect(() => {
    if (!asset) return
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel()
      if (e.key === 'Enter') onConfirm()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [asset, onCancel, onConfirm])

  if (!asset) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-up" onClick={onCancel} />
      <div className="relative w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl animate-fade-up">
        <h3 className="text-lg font-bold text-white">{c.title}</h3>
        <p className="mt-4 text-sm text-slate-400">{c.body}</p>
        <div className="mt-2 rounded-xl border border-slate-800 bg-black/30 px-4 py-3">
          <p className="break-all text-sm font-medium text-brand-soft">{asset.name}</p>
          {asset.size ? <p className="mt-1 text-xs text-slate-500">{formatSize(asset.size)}</p> : null}
        </div>
        <p className="mt-3 text-xs text-slate-500">{c.tip}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="btn-ghost !px-4 !py-2">
            {c.cancel}
          </button>
          <button onClick={onConfirm} className="btn-primary !px-4 !py-2" autoFocus>
            {c.confirm} ↓
          </button>
        </div>
      </div>
    </div>
  )
}
