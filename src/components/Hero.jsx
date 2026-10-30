import { useContent } from '../i18n/useContent.js'
import { site } from '../data/content.js'
import './Hero.css'

export default function Hero() {
  const t = useContent()

  return (
    <section className="hero container" aria-labelledby="hero-title">
      <p className="mono-label">{t.hero.label}</p>
      <h1 id="hero-title" className="hero__title">{t.hero.headline}</h1>
      <p className="hero__intro">{t.hero.intro}</p>
      <div className="hero__actions">
        <a className="button button--primary" href="#projects">{t.hero.ctaProjects}</a>
        <a className="button button--secondary" href={site.github} target="_blank" rel="noreferrer">
          {t.hero.ctaGithub}
        </a>
      </div>
    </section>
  )
}
