import { useTranslations } from 'next-intl'
import { Button } from '@/components'

type MapStyleSwitcherProps = {
  isAerialPhoto: boolean
  setIsAerialPhoto: (isAerialPhoto: boolean) => void
  bottomLeft?: boolean
  mobile?: boolean
}

export const MapStyleSwitcher = ({
  isAerialPhoto,
  setIsAerialPhoto,
  bottomLeft = false,
  mobile = false,
}: MapStyleSwitcherProps) => {
  const t = useTranslations('describe_add.map')

  return (
    <fieldset
      className={`map-style-switcher${bottomLeft ? ' map-style-switcher--bottom-left' : ''}${mobile ? ' map-style-switcher--mobile' : ''}`}
      aria-label={t('map_style_switcher_label')}
    >
      <legend className="sr-only">{t('map_style_switcher_label')}</legend>
      <Button
        type="button"
        purpose={!isAerialPhoto ? 'secondary' : 'subtle'}
        aria-pressed={!isAerialPhoto}
        onClick={() => setIsAerialPhoto(false)}
      >
        {t('map_style_map')}
      </Button>
      <Button
        type="button"
        purpose={isAerialPhoto ? 'secondary' : 'subtle'}
        aria-pressed={isAerialPhoto}
        onClick={() => setIsAerialPhoto(true)}
      >
        {t('map_style_aerial')}
      </Button>
    </fieldset>
  )
}
