// 构建期抓取最新 Release,写成静态 public/release.json。
// 浏览器改读同源的这个文件,避免直连 api.github.com(会被部分网络/代理
// 拦成 403,且匿名有 60 次/小时限流)。CI 里带 GITHUB_TOKEN,稳定且高限额。
// 抓取失败时写入空数据,保证构建不被打断(前端会回退到 Releases 页)。
import { writeFile, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = 'cj620/instudio-desktop'
const API = `https://api.github.com/repos/${REPO}/releases/latest`
const here = dirname(fileURLToPath(import.meta.url))
const OUT = join(here, '..', 'public', 'release.json')

// 每个平台只取真正用于安装的产物,忽略 .blockmap / .zip(更新包)/ *.yml。
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

async function main() {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'xiaoyuan-website-build'
  }
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN
  if (token) headers.Authorization = `Bearer ${token}`

  let data = { version: '', assets: {} }

  const ac = new AbortController()
  const timer = setTimeout(() => ac.abort(), 10000)
  try {
    const res = await fetch(API, { headers, signal: ac.signal })
    if (!res.ok) throw new Error(`GitHub API ${res.status}`)
    const rel = await res.json()
    data = { version: rel.tag_name || '', assets: pickAssets(rel) }
    console.log(`[fetch-release] ${data.version || '(no tag)'} · ${Object.keys(data.assets).join(', ') || 'no assets'}`)
  } catch (err) {
    console.warn(`[fetch-release] failed: ${err.message} — writing empty release.json`)
  } finally {
    clearTimeout(timer)
  }

  await mkdir(dirname(OUT), { recursive: true })
  await writeFile(OUT, JSON.stringify(data, null, 2) + '\n', 'utf8')
}

main()
