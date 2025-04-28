import React from 'react'
import { Icon } from '@/components'
import { IconMapPinFilled } from '@tabler/icons-react'
import { Category } from '@/types/category'

export const CategoryLabelWithIcon = (category: Category) => {
  if (!category) {
    return null
  }

  const categoryIcon = category._links?.['sia:icon']?.href || null

  return (
    <span className="flex gap-2 items-center">
      <Icon className="!min-w-6 !min-h-6 !max-w-6 !max-h-6">
        {categoryIcon ? (
          <img src={categoryIcon} alt={`Icon for category: ${category.name}`} />
        ) : (
          <IconMapPinFilled color="currentColor" />
        )}
      </Icon>
      {category.name}
    </span>
  )
}
