import configuration from '../../../configuration.json'
import { LogoConfiguration } from '@/types/configuration'

const getLogo = (): LogoConfiguration => {
  return {
    link: configuration.logo.link,
    max_height: configuration.logo.max_height,
  }
}

// Local font should always have the .woff2 extension
const getLocalFont = (): string => {
  return configuration.theme.font + '.woff2'
}

export { getLogo, getLocalFont }
