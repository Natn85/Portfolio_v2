import { lazy, Suspense } from 'react'
import { useContent } from '../i18n/useContent.js'
import { site } from '../data/content.js'
import LanguageToggle from './LanguageToggle.jsx'
import './Nav.css'

function CoinFallback() {
  return (
    <span className="coin">
      <img className="coin__fallback" src="/favicon.svg" alt="" />
    </span>
  )
}

// three.js is only pulled in here, as its own chunk. If the chunk can't load, keep the favicon.
const CoinLogo = lazy(() =>
  import('./CoinLogo.jsx').catch(() => ({ default: CoinFallback })),
)

export default function Nav() {
  const t = useContent()

  return (
    <header className="nav">
      <div className="container nav__inner">
        <a className="nav__brand" href="#top" aria-label={t.nav.home}>
          {site.name}
        </a>
        <nav className="nav__right" aria-label={t.nav.label}>
          <ul className="nav__links">
            <li><a className="nav__link" href="#projects">{t.nav.projects}</a></li>
            <li><a className="nav__link" href="#skills">{t.nav.skills}</a></li>
            <li><a className="nav__link" href="#contact">{t.nav.contact}</a></li>
          </ul>
        </nav>
        <LanguageToggle />
        <a className="nav__coin" href="#top" aria-label="Nat, back to top">
          <Suspense fallback={<CoinFallback />}>
            <CoinLogo />
          </Suspense>
        </a>
      </div>
    </header>
  )
}
