// Projects shown on the page, in this order.
// image: path inside /public (e.g. '/projects/keyfighter.png'); a dark placeholder shows if it's missing.
// live / code: leave '' to hide that link.

export const projects = [
  {
    id: 'keyfighter',
    title: 'Street Fighter Typing Game',
    description: {
      en: 'A Street Fighter style typing battle in the browser. Type words fast and accurately to land hits on your opponent.',
      de: 'Ein Tipp-Kampfspiel im Street-Fighter-Stil im Browser. Wer schnell und fehlerfrei tippt, landet Treffer beim Gegner.',
    },
    tags: ['JavaScript', 'HTML', 'CSS'],
    image: '', // e.g. '/projects/keyfighter.png'
    live: '',
    code: 'https://github.com/Natn85/ScriptProject',
  },
  {
    id: 'lol-tracker',
    title: 'League of Legends Stats Tracker',
    description: {
      en: 'Look up a summoner and see ranked stats and recent matches, pulled live from the Riot Games API.',
      de: 'Beschwörer suchen und Ranglisten-Statistiken sowie letzte Matches sehen, live über die Riot-Games-API.',
    },
    tags: ['JavaScript', 'REST API'],
    image: '', // e.g. '/projects/lol-tracker.png'
    live: '',
    code: '',
  },
]
