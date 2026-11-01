# Portfolio v2

Personal portfolio of Nat (Natnael Feleke), Application Developer in Training based in Würzburg.
Single-page site built with React + Vite (plain JavaScript, no UI libraries), with a slow, dim
lightning animation drawn on a canvas behind the page and an EN/DE language toggle.

## Run it locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev       # dev server at http://localhost:5173
npm run build     # production build into dist/
npm run preview   # serve the production build at http://localhost:4173
```

## Editing content

All text and data live in `src/data/`, so content changes never touch components:

| File | What it holds |
| --- | --- |
| `src/data/content.js` | All UI text in `en` and `de`, plus name, email, GitHub and LinkedIn links (`site`) |
| `src/data/projects.js` | Projects: title, EN/DE description, tags, screenshot, Live/Code links. `featured: true` (max 4) = big card, otherwise a row under "More projects" |
| `src/data/skills.js` | Skill groups and their tags |

- **Screenshots:** put a 16:9 image in `public/projects/` and set `image: '/projects/your-file.png'`.
  Without one, the card shows a dark placeholder.
- **Links:** an empty `live`, `code` or `linkedin` value hides that link.

## Design tokens

Every color, font, size and spacing value is a CSS variable in `src/styles/tokens.css`.

## Lightning background

`src/components/Lightning.jsx`. The main numbers (brightness, step speed, branch chance,
spawn interval, flicker timing) are constants at the top of the file, each with a short comment.
With `prefers-reduced-motion: reduce` it draws one faint static bolt instead of animating.

## Project structure

```
src/
  components/   Nav, Hero, Projects, Skills, Contact, Footer, LanguageToggle, Lightning
  data/         content.js, projects.js, skills.js
  i18n/         language context, provider and hooks
  styles/       tokens.css, global.css
public/projects/  project screenshots
```
