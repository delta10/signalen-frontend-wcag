'use client'

import React, { useState } from 'react'
import { clsx } from 'clsx'
import SelectedIncidentDetails from '@/app/[locale]/incident-map/components/SelectedIncidentDetails'
import NestedCategoryCheckboxList from '@/app/[locale]/incident-map/components/NestedCategoryCheckboxList'
import { Drawer } from 'vaul'
import { Paragraph } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import { Icon } from '@/components'
import { IconChevronDown } from '@tabler/icons-react'

type IncidentMapMobileSidebarProps = {
  selectedFeatureId: number | null
  selectedFeature: any
  selectedFeatureAddress: any
  resetSelectedIncident: any
  categories: any
  selectedSubCategories: any
  setSelectedSubCategories: any
}

const IncidentMapMobileSidebar = ({
  selectedFeatureId,
  selectedFeature,
  selectedFeatureAddress,
  resetSelectedIncident,
  categories,
  selectedSubCategories,
  setSelectedSubCategories,
}: IncidentMapMobileSidebarProps) => {
  const tIncidentMap = useTranslations('incident_map')

  const snapPoints = ['248px', '355px', 1]
  const [snap, setSnap] = useState<number | string | null>(snapPoints[0])

  return (
    <Drawer.Root
      snapPoints={snapPoints}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      defaultOpen={true}
      modal={false}
      autoFocus={true}
    >
      <Drawer.Trigger className="relative flex h-14 flex-shrink-0 items-center justify-center overflow-hidden bg-white px-4 text-base font-medium shadow-sm transition-all hover:bg-[#FAFAFA] dark:bg-[#161615] dark:hover:bg-[#1A1A19]">
        {selectedFeatureId ? 'Toon details' : 'Toon filters'}
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Content className="fixed flex flex-col bg-white border border-gray-200 border-b-none rounded-t-[10px] bottom-0 left-0 right-0 h-full max-h-[97%] mx-[-1px]">
          <div
            className={clsx('flex flex-col max-w-md mx-auto w-full p-4 pt-5', {
              'overflow-y-auto': snap === 1,
              'overflow-hidden': snap !== 1,
            })}
          >
            {/*Drawer handle handle*/}
            <div
              aria-hidden
              className="mx-auto w-16 h-2 flex-shrink-0 rounded-full bg-gray-300 mb-4"
            />

            <Drawer.Description>
              <Paragraph className="!text-base">
                {tIncidentMap('description')}
              </Paragraph>
            </Drawer.Description>
            <Drawer.Title className="text-2xl my-2 font-medium text-gray-900">
              {selectedFeatureId ? 'Details' : 'Filters'}
            </Drawer.Title>

            {selectedFeatureId ? (
              <SelectedIncidentDetails
                feature={selectedFeature}
                address={selectedFeatureAddress}
                onClose={resetSelectedIncident}
              />
            ) : (
              <div className="flex flex-col gap-4">
                {categories && categories.length > 0 && (
                  <NestedCategoryCheckboxList
                    categories={categories}
                    selectedSubCategories={selectedSubCategories}
                    setSelectedSubCategories={setSelectedSubCategories}
                  />
                )}
              </div>
            )}
          </div>
          <Drawer.Close>
            <div className="flex gap-2 justify-center my-2 ">
              Sluit paneel
              <Icon>
                <IconChevronDown />
              </Icon>
            </div>
          </Drawer.Close>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

export default IncidentMapMobileSidebar
