'use client'

import React from 'react'
import { MapProvider } from 'react-map-gl/maplibre'

import '../../incident/add/components/MapDialog.css'
import { IncidentMapContent } from '@/app/[locale]/incident-map/components/IncidentMapContent'

export type IncidentMapProps = {
  prop?: string
} & React.HTMLAttributes<HTMLDivElement>

const IncidentMap = ({}: IncidentMapProps) => {
  return (
    <>
      <MapProvider>
        <IncidentMapContent />
      </MapProvider>
    </>
  )
}

export { IncidentMap }
