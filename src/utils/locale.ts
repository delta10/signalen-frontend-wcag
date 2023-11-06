import * as fs from 'fs'
import configuration from '../../configuration.json'

const getAllAvailableLocales = (): Array<string> => {
  return configuration.general.available_locales
}

const getDefaultLocale = (): string => {
  return configuration.general.default_locale
}

export { getAllAvailableLocales, getDefaultLocale }
