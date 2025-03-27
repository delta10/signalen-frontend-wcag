'use client'

import React from 'react'
import { MapProvider } from 'react-map-gl/maplibre'
import { useTranslations } from 'next-intl'

import '../../incident/add/components/MapDialog.css'
import { IncidentMapContent } from '@/app/[locale]/incident-map/components/IncidentMapContent'

export type IncidentMapProps = {
  prop?: string
} & React.HTMLAttributes<HTMLDivElement>

const IncidentMap = ({}: IncidentMapProps) => {
  // nieuwe toevoegen
  const t = useTranslations('describe_add.map')

  return (
    <>
      <MapProvider>
        <div className="grid grid-rows-[auto_1fr_auto] md:grid-cols-3 overflow-y-auto">
          <IncidentMapContent />
        </div>
      </MapProvider>
    </>
  )
}

export { IncidentMap }
