import configuration from '../../configuration.json'
import { LogoConfiguration } from '@/types/configuration'

const getLogo = (): LogoConfiguration => {
  return {
    link: configuration.logo.link,
    max_height: configuration.logo.max_height,
  }
}

export { getLogo }
