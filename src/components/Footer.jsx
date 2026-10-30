import { site } from '../data/content.js'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p className="footer__text">© {site.year} {site.name}</p>
      </div>
    </footer>
  )
}
