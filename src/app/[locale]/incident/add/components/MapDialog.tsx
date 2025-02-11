import * as Dialog from '@radix-ui/react-dialog'
import React from 'react'
import { MapRef } from 'react-map-gl/maplibre'
import { useTranslations } from 'next-intl'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'

import { FeatureCollection } from 'geojson'
import { PublicQuestion } from '@/types/form'

import './MapDialog.css'
import MapDialogContent from '@/app/[locale]/incident/add/components/MapDialogContent'
import MapDialogMobileContent from '@/app/[locale]/incident/add/components/MapDialogMobileContent'
import { useMediaQuery } from 'usehooks-ts'

export type MapDialogProps = {
  trigger: React.ReactElement
  onMapReady?: (map: MapRef) => void
  features?: FeatureCollection | null
  field?: PublicQuestion
  isAssetSelect?: boolean
  loadingAssets?: boolean
} & React.HTMLAttributes<HTMLDivElement>

const MapDialog = ({
  trigger,
  onMapReady,
  features,
  field,
  isAssetSelect = false,
  loadingAssets = false,
}: MapDialogProps) => {
  const t = useTranslations('describe_add.map')
  const isMobile = useMediaQuery('only screen and (max-width : 768px)')

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content
          className="grid grid-rows-[auto_1fr_auto] md:grid-cols-3 overflow-y-auto signalen-modal-dialog signalen-modal-dialog--cover-viewport"
          id="headlessui-portal-root"
        >
          <VisuallyHidden.Root>
            <Dialog.Title>
              {field?.meta.language.title
                ? field.meta.language.title
                : t('dialog_title')}
            </Dialog.Title>
            <Dialog.Description>{t('dialog_description')}</Dialog.Description>
          </VisuallyHidden.Root>
          {isMobile ? (
            <MapDialogMobileContent
              onMapReady={onMapReady}
              field={field}
              features={features}
              isAssetSelect={isAssetSelect}
              loadingAssets={loadingAssets}
            />
          ) : (
            <MapDialogContent
              onMapReady={onMapReady}
              field={field}
              features={features}
              isAssetSelect={isAssetSelect}
              loadingAssets={loadingAssets}
            />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export { MapDialog }
