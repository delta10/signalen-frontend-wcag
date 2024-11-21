import config from '../../../config.json'

const getAllAvailableLocales = (): Array<string> => {
  return config.base.supportedLanguages.map(
    (supportedLanguage) => supportedLanguage.lang
  )
}

export { getAllAvailableLocales }
