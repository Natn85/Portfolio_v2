// All UI text. Edit freely – components only read from here.
// `en` and `de` must have the same shape.

export const site = {
  name: 'Nat',
  fullName: 'Natnael Feleke',
  github: 'https://github.com/Natn85',
  email: 'dnatnael928@gmail.com',
  linkedin: '', // add your LinkedIn URL here; the link is hidden while empty
  year: 2026,
}

export const content = {
  en: {
    skipLink: 'Skip to content',
    nav: {
      label: 'Main',
      home: 'Nat – back to top',
      projects: 'Projects',
      skills: 'Skills',
      contact: 'Contact',
    },
    hero: {
      label: 'Application Developer in Training',
      headline: 'Building things for the web.',
      intro: "I'm Nat, an application developer in training based in Würzburg, building fast and focused web apps.",
      ctaProjects: 'View projects',
      ctaGithub: 'GitHub',
    },
    projects: {
      label: 'Selected work',
      heading: 'Projects',
      live: 'Live',
      code: 'Code',
      tagsLabel: 'Technologies',
      noPreview: 'Preview coming soon',
      imageAlt: (title) => `Screenshot of ${title}`,
    },
    skills: {
      label: 'Toolkit',
      heading: 'Skills',
      groups: {
        languages: 'Languages',
        frameworks: 'Frameworks',
        tools: 'Tools',
      },
    },
    contact: {
      label: 'Contact',
      heading: "Let's talk.",
      text: "I'm open to apprenticeships, internships and junior roles. Feel free to reach out.",
      email: 'Email',
    },
  },
  de: {
    skipLink: 'Zum Inhalt springen',
    nav: {
      label: 'Hauptnavigation',
      home: 'Nat – nach oben',
      projects: 'Projekte',
      skills: 'Skills',
      contact: 'Kontakt',
    },
    hero: {
      label: 'Fachinformatiker für Anwendungsentwicklung in Ausbildung',
      headline: 'Ich baue Dinge für das Web.',
      intro: 'Ich bin Nat, angehender Anwendungsentwickler aus Würzburg und baue schnelle, fokussierte Web-Apps.',
      ctaProjects: 'Projekte ansehen',
      ctaGithub: 'GitHub',
    },
    projects: {
      label: 'Ausgewählte Arbeiten',
      heading: 'Projekte',
      live: 'Live',
      code: 'Code',
      tagsLabel: 'Technologien',
      noPreview: 'Vorschau folgt',
      imageAlt: (title) => `Screenshot von ${title}`,
    },
    skills: {
      label: 'Werkzeuge',
      heading: 'Skills',
      groups: {
        languages: 'Sprachen',
        frameworks: 'Frameworks',
        tools: 'Tools',
      },
    },
    contact: {
      label: 'Kontakt',
      heading: 'Lass uns reden.',
      text: 'Ich bin offen für Praktika, Werkstudentenstellen und Junior-Positionen. Schreib mir gern.',
      email: 'E-Mail',
    },
  },
}
