import { content } from '../data/content.js'

// Current language code. English only until the EN/DE toggle lands.
export function useLanguage() {
  return 'en'
}

// Returns the UI text for the current language.
export function useContent() {
  return content[useLanguage()]
}
