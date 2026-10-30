import { useEffect, useMemo, useState } from 'react'
import { content } from '../data/content.js'
import { LanguageContext } from './context.js'

const STORAGE_KEY = 'lang'

function initialLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && saved in content) return saved
  } catch {
    // Storage blocked (private mode etc.) – fall back to the browser language.
  }
  return navigator.language?.toLowerCase().startsWith('de') ? 'de' : 'en'
}

export default function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(initialLanguage)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo(() => ({
    lang,
    setLang(next) {
      setLangState(next)
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // Not critical; the choice just won't be remembered.
      }
    },
  }), [lang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
