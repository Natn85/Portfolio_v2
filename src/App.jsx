import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import { useContent } from './i18n/useContent.js'

export default function App() {
  const t = useContent()

  return (
    <>
      <a className="skip-link" href="#main">{t.skipLink}</a>
      <div id="top" />
      <Nav />
      <main id="main" tabIndex={-1}>
        <Hero />
      </main>
    </>
  )
}
