import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import DownloadModal from './components/DownloadModal.jsx'

const REPO = 'cj620/instudio-desktop'
const RELEASES_PAGE = `https://github.com/${REPO}/releases/latest`
// 同源静态文件,构建期由 scripts/fetch-release.mjs 写入。
// 不直连 api.github.com:部分网络会把它拦成 403,且匿名有限流。
const RELEASE_JSON = `${import.meta.env.BASE_URL}release.json`

const DownloadContext = createContext(null)

// 仅靠 UA 粗判操作系统;macOS 的 arm/intel 无法从 UA 可靠区分,
// 默认按 Apple Silicon 推荐,Chromium 上再用 userAgentData 精修。
export function detectOS() {
  const ua = navigator.userAgent || ''
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios'
  if (/Android/i.test(ua)) return 'android'
  if (/Macintosh|Mac OS X/i.test(ua)) return 'mac'
  if (/Windows|Win64|Win32/i.test(ua)) return 'windows'
  if (/Linux/i.test(ua)) return 'linux'
  return 'other'
}

export function formatSize(bytes) {
  if (!bytes) return ''
  return `${(bytes / 1024 / 1024).toFixed(0)} MB`
}

export function DownloadProvider({ children }) {
  const [state, setState] = useState({ loading: true, error: false, version: '', assets: {} })
  const [archHint, setArchHint] = useState(null)
  const [pending, setPending] = useState(null)

  useEffect(() => {
    let alive = true

    fetch(RELEASE_JSON, { cache: 'no-cache' })
      .then((r) => {
        if (!r.ok) throw new Error(`release.json ${r.status}`)
        return r.json()
      })
      .then((data) => {
        if (!alive) return
        const assets = data?.assets || {}
        const hasAny = Object.keys(assets).length > 0
        setState({ loading: false, error: !hasAny, version: data?.version || '', assets })
      })
      .catch(() => {
        if (alive) setState({ loading: false, error: true, version: '', assets: {} })
      })

    // Chromium 高熵 UA:可拿到 'arm' / 'x86',用于精修 mac 架构推荐。
    navigator.userAgentData
      ?.getHighEntropyValues?.(['architecture'])
      .then((hv) => {
        if (alive && hv?.architecture) setArchHint(hv.architecture)
      })
      .catch(() => {})

    return () => {
      alive = false
    }
  }, [])

  const os = useMemo(() => detectOS(), [])

  const recommended = useMemo(() => {
    const a = state.assets
    if (os === 'windows') return a.win || null
    if (os === 'linux') return a.linux || null
    if (os === 'mac') return (archHint === 'x86' ? a.macX64 : a.macArm64) || a.macArm64 || a.macX64 || null
    return null
  }, [state.assets, os, archHint])

  // asset 缺失时回退到 Releases 页(仅在拿不到直链的极端情况)。
  const requestDownload = (asset) => {
    if (!asset) {
      window.open(RELEASES_PAGE, '_blank', 'noopener,noreferrer')
      return
    }
    setPending(asset)
  }

  const confirmDownload = () => {
    if (pending) {
      const a = document.createElement('a')
      a.href = pending.url
      a.download = pending.name
      a.rel = 'noopener'
      document.body.appendChild(a)
      a.click()
      a.remove()
    }
    setPending(null)
  }

  const value = {
    loading: state.loading,
    error: state.error,
    version: state.version,
    assets: state.assets,
    os,
    archHint,
    recommended,
    requestDownload,
    releasesPage: RELEASES_PAGE
  }

  return (
    <DownloadContext.Provider value={value}>
      {children}
      <DownloadModal asset={pending} onConfirm={confirmDownload} onCancel={() => setPending(null)} />
    </DownloadContext.Provider>
  )
}

export function useDownload() {
  const ctx = useContext(DownloadContext)
  if (!ctx) throw new Error('useDownload must be used within DownloadProvider')
  return ctx
}
