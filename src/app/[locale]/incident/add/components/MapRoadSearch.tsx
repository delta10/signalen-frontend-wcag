import { useEffect, useRef, useState } from 'react'
import { IconSearch, IconX } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'

import { Button, FormLabel } from '@/components'
import { AddressCombobox, SearchType } from '@/components/ui/AddressCombobox'

type MapRoadSearchProps = {
  id: string
  updatePosition: (lat: number, lng: number, selectPosition?: boolean) => void
  mobile?: boolean
}

export const MapRoadSearch = ({
  id,
  updatePosition,
  mobile = false,
}: MapRoadSearchProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const t = useTranslations('describe_add.map')
  const panelId = `${id}-panel`

  const openSearch = () => {
    setIsOpen(true)
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  const closeSearch = () => {
    setIsOpen(false)
    requestAnimationFrame(() => toggleRef.current?.focus())
  }

  useEffect(() => {
    if (!isOpen) return

    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return

      event.preventDefault()
      event.stopPropagation()
      setIsOpen(false)
      requestAnimationFrame(() => toggleRef.current?.focus())
    }

    window.addEventListener('keydown', closeWithEscape, { capture: true })

    return () => {
      window.removeEventListener('keydown', closeWithEscape, { capture: true })
    }
  }, [isOpen])

  return (
    <div className="map-road-search-disclosure">
      <Button
        ref={toggleRef}
        type="button"
        purpose={mobile ? 'subtle' : undefined}
        iconOnly
        iconStart={isOpen ? <IconX /> : <IconSearch />}
        label={isOpen ? t('close_road_search') : t('open_road_search')}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className={
          mobile
            ? 'map-icon-button map-road-search-toggle'
            : 'map-button map-zoom-button map-road-search-toggle'
        }
        onClick={isOpen ? closeSearch : openSearch}
      />
      <div
        id={panelId}
        role="region"
        aria-label={t('search_road_label')}
        className="map-road-search-panel"
        hidden={!isOpen}
      >
        <FormLabel htmlFor={id}>{t('search_road_label')}</FormLabel>
        <AddressCombobox
          updatePosition={updatePosition}
          id={id}
          inputRef={inputRef}
          searchType={SearchType.Road}
          selectLocation={false}
          placeholder={t('search_road_label')}
          className="map-road-search__input"
          mobileView={mobile}
        />
      </div>
    </div>
  )
}
