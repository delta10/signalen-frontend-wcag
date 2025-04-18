import React from 'react'
import { Icon } from '@/components'
import { IconMapPinFilled } from '@tabler/icons-react'
import { Category } from '@/types/category'

export const CategoryIcon = (category: Category) => {
  const categoryIcon = category?._links?.['sia:icon']?.href || null

  return (
    <Icon className="!min-w-6 !min-h-6 !max-w-6 !max-h-6">
      {categoryIcon ? (
        <img src={categoryIcon} alt="Categorie icoon" />
      ) : (
        <IconMapPinFilled color="currentColor" />
      )}
    </Icon>
  )
}

export const CategoryLabelWithIcon = (category: Category) => {
  if (!category) {
    return
  }

  return (
    <span className="flex gap-2 items-center">
      {CategoryIcon(category)}
      {category.name}
    </span>
  )
}
