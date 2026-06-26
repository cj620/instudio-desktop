import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages 在子路径 /instudio-desktop/ 下,base 必须带前缀否则资源 404。
// Netlify / Vercel / Cloudflare Pages 在根路径托管,需要 base = '/'。
// 这些平台构建时各自注入了环境变量,据此自动切换;也可手动用 DEPLOY_BASE 覆盖。
const rootHost = process.env.NETLIFY || process.env.VERCEL || process.env.CF_PAGES
const base = process.env.DEPLOY_BASE || (rootHost ? '/' : '/instudio-desktop/')

export default defineConfig({
  base,
  plugins: [react()]
})
