// Projects shown on the page, in this order.
// featured: true  -> big card (max 4, in array order). false -> compact row under "More projects".
// image: path inside /public (e.g. '/projects/keyfighter.png'); a dark placeholder shows if it's missing.
// live / code: leave '' to hide that link.
// Comments marked <...> are details still to fill in.

export const projects = [
  {
    id: 'minijob-finder',
    featured: true,
    title: 'Minijob Finder',
    description: {
      en: 'Finds Minijobs near you through the Bundesagentur für Arbeit job search API and drafts the application email for each listing.',
      de: 'Findet Minijobs in deiner Nähe über die Jobsuche-API der Bundesagentur für Arbeit und entwirft für jede Anzeige die Bewerbungs-E-Mail.',
    },
    tags: ['JavaScript', 'Python', 'REST API'],
    image: '', // <screenshot, e.g. '/projects/minijob-finder.png'>
    live: '', // <Live URL>
    code: '', // <GitHub URL>
  },
  {
    id: 'monara',
    featured: true,
    title: 'Monara',
    description: {
      en: 'A budget tracker in PHP: log income and expenses, see where the money goes in charts, and plan ahead with a built-in investment calculator.',
      de: 'Ein Budget-Tracker in PHP: Einnahmen und Ausgaben erfassen, in Diagrammen sehen, wohin das Geld fließt, und mit dem eingebauten Investmentrechner vorausplanen.',
    },
    tags: ['PHP', 'Charts'], // <database / chart library>
    image: '', // <screenshot, e.g. '/projects/monara.png'>
    live: '', // <Live URL>
    code: '', // <GitHub URL>
  },
  {
    id: 'japanara',
    featured: true,
    title: 'Japanara',
    description: {
      en: 'A Japanese learning platform with kana drills, vocabulary practice and structured lessons. Built and deployed solo.',
      de: 'Eine Lernplattform für Japanisch mit Kana-Training, Vokabelübungen und strukturierten Lektionen. Allein gebaut und deployt.',
    },
    tags: ['Next.js', 'React', 'Python', 'Vercel'],
    image: '/projects/japanara.png',
    live: 'https://japanara.vercel.app',
    code: 'https://github.com/Natn85/Japanara',
  },
  {
    id: 'java-video-chat',
    featured: true,
    title: 'Java Video-Call Chat App',
    description: {
      en: 'Team project at university: a JavaFX chat app with group audio and video calls streamed over UDP through relay servers.',
      de: 'Teamprojekt an der Uni: eine JavaFX-Chat-App mit Audio- und Videoanrufen in Gruppen, per UDP über Relay-Server übertragen.',
    },
    tags: ['Java', 'JavaFX', 'UDP', 'Team project'],
    image: '', // <screenshot, e.g. '/projects/java-video-chat.png'>
    live: '',
    code: '', // <GitHub URL>
  },
  {
    id: 'lol-tracker',
    featured: false,
    title: 'League of Legends Stats Tracker',
    description: {
      en: 'Look up a summoner and see ranked stats and recent matches, pulled live from the Riot Games API.',
      de: 'Beschwörer suchen und Ranglisten-Statistiken sowie letzte Matches sehen, live über die Riot-Games-API.',
    },
    tags: ['JavaScript', 'REST API'],
    image: '',
    live: '',
    code: '', // <GitHub URL>
  },
  {
    id: 'keyfighter',
    featured: false,
    title: 'Street Fighter Typing Game',
    description: {
      en: 'A Street Fighter style typing battle in the browser. Type fast and accurately to land hits.',
      de: 'Ein Tipp-Kampfspiel im Street-Fighter-Stil im Browser. Schnell und fehlerfrei tippen, um Treffer zu landen.',
    },
    tags: ['JavaScript', 'HTML', 'CSS'],
    image: '',
    live: '',
    code: 'https://github.com/Natn85/ScriptProject',
  },
]

export const featuredProjects = projects.filter((p) => p.featured).slice(0, 4)
export const moreProjects = projects.filter((p) => !p.featured)
