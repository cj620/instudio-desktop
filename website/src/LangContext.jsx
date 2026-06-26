import { createContext, useContext, useEffect, useState } from 'react'
import { content } from './content.js'

const LangContext = createContext(null)

function detectInitial() {
  const saved = window.localStorage.getItem('xy-lang')
  if (saved === 'zh' || saved === 'en') return saved
  return navigator.language?.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}

export function LangProvider({ children }) {
  const [lang, setLang] = useState(detectInitial)

  useEffect(() => {
    window.localStorage.setItem('xy-lang', lang)
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
  }, [lang])

  const toggle = () => setLang((l) => (l === 'zh' ? 'en' : 'zh'))

  return (
    <LangContext.Provider value={{ lang, setLang, toggle, t: content[lang] }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within LangProvider')
  return ctx
}
