import { content } from '../data/content.js'

// Returns the UI text for the current language. English only until the EN/DE toggle lands.
export function useContent() {
  return content.en
}
