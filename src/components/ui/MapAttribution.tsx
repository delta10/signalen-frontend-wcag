import {
  type ComponentProps,
  type MouseEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { IconInfoCircle } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'

import { AlertDialog, Button, Heading, Paragraph } from '@/components'
import { cn } from '@/lib/utils/style'

type MapAttributionProps = {
  attribution?: string
  inline?: boolean
  mobile?: boolean
  purpose?: ComponentProps<typeof Button>['purpose']
}

const MapAttribution = ({
  attribution,
  inline = false,
  mobile = false,
  purpose,
}: MapAttributionProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const titleId = useId()
  const t = useTranslations('describe_add.map')
  const tButton = useTranslations('general.button')

  const closeOnBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) {
      event.currentTarget.close()
    }
  }

  const openAttribution = () => {
    dialogRef.current?.showModal()
    setIsOpen(true)
    requestAnimationFrame(() => closeButtonRef.current?.focus())
  }

  useEffect(() => {
    if (!isOpen) return

    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return

      event.preventDefault()
      event.stopPropagation()
      dialogRef.current?.close()
    }

    window.addEventListener('keydown', closeWithEscape, { capture: true })

    return () => {
      window.removeEventListener('keydown', closeWithEscape, { capture: true })
    }
  }, [isOpen])

  if (!attribution) {
    return null
  }

  return (
    <>
      <AlertDialog
        ref={dialogRef}
        className="map-attribution-dialog"
        aria-labelledby={titleId}
        onClick={closeOnBackdropClick}
        onClose={() => {
          setIsOpen(false)
          requestAnimationFrame(() => triggerRef.current?.focus())
        }}
      >
        <div className="map-attribution-dialog__content">
          <Heading id={titleId} level={2}>
            {t('attribution_title')}
          </Heading>
          <Paragraph dangerouslySetInnerHTML={{ __html: attribution }} />
          <Button
            ref={closeButtonRef}
            type="button"
            purpose="secondary"
            autoFocus
            onClick={() => dialogRef.current?.close()}
          >
            {tButton('close')}
          </Button>
        </div>
      </AlertDialog>
      <Button
        ref={triggerRef}
        className={cn(
          'map-attribution-button map-zoom-button',
          mobile ? 'map-icon-button' : 'map-button',
          { 'map-attribution-button--inline': inline }
        )}
        purpose={purpose}
        iconOnly
        iconStart={<IconInfoCircle />}
        label={t('show_attribution')}
        onClick={openAttribution}
      />
    </>
  )
}

export { MapAttribution }
