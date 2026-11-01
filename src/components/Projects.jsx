import { useState } from 'react'
import { useContent, useLanguage } from '../i18n/useContent.js'
import { featuredProjects, moreProjects } from '../data/projects.js'
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

function ProjectLinks({ project, className = 'project__links' }) {
  const t = useContent()
  if (!project.live && !project.code) return null

  return (
    <div className={className}>
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
  )
}

function ProjectRow({ project }) {
  const t = useContent()
  const lang = useLanguage()

  return (
    <li className="project-row">
      <div className="project-row__main">
        <h4 className="project-row__title">{project.title}</h4>
        <p className="project-row__description">{project.description[lang]}</p>
      </div>
      <ul className="project-row__tags" aria-label={t.projects.tagsLabel}>
        {project.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
      <ProjectLinks project={project} className="project-row__links" />
    </li>
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
        <ProjectLinks project={project} />
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
        {featuredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      {moreProjects.length > 0 && (
        <div className="projects__more">
          <h3 className="mono-label projects__more-title">{t.projects.moreHeading}</h3>
          <ul className="project-list">
            {moreProjects.map((project) => (
              <ProjectRow key={project.id} project={project} />
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
