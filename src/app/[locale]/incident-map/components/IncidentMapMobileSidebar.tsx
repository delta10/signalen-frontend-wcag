'use client'

import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { clsx } from 'clsx'
import SelectedIncidentDetails from '@/app/[locale]/incident-map/components/SelectedIncidentDetails'
import NestedCategoryCheckboxList from '@/app/[locale]/incident-map/components/NestedCategoryCheckboxList'
import { Drawer } from 'vaul'
import { useTranslations } from 'next-intl'
import { Feature } from 'geojson'
import { Address } from '@/types/form'
import { Category } from '@/types/category'
import { SpotlightSection } from '@/components'
import { Paragraph } from '@utrecht/component-library-react/dist/css-module'

type IncidentMapMobileSidebarProps = {
  selectedFeature?: Feature
  selectedFeatureAddress: Address | null
  resetSelectedIncident: () => void
  categories: Category[] | null
  selectedSubCategories: string[] | null
  setSelectedSubCategories: Dispatch<SetStateAction<string[]>>
}

const IncidentMapMobileSidebar = ({
  selectedFeature,
  selectedFeatureAddress,
  resetSelectedIncident,
  categories,
  selectedSubCategories,
  setSelectedSubCategories,
}: IncidentMapMobileSidebarProps) => {
  const tIncidentMap = useTranslations('incident_map')

  const snapPoints = ['355px', 1]
  const [snap, setSnap] = useState<number | string | null>(snapPoints[0])
  const [openDrawer, setOpenDrawer] = useState<boolean>(true)
  const [disableBackground, setDisableBackground] = useState(false)

  useEffect(() => {
    if (selectedFeature) {
      setOpenDrawer(true)
      // Re-enable background interaction because the drawer internally uses a modal,
      // which would otherwise block all pointer events on the background.
      setDisableBackground(false)
    }
  }, [selectedFeature])

  return (
    <Drawer.Root
      snapPoints={snapPoints}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      modal={disableBackground}
      open={openDrawer}
      onOpenChange={setOpenDrawer}
    >
      <Drawer.Trigger
        aria-label={tIncidentMap('show_menu', {
          menu_object: selectedFeature
            ? tIncidentMap('details')
            : tIncidentMap('filters'),
        })}
        className="absolute bottom-16 w-full flex h-10 flex-shrink-0 items-center justify-center overflow-hidden bg-white px-4 text-base font-medium transition-all hover:bg-[#FAFAFA] dark:bg-[#161615] dark:hover:bg-[#1A1A19] shadow-top"
      >
        <DragHandle />
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Content className="fixed flex flex-col bg-white border border-gray-200 border-b-0 rounded-t-[10px] bottom-0 left-0 right-0 h-full max-h-[97%] mx-[-1px] dark:bg-[#161615] shadow-top z-20">
          <div
            className={clsx('flex flex-col max-w-md mx-auto w-full pt-4', {
              'overflow-y-auto': snap === 1,
              'overflow-hidden': snap !== 1,
            })}
          >
            <Drawer.Close
              aria-label={tIncidentMap('close_menu', {
                menu_object: selectedFeature
                  ? tIncidentMap('details')
                  : tIncidentMap('filters'),
              })}
            >
              <DragHandle className="mb-4" />
            </Drawer.Close>

            {!selectedFeature && (
              <Drawer.Description className="!text-base">
                <SpotlightSection type="info">
                  <Paragraph className="!text-lg">
                    {tIncidentMap('description')}
                  </Paragraph>
                </SpotlightSection>
              </Drawer.Description>
            )}

            <div className="px-4 pb-20">
              <Drawer.Title className="text-xl my-2 font-medium text-gray-900">
                {selectedFeature
                  ? tIncidentMap('details')
                  : tIncidentMap('filters')}
              </Drawer.Title>

              {selectedFeature ? (
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
                      mobile={true}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

export default IncidentMapMobileSidebar

const DragHandle = ({ className }: { className?: string }) => (
  <div
    aria-hidden
    className={clsx(
      'mx-auto w-32 h-[0.3em] flex-shrink-0 rounded-full bg-primary',
      className
    )}
  />
)
