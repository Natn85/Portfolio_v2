import { useContent, useLanguageSwitch } from '../i18n/useContent.js'
import './LanguageToggle.css'

const LANGUAGES = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'de', label: 'DE', name: 'Deutsch' },
]

export default function LanguageToggle() {
  const t = useContent()
  const { lang, setLang } = useLanguageSwitch()

  return (
    <div className="lang-toggle" role="group" aria-label={t.nav.language}>
      {LANGUAGES.map(({ code, label, name }) => (
        <button
          key={code}
          type="button"
          className="lang-toggle__button"
          aria-pressed={lang === code}
          title={name}
          lang={code}
          onClick={() => setLang(code)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
