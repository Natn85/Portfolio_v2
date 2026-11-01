import { useLayoutEffect } from 'react'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Lightning from './components/Lightning.jsx'
import Projects from './components/Projects.jsx'
import Skills from './components/Skills.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import { useContent } from './i18n/useContent.js'

export default function App() {
  const t = useContent()

  // Sections below the hero fade in once when they scroll into view.
  // The hidden state is added here (before first paint), so without JS nothing stays hidden.
  useLayoutEffect(() => {
    const sections = document.querySelectorAll('main > section:not(.hero)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || !('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 })

    sections.forEach((section) => {
      section.classList.add('reveal')
      observer.observe(section)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Lightning />
      <a className="skip-link" href="#main">{t.skipLink}</a>
      <div id="top" />
      <Nav />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
