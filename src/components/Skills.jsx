import { useContent } from '../i18n/useContent.js'
import { skillGroups } from '../data/skills.js'
import './Skills.css'

export default function Skills() {
  const t = useContent()

  return (
    <section id="skills" className="section container" aria-labelledby="skills-title">
      <div className="section-header">
        <p className="mono-label">{t.skills.label}</p>
        <h2 id="skills-title" className="section-title">{t.skills.heading}</h2>
      </div>
      <div className="skills__grid">
        {skillGroups.map((group) => (
          <div key={group.id} className="skills__group card">
            <h3 className="skills__title">{t.skills.groups[group.id]}</h3>
            <ul className="tags">
              {group.items.map((item) => (
                <li key={item} className="tag">{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
