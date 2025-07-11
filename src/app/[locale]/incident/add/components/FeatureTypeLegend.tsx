'use client'

import React, { Dispatch, SetStateAction } from 'react'
import { clsx } from 'clsx'
import { Drawer } from 'vaul'
import { useTranslations } from 'next-intl'
import { FeatureType } from '@/types/form'
import { Icon } from '@/components'
import { IconX } from '@tabler/icons-react'

type FeatureTypeLegendProps = {
  featureTypes: FeatureType[] | null
  mobile?: boolean
  openLegend: boolean
  setOpenLegend: Dispatch<SetStateAction<boolean>>
}

const FeatureTypeLegend = ({
  featureTypes,
  mobile = false,
  openLegend,
  setOpenLegend,
}: FeatureTypeLegendProps) => {
  const t = useTranslations('describe_add.map')
  const EXCLUDED_TYPE_VALUE = 'not-on-map'
  return (
    <Drawer.Root
      direction={mobile ? 'bottom' : 'left'}
      modal={false}
      open={openLegend}
      onOpenChange={setOpenLegend}
    >
      <Drawer.Portal>
        <Drawer.Content
          aria-describedby="legend-description"
          className={clsx(
            'fixed flex flex-col bg-white border border-gray-200 p-6 bottom-0 left-0  mx-[-1px] dark:bg-[#161615] z-20 w-[33%] overflow-y-auto',
            mobile ? 'w-full h-[70%] shadow-top' : 'h-full shadow-right'
          )}
        >
          <Drawer.Title className="flex justify-between  text-3xl font-bold">
            {t('legend')}

            <Drawer.Close aria-label={t('close_legend')}>
              <IconX />
            </Drawer.Close>
          </Drawer.Title>

          <Drawer.Description id="legend-description" className="pt-10 pb-1">
            {t('legend_description')}
          </Drawer.Description>

          {featureTypes && (
            <ul>
              {featureTypes
                .filter(
                  (featureType) => featureType.typeValue !== EXCLUDED_TYPE_VALUE
                )
                .map((featureType, index) => (
                  <li key={index} className="flex items-center gap-2 py-1">
                    <Icon>
                      <img
                        src={featureType.icon.iconUrl}
                        alt="Feature marker"
                      />
                    </Icon>
                    {featureType.label}
                  </li>
                ))}
            </ul>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

export default FeatureTypeLegend
