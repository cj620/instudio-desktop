import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 项目页地址为 https://cj620.github.io/instudio-desktop/(带子路径),
// 因此 base 必须是 '/instudio-desktop/',否则构建后 JS/CSS/图片会 404。
// 若以后绑定自定义域名(走根路径),把 base 改回 '/' 即可。
export default defineConfig({
  base: '/instudio-desktop/',
  plugins: [react()]
})
