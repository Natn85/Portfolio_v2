import { useState } from 'react'
import { useContent, useLanguage } from '../i18n/useContent.js'
import { projects } from '../data/projects.js'
import './Projects.css'

function ProjectImage({ src, alt, placeholder }) {
  const [failed, setFailed] = useState(!src)

  // No screenshot: purely decorative box, so keep it out of the accessibility tree.
  if (failed) {
    return (
      <div className="project__media project__media--empty" aria-hidden="true">
        <span className="mono-label">{placeholder}</span>
      </div>
    )
  }

  return (
    <div className="project__media">
      <img src={src} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} />
    </div>
  )
}

function ProjectCard({ project }) {
  const t = useContent()
  const lang = useLanguage()

  return (
    <article className="project card">
      <ProjectImage
        src={project.image}
        alt={t.projects.imageAlt(project.title)}
        placeholder={t.projects.noPreview}
      />
      <div className="project__body">
        <h3 className="project__title">{project.title}</h3>
        <p className="project__description">{project.description[lang]}</p>
        <ul className="tags" aria-label={t.projects.tagsLabel}>
          {project.tags.map((tag) => (
            <li key={tag} className="tag">{tag}</li>
          ))}
        </ul>
        {(project.live || project.code) && (
          <div className="project__links">
            {project.live && (
              <a className="project__link" href={project.live} target="_blank" rel="noreferrer">
                {t.projects.live}
                <span className="sr-only"> – {project.title}</span>
                <span aria-hidden="true"> ↗</span>
              </a>
            )}
            {project.code && (
              <a className="project__link" href={project.code} target="_blank" rel="noreferrer">
                {t.projects.code}
                <span className="sr-only"> – {project.title}</span>
                <span aria-hidden="true"> ↗</span>
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

export default function Projects() {
  const t = useContent()

  return (
    <section id="projects" className="section container" aria-labelledby="projects-title">
      <div className="section-header">
        <p className="mono-label">{t.projects.label}</p>
        <h2 id="projects-title" className="section-title">{t.projects.heading}</h2>
      </div>
      <div className="projects__grid">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}
