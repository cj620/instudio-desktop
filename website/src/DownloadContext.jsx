import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import DownloadModal from './components/DownloadModal.jsx'

const REPO = 'cj620/instudio-desktop'
const API = `https://api.github.com/repos/${REPO}/releases/latest`
const RELEASES_PAGE = `https://github.com/${REPO}/releases/latest`

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

// 从 release.assets 里挑出每个平台真正用于安装的产物(忽略 .blockmap / .zip 更新包)。
function pickAssets(release) {
  const out = {}
  for (const a of release.assets || []) {
    const item = { name: a.name, url: a.browser_download_url, size: a.size }
    if (/-mac-arm64\.dmg$/i.test(a.name)) out.macArm64 = item
    else if (/-mac-x64\.dmg$/i.test(a.name)) out.macX64 = item
    else if (/-win-x64\.exe$/i.test(a.name)) out.win = item
    else if (/-linux-.*\.AppImage$/i.test(a.name)) out.linux = item
  }
  return out
}

export function DownloadProvider({ children }) {
  const [state, setState] = useState({ loading: true, error: false, version: '', assets: {} })
  const [archHint, setArchHint] = useState(null)
  const [pending, setPending] = useState(null)

  useEffect(() => {
    let alive = true

    fetch(API, { headers: { Accept: 'application/vnd.github+json' } })
      .then((r) => {
        if (!r.ok) throw new Error(`GitHub API ${r.status}`)
        return r.json()
      })
      .then((rel) => {
        if (alive) {
          setState({ loading: false, error: false, version: rel.tag_name || '', assets: pickAssets(rel) })
        }
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

  // asset 为空时回退到 Releases 页(仅在拿不到直链的极端情况)。
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
