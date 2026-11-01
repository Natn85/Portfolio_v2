import { useContent } from '../i18n/useContent.js'
import { site } from '../data/content.js'
import Coin from './Coin.jsx'
import './Contact.css'

export default function Contact() {
  const t = useContent()
  const links = [
    { label: t.contact.email, href: site.email && `mailto:${site.email}`, external: false },
    { label: 'GitHub', href: site.github, external: true },
    { label: 'LinkedIn', href: site.linkedin, external: true },
  ].filter((link) => link.href)

  return (
    <section id="contact" className="section container" aria-labelledby="contact-title">
      <div className="contact-ray">
      <div className="contact card">
        <div className="contact__text">
          <p className="mono-label">{t.contact.label}</p>
          <h2 id="contact-title" className="section-title">{t.contact.heading}</h2>
          <p className="contact__line">{t.contact.text}</p>
        </div>
        <ul className="contact__links">
          {links.map((link, i) => (
            <li key={link.label}>
              <a
                className={`button ${i === 0 ? 'button--primary' : 'button--secondary'}`}
                href={link.href}
                {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      </div>
      <div className="contact__coin" aria-hidden="true">
        <Coin />
      </div>
    </section>
  )
}
