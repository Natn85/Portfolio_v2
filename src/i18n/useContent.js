import { useContext } from 'react'
import { content } from '../data/content.js'
import { LanguageContext } from './context.js'

// Current language code ('en' | 'de').
export function useLanguage() {
  return useContext(LanguageContext).lang
}

// Language switcher: { lang, setLang }.
export function useLanguageSwitch() {
  return useContext(LanguageContext)
}

// Returns the UI text for the current language.
export function useContent() {
  return content[useLanguage()]
}
