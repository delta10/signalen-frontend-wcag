'use client'

import React, { useState } from 'react'
import { MapProvider, MapRef } from 'react-map-gl/maplibre'
import { useTranslations } from 'next-intl'

import '../../incident/add/components/MapDialog.css'
import { MapDialog } from '@/app/[locale]/incident/add/components/MapDialog'
import { Button } from '@/components'
import * as Dialog from '@radix-ui/react-dialog'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import MapDialogMobileContent from '@/app/[locale]/incident/add/components/MapDialogMobileContent'
import MapDialogContent from '@/app/[locale]/incident/add/components/MapDialogContent'
import { IncidentMapContent } from '@/app/[locale]/incident-map/components/IncidentMapContent'

export type IncidentMapProps = {
  prop?: string
} & React.HTMLAttributes<HTMLDivElement>

const IncidentMap = ({}: IncidentMapProps) => {
  // nieuwe toevoegen
  const t = useTranslations('describe_add.map')
  const [dialogMap, setDialogMap] = useState<MapRef | null>(null)

  // const features = []
  //          features={features}
  //field={field}

  const onMapReady = (map: MapRef) => {
    setDialogMap(map)
  }

  return (
    <>
      <MapProvider>
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <Button>klik</Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay />
            <Dialog.Content
              className="grid grid-rows-[auto_1fr_auto] md:grid-cols-3 overflow-y-auto signalen-modal-dialog signalen-modal-dialog--cover-viewport"
              id="headlessui-portal-root"
            >
              <VisuallyHidden.Root>
                <Dialog.Title>title</Dialog.Title>
                <Dialog.Description>
                  {t('dialog_description')}
                </Dialog.Description>
              </VisuallyHidden.Root>

              <IncidentMapContent />
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </MapProvider>
    </>
  )
}

export { IncidentMap }
