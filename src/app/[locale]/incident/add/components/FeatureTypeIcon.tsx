import React from 'react'
import { Icon } from '@/components'
import { useConfig } from '@/contexts/ConfigContext'

interface FeatureIconProps {
  isSelected?: boolean
  isFocused?: boolean
  iconUrl?: string
}

export const FeatureTypeIcon: React.FC<FeatureIconProps> = ({
  isSelected = false,
  isFocused = false,
  iconUrl,
}) => {
  const config = useConfig()

  if (isSelected) {
    return (
      <Icon>
        <img
          src={
            config.base.assets_url +
            '/assets/images/feature-selected-marker.svg'
          }
          alt="Selected marker"
        />
      </Icon>
    )
  }

  if (isFocused) {
    return (
      <Icon>
        <div className="focused-map-marker"></div>
      </Icon>
    )
  }

  if (!iconUrl) {
    return (
      <Icon>
        <img
          src={
            config.base.assets_url + '/assets/images/feature-default-marker.svg'
          }
          alt="Feature marker"
        />
      </Icon>
    )
  }

  return (
    <Icon>
      <img src={iconUrl} alt="Feature marker" />
    </Icon>
  )
}
