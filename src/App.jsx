import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Lightning from './components/Lightning.jsx'
import Projects from './components/Projects.jsx'
import { useContent } from './i18n/useContent.js'

export default function App() {
  const t = useContent()

  return (
    <>
      <Lightning />
      <a className="skip-link" href="#main">{t.skipLink}</a>
      <div id="top" />
      <Nav />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Projects />
      </main>
    </>
  )
}
