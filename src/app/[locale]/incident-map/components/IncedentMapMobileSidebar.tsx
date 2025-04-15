'use client'

import React, { useState } from 'react'
import { clsx } from 'clsx'
import SelectedIncidentDetails from '@/app/[locale]/incident-map/components/SelectedIncidentDetails'
import NestedCategoryCheckboxList from '@/app/[locale]/incident-map/components/NestedCategoryCheckboxList'
import { Drawer } from 'vaul'
import { Paragraph } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import { DialogDescription } from '@headlessui/react'

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

  const snapPoints = ['148px', '355px', 1]
  const [snap, setSnap] = useState<number | string | null>(snapPoints[0])

  return (
    // <div
    //   className={clsx(
    //     'fixed inset-0 z-40 transition-transform duration-300 ease-in-out bg-white shadow-lg rounded-t-2xl overflow-hidden',
    //     getSidebarStyles()
    //   )}
    // >
    //   {/* Handle bar for dragging - always visible */}
    //   <div
    //     className="h-10 w-full flex justify-center items-center cursor-pointer border-b bg-white"
    //     onClick={toggleSidebarSize}
    //   >
    //     <div className="w-16 h-1 bg-gray-300 rounded-full mr-2"></div>
    //   </div>
    //
    //   {/* Header - visible in medium and large states */}
    //   {sidebarSize !== SidebarSize.SMALL && (
    //     <div className="flex justify-between items-center p-4 border-b">
    //       <h2 className="text-lg font-semibold">Filters & Details</h2>
    //       <button onClick={() => setSidebarSize(SidebarSize.SMALL)}>
    //         <IconX />
    //       </button>
    //     </div>
    //   )}
    //
    //   {/* Content - scrollable area */}
    //   <div
    //     className={clsx(
    //       'flex flex-col p-4 overflow-y-auto',
    //       sidebarSize === SidebarSize.MEDIUM
    //         ? 'max-h-[calc(50vh-50px)]'
    //         : 'max-h-[calc(100vh-94px)]'
    //     )}
    //   >
    //     {selectedFeatureId ? (
    //       <SelectedIncidentDetails
    //         feature={selectedFeature}
    //         address={selectedFeatureAddress}
    //         onClose={resetSelectedIncident}
    //       />
    //     ) : (
    //       <div className="flex flex-col gap-4">
    //         {categories && categories.length > 0 && (
    //           <NestedCategoryCheckboxList
    //             categories={categories}
    //             selectedSubCategories={selectedSubCategories}
    //             setSelectedSubCategories={setSelectedSubCategories}
    //           />
    //         )}
    //       </div>
    //     )}
    //   </div>
    // </div>
    <Drawer.Root defaultOpen={true} modal={false} autoFocus={true}>
      <Drawer.Trigger className="relative flex h-14 flex-shrink-0 items-center justify-center overflow-hidden bg-white px-4 text-base font-medium shadow-sm transition-all hover:bg-[#FAFAFA] dark:bg-[#161615] dark:hover:bg-[#1A1A19]">
        Toon filters
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Content className="fixed flex flex-col bg-white border border-gray-200 border-b-none rounded-t-[10px] bottom-0 left-0 right-0 h-full max-h-[97%] mx-[-1px]">
          <div
            className={clsx('flex flex-col max-w-md mx-auto w-full p-4 pt-5', {
              'overflow-y-auto': snap === 1,
              'overflow-hidden': snap !== 1,
            })}
          >
            <Drawer.Description>
              <Paragraph className="!text-base">
                {tIncidentMap('description')}
              </Paragraph>
            </Drawer.Description>
            <Drawer.Title className="text-2xl mt-2 font-medium text-gray-900">
              Title
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
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

export default IncidentMapMobileSidebar
